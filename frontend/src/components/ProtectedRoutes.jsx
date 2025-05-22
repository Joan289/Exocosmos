/**
 * ProtectedRoute component guards private routes in the application.
 *
 * - Checks the user's authentication status by calling `checkAuthStatus()` on mount.
 * - Shows a loading spinner while auth is being verified.
 * - Redirects to /auth if the user is not authenticated.
 * - Otherwise, renders nested routes using <Outlet />.
 *
 * Must be used inside a <Router> and with <AuthProvider> mounted at a higher level.
 */

import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Loader } from "lucide-react";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuth();

  // On mount: check if the user is authenticated
  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show full-screen loader while authentication is being verified
  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-950">
        <div className="bg-gray-900/70 backdrop-blur-md p-8 rounded-2xl border border-gray-800 flex flex-col items-center">
          <Loader className="h-12 w-12 text-purple-500 animate-spin mb-4" />
          <p className="text-xl text-white font-medium">
            Verificant autenticació...
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Si us plau, espera un moment
          </p>
        </div>

        {/* Blurred background decorations */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/4 -left-10 w-72 h-72 bg-purple-700/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-blue-700/20 rounded-full filter blur-3xl"></div>
        </div>
      </main>
    );
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If authenticated, render the protected route's content
  return <Outlet />;
};

export default ProtectedRoute;
