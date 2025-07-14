// Import React for JSX support
import React from 'react';

// Import FontAwesomeIcon component and specific icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faUndo, faHeadset } from '@fortawesome/free-solid-svg-icons';

/**
 * Features component displays three key selling points or services:
 * - Free shipping
 * - Easy returns
 * - 24/7 customer support
 */
const Features = () => {
  return (
    // Section wrapper with accessible label for screen readers
    <section className="features" aria-label="Klíčové vlastnosti">
      
      {/* Feature 1: Free shipping */}
      <div className="feature-box" role="region" aria-labelledby="feature1">
        {/* Truck icon to visually represent shipping */}
        <FontAwesomeIcon icon={faTruck} size="2x" className="feature-icon" />
        {/* Associated description with an ID for accessibility */}
        <p id="feature1">Doprava zdarma nad 999 Kč</p>
      </div>
      
      {/* Feature 2: 30-day return policy */}
      <div className="feature-box" role="region" aria-labelledby="feature2">
        {/* Undo icon represents the return process */}
        <FontAwesomeIcon icon={faUndo} size="2x" className="feature-icon" />
        <p id="feature2">Vrácení do 30 dnů</p>
      </div>
      
      {/* Feature 3: 24/7 customer support */}
      <div className="feature-box" role="region" aria-labelledby="feature3">
        {/* Headset icon representing customer support */}
        <FontAwesomeIcon icon={faHeadset} size="2x" className="feature-icon" />
        <p id="feature3">Zákaznický servis 24/7</p>
      </div>
    </section>
  );
};

export default Features;
