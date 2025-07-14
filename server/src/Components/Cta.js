// Import necessary hooks from React
import { useEffect, useState } from "react";

// Import CSS styles specific to the CTA component
import "../styles/Cta.css";

// Import js-cookie for managing cookies in the browser
import Cookies from "js-cookie";

/**
 * Cta (Call to Action) component that conditionally shows a promotional banner.
 * Visibility is controlled via cookies to avoid repeated display.
 */
const Cta = () => {
  // Initialize state: visible = true if "cta" cookie is not set, otherwise false
  const [visible, setVisible] = useState(() => !Cookies.get("cta"));

  useEffect(() => {
    // On component mount, if "cta" cookie is missing, set it to prevent future display
    if (!Cookies.get("cta")) {
      Cookies.set("cta", "seen", { expires: 25 }); // expires in 25 days
    }
  }, []);

  /**
   * Handles manual closing of the CTA by the user.
   * Sets the cookie and hides the component.
   */
  const removeCta = () => {
    Cookies.set("cta", "seen", { expires: 25 }); // Prevent future popups
    setVisible(false); // Hide CTA box
  };

  // If CTA should not be visible, render nothing
  if (!visible) return null;

  return (
    <section className="cta-box">
      <div className="cta-glow">
        
        {/* Dismiss/close button for CTA */}
        <button
          className="cta-close"
          onClick={removeCta}
          aria-label="Zavřít oznámení"
        >
          ×
        </button>

        {/* Main headline for the call to action */}
        <h2 className="cta-headline">🔥 Limitovaná nabídka právě teď!</h2>

        {/* Description with emphasized discount offer */}
        <p className="cta-text">
          Získej až <strong>50% slevu</strong> na vybrané produkty — jen dnes!
        </p>

        {/* Buttons for primary and secondary actions */}
        <div className="cta-actions">
          {/* Main button: leads to shopping page */}
          <a href="/nakupovat" className="cta-button big" role="button">
            Chci slevu
          </a>

          {/* Secondary button: leads to new arrivals */}
          <a href="/novinky" className="cta-secondary" role="button">
            Prohlédnout novinky
          </a>
        </div>
      </div>
    </section>
  );
};

export default Cta;
