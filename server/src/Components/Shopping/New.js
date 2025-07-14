import { useParams } from "react-router-dom";     // Hook to get URL params
import { useState, useEffect } from "react";     // React hooks for state and lifecycle
import FilterProducts from "./FilterProducts";   // Component to display filtered product list
import ShoppingMenu from "./ShoppingMenu";       // Sidebar menu for filter/category navigation

import SectionHeader from "../SectionHeader";    // Reusable section title component
import normalize from "../../utils/normalize";   // Utility to standardize strings (e.g., lowercase, remove accents)
import "../../styles/FilterProducts.css";        // Styles for filtering UI

const New = () => {
  // Extract 'category' and 'gender' params from URL
  const { category, gender } = useParams();

  // Normalize params to ensure consistency (e.g., lowercase, no diacritics)
  const normalizedCategory = normalize(category);
  const normalizedGender = normalize(gender);

  // State to store current filter settings, initially set from URL params
  const [filter, setFilter] = useState({
    gender: normalizedGender,
    categorie: normalizedCategory,
    new: true,           // Filter only new products
    recommend: null,     // Optionally filter by recommendation (not set initially)
  });

  // Update filter state when category or gender in URL changes
  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      gender: normalizedGender,
      categorie: normalizedCategory,
    }));
  }, [normalizedCategory, normalizedGender]);

  // Links to display in the sidebar menu for filtering by gender or category
  const links = [
    { title: "Pro ženy", href: "/nove/zeny" },
    { title: "Pro muže", href: "/nove/muzi" },
    { title: "Pro děti", href: "/nove/deti" },
    { title: "Trika", href: "/nove/trika" },
    { title: "Mikiny", href: "/nove/mikiny" },
    { title: "Bundy", href: "/nove/bundy" },
    { title: "Kalhoty", href: "/nove/kalhoty" },
    { title: "Šaty", href: "/nove/saty" },
    { title: "Obuv", href: "/nove/obuv" },
    { title: "Doplňky", href: "/nove/doplnky" },
  ];

  return (
    <>
      {/* Page header with descriptive text */}
      <SectionHeader text="Novinky, které právě dorazily" />
      
      {/* Main layout with shopping menu sidebar and product list */}
      <div className="shop-layout">
        {/* Sidebar navigation menu:
            - Displays filtering links
            - Calls onFilterChange when user selects new filters */}
        <ShoppingMenu
          links={links}
          onFilterChange={(newFilters) =>
            setFilter((prev) => ({
              ...prev,
              ...newFilters,   // Merge new filters into current filter state
            }))
          }
        />

        {/* Component that renders products based on current filter */}
        <FilterProducts filter={filter} />  
      </div>
    </>
  );
};

export default New;
