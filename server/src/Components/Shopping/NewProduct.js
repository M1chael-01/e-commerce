import { useState, useEffect } from "react";
import "../../styles/NewProducts.css";        // Styles specific to new products section
import { Link } from "react-router-dom";      // For linking to product pages
import OrderButton from "./OrderButton";      // Imported but not used here (may be used elsewhere)
import splitTitle from "../SplitTitle";       // Utility to format product names

import productsData from "../database/GetData"; // Data access layer with product fetching methods

const NewProduct = () => {
  // State to hold the list of fetched new products
  const [newProducts, setNewProducts] = useState([]);

  // useEffect runs once after component mounts, fetching new products data
  useEffect(() => {
    const fetchNewProducts = async () => {
      // Call the API or data source to get new products
      const res = await productsData.getNewProducts();
      
      // Check if result is an array and not empty
      if (res && Array.isArray(res)) {
        // Limit displayed products to top 10 new items
        setNewProducts(res.slice(0, 10));
      } else {
        // Log a warning if no new products found
        console.warn("❗ Žádné nové produkty nebyly nalezeny.");
      }
    };

    // Trigger the fetch
    fetchNewProducts();
  }, []); // Empty dependency array means this runs only once on mount

  return (
    <>
      {/* Section header with title and horizontal line */}
      <div>
        <h2>Naše novinky</h2>
        <hr />
      </div>

      {/* Container for the list of product cards */}
      <div className="news">
        {/* Map over newProducts to create individual product cards */}
        {newProducts.map((product) => (
          <div className="product-card" key={product.id}>
            {/* Wrap product image with a Link to that product's page */}
            <Link to={`/produkt/${product.id}`}>
              <div className="product-img-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-img"
                />
              </div>
            </Link>

            {/* Display the product name formatted nicely */}
            <p className="product-name">{splitTitle(product.name)}</p>

            {/* Display product price, showing discount if available */}
            <div className="product-price">
              {product.discount ? (
                <>
                  {/* Show original price crossed out or styled */}
                  <span className="original-price">{product.price} Kč</span>
                  {/* Show discounted price rounded */}
                  <span className="discounted-price">
                    {Math.round(product.price * (1 - product.discount / 100))} Kč
                  </span>
                </>
              ) : (
                // Show price normally if no discount
                <span className="discounted-price">{product.price} Kč</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Button linking to the full page of all new products */}
      <Link to="/nove">
        <button className="show-more">Zobrazit více</button>
      </Link>
    </>
  );
};

export default NewProduct;
