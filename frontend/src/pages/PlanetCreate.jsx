"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getPlanetFormSchema } from "../schemas/getPlanetFormSchema";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { parseApiError } from "../utils/parseApiError";
import PlanetForm from "../components/forms/PlanetForm";
import FloatingFormPanel from "../components/ui/FloatingFormPanel";
import LivePlanet3DPreview from "../components/3d/LivePlanet3DPreview";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";
import { uploadPlanetTextures } from "../utils/uploadPlanetTextures";
import { uploadPlanetThumbnail } from "../utils/uploadPlanetThumbnail";
import { uploadSystemThumbnail } from "../utils/uploadSystemThumbnail";
import { PlanetarySystemFull } from "../models/PlanetarySystemFull";
import { Loader } from "lucide-react";

// Load API base URL from environment
const API_URL = import.meta.env.VITE_API_URL;

/**
 * PlanetCreate is a form-driven page for creating a new planet.
 * It allows submitting basic properties, uploading textures,
 * and updating system/planet thumbnails.
 */
export default function PlanetCreate({ planetType, systemId }) {
  const navigate = useNavigate();
  const fetchWithAuth = useFetchWithAuth();

  // Local state for form submission
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Ensure a valid planet type is provided
  if (!planetType) {
    throw new Error(
      "PlanetCreate necessita un planetType carregat prèviament."
    );
  }

  // Initialize form with schema and default values based on planetType
  const methods = useForm({
    resolver: zodResolver(getPlanetFormSchema(planetType)),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      mass_earth:
        planetType.min_mass + (planetType.max_mass - planetType.min_mass) / 4,
      radius_earth:
        planetType.min_radius +
        (planetType.max_radius - planetType.min_radius) / 4,
      inclination_deg: 0,
      rotation_speed_kms: 0.5,
      albedo: 0.3,
      star_distance_au: 1,
      has_rings: !!planetType.has_rings,
      moon_count: 0,
      planetary_system_id: Number(systemId),
      planet_type_id: planetType.planet_type_id,
      compounds: [],
      atmosphere: {
        pressure_atm: 1,
        greenhouse_factor: 0.5,
        compounds: [],
      },
    },
  });

  /**
   * Handles form submission:
   * - creates the planet
   * - uploads textures
   * - generates thumbnails
   * - navigates to updated system view
   */
  const handleSubmit = async (data) => {
    setIsSaving(true);
    try {
      const res = await fetchWithAuth(`${API_URL}/planets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const created = res.data;

      await uploadPlanetTextures({
        planetId: created.planet_id,
        hasSurface: planetType.has_surface,
      });

      const planetRes = await fetchWithAuth(
        `${API_URL}/planets/${created.planet_id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (planetRes.status !== "success") throw planetRes;
      const planet = await planetRes.data;

      await uploadPlanetThumbnail({ planet });

      const fullRes = await fetchWithAuth(
        `${API_URL}/planetary-systems/${systemId}/full`
      );
      const fullSystem = new PlanetarySystemFull(fullRes.data);

      await uploadSystemThumbnail({ system: fullSystem });

      navigate(`/app/systems/${systemId}`);
    } catch (err) {
      console.error("Error creant planeta:", err.message);
      console.error("Detalls", err.details);
      setFormErrors(parseApiError(err));
      setIsSaving(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="relative w-screen h-screen overflow-hidden bg-gray-950">
        <LivePlanet3DPreview bloomEnabled />
        <FloatingFormPanel title="Crear nou planeta">
          <PlanetForm
            onSubmit={handleSubmit}
            errors={formErrors}
            planetType={planetType}
            systemId={systemId}
          />
        </FloatingFormPanel>

        {isSaving && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="bg-gray-900/80 p-8 rounded-2xl border border-blue-900/50 flex flex-col items-center">
              <Loader className="h-12 w-12 text-blue-500 animate-spin" />
              <p className="mt-4 text-white text-lg font-medium">
                Creant planeta...
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
