"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";
import ProfileActions from "../components/user/ProfileActions";
import UserProfileInfo from "../components/user/UserProfileInfo";
import SystemList from "../components/user/SystemList";
import { Loader, AlertCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const { user, isLoading: authLoading, logout } = useAuth();
  const fetch = useFetchWithAuth();

  const [profile, setProfile] = useState(null); // Full user profile, including planetary systems
  const [loading, setLoading] = useState(true); // State to control loading indicator
  const [error, setError] = useState(null); // Error message if the fetch fails

  const handleLogout = async () => {
    await logout(); // Ends the session and redirects
  };

  // Fetch full user profile when component mounts
  useEffect(() => {
    if (!user) return;

    fetch(`${API_URL}/users/${user.user_id}/full`)
      .then((res) => setProfile(res.data))
      .catch((err) => {
        console.error("Error loading full profile:", err.message);
        setError(err.message || "Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, [user, fetch]);

  // Show loading state if auth or profile is still loading
  if (authLoading || loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader className="h-12 w-12 text-purple-500 animate-spin" />
          <p className="text-xl text-gray-300">Carregant perfil...</p>
        </div>
      </main>
    );
  }

  // If an error occurred or the user/profile is missing
  if (error || !user || !profile) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-gray-900/70 backdrop-blur-md p-8 rounded-2xl border border-red-900/50 max-w-md w-full">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Error</h2>
            <p className="text-gray-300">
              {error || "Failed to load user. Please try again later."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Recarregar
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-800 sticky top-8">
            <UserProfileInfo user={profile} showCreatedAt />
            <ProfileActions onLogout={handleLogout} />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">
              Els meus sistemes planetaris
            </h2>
            <SystemList systems={profile.planetary_systems} showCreate />
          </div>

          {/* Additional sections can be added here */}
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

export default Profile;
