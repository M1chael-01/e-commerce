// React Router hook for accessing URL parameters
import { useParams } from "react-router-dom";

// React hooks for managing state, side effects, and memoization
import { useState, useEffect, useMemo } from "react";

// Component for filtering and displaying products based on filters
import FilterProducts from "./FilterProducts";

// Sidebar menu with category links
import ShoppingMenu from "./ShoppingMenu";

// Reusable header component for the section title
import SectionHeader from "../SectionHeader";

// CSS styles specific to the women’s category page
import "../../styles/Women.css";

/**
 * Helper function to normalize category names from the URL.
 * Converts to lowercase, removes diacritics, and handles special cases (e.g., "doplňky").
 */
const normalizeCategory = (cat) => {
  if (!cat) return "";
  return cat
    .toLowerCase()
    .normalize("NFD")                     // Separates diacritics from base characters
    .replace(/[\u0300-\u036f]/g, "")     // Removes diacritics
    .replace("doplňky", "doplnky");      // Fix specific Czech variant
};

/**
 * Women component represents the category page for women's products.
 * Filters products based on selected category and gender.
 */
const Women = () => {
  // Extract category from the URL using useParams
  const { category: rawCategory } = useParams();

  // Normalize the category to match backend naming
  const normalizedCategory = normalizeCategory(rawCategory);

  // State: stores active filters applied to the product listing
  const [filters, setFilters] = useState({
    gender: "ženy",            // Default gender
    categorie: normalizedCategory,
    new: null,                 // Optional "new" filter
    recommend: null,           // Optional "recommend" filter
  });

  // Update the filters whenever the normalized category changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categorie: normalizedCategory,
    }));
  }, [normalizedCategory]);

  // Memoized list of sidebar links (categories under "women")
  const links = useMemo(
    () => [
      { title: "Trika", href: "/zeny/trika" },
      { title: "Mikiny", href: "/zeny/mikiny" },
      { title: "Bundy", href: "/zeny/bundy" },
      { title: "Kalhoty", href: "/zeny/kalhoty" },
      { title: "Šaty", href: "/zeny/saty" },
      { title: "Obuv", href: "/zeny/obuv" },
      { title: "Doplňky", href: "/zeny/doplnky" },
    ],
    []
  );

  return (
    <>
      {/* Page headline section */}
      <SectionHeader text="Váš styl, vaše pravidla" />

      <div className="women-layout">
        {/* Sidebar with category links and filters */}
        <ShoppingMenu
          links={links}
          onFilterChange={(newFilters) =>
            setFilters((prev) => ({
              ...prev,
              ...newFilters,  // Merge new filter changes into existing state
            }))
          }
        />

        {/* Product grid that reacts to current filters */}
        <FilterProducts filter={filters} />
      </div>
    </>
  );
};

export default Women;
