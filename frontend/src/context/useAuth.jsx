/**
 * Custom hook to access the authentication context.
 *
 * Provides access to:
 * - isAuthenticated: boolean
 * - user: user data object
 * - isLoading: boolean for auth status
 * - login(): function to log in
 * - logout(): function to log out
 * - checkAuthStatus(): function to refresh session
 * - setUser(), setIsLoading(): internal state setters
 *
 * Must be used within <AuthProvider>.
 *
 * @returns {object} The full authentication context value
 */
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// Returns the current authentication context (state and actions)
export const useAuth = () => useContext(AuthContext);
