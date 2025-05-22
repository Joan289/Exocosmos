import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";
import SystemForm from "../components/forms/SystemForm";
import { uploadSystemThumbnail } from "../utils/uploadSystemThumbnail";
import { PlanetarySystemFull } from "../models/PlanetarySystemFull";
import { parseApiError } from "../utils/parseApiError";
import { uploadStarThumbnail } from "../utils/uploadStarThumbnail";
import { ArrowLeft } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * SystemCreate is a protected page for creating a new planetary system.
 * It handles form submission, API communication, and thumbnail generation for both system and its star.
 */
const SystemCreate = () => {
  const navigate = useNavigate(); // Used to programmatically redirect the user
  const fetch = useFetchWithAuth(); // Authenticated fetch function
  const [formErrors, setFormErrors] = useState({}); // Form-level validation errors
  const [isSaving, setIsSaving] = useState(false); // Tracks loading state

  /**
   * Handles form submission to create a new planetary system.
   * Also generates and uploads system and star thumbnails.
   */
  const onSubmit = async (data) => {
    // Prepare payload for API request
    const payload = {
      name: data.name,
      distance_ly: Number(data.distance_ly),
      thumbnail_url: "https://placehold.co/400", // Placeholder image
      ...(data.description ? { description: data.description } : {}), // Optional description
    };

    setIsSaving(true); // Show loading overlay

    try {
      // Create planetary system
      const res = await fetch(`${API_URL}/planetary-systems`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      const systemId = res.data.planetary_system_id;

      // Fetch full system data including the star
      const fullRes = await fetch(
        `${API_URL}/planetary-systems/${systemId}/full`
      );
      const fullSystem = new PlanetarySystemFull(fullRes.data);

      // Generate thumbnails
      await uploadSystemThumbnail({ system: fullSystem });
      await uploadStarThumbnail({ star: fullSystem.star });

      // Redirect to profile after success
      navigate("/app/profile");
    } catch (err) {
      console.error("Error creating system:", err);
      return parseApiError(err); // Return errors to be set on the form
    } finally {
      setIsSaving(false); // Hide loading overlay
    }
  };

  /**
   * Wraps onSubmit to capture and store validation errors returned by parseApiError.
   */
  const handleSubmitWrapper = async (data) => {
    const errors = await onSubmit(data);
    if (errors) setFormErrors(errors);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate("/app/profile")}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={18} /> Tornar al perfil
      </button>

      {/* System creation form */}
      <SystemForm
        title="Crear nou sistema planetari"
        submitLabel="Crear sistema"
        defaultValues={{ name: "", description: "", distance_ly: "" }}
        onSubmit={handleSubmitWrapper}
        errors={formErrors}
      />

      {/* Loading overlay displayed during saving */}
      {isSaving && (
        <div className="fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg font-semibold">
            Creant sistema planetari...
          </p>
        </div>
      )}
    </main>
  );
};

export default SystemCreate;
