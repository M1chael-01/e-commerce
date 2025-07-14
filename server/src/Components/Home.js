import { motion } from "framer-motion";  // For animation support
import Features from "./Features";        // Feature highlights component
import NewProduct from "./Shopping/NewProduct"; // New product showcase
import Footer from "./Footer";             // Page footer
import "../styles/Home.css";               // Styles for this component
import { Link } from "react-router-dom";  // For navigation links

// Text for the main heading
const headingText = "Objev svůj styl a ukaž světu, kdo jsi";

// Animation variants for the container that wraps all letters
const containerVariants = {
  hidden: { opacity: 0 },   // Initial state: fully transparent
  visible: {               // Animate to visible
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Stagger each child animation by 0.05s
      delayChildren: 0.2,    // Start after 0.2s delay
    },
  },
};

// Animation variants for each letter in the heading
const letterVariants = {
  hidden: { opacity: 0, y: 50 },  // Start slightly down and invisible
  visible: {
    opacity: 1,
    y: 0,                         // Animate to original position and visible
    transition: { type: "spring", damping: 12, stiffness: 100 }, // Spring physics for smooth effect
  },
};

const Home = () => {
  return (
    <>
      {/* Hero Section with animated heading */}
      <section className="home">
        <main className="home-content">
          <motion.h1
            aria-label={headingText}    // Accessibility label for screen readers
            variants={containerVariants} // Apply container animation variants
            initial="hidden"            // Initial animation state
            animate="visible"           // Animate to visible
            className="animated-heading"
          >
            {/* Split heading into individual letters and animate each */}
            {headingText.split("").map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}  // Animation for each letter
                aria-hidden="true"        // Hide individual letters from screen readers (redundant reading)
                className={char === " " ? "whitespace-char" : ""} // Add special class for spaces if needed
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subheading with fade and slide up animation */}
          <motion.p
            className="subheading"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Stylové kousky pro každou příležitost
          </motion.p>

          {/* CTA button with scale and fade animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link to="/nakupovat">
              <button className="cta-button" aria-label="Začněte nakupovat">
                Začněte nakupovat
              </button>
            </Link>
          </motion.div>
        </main>
      </section>

      {/* Features Section */}
      <Features />

      {/* New Product Showcase */}
      <NewProduct />

      {/* Recommended Section with heading and banner */}
      <section className="recommended-section">
        <motion.h2
          className="section-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}  // Animate when scrolled into view
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}            // Animate only once
        >
          Prozkoumejte naše slevy
        </motion.h2>

        <motion.div
          className="recommended-banner"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }} // Animate on scroll into view
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}              // Animate only once
        >
          <p>Trendy outfity pro tento měsíc právě skladem</p>
          <Link to="/slevy">
            <button className="cta-button" aria-label="Prozkoumat kolekci">
              Prozkoumat slevy
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Home;
