import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

// Create a new instance of the Login class to handle login requests
const login = new Login();

// Maximum number of allowed login attempts before showing an error
const MAX_RETRIES = 2;

const AutoLogin = () => {
  // State to track whether an error has occurred after retries
  const [hasError, setHasError] = useState(false);
  
  // React Router hook for programmatic navigation
  const navigate = useNavigate();

  useEffect(() => {
    // Get current login attempt count from localStorage or default to 0
    const attemptCount = Number(localStorage.getItem("loginAttempts") || 0);

    // If maximum retries exceeded, show error and stop login attempts
    if (attemptCount >= MAX_RETRIES) {
      setHasError(true);
      return;
    }

    // Async function to attempt login with stored credentials
    async function doLogin() {
      try {
        // Attempt login with hardcoded credentials 
        const token = await login.clientLogin(
          "admin_ecommerce",
          "hlfqq178888_7777000llffFF"
        );

        // On successful login, store token and reset login attempts
        console.log("Přihlášení úspěšné, token:", token);
        localStorage.setItem("token", token);
        localStorage.removeItem("loginAttempts");
      } catch (err) {
        // On failure, increment login attempt count in localStorage
        const newCount = attemptCount + 1;
        localStorage.setItem("loginAttempts", newCount);
        console.warn(`Login attempt ${newCount} failed`);

        // Retry login after 1 second if under max retries, else show error
        if (newCount < MAX_RETRIES) {
          setTimeout(() => window.location.reload(), 1000);
        } else {
          setHasError(true);
        }
      }
    }

    // Call the async login function immediately on component mount
    doLogin();
  }, []);

  // Effect to handle navigation if error occurs after max retries
  useEffect(() => {
    if (hasError) {
      // Redirect to error page if login failed after retries
      navigate("/eror");
    } else {
      // If no error, clean up loginAttempts from localStorage
      localStorage.removeItem("loginAttempts");
    }
  }, [hasError, navigate]);

  // No UI rendered by this component
  return null;
};

export default AutoLogin;
