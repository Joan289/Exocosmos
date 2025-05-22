"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";
import SystemForm from "../components/forms/SystemForm";
import { parseApiError } from "../utils/parseApiError";
import { ArrowLeft, Loader, AlertCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * SystemEdit is a protected page that allows the user to edit
 * the data of a specific planetary system.
 *
 * It loads the current system details, populates the form,
 * and submits changes using PATCH.
 */
const SystemEdit = () => {
  const { id } = useParams(); // Extract the planetary system ID from the URL
  const navigate = useNavigate();
  const fetch = useFetchWithAuth(); // Custom fetch wrapper with authentication

  // State variables to manage form, loading, and errors
  const [defaultValues, setDefaultValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch system data on mount and populate default values for the form.
   */
  useEffect(() => {
    fetch(`${API_URL}/planetary-systems/${id}`)
      .then((res) => {
        const system = res.data;
        setDefaultValues({
          name: system.name,
          description: system.description ?? "",
          distance_ly: system.distance_ly,
        });
      })
      .catch((err) => {
        if (err.message?.includes("404")) {
          setNotFound(true); // Handle 404 not found
        } else {
          console.error("Error carregant sistema:", err.message);
          setError(
            "No s'ha pogut carregar el sistema. Si us plau, torna-ho a provar més tard."
          );
        }
      })
      .finally(() => setLoading(false));
  }, [id, fetch]);

  /**
   * Handles the form submission.
   * Sends a PATCH request to update the planetary system.
   */
  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      distance_ly: Number(data.distance_ly),
      ...(data.description ? { description: data.description } : {}),
    };

    setIsSaving(true); // Show loading overlay
    try {
      await fetch(`${API_URL}/planetary-systems/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      navigate(`/app/systems/${id}`); // Redirect to system detail page
    } catch (err) {
      return parseApiError(err); // Return form-level errors
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Wraps the submission function and sets form errors if any.
   */
  const handleSubmitWrapper = async (data) => {
    const errors = await onSubmit(data);
    if (errors) setFormErrors(errors);
  };

  // Show loading screen while fetching system data
  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader className="h-12 w-12 text-purple-500 animate-spin" />
          <p className="text-xl text-gray-300">Carregant sistema...</p>
        </div>
      </main>
    );
  }

  // Show not found screen if system doesn't exist
  if (notFound) {
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

  // Show generic error if something went wrong
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

  // Render the form once default values are loaded
  if (!defaultValues) return null;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(`/app/systems/${id}`)}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={18} /> Tornar al sistema
      </button>

      {/* Edit form for planetary system */}
      <SystemForm
        title="Editar sistema planetari"
        submitLabel="Desar canvis"
        defaultValues={defaultValues}
        onSubmit={handleSubmitWrapper}
        errors={formErrors}
      />

      {/* Full-screen loading overlay shown while saving */}
      {isSaving && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="bg-gray-900/80 p-8 rounded-2xl border border-purple-900/50 flex flex-col items-center">
            <Loader className="h-12 w-12 text-purple-500 animate-spin" />
            <p className="mt-4 text-white text-lg font-medium">
              Desant sistema...
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default SystemEdit;
