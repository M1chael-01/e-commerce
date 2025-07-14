import { useState } from "react";
import ShoppingMenu from "./ShoppingMenu";
import FilterProducts from "./FilterProducts";

import SectionHeader from "../SectionHeader";
import "../../styles/FilterProducts.css";

const Discount = () => {
  // Initialize filters state with discount flag set to true
  // This filter is used to display only discounted products
  const [filters, setFilters] = useState({
    discount: true, // Filter to show discounted items only
  });

  // Navigation links for various product categories under the discount section
  const links = [
    { title: "Trika", href: "/slevy/trika", categorie: "trika" },
    { title: "Mikiny", href: "/slevy/mikiny", categorie: "mikiny" },
    { title: "Bundy", href: "/slevy/bundy", categorie: "bundy" },
    { title: "Kalhoty", href: "/slevy/kalhoty", categorie: "kalhoty" },
    { title: "Šaty", href: "/slevy/saty", categorie: "šaty" },
    { title: "Obuv", href: "/slevy/obuv", categorie: "obuv" },
    { title: "Doplňky", href: "/slevy/doplnky", categorie: "doplňky" },
  ];

  // Handler to update filters state when user selects a different filter/category
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters, // Merge new filters into current state, preserving discount:true
    }));
  };

  return (
    <>
      {/* Section header displaying page title */}
      <SectionHeader text="Slevy a výhodné nabídky" />

      <div className="products-layout">
        {/* Sidebar navigation menu for discount categories */}
        <ShoppingMenu
          links={links}
          onFilterChange={handleFilterChange} // Callback to update filters state
        />

        {/* Product listing component filtered according to selected filters */}
        <FilterProducts filter={filters} />
      </div>
    </>
  );
};

export default Discount;
