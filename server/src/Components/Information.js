// Import necessary hooks and components from React Router
import { useParams, Link } from "react-router-dom";

// Import the content data used to populate the information pages
import contentData from "../data/contentData";

// Import the CSS styling for this component
import "../styles/Information.css";

/**
 * Renders different types of content sections based on the `type` field
 * in each section object (e.g., paragraph, image, list, faq).
 */
const SectionRenderer = ({ section }) => {
  switch (section.type) {
    case "paragraph":
      // Render a paragraph section
      return <p className="info-paragraph">{section.content}</p>;

    case "image":
      // Render an image section
      return (
        <div className="info-image-container">
          <img
            className="info-image"
            src={section.src}
            alt={section.alt}
            loading="lazy"
          />
        </div>
      );

    case "list":
      // Render an unordered list section
      return (
        <ul className="info-list">
          {section.items.map((item, i) => (
            <li key={i} className="info-list-item">
              {item}
            </li>
          ))}
        </ul>
      );

    case "faq":
      // Render an FAQ section using <details> for collapsible items
      return (
        <div className="info-faq">
          {section.items.map((faq, i) => (
            <details key={i} className="faq-item">
              <summary className="faq-question">{faq.question}</summary>
              <p className="faq-answer">{faq.answer}</p>
            </details>
          ))}
        </div>
      );

    default:
      // Return nothing if the type is unrecognized
      return null;
  }
};

/**
 * Main Information component that dynamically renders a page
 * based on the URL slug from the route parameters.
 */
const Information = () => {
  const { slug } = useParams(); // Get the slug from the URL (e.g., /informace/faq → slug: "faq")
  const page = contentData[slug]; // Lookup the content data for the current page

  // Handle case when the page does not exist
  if (!page) {
    return (
      <div className="info-not-found">
        <h2 className="not-found-title">Stránka nenalezena</h2>
        <p className="not-found-text">Omlouváme se, tato stránka neexistuje.</p>
        <Link className="not-found-link" to="/informace/kontakt">
          Zpět na Kontakt
        </Link>
      </div>
    );
  }

  return (
    <section id="information">
      <div className="info-container">
        {/* Page title */}
        <h1 className="info-title">{page.title}</h1>

        {/* Render each content section using the SectionRenderer */}
        {page.sections.map((section, i) => (
          <SectionRenderer key={i} section={section} />
        ))}

        {/* Navigation links to other information pages */}
        <nav className="info-nav">
          <Link className="info-nav-link" to="/informace/kontakt">
            Kontakt
          </Link>
          <span className="nav-separator">|</span>
          <Link className="info-nav-link" to="/informace/vraceni">
            Vrácení zboží
          </Link>
          <span className="nav-separator">|</span>
          <Link className="info-nav-link" to="/informace/podminky">
            Obchodní podmínky
          </Link>
          <span className="nav-separator">|</span>
          <Link className="info-nav-link" to="/informace/faq">
            FAQ
          </Link>
        </nav>
      </div>
    </section>
  );
};

export default Information;
