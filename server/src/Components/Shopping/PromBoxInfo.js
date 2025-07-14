import "../../styles/PromoBox.css"; // Import associated styles for the promo box

const PromBoxInfo = () => {
  return (
    // Main promotional box container with ARIA region for accessibility
    <div className="promo-box" role="region" aria-label="Promotional offer">
      
      {/* Visual highlight area for styling and emphasis */}
      <div className="promo-glow">
        
        {/* Flash deal badge - announces to screen readers when updated */}
        <span className="promo-badge" aria-live="polite">
          ⚡ FLASH DEAL
        </span>

        {/* Main promotional headline */}
        <h3 className="promo-title">
          Máme pro Vás slevu, až 15%
        </h3>

        {/* Supporting text for the promotion details */}
        <p className="promo-subtext">
          Platí pro všechen sortiment nad 1000 Kč
        </p>
      </div>
    </div>
  );
};

export default PromBoxInfo;
