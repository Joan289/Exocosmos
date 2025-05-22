"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";
import Star3DPreview from "../components/3d/Star3DPreview";
import { StarFull } from "../models/StarFull";
import SystemCard from "../components/cards/SystemCard";
import UserBadge from "../components/ui/UserBadge";
import {
  Loader,
  AlertCircle,
  Edit,
  ArrowLeft,
  Star,
  Info,
  Scale,
  Ruler,
  Thermometer,
  Sun,
  Sparkles,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * StarDetail is a protected page that fetches and displays full details
 * about a specific star, including its metadata, 3D preview, and associated planetary system.
 */
const StarDetail = () => {
  // Extract star ID from URL parameters
  const { id } = useParams();
  const navigate = useNavigate();
  const fetch = useFetchWithAuth();
  const { user } = useAuth();

  // State to manage star data, loading status, and errors
  const [star, setStar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  // Fetch star data on mount
  useEffect(() => {
    fetch(`${API_URL}/stars/${id}/full`)
      .then((res) => setStar(res.data))
      .catch((err) => {
        if (err.message?.includes("404")) {
          setNotFound(true); // Handle not found
        } else {
          console.error("Error carregant estrella:", err.message);
          setError(
            "No s'ha pogut carregar l'estrella. Si us plau, torna-ho a provar més tard."
          );
        }
      })
      .finally(() => setLoading(false));
  }, [id, fetch]);

  // Loading screen
  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader className="h-12 w-12 text-yellow-500 animate-spin" />
          <p className="text-xl text-gray-300">Carregant estrella...</p>
        </div>
      </main>
    );
  }

  // Not found screen
  if (notFound || !star) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-gray-900/70 backdrop-blur-md p-8 rounded-2xl border border-red-900/50 max-w-md w-full">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Estrella no trobada
            </h2>
            <p className="text-gray-300">
              No hem pogut trobar l'estrella que estàs buscant. Pot ser que hagi
              estat eliminada o que no tinguis permisos per accedir-hi.
            </p>
            <button
              onClick={() => navigate("/app/profile")}
              className="mt-4 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
            >
              Tornar al perfil
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Generic error screen
  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-gray-900/70 backdrop-blur-md p-8 rounded-2xl border border-red-900/50 max-w-md w-full">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Error</h2>
            <p className="text-gray-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
            >
              Recarregar
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Instantiate star model
  const starInstance = new StarFull(star);
  const { system } = starInstance;

  // Check if current user is the creator
  const isOwner = user && system?.user?.user_id === user.user_id;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Back to system button */}
      <button
        onClick={() => navigate(`/app/systems/${system.planetary_system_id}`)}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={18} /> Tornar al sistema
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Star info and 3D section */}
        <div className="lg:col-span-2 space-y-6">
          {/* General info card */}
          <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-600/30 flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-400" />
                </div>
                <h1 className="text-3xl font-bold text-white">{star.name}</h1>
              </div>

              {/* Edit button if user is owner */}
              {isOwner && (
                <button
                  onClick={() => navigate(`/app/stars/${id}/edit`)}
                  className="px-4 py-2 bg-yellow-600/30 hover:bg-yellow-600/50 text-yellow-300 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Edit size={16} /> Editar estrella
                </button>
              )}
            </div>

            {/* Optional description */}
            {star.description && (
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-yellow-600/30 flex items-center justify-center flex-shrink-0">
                  <Info className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Descripció</p>
                  <p className="text-white">{star.description}</p>
                </div>
              </div>
            )}

            {/* Star properties grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Mass */}
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Scale className="h-4 w-4 text-yellow-400" />
                  <p className="text-gray-400 text-sm">Massa</p>
                </div>
                <p className="text-white text-lg font-medium">
                  {star.mass_solar} M☉
                </p>
              </div>

              {/* Radius */}
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Ruler className="h-4 w-4 text-yellow-400" />
                  <p className="text-gray-400 text-sm">Radi</p>
                </div>
                <p className="text-white text-lg font-medium">
                  {star.radius_solar} R☉
                </p>
              </div>

              {/* Temperature */}
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Thermometer className="h-4 w-4 text-yellow-400" />
                  <p className="text-gray-400 text-sm">Temperatura</p>
                </div>
                <p className="text-white text-lg font-medium">
                  {starInstance.temperature.toFixed(0)} K
                </p>
              </div>

              {/* Luminosity */}
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Sun className="h-4 w-4 text-yellow-400" />
                  <p className="text-gray-400 text-sm">Luminositat</p>
                </div>
                <p className="text-white text-lg font-medium">
                  {starInstance.luminosity.toFixed(2)} L☉
                </p>
              </div>

              {/* Spectral type */}
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  <p className="text-gray-400 text-sm">Tipus espectral</p>
                </div>
                <p className="text-white text-lg font-medium">
                  {starInstance.spectralType}
                </p>
              </div>
            </div>
          </div>

          {/* 3D star visualization */}
          <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">
              Visualització 3D
            </h2>
            <div className="aspect-[2/1] w-full bg-gray-950/50 rounded-xl overflow-hidden">
              <Star3DPreview star={starInstance} />
            </div>
            <p className="text-gray-400 text-sm mt-3 text-center">
              Pots fer zoom i rotar l'estrella utilitzant el ratolí o els gestos
              tàctils
            </p>
          </div>
        </div>

        {/* Sidebar with system and creator info */}
        <div className="lg:col-span-1 space-y-6">
          {/* System card */}
          <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">
              Sistema planetari
            </h3>
            <div className="mb-4">
              <SystemCard system={star.system} />
            </div>
            <button
              onClick={() =>
                navigate(`/app/systems/${system.planetary_system_id}`)
              }
              className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors mt-4"
            >
              Veure sistema complet
            </button>
          </div>

          {/* Creator info */}
          <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Creador</h3>
            <UserBadge user={system?.user} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default StarDetail;
