// Import the modern React DOM rendering method from React 18+
import { createRoot } from 'react-dom/client';

// Import global styles for the application
import './index.css';

// Import the main App component (root component of your React app)
import App from './App';

// Get the DOM element with ID 'website' where the React app will mount
const container = document.getElementById('website');

// Create a React root for rendering using the new React 18+ API
const root = createRoot(container);

// Render the <App /> component into the root, passing an optional prop 'tab' with value "home"
root.render(<App tab="home" />);
