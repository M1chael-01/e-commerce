import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import AutoLogin from "../AutoLogin";
import "../../styles/Cart.css";
import Cookies from "js-cookie";
import Products from "../database/GetData";

const Cart = () => {
  // State to store cart items with full product details
  const [cartItems, setCartItems] = useState([]);

  // State to hold all product details fetched from database or API
  const [productDetails, setProductDetails] = useState([]);

  // Loading state to show spinner or message during data fetch
  const [loading, setLoading] = useState(true);

  // Error state to display any issues during data fetching or processing
  const [error, setError] = useState(null);

  // Retrieve token from localStorage to verify if user is logged in
  const token = localStorage.getItem("token");

  // Fetch all products from database on component mount
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // Simulated fetch call to get all products
        const products = await Products.getAllProducts();
        setProductDetails(products);
      } catch (err) {
        console.error("Failed to fetch product data", err);
        setError("Nepodařilo se načíst produkty."); // Set error message for UI
      }
    };
    fetchProductDetails();
  }, []);

  // Once product details are loaded and user is authenticated,
  // load and enrich cart data from cookies
  useEffect(() => {
    if (!token) {
      setError("Nejprve se musíte přihlásit."); // Require login
      setLoading(false);
      return;
    }

    const fetchCart = () => {
      const data = Cookies.get("cart"); // Get cart cookie

      try {
        if (data) {
          const parsedData = JSON.parse(data);

          if (Array.isArray(parsedData)) {
            // For each cart item, find full product info and enrich
            const updatedCart = parsedData.map((cartItem) => {
              const product = productDetails.find((p) => p.id === cartItem.id);

              if (product) {
                // Merge product details with cart item (quantity etc.)
                return {
                  ...cartItem,
                  name: product.name,
                  brand: product.brand,
                  price: Number(product.price) || 0,
                  image: product.image,
                  flavor: product.flavor,
                  weight: product.weight,
                };
              }

              // If product not found, fallback to existing cart item price
              return {
                ...cartItem,
                price: Number(cartItem.price) || 0,
              };
            });

            setCartItems(updatedCart);
          } else {
            setError("Neplatná data v košíku."); // Cart data is invalid
          }
        } else {
          // No cart cookie found, initialize empty cart
          setCartItems([]);
        }
      } catch (err) {
        setError("Nepodařilo se načíst košík."); // Failed to parse or load cart
      }

      setLoading(false); // Finished loading cart data
    };

    // Only fetch cart after product details have loaded
    if (productDetails.length > 0) {
      fetchCart();
    }
  }, [token, productDetails]);

  // Function to update cart both in state and in cookies
  const updateCart = (newCart) => {
    try {
      Cookies.set("cart", JSON.stringify(newCart), { expires: 7 }); // Persist cookie for 7 days
      setCartItems(newCart);
    } catch (err) {
      console.error("Chyba při ukládání košíku:", err);
      setError("Nepodařilo se aktualizovat košík."); // Error updating cart
    }
  };

  // Handler to change quantity of a cart item; uses useCallback to memoize
  const handleQuantityChange = useCallback(
    (id, qty) => {
      if (qty < 1) return; // Prevent quantity less than 1

      const updatedCart = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Number(qty) } : item
      );

      updateCart(updatedCart);
    },
    [cartItems]
  );

  // Handler to remove an item from the cart; also memoized
  const handleRemove = useCallback(
    (id) => {
      const updatedCart = cartItems.filter((item) => item.id !== id);
      updateCart(updatedCart);
    },
    [cartItems]
  );

  // Calculate subtotal price by summing item price * quantity
  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    return sum + price * quantity;
  }, 0);

  // Reusable component for quantity controls: buttons to increase/decrease + input
  const QuantityControls = ({ item }) => {
    const quantity = item.quantity ?? 1;

    return (
      <div className="qty-controls">
        {/* Decrease quantity button */}
        <button onClick={() => handleQuantityChange(item.id, quantity - 1)}>-</button>

        {/* Input field to manually enter quantity */}
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (!isNaN(val)) handleQuantityChange(item.id, val);
          }}
        />

        {/* Increase quantity button */}
        <button onClick={() => handleQuantityChange(item.id, quantity + 1)}>+</button>
      </div>
    );
  };

  // Show loading indicator if data is still loading
  if (loading) return <p>Načítání košíku...</p>;

  // Show error message if any error happened
  if (error) return <p className="error-message">{error}</p>;

  // Render the complete cart UI
  return (
    <div className="cart-wrapper">
      {/* AutoLogin component handles session refresh */}
      <AutoLogin />
      <div className="cart-main">
        {/* Left section: cart items table */}
        <div className="cart-left">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Položka</th>
                <th>Popis</th>
                <th>Cena</th>
                <th>Množství</th>
                <th>Celkem</th>
                <th>Odstranit</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Košík je prázdný.
                  </td>
                </tr>
              ) : (
                cartItems.map((item) => {
                  const quantity = Number(item.quantity) || 1;
                  const price = Number(item.price) || 0;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => (window.location.href = `/produkt/${item.id}`)} // Navigate to product page on row click
                    >
                      {/* Product image */}
                      <td>
                        <img src={item.image} alt={item.name} className="product-img" />
                      </td>

                      {/* Product description */}
                      <td>
                        <div>{item.name}</div>
                        <div>{item.brand}</div>
                        {item.flavor && <div>Příchuť: {item.flavor}</div>}
                        {item.weight && <div>Balení: {item.weight}</div>}
                      </td>

                      {/* Single item price */}
                      <td>{price.toFixed(2)} Kč</td>

                      {/* Quantity controls with event stopPropagation so clicking here doesn't trigger row click */}
                      <td>
                        <div onClick={(e) => e.stopPropagation()}>
                          <QuantityControls item={item} />
                        </div>
                      </td>

                      {/* Total price for this item */}
                      <td>{(price * quantity).toFixed(2)} Kč</td>

                      {/* Remove button, stops propagation so it doesn't trigger row click */}
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(item.id);
                          }}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Right section: order summary and next step button */}
        <aside className="cart-right">
          <div className="summary-box">
            <h2>Souhrn objednávky</h2>

            {/* Subtotal line */}
            <div className="summary-line">
              <span>Mezisoučet:</span>
              <span>{subtotal.toFixed(2)} Kč</span>
            </div>

            {/* Total amount (same as subtotal here, could include taxes/shipping) */}
            <div className="summary-line total">
              <span>K úhradě:</span>
              <span>{subtotal.toFixed(2)} Kč</span>
            </div>

            {/* Bonus messages based on subtotal */}
            {subtotal < 1000 && (
              <div className="bonus-info">
                <p>
                  Nakupte ještě za <strong>{(1000 - subtotal).toFixed(2)} Kč</strong> a
                  získáte <span className="highlight">vzorek zdarma</span>.
                </p>

                {subtotal < 600 && (
                  <p>
                    Za nákup nad <strong>600 Kč</strong> máte{" "}
                    <span className="highlight">dopravu zdarma</span>!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Button to proceed to delivery step */}
          <div className="continue-button-container">
            <Link to="/doprava">
              <button className="continue-button">Pokračovat</button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
