"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getPlanetFormSchema } from "../schemas/getPlanetFormSchema";
import { parseApiError } from "../utils/parseApiError";
import { uploadPlanetTextures } from "../utils/uploadPlanetTextures";
import { uploadPlanetThumbnail } from "../utils/uploadPlanetThumbnail";
import PlanetForm from "../components/forms/PlanetForm";
import LivePlanet3DPreview from "../components/3d/LivePlanet3DPreview";
import FloatingFormPanel from "../components/ui/FloatingFormPanel";
import normalizePlanetData from "../utils/normalizePlanetData";
import { PlanetarySystemFull } from "../models/PlanetarySystemFull";
import { uploadSystemThumbnail } from "../utils/uploadSystemThumbnail";
import { Loader, AlertCircle, ArrowLeft } from "lucide-react";

// API base URL
const API_URL = import.meta.env.VITE_API_URL;

/**
 * PlanetEdit is the main component for editing a planet's data.
 * It loads planet and type information, handles form submission,
 * and updates associated resources like textures and thumbnails.
 */
export default function PlanetEdit() {
  const { id } = useParams(); // Planet ID from URL
  const fetch = useFetchWithAuth(); // Authenticated fetch
  const navigate = useNavigate(); // Navigation hook

  // Local state
  const [planet, setPlanet] = useState(null);
  const [planetType, setPlanetType] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch planet data and its corresponding type when the component mounts.
   * Sets loading and error states accordingly.
   */
  useEffect(() => {
    const loadPlanet = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/planets/${id}`);
        if (res.status !== "success") throw new Error("Planeta no trobat");
        setPlanet(res.data);

        const typeRes = await fetch(
          `${API_URL}/planet-types/${res.data.planet_type_id}`
        );
        if (typeRes.status !== "success")
          throw new Error("Tipus de planeta no trobat");
        setPlanetType(typeRes.data);
      } catch (err) {
        console.error("Error carregant dades del planeta:", err);
        setError(
          err.message ||
            "No s'ha pogut carregar el planeta. Si us plau, torna-ho a provar més tard."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPlanet();
  }, [id, fetch, navigate]);

  /**
   * Setup the form using React Hook Form.
   * Uses dynamic schema depending on the planet type.
   */
  const methods = useForm({
    resolver: planetType
      ? zodResolver(getPlanetFormSchema(planetType))
      : undefined,
    mode: "onChange",
    defaultValues: planet
      ? {
          ...planet,
          atmosphere: planet.atmosphere ?? {
            pressure_atm: 1,
            greenhouse_factor: 0.5,
            compounds: [],
            texture_url: "",
          },
        }
      : {},
  });

  /**
   * Normalize and populate the form when planet data is available.
   */
  useEffect(() => {
    if (!planet || !planetType) return;

    const normalized = normalizePlanetData(planet);
    methods.reset(normalized);
  }, [planet, planetType, methods]);

  /**
   * Handle planet form submission:
   * - Updates planet
   * - Re-uploads textures and thumbnails
   * - Refreshes system thumbnail
   * - Navigates to planet detail
   */
  const handleSubmit = async (data) => {
    setIsSaving(true);
    setFormErrors({});

    try {
      const res = await fetch(`${API_URL}/planets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status !== "success") throw res;

      await uploadPlanetTextures({
        planetId: id,
        hasSurface: planetType.has_surface,
      });

      const planetRes = await fetch(`${API_URL}/planets/${id}`, {
        method: "GET",
        credentials: "include",
      });
      if (planetRes.status !== "success") throw planetRes;

      const updatedPlanet = await planetRes.data;
      await uploadPlanetThumbnail({ planet: updatedPlanet });

      const fullRes = await fetch(
        `${API_URL}/planetary-systems/${planet.planetary_system_id}/full`
      );
      const fullSystem = new PlanetarySystemFull(fullRes.data);

      await uploadSystemThumbnail({ system: fullSystem });

      navigate(`/app/planets/${id}`);
    } catch (err) {
      console.error("Error actualitzant planeta:", err);
      setFormErrors(parseApiError(err));
      setIsSaving(false);
    }
  };

  /**
   * Handle cancel button press, navigates back to planet detail.
   */
  const handleCancel = () => {
    navigate(`/app/planets/${id}`);
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader className="h-12 w-12 text-blue-500 animate-spin" />
          <p className="text-xl text-gray-300">
            Carregant dades del planeta...
          </p>
        </div>
      </div>
    );
  }

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
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Recarregar
              </button>
              <button
                onClick={() => navigate("/app/profile")}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Tornar al perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!planet || !planetType) {
    return null; // This should not happen due to the loading state, but just in case
  }

  return (
    <FormProvider {...methods}>
      <div className="relative w-screen h-screen overflow-hidden bg-gray-950">
        {/* Back button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 z-40 px-4 py-2 rounded-lg bg-gray-900/70 backdrop-blur-md text-sm text-white hover:bg-gray-800/90 transition pointer-events-auto flex items-center gap-2 border border-gray-800"
        >
          <ArrowLeft size={16} />
          Tornar al planeta
        </button>

        <LivePlanet3DPreview bloomEnabled />

        <FloatingFormPanel title={`Editar planeta: ${planet.name}`}>
          <PlanetForm
            onSubmit={handleSubmit}
            errors={formErrors}
            planetType={planetType}
            systemId={planet.planetary_system_id}
          />
        </FloatingFormPanel>

        {/* Full-screen loading overlay */}
        {isSaving && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="bg-gray-900/80 p-8 rounded-2xl border border-blue-900/50 flex flex-col items-center">
              <Loader className="h-12 w-12 text-blue-500 animate-spin" />
              <p className="mt-4 text-white text-lg font-medium">
                Desant planeta...
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
