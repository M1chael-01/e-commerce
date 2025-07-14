import { useState, useEffect, useRef, useCallback } from "react";
import Fuse from "fuse.js"; // Fuzzy search library for flexible filtering
import { Link } from "react-router-dom";
import Products from "../database/GetData"; // Module to fetch products data
import splitTitle from "../SplitTitle"; // Helper to format product titles
import ImageHover from "../ImageHover"; // Custom image hover effect handler
import "../../styles/FilterProducts.css";

const FilterProducts = ({ filter }) => {
  // State for all products fetched from database or API
  const [allProducts, setAllProducts] = useState([]);

  // State for products filtered based on current filters and search
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Pagination state: current page number
  const [currentPage, setCurrentPage] = useState(1);

  // Number of items shown per page
  const itemsPerPage = 10;

  // Ref to store timestamps when user starts viewing product (for tracking view duration)
  const viewStartTime = useRef({});

  // Ref to manage image hover functionality via custom class
  const imageHover = useRef(null);

  // Ref to prevent rapid consecutive loads on "Load More" button
  const lastLoadMoreTime = useRef(0);

  // Ref to the "Load More" button element for Intersection Observer
  const loadMoreBtnRef = useRef(null);

  // Flag to track if it's the initial load (used to fetch filters from server only once)
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // State holding product data fetched from localStorage or server filters
  const [gottenData, setGottenData] = useState(null);

  // Fetch all products once when component mounts
  useEffect(() => {
    Products.getAllProducts().then((products) => {
      setAllProducts(products);
      setFilteredProducts(products);
    });
  }, []);

  // Function to fetch filtered product data from backend API
  const fetchFilterData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/resultFilter", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Nepodařilo se načíst filtry");
      }

      const data = await response.json();

      console.log("Server response:", data);

      if (data.data && Array.isArray(data.data)) {
        // Save filtered product list to localStorage for caching or cross-component use
        localStorage.setItem("userFilter", JSON.stringify(data.data));
        return data.data;
      }
      return null;
    } catch (error) {
      console.error("Chyba při načítání filtrů:", error);
      return null;
    }
  }, []);

  // Debounce filter changes to avoid excessive filtering calls while user is typing/selecting filters
  const [debouncedFilter, setDebouncedFilter] = useState(filter);
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedFilter(filter), 300);
    return () => clearTimeout(timeout);
  }, [filter]);

  // Effect to apply filters whenever allProducts or debouncedFilter changes
  useEffect(() => {
    if (allProducts.length === 0) return;

    const applyFilters = async () => {
      if (isInitialLoad) {
        // On initial load, try fetching filters from backend and use those products if any
        const serverFilters = await fetchFilterData();
        if (serverFilters && serverFilters.length > 0) {
          setFilteredProducts(serverFilters);
          setIsInitialLoad(false);
          return;
        }
        setIsInitialLoad(false);
      }

      let result = [...allProducts];

      // Use Fuse.js fuzzy search if a 'style' filter is present to match against multiple keys
      if (debouncedFilter.style) {
        const fuse = new Fuse(result, {
          keys: ["description", "name", "style"],
          threshold: 0.4, // Adjust threshold for fuzzy matching sensitivity
        });
        result = fuse.search(debouncedFilter.style).map((r) => r.item);
      }

      // Apply filtering by gender and category if specified in filters
      result = result.filter(
        (p) =>
          (!debouncedFilter.gender ||
            p.gender?.toLowerCase() === debouncedFilter.gender.toLowerCase()) &&
          (!debouncedFilter.categorie ||
            p.categorie?.toLowerCase() === debouncedFilter.categorie.toLowerCase())
      );

      // Update filtered products and reset to first page of pagination
      setFilteredProducts(result);
      setCurrentPage(1);
    };

    applyFilters();
  }, [allProducts, debouncedFilter, fetchFilterData, isInitialLoad]);

  // Initialize image hover effect whenever filtered products change
  useEffect(() => {
    imageHover.current = new ImageHover(filteredProducts, setFilteredProducts);
  }, [filteredProducts]);

  // Calculate products to render based on current pagination
  const paginated = filteredProducts.slice(0, currentPage * itemsPerPage);

  // Calculate total pages based on filtered product count and items per page
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Function to load more items, increases currentPage if possible and records load time
  const loadMore = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
      lastLoadMoreTime.current = Date.now();
    }
  }, [currentPage, totalPages]);

  // Use Intersection Observer to automatically load more products when "Load More" button comes into view,
  // but throttled to once every 5 seconds to avoid excessive loading
  useEffect(() => {
    if (!loadMoreBtnRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            Date.now() - lastLoadMoreTime.current > 5000
          ) {
            loadMore();
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    observer.observe(loadMoreBtnRef.current);

    return () => {
      if (loadMoreBtnRef.current) observer.unobserve(loadMoreBtnRef.current);
    };
  }, [loadMore]);

  // Event handler for mouse entering product card:
  // Records the start time of view and triggers image hover change
  const handleMouseEnter = (id) => {
    viewStartTime.current[id] = Date.now();
    imageHover.current?.changeImage(id);
  };

  // Event handler for mouse leaving product card:
  // Calculates view duration, sends analytics to backend, and reverts image
  const handleMouseLeave = (product) => {
    const start = viewStartTime.current[product.id];
    if (!start) return;

    const duration = (Date.now() - start) / 1000; // seconds

    fetch("http://localhost:5000/api/similar-products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        product,
        userBehavior: { viewDurationSec: duration },
      }),
    }).catch(console.error);

    imageHover.current?.returnImage(product.id);
  };

  // Clear any previously stored user filters from localStorage on component mount
  useEffect(() => {
    localStorage.removeItem("userFilter");
  }, []);

  // Helper function to safely parse user filter data from localStorage
  const getUserFilterFromLocalStorage = () => {
    const data = localStorage.getItem("userFilter");
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  };

  // Poll localStorage every 500ms to detect changes in userFilter data and update gottenData state accordingly
  useEffect(() => {
    let lastValue = JSON.stringify(getUserFilterFromLocalStorage());

    const intervalId = setInterval(() => {
      const currentValue = JSON.stringify(getUserFilterFromLocalStorage());
      if (currentValue !== lastValue) {
        lastValue = currentValue;
        const parsed = JSON.parse(currentValue);
        setGottenData(parsed);
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  // Determine which data to display:
  // If gottenData exists (from localStorage), use it,
  // otherwise show paginated filtered results from state
  const result =
    gottenData === null
      ? paginated
      : Array.isArray(gottenData)
      ? gottenData
      : [];

  // Debugging: log products and their count every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      const arrayResult = Array.isArray(result) ? result : [];
      arrayResult.forEach((item, index) => {
        console.log(index, item);
      });
      console.log(arrayResult.length, "'aa'");
    }, 1000);

    return () => clearInterval(intervalId);
  }, [result]);

  return (
    <>
      <section className="product-section">
        <div className="product-flex">
          {result.length === 0 ? (
            <div className="no-products-box">
              <h2>Omlouváme se, žádné produkty neodpovídají vašim filtrům</h2>
              <button onClick={() => window.location.reload()}>
                Obnovit filtry
              </button>
            </div>
          ) : (
            // Map filtered products to product cards
            result.map((p) => (
              <div
                key={p.id}
                className="product-card"
                onMouseEnter={() => handleMouseEnter(p.id)}
                onMouseLeave={() => handleMouseLeave(p)}
              >
                <Link to={`/produkt/${p.id}`} className="product-link">
                  <img src={p.image} alt={p.name} className="product-image" />
                  <h3>{splitTitle(p.name)}</h3>

                  {/* Show discounted price if applicable */}
                  {p.discount != null ? (
                    <div className="product-price-discounted">
                      <span className="original-price">{p.price} Kč</span>
                      <span className="discounted-price">
                        {Math.round(p.price - (p.price * p.discount) / 100)} Kč
                      </span>
                    </div>
                  ) : (
                    <p className="normal-price">{p.price} Kč</p>
                  )}
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Load More button shown only if more pages are available */}
        {currentPage < totalPages && (
          <div className="pagination">
            <button ref={loadMoreBtnRef} onClick={loadMore}>
              Načíst další
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default FilterProducts;
