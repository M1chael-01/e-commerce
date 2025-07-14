import { useParams } from "react-router-dom";  // Hook to access URL parameters
import { useState, useEffect } from "react";  // React hooks for state management and lifecycle
import FilterProducts from "./FilterProducts"; // Component to display products filtered by criteria
import ShoppingMenu from "./ShoppingMenu";     // Sidebar menu component for filter navigation

import SectionHeader from "../SectionHeader";  // Reusable section header component
import "../../styles/FilterProducts.css";      // Styles specific to filter and product layout

const Men = () => {
  // Extract 'category' param from the URL (e.g., /muzi/trika -> category = "trika")
  const { category } = useParams();

  // Normalize the category string for consistent filtering
  // Special handling to unify variants "doplňky" and "doplnky" to "doplnky"
  const normalizedCategory = category
    ? category.toLowerCase() === "doplňky" || category.toLowerCase() === "doplnky"
      ? "doplnky"
      : category.toLowerCase()
    : "";

  // State to hold the current filter options for product display
  const [filter, setFilter] = useState({
    gender: "muži",            // Fixed gender filter for this page ("men")
    categorie: normalizedCategory, // Category from URL, normalized
    new: null,                 // No filter on 'new' products by default
    recommend: null,           // No filter on recommendations by default
    size: "",                  // Filter by product size (empty initially)
    style: "",                 // Filter by style (empty initially)
    minRating: null,           // Minimum rating filter (not set initially)
    minPrice: null,            // Minimum price filter (not set initially)
    maxPrice: null,            // Maximum price filter (not set initially)
  });

  // Update filter category state when URL category param changes
  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      categorie: normalizedCategory,
    }));
  }, [normalizedCategory]);

  // Sidebar navigation links specific to men's product categories
  const links = [
    { title: "Trika", href: "/muzi/trika" },
    { title: "Mikiny", href: "/muzi/mikiny" },
    { title: "Bundy", href: "/muzi/bundy" },
    { title: "Kalhoty", href: "/muzi/kalhoty" },
    { title: "Obuv", href: "/muzi/obuv" },
    { title: "Doplňky", href: "/muzi/doplnky" },
  ];

  return (
    <>
      {/* Section header for the men’s products page */}
      <SectionHeader text="To nejlepší pro muže" />

      {/* Main layout containing the sidebar menu and filtered product list */}
      <div className="products-layout">
        {/* Sidebar menu with category links and callback to update filters */}
        <ShoppingMenu
          links={links}
          onFilterChange={(newFilters) =>
            setFilter((prev) => ({
              ...prev,
              ...newFilters,  // Merge newly selected filters into current state
            }))
          }
        />

        {/* Product listing filtered based on current filter state */}
        <FilterProducts filter={filter} />
      </div>
    </>
  );
};

export default Men;
