// Async function to check if a session has a discount code
export default async function Show() {
  try {
    // Send GET request to the session API including cookies
    const res = await fetch("http://localhost:5000/api/session", {
      method: "GET",
      credentials: "include", // ensures cookies are sent along with request
    });

    // If response status is not OK (e.g., 404, 500), handle gracefully
    if (!res.ok) {
      console.error(`Error fetching session: ${res.status} ${res.statusText}`);
      return false; // Indicate failure
    }

    // Parse JSON response body
    const data = await res.json();
    console.log("Session data from server:", data);

    // Return true if discountCode exists and is truthy, else false
    return Boolean(data.discountCode);
  } catch (err) {
    // Log any network or unexpected errors
    console.error("Fetch error:", err);
    return false;
  }
}
