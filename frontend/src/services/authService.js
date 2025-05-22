const API_URL = import.meta.env.VITE_API_URL + "/auth";

/**
 * Sends a POST request to register a new user.
 *
 * Uses credentials: "include" to support HttpOnly cookie-based authentication.
 *
 * @param {Object} data - User registration data (username, email, password, etc.)
 * @returns {Promise<Object>} The response JSON from the server if successful
 * @throws {Error} If the response is not OK, throws with the server error message or a default one
 */
export const register = async (data) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Registration failed");
  }

  return res.json();
};
