import React, { useState } from "react";         // React core and useState hook for managing state
import { useParams } from "react-router-dom";   // Hook to access URL parameters
import ShoppingMenu from "./ShoppingMenu";      // Sidebar menu component for filtering navigation
import FilterProducts from "./FilterProducts";  // Component to display products filtered by criteria
import SectionHeader from "../SectionHeader";   // Reusable header component

const Main = () => {
  // Get 'category' param from the URL (e.g., /nakupovat/trika -> category = "trika")
  const { category } = useParams();

  // Normalize the category string to ensure consistent filtering
  // Special case: unify "doplňky" and "doplnky" to "doplnky"
  const normalizeCategory = (cat) =>
    cat
      ? cat.toLowerCase() === "doplňky" || cat.toLowerCase() === "doplnky"
        ? "doplnky"
        : cat.toLowerCase()
      : "";

  // State to hold current filter options for product listing
  const [filter, setFilter] = useState({
    gender: "",                         // No gender filter selected initially
    categorie: normalizeCategory(category),  // Category normalized from URL param
    new: null,                         // No filter for new products by default
    recommend: null,                   // No recommendation filter by default
  });

  // Array of navigation links for the shopping menu
  const links = [
    { title: "Pro ženy", href: "/zeny" },
    { title: "Pro muže", href: "/muzi" },
    { title: "Pro děti", href: "/deti" },
    { title: "Trika", href: "/nakupovat/trika" },
    { title: "Mikiny", href: "/nakupovat/mikiny" },
    { title: "Bundy", href: "/nakupovat/bundy" },
    { title: "Kalhoty", href: "/nakupovat/kalhoty" },
    { title: "Šaty", href: "/nakupovat/saty" },
    { title: "Obuv", href: "/nakupovat/obuv" },
    { title: "Doplňky", href: "/nakupovat/doplnky" },
  ];

  return (
    <>
      {/* Page header with a welcoming message */}
      <SectionHeader text="Váš styl, naše inspirace" />

      {/* Main layout with sidebar and filtered product listing */}
      <div className="shop-layout">
        {/* Sidebar menu for navigating product categories and genders
            onFilterChange callback updates the filter state with new selections */}
        <ShoppingMenu
          links={links}
          onFilterChange={(newFilter) =>
            setFilter((prev) => ({ ...prev, ...newFilter }))
          }
        />

        {/* Product list filtered according to current filter state */}
        <FilterProducts filter={filter} />
      </div>
    </>
  );
};

export default Main;
