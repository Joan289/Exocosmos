"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";
import { PlanetarySystemFull } from "../models/PlanetarySystemFull";
import UserBadge from "../components/ui/UserBadge";
import PlanetList from "../components/ui/PlanetList";
import {
  Loader,
  AlertCircle,
  Edit,
  Trash2,
  ArrowLeft,
  Star,
  Globe,
  Ruler,
  Info,
  Calendar,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const SystemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetch = useFetchWithAuth();
  const { user } = useAuth();

  const [system, setSystem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/planetary-systems/${id}/full`)
      .then((res) => setSystem(new PlanetarySystemFull(res.data)))
      .catch((err) => {
        if (err.message?.includes("404")) {
          setNotFound(true);
        } else {
          console.error("Error carregant sistema:", err.message);
          setError(
            "No s'ha pogut carregar el sistema. Si us plau, torna-ho a provar més tard."
          );
        }
      })
      .finally(() => setLoading(false));
  }, [id, fetch]);

  const handleDelete = async () => {
    const confirmed = window.confirm("Segur que vols eliminar aquest sistema?");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await fetch(`${API_URL}/planetary-systems/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      navigate("/app/profile");
    } catch (err) {
      console.error("Error eliminant sistema:", err.message);
      setError(
        "No s'ha pogut eliminar el sistema. Si us plau, torna-ho a provar més tard."
      );
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader className="h-12 w-12 text-purple-500 animate-spin" />
          <p className="text-xl text-gray-300">
            Carregant sistema planetari...
          </p>
        </div>
      </main>
    );
  }

  if (notFound || !system) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-gray-900/70 backdrop-blur-md p-8 rounded-2xl border border-red-900/50 max-w-md w-full">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Sistema no trobat</h2>
            <p className="text-gray-300">
              No hem pogut trobar el sistema planetari que estàs buscant. Pot
              ser que hagi estat eliminat o que no tinguis permisos per
              accedir-hi.
            </p>
            <button
              onClick={() => navigate("/app/profile")}
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Tornar al perfil
            </button>
          </div>
        </div>
      </main>
    );
  }

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
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Recarregar
            </button>
          </div>
        </div>
      </main>
    );
  }

  const isOwner = user && system.user_id === user.user_id;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <button
        onClick={() => navigate("/app/profile")}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={18} /> Tornar al perfil
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-3xl font-bold text-white">{system.name}</h1>

              {isOwner && (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/app/systems/${id}/edit`)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Edit size={16} /> Editar
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isDeleting ? (
                      <Loader size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}{" "}
                    Eliminar
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <Ruler className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Distància</p>
                  <p className="text-white font-medium text-lg">
                    {system.distance_ly} anys llum
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Creat</p>
                  <p className="text-white font-medium">
                    {new Date(system.created_at).toLocaleDateString()}{" "}
                    {new Date(system.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            {system.description && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <Info className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Descripció</p>
                  <p className="text-white">{system.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Star Section */}
          <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-5 w-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Estrella central</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-square relative overflow-hidden rounded-xl">
                {system.star.thumbnail_url ? (
                  <img
                    src={
                      `${API_URL}${system.star.thumbnail_url}` ||
                      "/placeholder.svg"
                    }
                    alt={`Estrella ${system.star.name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-600/30 to-orange-700/30 flex items-center justify-center">
                    <Star className="h-16 w-16 text-yellow-400" />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">
                  {system.star.name}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {system.star.radius_solar && (
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm">Radi</p>
                      <p className="text-white font-medium">
                        {system.star.radius_solar}
                      </p>
                    </div>
                  )}

                  {system.star.mass_solar && (
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm">Massa</p>
                      <p className="text-white font-medium">
                        {system.star.mass_solar} M☉
                      </p>
                    </div>
                  )}

                  {system.star.temperature && (
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm">Temperatura</p>
                      <p className="text-white font-medium">
                        {system.star.temperature.toFixed(2)}K
                      </p>
                    </div>
                  )}

                  {system.star.luminosity && (
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm">Luminositat</p>
                      <p className="text-white font-medium">
                        {system.star.luminosity.toFixed(2)}K
                      </p>
                    </div>
                  )}

                  {system.star.spectralType && (
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm">Tipus espectral</p>
                      <p className="text-white font-medium">
                        {system.star.spectralType}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/app/stars/${system.star.star_id}`)}
                  className="px-4 py-2 bg-yellow-900/30 hover:bg-yellow-900/50 text-yellow-300 rounded-lg transition-colors w-full mt-4"
                >
                  Veure detalls de l'estrella
                </button>
              </div>
            </div>
          </div>

          {/* Planets Section */}
          <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">
                Planetes del sistema
              </h2>
            </div>

            <PlanetList
              planets={system.planets}
              showCreate={isOwner}
              systemId={system.planetary_system_id}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Creator Info */}
          <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Creador</h3>
            <UserBadge user={system.user} />
          </div>

          {/* System Stats */}
          <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">
              Estadístiques
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Planetes:</span>
                <span className="text-white font-medium">
                  {system.planets?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen loading overlay for delete operation */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="bg-gray-900/80 p-8 rounded-2xl border border-red-900/50 flex flex-col items-center">
            <Loader className="h-12 w-12 text-red-500 animate-spin" />
            <p className="mt-4 text-white text-lg font-medium">
              Eliminant sistema...
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default SystemDetail;
