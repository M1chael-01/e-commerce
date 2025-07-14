// React core imports
import React, { useState, useEffect } from "react";

// Icons used for UI elements
import {
  CiShoppingCart,
  CiMenuBurger,
  CiSquareRemove,
  CiSearch,
} from "react-icons/ci";

// React Router for navigation
import { Link } from "react-router-dom";

// Library for handling browser cookies
import Cookies from "js-cookie";

// Handles automatic login functionality (e.g., via cookie/session)
import AutoLogin from "./AutoLogin";

// Function to fetch all product data (e.g., for search suggestions)
import alllProducts from "./database/GetData";

// CSS for header styling
import "../styles/Header.css";

const Header = () => {
  // Track whether the mobile menu is toggled open
  const [menuOpen, setMenuOpen] = useState(false);

  // Track the total number of items in the shopping cart
  const [itemCount, setItemCount] = useState(0);

  // Track the user's current search input
  const [searchedProduct, setSearchedProduct] = useState("");

  // Store a list of products that match the search input
  const [filteredProducts, setFilteredProducts] = useState([]);

  /**
   * Retrieves the current number of items in the cart by reading the "cart" cookie,
   * parsing it, and summing the quantities.
   */
  const getItemCount = () => {
    try {
      const cartData = Cookies.get("cart");
      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        const itemCount = parsedCart.reduce(
          (count, item) => count + item.quantity,
          0
        );
        setItemCount(itemCount);
      } else {
        setItemCount(0);
      }
    } catch (err) {
      console.error("Chyba při získávání počtu položek:", err);
      setItemCount(0);
    }
  };

  /**
   * Runs once when the component mounts. Uses an interval to update cart item count
   * every 500ms to reflect changes from other components.
   */
  useEffect(() => {
    const it = setInterval(() => {
      getItemCount();
    }, 500);

    return () => {
      clearInterval(it); // Clean up interval when component unmounts
    };
  }, []);

  /**
   * Filters products based on the search input and updates the dropdown.
   */
  const searchProduct = async (e) => {
    const value = e.target.value;
    const searchTerm = value.toLowerCase();
    setSearchedProduct(value);

    if (!searchTerm.trim()) {
      setFilteredProducts([]);
      return;
    }

    try {
      const data = await alllProducts.getAllProducts();
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm)
      );
      setFilteredProducts(filtered);
    } catch (err) {
      console.warn("Error filtering products:", err);
    }
  };

  /**
   * Clears the search input and the filtered results.
   */
  const clearSearch = () => {
    setSearchedProduct("");
    setFilteredProducts([]);
  };

  return (
    <>
      {/* Automatically logs in the user if credentials are stored */}
      <AutoLogin />

      <header className="header">
        <nav className="nav container">

          {/* Left: Menu toggle & Logo */}
          <div className="nav-left">
            <button
              className="menu-toggle"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {/* Show open or close icon based on menu state */}
              {menuOpen ? <CiSquareRemove size={30} /> : <CiMenuBurger size={30} />}
            </button>

            {/* Logo that links to the homepage */}
            <Link to="/" className="logo">
              <div>
                <span>Run</span>ix
              </div>
            </Link>
          </div>

          {/* Center: Search bar */}
          <div className="nav-center">
            <div className="search-wrapper">
              <CiSearch size={20} className="search-icon" />
              <input
                type="text"
                value={searchedProduct}
                onInput={(e) => searchProduct(e)}
                placeholder="Hledat..."
                aria-label="Vyhledávání produktů"
                className="search-input"
              />
              {/* Clear search button (X icon) */}
              {searchedProduct && (
                <CiSquareRemove
                  size={20}
                  className="clear-icon"
                  onClick={clearSearch}
                />
              )}
            </div>

            {/* Dropdown with filtered product results */}
            {filteredProducts.length > 0 && searchedProduct.length > 0 && (
              <div className="search-dropdown">
                {filteredProducts.map((item) => (
                  <Link
                    key={item.id}
                    to={`/produkt/${item.id}`}
                    className="dropdown-item"
                    onClick={() => {
                      setSearchedProduct("");
                      setFilteredProducts([]);
                    }}
                  >
                    <img src={item.image} alt={item.name} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right: Navigation links and Cart */}
          <div className="nav-right">
            <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
              <li><Link to="/muzi">Muži</Link></li>
              <li><Link to="/zeny">Ženy</Link></li>
              <li><Link to="/deti">Děti</Link></li>
              <li><Link to="/nove" className="active">Nové</Link></li>
              <li><Link to="/doporucujeme" className="active">Doporučujeme</Link></li>
              <li><Link to="/obuv">Boty</Link></li>
            </ul>

            {/* Cart icon with item count */}
            <Link to="/kosik" aria-label="Nákupní košík">
              <div className="cart">
                <CiShoppingCart size={40} />
                <span className="cart-count">{itemCount}</span>
              </div>
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
