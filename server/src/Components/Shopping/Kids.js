import { useState } from "react";                  // React hook for state management
import ShoppingMenu from "./ShoppingMenu";         // Sidebar menu for filtering and navigation
import FilterProducts from "./FilterProducts";     // Displays products based on applied filters

import SectionHeader from "../SectionHeader";      // Reusable section header component
import "../../styles/FilterProducts.css";          // Styles specific to filtered product display

const Kids = () => {
  // State to hold the current filter criteria, initially filtering for "děti" (kids)
  const [filters, setFilters] = useState({
    gender: "děti",
  });

  // Navigation links for categories relevant to kids
  const links = [
    { title: "Trika", href: "/deti/trika", categorie: "trika" },
    { title: "Mikiny", href: "/deti/mikiny", categorie: "mikiny" },
    { title: "Bundy", href: "/deti/bundy", categorie: "bundy" },
    { title: "Kalhoty", href: "/deti/kalhoty", categorie: "kalhoty" },
    { title: "Šaty", href: "/deti/saty", categorie: "šaty" },
    { title: "Obuv", href: "/deti/obuv", categorie: "obuv" },
    { title: "Doplňky", href: "/deti/doplnky", categorie: "doplňky" },
  ];

  // Handler for updating filters when user interacts with the ShoppingMenu
  const handleFilterChange = (newFilters) => {
    // Merge new filter values with existing filter state
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  return (
    <>
      {/* Section header with a welcoming message for the kids category */}
      <SectionHeader text="To nejlepší pro malé objevitele" />

      {/* Main layout container with sidebar and product display */}
      <div className="products-layout">
        {/* Sidebar menu displaying category links and passing filter update callback */}
        <ShoppingMenu
          links={links}
          onFilterChange={handleFilterChange}
        />
        
        {/* Product listing component filtered according to current filter state */}
        <FilterProducts filter={filters} />
      </div>
    </>
  );
};

export default Kids;
