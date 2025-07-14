import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FilterProducts from "./FilterProducts";    
import ShoppingMenu from "./ShoppingMenu";        
import SectionHeader from "../SectionHeader";    

const Shoes = () => {
  // --- Get 'subcategory' from the URL ---
  // Example: URL /zeny/obuv/tenisky -> subcategory = 'tenisky'
  const { subcategory } = useParams();

  // --- Initial filter state ---
  // 'gender' is left blank (can be set in ShoppingMenu), 'categorie' is fixed as "obuv"
  // 'subcategorie' is dynamically set from URL param (if exists)
  const [filter, setFilter] = useState({
    gender: "",                   // Can be updated via ShoppingMenu
    categorie: "obuv",            // Always "obuv" for this page
    subcategorie: subcategory || "",  // From URL if present
    new: null,                    // Optional filter (e.g., new arrivals)
  });

  // --- Update 'subcategorie' when URL param changes ---
  // Ensures filter state reflects the current subcategory from route
  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      subcategorie: subcategory || "",
    }));
  }, [subcategory]);

  // --- Navigation links shown in the sidebar ---
  // These represent available subcategories of women's shoes
  const links = [
    { title: "Tenisky", href: "/zeny/obuv/tenisky" },
    { title: "Sandály", href: "/zeny/obuv/sandaly" },
    { title: "Kotníkové boty", href: "/zeny/obuv/kotnikove" },
    { title: "Lodičky", href: "/zeny/obuv/lodicky" },
    { title: "Kozačky", href: "/zeny/obuv/kozacky" },
    { title: "Sportovní", href: "/zeny/obuv/sportovni" },
    { title: "Doplňky", href: "/zeny/doplnky" }, // extra category
  ];

  return (
    <>
      {/* Page header text */}
      <SectionHeader text="Stylové boty pro každý den" />
    
      {/* Layout wrapper for sidebar + product grid */}
      <div className="women-layout">
        {/* Sidebar filter menu (handles category, gender, price, etc.) */}
        <ShoppingMenu
          links={links}
          // When filters change, update our local filter state
          onFilterChange={(newFilters) =>
            setFilter((prev) => ({ ...prev, ...newFilters }))
          }
        />

        {/* Main product list filtered by current state */}
        <FilterProducts filter={filter} />
      </div>
    </>
  );
};

export default Shoes;
