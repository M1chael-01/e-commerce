import { Link } from "react-router-dom"; 
import "../styles/Error.css";  // Importing styles specific to the error page

// Functional component for displaying a generic error page
// Accepts a `message` prop with a default value if none is provided
const ErrorPage = ({ message = "Něco se pokazilo." }) => {
  return (
    // Outer container for error page layout and styling
    <div className="error-page-container">
      {/* Inner box holding the error message and navigation link */}
      <div className="error-box">
        {/* Heading with an emoji and error code */}
        <h1>😵 Chyba 500</h1>
        {/* Paragraph displaying the error message passed via props */}
        <p>{message}</p>
        {/* Link component for navigation back to the homepage */}
        <Link to="/" className="error-btn">
          Zpět na hlavní stránku
        </Link>
      </div>
    </div>
  );
};

// Export the component for use in other parts of the app
export default ErrorPage;
