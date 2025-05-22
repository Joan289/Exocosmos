"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { starFormSchema } from "../schemas/starFormSchema";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";
import { Star } from "../models/Star";
import FloatingFormPanel from "../components/ui/FloatingFormPanel";
import StarForm from "../components/forms/StarForm";
import LiveStar3DPreview from "../components/3d/LiveStar3DPreview";
import { uploadStarThumbnail } from "../utils/uploadStarThumbnail";
import { uploadSystemThumbnail } from "../utils/uploadSystemThumbnail";
import { parseApiError } from "../utils/parseApiError";
import { PlanetarySystemFull } from "../models/PlanetarySystemFull";
import { Loader, AlertCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * StarEdit is a protected page that allows users to edit the data of a specific star.
 * It fetches initial data, populates the form, handles validation, and updates the star via PATCH.
 * Also handles thumbnail uploads for both the star and its system.
 */
export default function StarEdit() {
  const { id } = useParams(); // Extract star ID from URL
  const fetchWithAuth = useFetchWithAuth();
  const navigate = useNavigate();

  // State for managing loading, errors, and form
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Setup react-hook-form with Zod validation
  const methods = useForm({
    resolver: zodResolver(starFormSchema),
    mode: "onChange",
    defaultValues: initialData,
  });

  // Fetch initial star data on mount
  useEffect(() => {
    fetchWithAuth(`${API_URL}/stars/${id}`)
      .then((res) => {
        const data = res.data;
        const initial = {
          name: data.name,
          description: data.description || "",
          mass_solar: data.mass_solar,
          radius_solar: data.radius_solar,
          thumbnail_url: data.thumbnail_url || "",
        };
        setInitialData(initial);
        methods.reset(initial); // Populate form with initial data
      })
      .catch((err) => {
        if (err.message?.includes("404")) {
          setNotFound(true); // Handle star not found
        } else {
          console.error("Error carregant estrella:", err.message);
          setError(
            "No s'ha pogut carregar l'estrella. Si us plau, torna-ho a provar més tard."
          );
        }
      })
      .finally(() => setLoading(false));
  }, [id, fetchWithAuth, methods]);

  /**
   * Submits updated star data to the API.
   * Also updates thumbnails for both the star and its system.
   */
  const handleSubmit = async (data) => {
    setIsSaving(true);
    try {
      // Update star info
      await fetchWithAuth(`${API_URL}/stars/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Upload star thumbnail
      const star = new Star({ ...data, star_id: Number(id) });
      await uploadStarThumbnail({ star });

      // Fetch related planetary system
      const systemRes = await fetchWithAuth(
        `${API_URL}/planetary-systems?star_id=${id}`
      );
      const systems = systemRes.data;
      if (!Array.isArray(systems) || systems.length === 0) {
        throw new Error("No s'ha trobat cap sistema per aquesta estrella");
      }

      // Upload system thumbnail
      const res = await fetchWithAuth(
        `${API_URL}/planetary-systems/${systems[0].planetary_system_id}/full`
      );
      const fullSystem = new PlanetarySystemFull(res.data);
      await uploadSystemThumbnail({ system: fullSystem });

      // Redirect to star detail page
      navigate(`/app/stars/${id}`);
    } catch (err) {
      console.error("Error guardant estrella o pujant imatge:", err.message);
      const parsedErrors = parseApiError(err);
      setFormErrors(parsedErrors); // Show parsed API errors on form
    } finally {
      setIsSaving(false);
    }
  };

  // Loading screen while fetching initial data
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader className="h-12 w-12 text-yellow-500 animate-spin" />
          <p className="text-xl text-gray-300">Carregant estrella...</p>
        </div>
      </div>
    );
  }

  // Not found screen
  if (notFound) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-950 p-4">
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
      </div>
    );
  }

  // Generic error screen
  if (error) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-950 p-4">
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
      </div>
    );
  }

  // Don't render until initial data is ready
  if (!initialData) return null;

  return (
    <FormProvider {...methods}>
      <div className="relative w-screen h-screen overflow-hidden bg-gray-950">
        {/* Live 3D preview updates with form data */}
        <LiveStar3DPreview
          star={new Star({ ...methods.getValues(), star_id: Number(id) })}
        />

        {/* Floating form panel for editing */}
        <FloatingFormPanel title="Editar estrella">
          <StarForm onSubmit={handleSubmit} errors={formErrors} />
        </FloatingFormPanel>

        {/* Overlay shown during saving process */}
        {isSaving && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="bg-gray-900/80 p-8 rounded-2xl border border-yellow-900/50 flex flex-col items-center">
              <Loader className="h-12 w-12 text-yellow-500 animate-spin" />
              <p className="mt-4 text-white text-lg font-medium">
                Guardant estrella...
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Això pot trigar uns segons
              </p>
            </div>
          </div>
        )}
      </div>
    </FormProvider>
  );
}
