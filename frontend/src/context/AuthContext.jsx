/**
 * AuthContext provides global authentication state and actions.
 *
 * It handles:
 * - Login/logout via cookie-based JWT
 * - Fetching the current user from /auth/me
 * - Exposes isAuthenticated, user, and isLoading to consumers
 *
 * Must be used inside a <Router> since it uses `useNavigate()`
 */

import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

// Context Provider that wraps the app
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks if user is logged in
  const [user, setUser] = useState(null); // Stores user data
  const [isLoading, setIsLoading] = useState(true); // Indicates if auth state is being checked

  const navigate = useNavigate();

  /**
   * Checks whether the user has a valid session by calling /auth/me.
   * Sets isAuthenticated and user accordingly.
   */
  const checkAuthStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include", // Include cookies for session
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Not authenticated");

      const parsed = await res.json();
      const user = parsed.data;

      setIsAuthenticated(true);
      setUser(user);
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logs in the user by sending credentials to /auth/login.
   * On success, saves user and redirects to the main app.
   */
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Login error");
      }

      setIsAuthenticated(true);
      setUser(json.data);
      navigate("/app/menu"); // Redirect after successful login
    } catch (error) {
      console.error("Login failed:", error.message);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logs out the user by calling /auth/logout and clears local state.
   * Redirects to the login screen.
   */
  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      navigate("/auth");
    }
  };

  /**
   * Values made available to all components via useContext(AuthContext)
   */
  const contextValue = {
    isAuthenticated,
    user,
    isLoading,
    setIsLoading,
    setUser,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Export context for use in custom hook
export default AuthContext;
