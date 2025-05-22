"use client";

import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";
import { useAuth } from "../context/useAuth";
import UserProfileInfo from "../components/user/UserProfileInfo";
import SystemList from "../components/user/SystemList";
import { Loader, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Public user profile page.
 * Displays the profile of a user different from the authenticated one.
 */
const PublicUserProfile = () => {
  const { id } = useParams(); // User ID from the URL
  const fetch = useFetchWithAuth(); // Custom hook for authenticated requests
  const { user, isLoading: authLoading } = useAuth(); // Global auth context

  const [profile, setProfile] = useState(null); // Public user profile data
  const [loading, setLoading] = useState(true); // Loading state
  const [notFound, setNotFound] = useState(false); // Whether the user was not found
  const [error, setError] = useState(null); // Error while loading

  /**
   * Loads the full profile of a user different from the currently logged-in user.
   */
  useEffect(() => {
    if (!id || authLoading) return;
    if (user && id === String(user.user_id)) return;

    fetch(`${API_URL}/users/${id}/full`)
      .then((res) => setProfile(res.data))
      .catch((err) => {
        if (err.status === 404) setNotFound(true);
        else {
          console.error("Error loading profile:", err.message);
          setError(err.message || "Unable to load profile");
        }
      })
      .finally(() => setLoading(false));
  }, [authLoading, fetch, id, user]);

  /**
   * Redirects if the user tries to view their own public profile.
   */
  if (!authLoading && user && id === String(user.user_id)) {
    return <Navigate to="/app/profile" replace />;
  }

  // Show loading screen
  if (authLoading || loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader className="h-12 w-12 text-purple-500 animate-spin" />
          <p className="text-xl text-gray-300">Carregant perfil públic...</p>
        </div>
      </main>
    );
  }

  // Show error or user not found
  if (notFound || error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-gray-900/70 backdrop-blur-md p-8 rounded-2xl border border-red-900/50 max-w-md w-full">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {notFound ? "Usuari no trobat" : "Error"}
            </h2>
            <p className="text-gray-300">
              {notFound
                ? "No hem pogut trobar l'usuari que estàs buscant."
                : error ||
                  "No s'ha pogut carregar el perfil. Si us plau, torna-ho a provar més tard."}
            </p>
            <Link
              to="/app/explore"
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Explorar altres usuaris
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <Link
        to="/app/explore"
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={18} /> Tornar a explorar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-800 sticky top-8">
            <UserProfileInfo user={profile} showCreatedAt />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">
              Sistemes planetaris de {profile.username}
            </h2>
            <SystemList systems={profile.planetary_systems} />
          </div>

          {/* Additional sections */}
          <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">
              Estadístiques
            </h2>
            <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">
                Sistemes planetaris creats
              </p>
              <p className="text-3xl font-bold text-white">
                {profile.planetary_systems?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PublicUserProfile;
