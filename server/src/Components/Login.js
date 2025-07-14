class Login {
  // Async method to perform client login with username and password
  async clientLogin(username, password) {
    try {
      // Send POST request to login API endpoint with username and password
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify JSON payload
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      // If response status is not OK (non-2xx), parse error message and throw
      if (!res.ok) {
        const error = await res.json(); // Extract error JSON from response
        throw new Error(error.error || "Neznámá chyba přihlášení"); // "Unknown login error"
      }

      // Parse successful response JSON expecting { accessToken: token }
      const data = await res.json();
      console.log("Login response data:", data);  // Debug: log the response

      // Check if token exists in response and store it in localStorage
      if (data && data.accessToken) {
        localStorage.setItem("token", data.accessToken); // Save token for later authenticated requests
        return data.accessToken;  // Return the token to the caller
      } else {
        // If no token in response, throw error
        throw new Error("Token není v odpovědi."); // "Token not found in response"
      }
    } catch (err) {
      console.error("Login error:", err); // Log any caught errors
      throw err; // Re-throw error for caller to handle
    }
  }
}

export default Login;
