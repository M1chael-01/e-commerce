import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/ShoppingMenu.css";
import Cookies from "js-cookie";
import FilterProducts from "./FilterProducts";

// --------- Helper Functions for Cookie Management ---------

// Save a cookie with expiration in days
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + expires + "; path=/";
}

// Read a cookie by name
function getCookie(name) {
  return document.cookie.split("; ").reduce((res, c) => {
    const [key, val] = c.split("=");
    return key === name ? decodeURIComponent(val) : res;
  }, "");
}

// --------- Main Component ---------
const ShoppingMenu = ({ links, onFilterChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- Filter States ---
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [size, setSize] = useState("");
  const [rating, setRating] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [filtered, setFiltered] = useState("");

  // --- Load filters from cookies on initial render ---
  useEffect(() => {
    const savedFilters = getCookie("shoppingFilters");
    if (savedFilters) {
      try {
        const f = JSON.parse(savedFilters);
        setSelectedCategory(f.category || "");
        setSelectedGender(f.gender || "");
        setMinPrice(f.minPrice ?? 0);
        setMaxPrice(f.maxPrice ?? 5000);
        setSize(f.size || "");
        setRating(f.rating || "");
        setIsNew(f.isNew || false);
        setIsRecommended(f.isRecommended || false);
        setHasDiscount(f.hasDiscount || false);
      } catch (error) {
        // Ignore invalid cookie format
      }
    }
  }, []);

  // --- Update filters based on current URL path ---
  useEffect(() => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    const genders = ["muzi", "zeny", "deti"];

    // Reset all filters first
    setIsNew(false);
    setIsRecommended(false);
    setHasDiscount(false);
    setSelectedCategory("");
    setSelectedGender("");
    setMinPrice(0);
    setMaxPrice(5000);
    setSize("");
    setRating("");

    if (pathParts.length === 0) {
      setSelectedGender("");
      setSelectedCategory("");
    } else {
      const firstPart = pathParts[0];
      if (genders.includes(firstPart)) {
        setSelectedGender(firstPart);
        setSelectedCategory(pathParts[1] || "");
      } else {
        setSelectedGender("");
        setSelectedCategory("");
        if (firstPart === "nove") setIsNew(true);
        else if (firstPart === "doporucujeme") setIsRecommended(true);
      }
    }
  }, [location]);

  // --- Save current filters to cookie whenever they change ---
  useEffect(() => {
    const filters = {
      gender: selectedGender || null,
      category: selectedCategory || null,
      minPrice: minPrice !== 0 ? minPrice : null,
      maxPrice: maxPrice !== 5000 ? maxPrice : null,
      size: size || null,
      rating: rating || null,
      isNew: isNew ? true : null,
      isRecommended: isRecommended ? true : null,
      hasDiscount: hasDiscount ? true : null,
    };
    setCookie("shoppingFilters", JSON.stringify(filters), 7);
  }, [
    selectedGender,
    selectedCategory,
    minPrice,
    maxPrice,
    size,
    rating,
    isNew,
    isRecommended,
    hasDiscount,
  ]);

  // --------- Event Handlers for Filters ---------

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    let path = "/";
    if (selectedGender && category) path += `${selectedGender}/${category}`;
    else if (selectedGender) path += `${selectedGender}`;
    else if (category) path += `muzi/${category}`;
    navigate(path);
  };

  const handleGenderChange = (e) => {
    const gender = e.target.value;
    setSelectedGender(gender);

    let path = "/";
    if (gender && selectedCategory) path += `${gender}/${selectedCategory}`;
    else if (gender) path += `${gender}`;
    else if (selectedCategory) path += `muzi/${selectedCategory}`;
    navigate(path);
  };

  const handleMinPriceChange = (e) => {
    const value = Number(e.target.value);
    if (value <= maxPrice) setMinPrice(value);
  };

  const handleMaxPriceChange = (e) => {
    const value = Number(e.target.value);
    if (value >= minPrice) setMaxPrice(value);
  };

  const handleSizeChange = (e) => setSize(e.target.value);

  const handleRatingChange = (e) => setRating(e.target.value);

  const handleIsNewChange = (e) => setIsNew(e.target.checked);

  const handleIsRecommendedChange = (e) => setIsRecommended(e.target.checked);

  const handleHasDiscountChange = (e) => setHasDiscount(e.target.checked);

  // --- Reset filters and navigate to home ---
  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedGender("");
    setMinPrice(0);
    setMaxPrice(5000);
    setSize("");
    setRating("");
    setIsNew(false);
    setIsRecommended(false);
    setHasDiscount(false);
    navigate("/");
    setCookie("shoppingFilters", "", -1); 
    localStorage.removeItem("userFilter");

  };

  // --- Apply filters by sending them to backend ---
  const applyFilters = () => {
    const filters = {
      gender: selectedGender || null,
      category: selectedCategory || null,
      minPrice: minPrice !== 0 ? minPrice : null,
      maxPrice: maxPrice !== 5000 ? maxPrice : null,
      size: size || null,
      rating: rating || null,
      isNew: isNew ? true : null,
      isRecommended: isRecommended ? true : null,
      hasDiscount: hasDiscount ? true : null,
    };
localStorage.removeItem("userFilter");
    // Send filters to backend API
    fetch("http://localhost:5000/filter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    })
      .then((res) => res.json())
      .then((data) => {
        onFilterChange(data);     // Send filtered data to parent
        sendFilterData(data);     // Send session data to backend
      })
      .catch((error) => {
        console.error("Chyba při filtrování:", error);
      });
  };

  // --- Send filtered data to backend session + set cookie ---
 const sendFilterData = (data) => {
  fetch("http://localhost:5000/filterData", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ incomingData: data }),
  })
    .then((res) => res.json())
    .then((response) => {
      Cookies.set("userFilter", JSON.stringify(response), { expires: 7 });
      localStorage.setItem("userFilter", JSON.stringify(response.data)); // ← přidáno
      console.log("Server response:", response);
      setFiltered(data);
    })
    .catch((error) => {
      console.error("Chyba při odesílání do session:", error);
    });
};

  
 



  // --------- Component JSX ---------
  return (
    <>

    <aside className="shopping-menu">
      <nav>
        {/* Category Selection */}
        <h4>Kategorie</h4>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">Vše</option>
          {links.map((link, index) => (
            <option key={index} value={link.href.split("/")[2]}>
              {link.title}
            </option>
          ))}
        </select>

      

        {/* Filters */}
        <div className="menu-filters">
          {/* Price Range Filter */}
          <h4>Filtr podle ceny</h4>
          <div className="filter-range">
            <label htmlFor="minPriceRange">
              Min: <strong>{minPrice} Kč</strong>
            </label>
            <input
              type="range"
              id="minPriceRange"
              min="0"
              max="5000"
              step="100"
              value={minPrice}
              onChange={handleMinPriceChange}
            />
          </div>

          <div className="filter-range">
            <label htmlFor="maxPriceRange">
              Max: <strong>{maxPrice} Kč</strong>
            </label>
            <input
              type="range"
              id="maxPriceRange"
              min="0"
              max="5000"
              step="100"
              value={maxPrice}
              onChange={handleMaxPriceChange}
            />
          </div>

          {/* Size Filter */}
          <h4>Velikost</h4>
          <select value={size} onChange={handleSizeChange}>
            <option value="">Vše</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>

          {/* Rating Filter */}
          <h4>Hodnocení</h4>
          <select value={rating} onChange={handleRatingChange}>
            <option value="">Vše</option>
            <option value="4">4★ a více</option>
            <option value="4.5">4.5★ a více</option>
          </select>

          {/* Additional Filters */}
          <label>
            <input type="checkbox" checked={isNew} onChange={handleIsNewChange} />
            Novinky
          </label>

          <label>
            <input
              type="checkbox"
              checked={isRecommended}
              onChange={handleIsRecommendedChange}
            />
            Doporučené
          </label>

          <label>
            <input
              type="checkbox"
              checked={hasDiscount}
              onChange={handleHasDiscountChange}
            />
            Obsahuje slevu
          </label>

          {/* Action Buttons */}
          <button onClick={applyFilters} type="button" className="filter-menu">
            Filtrovat
          </button>
          <button type="button" className="reset-btn" onClick={resetFilters}>
            Reset filtrů
          </button>
        </div>
      </nav>
    </aside>
    </>
  );
};

export default ShoppingMenu;
