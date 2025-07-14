import React, { useEffect, useReducer, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Summary.css";
import { IoMdInformationCircle } from "react-icons/io";
import AutoLogin from "../AutoLogin";
import Cookies from "js-cookie";
import Products from "../database/GetData";

// Constant for fixed delivery price
const TOTAL_DELIVERY_PRICE = 100;

// Initial state for useReducer
const initialState = {
  cartItems: [],      // Items in the user's cart
  userInfo: null,     // User information fetched from backend
  error: "",          // Error message if any
  isConfirmed: false, // Has user confirmed terms & conditions
  sumPrice: 0,        // Sum of product prices without delivery
  delPrice: 0,        // Delivery price (may be free based on sumPrice)
};

// Reducer function to manage state updates based on dispatched actions
function reducer(state, action) {
  switch (action.type) {
    case "SET_CART_ITEMS":
      return { ...state, cartItems: action.payload };
    case "SET_USER_INFO":
      return { ...state, userInfo: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_CONFIRM":
      return { ...state, isConfirmed: action.payload };
    case "SET_SUM_PRICE":
      return { ...state, sumPrice: action.payload };
    case "SET_DEL_PRICE":
      return { ...state, delPrice: action.payload };
    default:
      return state;
  }
}

const Summary = () => {
  // Retrieve authentication token from localStorage
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // useReducer to manage complex component state
  const [state, dispatch] = useReducer(reducer, initialState);

  // Local state for toast notification visibility and message
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const timeoutRef = useRef(null); // Ref to track toast timeout

  // Destructure state variables for easy use
  const { cartItems, userInfo, error, isConfirmed, sumPrice, delPrice } = state;

  // Cleanup toast timeout when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!token) {
      alert("Nejste přihlášený. Přihlaste se prosím.");
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch user's previous orders from backend on component mount
  useEffect(() => {
    fetch("http://localhost:5000/getOrders", {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`, // Pass token for authorization
      },
    })
      .then((res) => res.json())
      .then((data) =>
        dispatch({ type: "SET_CART_ITEMS", payload: data.orderedProducts || [] })
      )
      .catch((err) => console.error("❌ Chyba při načítání objednávek:", err));
  }, [token]);

  // Fetch user info (name, address, etc.) from backend
  useEffect(() => {
    fetch("http://localhost:5000/getUserInfo", {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Žádná data v session");
        return res.json();
      })
      .then((data) => dispatch({ type: "SET_USER_INFO", payload: data.data }))
      .catch((err) => {
        console.error("❌ Chyba:", err.message);
        dispatch({ type: "SET_ERROR", payload: err.message });
      });
  }, [token]);

  // Helper function to get cart data from cookies
  const getData = () => {
    const cookie = Cookies.get("cart");
    if (cookie) {
      return JSON.parse(cookie);
    }
    return [];
  };

  // Calculate total price of products in cart (without delivery)
  const calcSumPrice = async () => {
    try {
      const cartData = getData();
      if (!cartData || cartData.length === 0) return 0;

      // Fetch all products to get full product details
      const allProducts = await Products.getAllProducts();

      let total = 0;
      cartData.forEach((cartItem) => {
        const matched = allProducts.find((p) => p.id == cartItem.id);
        if (!matched) return;
        const unitPrice = parseFloat(matched.price);
        const quantity = parseInt(cartItem.quantity) || 1;
        total += unitPrice * quantity;
      });

      return total;
    } catch (err) {
      console.error("❌ Chyba při výpočtu ceny:", err);
      return 0;
    }
  };

  // Calculate prices (sum and delivery) once component mounts
  useEffect(() => {
    const fetchPrices = async () => {
      const total = await calcSumPrice();
      dispatch({ type: "SET_SUM_PRICE", payload: total });

      // If total exceeds threshold, delivery is free
      if (total >= 600) dispatch({ type: "SET_DEL_PRICE", payload: 0 });
      else dispatch({ type: "SET_DEL_PRICE", payload: TOTAL_DELIVERY_PRICE });
    };

    fetchPrices();
  }, []);

  // Display a temporary toast notification with given message
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  // Handle confirm button click - validates and initiates Stripe checkout
  const handleConfirm = async () => {
    if (!isConfirmed) {
      showToastMessage("Musíte potvrdit souhlas před pokračováním.");
      return;
    }

    const cartData = getData();
    if (!cartData || cartData.length === 0) {
      alert("Košík je prázdný.");
      return;
    }

    try {
      const allProducts = await Products.getAllProducts();

      // Prepare line items for Stripe checkout based on cart data and product info
      const lineItems = cartData
        .map((cartItem) => {
          const matched = allProducts.find((p) => p.id == cartItem.id);
          if (!matched) return null;

          return {
            price_data: {
              currency: "czk",
              product_data: { name: matched.name },
              unit_amount: Math.round(parseFloat(matched.price) * 100), // convert CZK to haléře
            },
            quantity: parseInt(cartItem.quantity) || 1,
          };
        })
        .filter(Boolean);

      // Add delivery as a separate product if delivery price > 0
      if (delPrice > 0) {
        lineItems.push({
          price_data: {
            currency: "czk",
            product_data: { name: "Doprava" },
            unit_amount: Math.round(delPrice * 100),
          },
          quantity: 1,
        });
      }

      // Send checkout data to backend to create Stripe session
      const res = await fetch("http://localhost:5000/createCheckout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lineItems }),
      });

      const result = await res.json();

      // Redirect to Stripe payment page if URL returned
      if (result.url) {
        window.location.href = result.url;
      } else {
        alert("Nepodařilo se vytvořit platbu.");
      }
    } catch (err) {
      console.warn("❌ Chyba při vytváření platby:", err);
      alert("Nastala chyba při komunikaci se Stripe.");
    }
  };

  return (
    <>
      {/* Toast notification shown when showToast is true */}
      {showToast && (
        <div
          className="toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          tabIndex={-1}
        >
          <svg
            className="toast-icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="orange"
            strokeWidth="2"
            width="24"
            height="24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M5.07 17.07a9 9 0 1 1 13.86 0"
            />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* AutoLogin component to maintain user session */}
      <AutoLogin />

      {/* Main delivery form with customer info and order summary */}
      <div className="delivery-form">
        <div className="form-columns-wrapper">
          <div className="form-column">
            <h3 className="heading">👤 Zákazník</h3>

            {/* Show user info if loaded, else loading message */}
            {userInfo ? (
              <>
                <p className="client-info">
                  <strong>Jméno:</strong> {userInfo.fName} {userInfo.lName}
                </p>
                <p className="client-info">
                  <strong>Email:</strong> {userInfo.email}
                </p>
                <p className="client-info">
                  <strong>Adresa:</strong> {userInfo.street}, {userInfo.city}{" "}
                  {userInfo.psc}
                </p>
                <p className="client-info">
                  <strong>Platba:</strong> Převodem na účet{" "}
                  <IoMdInformationCircle className="icon" />
                </p>
                <p className="client-info">
                  <strong>Cena dopravy:</strong> {delPrice.toFixed(2)} Kč
                </p>
                <p className="client-info">
                  <strong>Cena bez dopravy:</strong> {sumPrice.toFixed(2)} Kč
                </p>
              </>
            ) : (
              <p>Načítání údajů o zákazníkovi...</p>
            )}

            {/* Summary of total price including delivery */}
            <div className="summary-total">
              <span>Celkem k úhradě:</span>
              <span>{(sumPrice + delPrice).toFixed(2)} Kč</span>
            </div>

            {/* Checkbox for user to confirm terms and conditions */}
            <div className="confirm-section">
              <input
                type="checkbox"
                id="sign"
                name="sign"
                checked={isConfirmed}
                onChange={(e) =>
                  dispatch({ type: "SET_CONFIRM", payload: e.target.checked })
                }
              />
              <label htmlFor="sign">
                Potvrzuji, že souhlasím s obchodními podmínkami.
              </label>
            </div>

            {/* Button to confirm and proceed with order */}
            <button
              onClick={handleConfirm}
              className="submit-btn"
              type="button"
              aria-label="Potvrdit objednávku"
            >
              Potvrdit objednávku
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Summary;
