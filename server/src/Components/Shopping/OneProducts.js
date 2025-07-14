import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import stringSimilarity from "string-similarity";  // Library to compare strings similarity
import "../../styles/OneProduct.css";               // Styles for the product page
import OrderButton from "./OrderButton";             // Add to cart button component
import splitTitle from "../SplitTitle";              // Utility to format product titles
import GetOneProduct from "../database/GetData";     // API helper to fetch product data

// Initial state for useReducer
const initialState = {
  oneProduct: null,           // Currently viewed product details
  mainImage: "",              // Main displayed image URL
  showAddedMessage: false,    // Flag to show "added to cart" notification
  suggestedProducts: [],      // List of similar products
  visibleSuggestions: 5,      // Number of suggestions to show
  productSize: "",            // Selected size by user
  allProducts: [],            // All products fetched for similarity comparisons
};

// Reducer function to manage component state updates
function reducer(state, action) {
  switch (action.type) {
    case "SET_PRODUCT":
      return {
        ...state,
        oneProduct: action.payload,
        mainImage: action.payload.image, // Set main image when product loads
      };
    case "SET_ALL_PRODUCTS":
      return { ...state, allProducts: action.payload };
    case "SET_SUGGESTED_PRODUCTS":
      return { ...state, suggestedProducts: action.payload };
    case "SET_PRODUCT_SIZE":
      return { ...state, productSize: action.payload };
    case "SHOW_ADDED_MESSAGE":
      return { ...state, showAddedMessage: true };
    case "HIDE_ADDED_MESSAGE":
      return { ...state, showAddedMessage: false };
    case "SET_MAIN_IMAGE":
      return { ...state, mainImage: action.payload };
    default:
      return state;
  }
}

const OneProduct = () => {
  const { id } = useParams();        // Get product ID from URL
  const location = useLocation();    // Current location object (not heavily used here)
  const navigate = useNavigate();    // Navigation function for programmatic redirects
  const [state, dispatch] = useReducer(reducer, initialState); // State management using reducer
  const [newLink, setLink] = useState(null);  // State to store dynamic category link

  // Destructure state properties for easy usage
  const {
    oneProduct,
    mainImage,
    showAddedMessage,
    suggestedProducts,
    visibleSuggestions,
    productSize,
    allProducts,
  } = state;

  // Calculate similarity score between two products based on category, style, price, and description
  const getSimilarityScore = (product1, product2) => {
    const categorySimilarity = product1.category === product2.category ? 1 : 0;
    const styleSimilarity = product1.style === product2.style ? 1 : 0;
    const priceSimilarity = Math.abs(product1.price - product2.price) <= 250 ? 1 : 0;
    const descriptionSimilarity = stringSimilarity.compareTwoStrings(
      product1.description.toLowerCase(),
      product2.description.toLowerCase()
    );

    // Weighted score combining all criteria
    return (
      0.4 * categorySimilarity +
      0.3 * styleSimilarity +
      0.2 * priceSimilarity +
      0.1 * descriptionSimilarity
    );
  };

  // Effect to generate a dynamic link based on product gender and category using slugify utility
  useEffect(() => {
      if (!id) return;
    if (oneProduct?.gender && oneProduct?.categorie) {
      const gender = slugify(oneProduct.gender);
      const category = slugify(oneProduct.categorie);
      setLink(`/${gender}/${category}`);
    }
  }, [oneProduct]);

  // Get top 5 similar products excluding the current product
  const getSimilarProducts = (product) => {
    return allProducts
      .filter((item) => item.id !== product.id)  // exclude current product
      .map((item) => ({
        ...item,
        similarityScore: getSimilarityScore(product, item), // calculate similarity
      }))
      .sort((a, b) => b.similarityScore - a.similarityScore) // sort descending by score
      .slice(0, 5);  // take top 5
  };

  // Handler to show added-to-cart message briefly
  const handleAddToCart = () => {
    dispatch({ type: "SHOW_ADDED_MESSAGE" });
    setTimeout(() => dispatch({ type: "HIDE_ADDED_MESSAGE" }), 2000);
  };

  // Fetch product data and all products when ID changes (page loads or product changes)
  useEffect(() => {
    const fetchOneProduct = async () => {
      const product = await GetOneProduct.getOneProduct(Number(id));
      if (product) {
        dispatch({ type: "SET_PRODUCT", payload: product });
      }
    };

    const fetchAllProducts = async () => {
      const products = await GetOneProduct.getAllProducts();
      dispatch({ type: "SET_ALL_PRODUCTS", payload: products });
    };

    if (id) {
      fetchOneProduct();
      fetchAllProducts();
    }
  }, [id]);

  // When product or allProducts change, calculate and set suggested products
  useEffect(() => {
    if (oneProduct) {
      const similar = getSimilarProducts(oneProduct);
      dispatch({ type: "SET_SUGGESTED_PRODUCTS", payload: similar });
    }
  }, [oneProduct, allProducts]);

  // Show loading if product is not yet loaded
  if (!oneProduct) {
    return <div className="loading">⏳ Načítání produktu...</div>;
  }

  // Use product images array if available; fallback to single image
  const images = oneProduct.images && oneProduct.images.length > 0 ? oneProduct.images : [oneProduct.image];

  // Utility to convert text to URL-friendly slug (remove accents, lowercase, replace spaces)
  const slugify = (text) => {
    return text
      .normalize("NFD")                // split accented letters
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .toLowerCase()                   // lowercase
      .replace(/[^a-z0-9]+/g, "-")     // replace non-alphanumeric with dashes
      .replace(/^-+|-+$/g, "");        // trim dashes from start/end
  };

  return (
    <>
      <div className="product-page">
        {/* Image Gallery with main selected image */}
        <div className="product-gallery">
          <img className="main-image" src={mainImage} alt={oneProduct.name} />
        </div>

        {/* Product Details Section */}
        <div className="product-details">
          <h1 className="product-title">{oneProduct.name}</h1>

          {/* Price display with discount if applicable */}
          <div className="product-price">
            {oneProduct.discount ? (
              <>
                <span className="original">{oneProduct.price} Kč</span>
                <span className="discounted">
                  {(oneProduct.price * (1 - oneProduct.discount / 100)).toFixed(0)} Kč
                </span>
              </>
            ) : (
              <span>{oneProduct.price} Kč</span>
            )}
          </div>

          {/* Short description */}
          <p className="product-description">{oneProduct.description}</p>

          {/* Size selection buttons if sizes available */}
          {oneProduct.sizes && oneProduct.sizes.length > 0 && (
            <div className="sizes">
              <strong>Velikosti:</strong>
              <div className="size-list">
                {oneProduct.sizes.map((size, idx) => (
                  <span
                    key={idx}
                    className={`size ${productSize === size ? "selected" : ""}`}
                    onClick={() => dispatch({ type: "SET_PRODUCT_SIZE", payload: size })}
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Smooth scroll link to more product info section */}
          <a
            href="#info"
            className="more-info-link"
            onClick={(e) => {
              e.preventDefault();
              const infoSection = document.getElementById("info");
              if (infoSection) {
                infoSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Zobrazit více informací &gt;
          </a>

          {/* Add to Cart button passing selected size and id */}
          <OrderButton productSize={productSize} id={id} onClick={handleAddToCart} />

          {/* Temporary toast message when item is added */}
          {showAddedMessage && (
            <div className="added-to-cart-toast">✅ Přidáno do košíku!</div>
          )}
        </div>
      </div>

      {/* Product Information Section */}
      <section className="product-info" id="info">
        <h2 className="info-heading">{oneProduct.name}</h2>

        <div className="info-grid">
          <div className="info-card">
            <h3>🎯 Základní informace</h3>
            <p><strong>Kategorie:</strong> {oneProduct.categorie || oneProduct.category}</p>
            <p><strong>Cena:</strong> {oneProduct.price} Kč</p>
            {oneProduct.discount && <p><strong>Sleva:</strong> {oneProduct.discount}%</p>}
            {oneProduct.sizes?.length > 0 && (
              <p><strong>Velikosti:</strong> {oneProduct.sizes.join(", ")}</p>
            )}
          </div>

          {/* Long description if available */}
          {oneProduct.description_long && (
            <div className="info-card">
              <h3>📝 Detailní popis</h3>
              <p>{oneProduct.description_long}</p>
            </div>
          )}

          {/* Features list */}
          {oneProduct.features?.length > 0 && (
            <div className="info-card">
              <h3>🔍 Vlastnosti</h3>
              <ul>
                {oneProduct.features.map((feature, idx) => <li key={idx}>{feature}</li>)}
              </ul>
            </div>
          )}

          {/* Functions list */}
          {oneProduct.funk?.length > 0 && (
            <div className="info-card">
              <h3>⚙️ Funkce</h3>
              <ul>
                {oneProduct.funk.map((f, idx) => <li key={idx}>{f}</li>)}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Rating Section */}
      <section className="rating">
        {oneProduct.rating ? (
          <>
            <div className="rating-score">
              <div className="stars">
                {/* Render filled stars based on rounded rating */}
                {Array.from({ length: Math.round(oneProduct.rating) }).map((_, i) => (
                  <span key={i} className="star filled">★</span>
                ))}
              </div>
              <div className="score-text">
                {oneProduct.rating.value} {Math.round(oneProduct.rating)} / 5
              </div>
            </div>
            <div className="rating-note">📝 {oneProduct.rating.note}</div>
          </>
        ) : (
          <div className="no-rating">Žádné hodnocení</div>
        )}

        {/* Recommendation message based on product property */}
        {oneProduct.recommend !== undefined && (
          <div className={oneProduct.recommend ? "recommend positive" : "recommend"}>
            {oneProduct.recommend
              ? "🌟 Doporučováno ostatními"
              : "📌 Doporučujeme porovnat s dalšími možnostmi"}
          </div>
        )}
      </section>

      {/* Photo Gallery Section */}
      <div className="photo-gallery">
        <h2>Foto galerie</h2>
        <div className="flex">
          {images.map((item, idx) => (
            <div key={idx}>
              {/* Clicking on image opens it in a new tab */}
              <img
                onClick={() => window.open(item, "_blank")}
                src={item}
                alt={`Product image ${idx + 1}`}
                className="gallery-img"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Highlight Section promoting product category */}
      <section className="product-highlight">
        <h2>Objevte výjimečné {oneProduct.categorie}, které udávají styl</h2>
        <p>
          Prozkoumejte naši pečlivě vybranou nabídku {oneProduct.categorie}, které spojují kvalitu,
          design a funkčnost. Ideální volba pro váš jedinečný styl.
        </p>
        {/* Navigate to category collection page */}
        <button onClick={() => navigate(newLink)} className="ct-button">Zobrazit kolekci</button>
      </section>

      {/* Suggested Products Section */}
      <section className="suggestions-section">
        <h2>Může se vám líbit</h2>
        <div className="suggested-products">
          {suggestedProducts.length > 0 ? (
            suggestedProducts.slice(0, visibleSuggestions).map((item) => (
              <a
                href={`/produkt/${item.id}`}
                key={item.id}
                className="suggested-product"
              >
                <img src={item.image} alt={item.name} />
                <h4>{splitTitle(item.name)}</h4>
                <div className="suggested-price">
                  {item.discount ? (
                    <>
                      <span className="original">{item.price} Kč</span>
                      <span className="discounted">
                        {(item.price * (1 - item.discount / 100)).toFixed(0)} Kč
                      </span>
                    </>
                  ) : (
                    <span>{item.price} Kč</span>
                  )}
                </div>
              </a>
            ))
          ) : (
            <p>Žádné podobné produkty</p>
          )}
        </div>

        {/* Link to browse more products */}
        <a href="/nakupovat">
          <button className="load-more-btn">Zobrazit více</button>
        </a>
      </section>
    </>
  );
};

export default OneProduct;
