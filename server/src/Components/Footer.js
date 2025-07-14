// Import footer-specific CSS styles
import "../styles/Footer.css";

// Import Font Awesome icons for social media and payment methods
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaCcVisa,
  FaCcMastercard,
  FaPaypal
} from "react-icons/fa";

/**
 * Footer component that displays:
 * - Brand information
 * - Navigation links for categories and informational pages
 * - Accepted payment methods
 * - Social media links
 */
const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">

        {/* Brand section with site title and short description */}
        <section className="footer-brand" aria-labelledby="footer-brand-title">
          <h3 id="footer-brand-title">MódaStyl</h3>
          <p>Objev svůj styl s námi. Kvalitní móda pro ženy, muže i děti.</p>
        </section>

        {/* Navigation links for main product categories */}
        <nav className="footer-links" aria-label="Kategorie">
          <h4>Kategorie</h4>
          <a href="/zeny">Ženy</a>
          <a href="/muzi">Muži</a>
          <a href="/deti">Děti</a>
          <a href="/nove">Novinky</a>
        </nav>

        {/* Navigation links for informational pages (customer service) */}
        <nav className="footer-links" aria-label="Informace">
          <h4>Informace</h4>
          <a href="/informace/kontakt">Kontakt</a>
          <a href="/informace/vraceni">Vrácení zboží</a>
          <a href="/informace/podminky">Obchodní podmínky</a>
          <a href="/informace/faq">FAQ</a>
        </nav>

        {/* Payment method icons and social media links */}
        <section className="footer-links" aria-label="Platby a sociální sítě">
          <h4>Platby</h4>
          <div className="footer-payments" aria-label="Způsoby platby">
            {/* Payment method icons (decorative) */}
            <FaCcVisa aria-hidden="true" />
            <FaCcMastercard aria-hidden="true" />
            <FaPaypal aria-hidden="true" />
          </div>

          <h4>Sledujte nás</h4>
          <div className="footer-social">
            {/* Social media icons linking to external platforms */}
            <a
              href="https://www.facebook.com/"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://x.com/"
              aria-label="X"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
