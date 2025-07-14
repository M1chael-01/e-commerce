import { useParams } from "react-router-dom";
import FilterProducts from "./FilterProducts";     // Component to display products based on filters
import ShoppingMenu from "./ShoppingMenu";         // Sidebar menu with filters and navigation
import SectionHeader from "../SectionHeader";      // Section header with a customizable title

const Recommend = () => {
  // Get the 'category' parameter from the URL (e.g. /doporucujeme/ženy)
  const { category } = useParams();

  // Sidebar navigation links for recommended sections by gender and product category
  const links = [
    { title: "Pro ženy", href: "/doporucujeme/ženy" },
    { title: "Pro muže", href: "/doporucujeme/muži" },
    { title: "Pro děti", href: "/doporucujeme/děti" },
    { title: "Trika", href: "/doporucujeme/trika" },
    { title: "Mikiny", href: "/doporucujeme/mikiny" },
    { title: "Bundy", href: "/doporucujeme/bundy" },
    { title: "Kalhoty", href: "/doporucujeme/kalhoty" },
    { title: "Šaty", href: "/doporucujeme/šaty" },
    { title: "Obuv", href: "/doporucujeme/obuv" },
    { title: "Doplňky", href: "/doporucujeme/doplnky" },
  ];

  // Check if the 'category' URL param matches one of the gender categories
  const isGender = ["ženy", "muži", "děti"].includes(category);

  // Determine if 'category' param is a product category (not gender and not empty)
  const isCategory = !isGender && !!category;

  return (
    <>
      {/* Section header with a promotional message */}
      <SectionHeader text="Zákazníci si zamilovali" />

      {/* Main content layout: sidebar and filtered product display */}
      <div className="women-layout">
        {/* Sidebar menu showing links for navigation/filtering */}
        <ShoppingMenu links={links} />

        {/* Product listing filtered by gender or category, always recommended */}
        <FilterProducts
          filter={{
            gender: isGender ? category : "",         // Apply gender filter if matched
            categorie: isCategory ? category : "",    // Apply category filter if matched
            new: null,                                // Not filtering by new arrivals here
            recommend: true,                          // Always show recommended products
          }}
        />
      </div>
    </>
  );
};

export default Recommend;
