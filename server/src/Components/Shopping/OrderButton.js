import { useState, useEffect, useRef } from "react";
import "../../styles/OrderButton.css"; // Styles for button and toast
import AutoLogin from "../AutoLogin";   // Component to auto-handle user login if needed
import Cookies from "js-cookie";        // Library for cookie management

const OrderButton = ({ productSize, id }) => {
  // State for controlling toast visibility, message, and type (success or error)
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [cart, setCart] = useState([]);  // Current shopping cart state
  const timeoutRef = useRef(null);        // Ref to store timeout ID for toast dismissal

  // Show a toast notification with a message and type
  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    // Clear any existing timeout to avoid premature hiding
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Automatically hide the toast after 2 seconds
    timeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  // Handler to add product to the cart
  const handleAddToCart = () => {
    // Prevent action if a toast is currently showing
    if (showToast) return;

    // Check if product ID is provided
    if (!id) {
      console.error("Product id is missing");
      return;
    }

    // Check if product size is selected
    if (!productSize) {
      showToastMessage("Vyberte velikost produktu.", "error");
      return;
    }

    // Check for user authentication token in localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      showToastMessage("Nejste přihlášený. Přihlaste se prosím.", "error");
      return;
    }

    // Retrieve current cart from cookies or initialize empty array
    let currentCart = Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) : [];

    const productId = parseInt(id);

    // Check if product with same ID and size already exists in the cart
    const existingProductIndex = currentCart.findIndex(
      item => item.id === productId && item.size === productSize
    );

    if (existingProductIndex !== -1) {
      // If exists, increase quantity by 1
      currentCart[existingProductIndex].quantity += 1;
    } else {
      // Otherwise, add new product entry
      currentCart.push({
        id: productId,
        size: productSize,
        quantity: 1,
      });
    }

    // Save updated cart to cookies with 7-day expiry
    Cookies.set("cart", JSON.stringify(currentCart), { expires: 7 });
    setCart(currentCart);

    // Show success toast message
    showToastMessage("Položka byla přidána do košíku!", "success");
  };

  // Load cart from cookies on component mount
  useEffect(() => {
    const cartFromCookies = Cookies.get("cart");
    if (cartFromCookies) {
      setCart(JSON.parse(cartFromCookies));
    }

    // Cleanup function to clear timeout when component unmounts
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Component to auto-handle user login */}
      <AutoLogin />

      {/* Add to cart button, disabled if toast is visible */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={showToast}
        className={`orderButton ${showToast ? "disabled" : ""}`}
      >
        Přidat do košíku
      </button>

      {/* Toast notification shown only when showToast is true */}
      {showToast && (
        <div
          className={`toast ${toastType}`}
          aria-live="polite"    // Screen readers announce changes politely
          role="alert"          // Identifies this as an important message
          tabIndex="-1"         // Prevents focus but keeps accessible to screen readers
        >
          {/* Icon indicating success (check) or error (cross) */}
          <svg
            className="toast-icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke={toastType === "success" ? "green" : "red"}
            strokeWidth="2"
            width="24"
            height="24"
            aria-hidden="true"
          >
            {toastType === "success" ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            )}
          </svg>

          {/* Toast message text */}
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};

export default OrderButton;
