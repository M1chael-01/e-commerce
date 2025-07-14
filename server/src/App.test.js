// Import necessary functions from React Testing Library
import { render, screen } from '@testing-library/react';
// Import the component to be tested
import App from './App';

// Define a test case named 'renders learn react link'
test('renders learn react link', () => {
  // Render the App component into a virtual DOM for testing
  render(<App />);
  
  // Query the rendered output for an element containing the text 'learn react' (case-insensitive)
  const linkElement = screen.getByText(/learn react/i);
  
  // Assert that the element is present in the document (i.e., it was rendered)
  expect(linkElement).toBeInTheDocument();
});
