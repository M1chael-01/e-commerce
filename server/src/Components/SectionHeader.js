// Functional component that renders a section header with a title and a horizontal line
const SectionHeader = ({ text }) => {
  return (
    // Section element acts as a container for the header content
    // The class names can be used for styling (e.g., spacing, font)
    // aria-label provides an accessible name for assistive technologies,
    // describing the purpose or content of this section
    <section className="section-header top" aria-label={text}>
      
      {/* The main heading of this section */}
      <h2>{text}</h2>
      
      {/* Horizontal rule to visually separate the header from content below */}
      <hr />
    </section>
  );
};

// Export the component to be used in other parts of the app
export default SectionHeader;
