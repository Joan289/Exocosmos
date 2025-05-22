/**
 * Custom hook that returns a fetch function with authentication support.
 *
 * Automatically includes credentials (cookies), sets common headers,
 * and handles 401 Unauthorized errors by triggering logout.
 *
 * @returns {Function} A fetch wrapper that mirrors the native fetch API, but adds auth handling
 */
import { useCallback } from "react";
import { useAuth } from "../context/useAuth";

export const useFetchWithAuth = () => {
  const { logout } = useAuth();

  /**
   * Wrapper around fetch with:
   * - JSON headers
   * - Cookie-based credentials
   * - Automatic logout on 401
   */
  const fetchWithAuth = useCallback(
    async (url, options = {}) => {
      const mergedOptions = {
        ...options,
        credentials: "include", // Include cookies (for JWT auth)
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      };

      try {
        const res = await fetch(url, mergedOptions);

        // Automatically log out if unauthorized
        if (res.status === 401) {
          console.warn("Unauthorized - triggering logout");
          logout();
          throw new Error("Unauthorized");
        }

        // Throw custom error for non-OK responses
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const err = new Error(errorData.message || errorData);

          err.status = res.status;
          err.details = errorData.details || null;
          err.raw = errorData;
          err.response = { data: errorData };

          throw err;
        }

        // Return parsed JSON data
        return res.json();
      } catch (err) {
        console.error("fetchWithAuth error:", err.message);
        if (err.details) {
          console.error("Detall:", err.details);
        }
        throw err;
      }
    },
    [logout]
  );

  return fetchWithAuth;
};
