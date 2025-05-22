"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patchUserSchema } from "../schemas/userSchemas";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  ArrowLeft,
  Upload,
  User,
  Mail,
  Lock,
  Loader,
  AlertCircle,
  Save,
  X,
} from "lucide-react";
import UserAvatar from "../components/ui/UserAvatar";

// Load API base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

/**
 * EditUser component allows the user to update their profile information,
 * including username, email, password, and profile picture.
 */
const EditUser = () => {
  const fetchWithAuth = useFetchWithAuth();
  const navigate = useNavigate();
  const { user, checkAuthStatus } = useAuth();

  const [loading, setLoading] = useState(true); // Whether the user data is still loading
  const [submitting, setSubmitting] = useState(false); // Whether the form is submitting
  const [initialData, setInitialData] = useState(null); // Original user data
  const [selectedFile, setSelectedFile] = useState(null); // New profile picture file
  const [previewUrl, setPreviewUrl] = useState(null); // Preview URL of selected image
  const [error, setError] = useState(null); // Error message to display

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(patchUserSchema),
  });

  // Fetch user data on mount to populate the form
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetchWithAuth(`${API_URL}/auth/me`);
        setInitialData(res.data);
        reset(res.data);
      } catch (err) {
        console.error("Error carregant l'usuari:", err.message || err);
        setError(
          "No s'ha pogut carregar la informació de l'usuari. Si us plau, torna-ho a provar més tard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [fetchWithAuth, reset]);

  /**
   * Handles form submission.
   * Sends PATCH request to update user info and uploads profile picture if present.
   */
  const onSubmit = async (formData) => {
    setSubmitting(true);
    setError(null);

    try {
      await fetchWithAuth(`${API_URL}/auth/me`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });

      if (selectedFile && user?.user_id) {
        const imageData = new FormData();
        imageData.append("file", selectedFile);

        const res = await fetch(
          `${API_URL}/upload/users/${user.user_id}/profile_picture`,
          {
            method: "POST",
            body: imageData,
            credentials: "include",
          }
        );

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Error pujant la imatge: ${errText}`);
        }
      }

      await checkAuthStatus();
      navigate("/app/profile");
    } catch (err) {
      console.error("Error desant els canvis:", err.message || err);
      setError(
        `Error desant els canvis: ${
          err.message || "Hi ha hagut un problema en actualitzar el perfil"
        }`
      );
      setSubmitting(false);
    }
  };

  /**
   * Handles change of file input, updating preview and file state.
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  /**
   * Clears the selected file and preview.
   */
  const clearFileSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader className="h-12 w-12 text-purple-500 animate-spin" />
          <p className="text-xl text-gray-300">Carregant perfil...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/app/profile")}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={18} /> Tornar al perfil
      </button>

      <div className="bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-6">Editar perfil</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-400 h-5 w-5 mt-0.5 flex-shrink-0" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          {/* Profile Picture */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative mb-4">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-purple-600/50">
                {previewUrl ? (
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Previsualització"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserAvatar
                    profilePictureUrl={initialData?.profile_picture_url}
                  />
                )}
              </div>
              {previewUrl && (
                <button
                  type="button"
                  onClick={clearFileSelection}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <label className="cursor-pointer group">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <Upload
                  size={16}
                  className="text-purple-400 group-hover:text-purple-300"
                />
                <span className="text-sm text-gray-300 group-hover:text-white">
                  Canviar imatge de perfil
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={submitting}
              />
            </label>
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Nom d'usuari
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="username"
                type="text"
                {...register("username")}
                disabled={submitting}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none text-white"
                placeholder="El teu nom d'usuari"
              />
            </div>
            {errors.username && (
              <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Correu electrònic
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="email"
                type="email"
                {...register("email")}
                disabled={submitting}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none text-white"
                placeholder="El teu correu electrònic"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Nova contrasenya (opcional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="password"
                type="password"
                {...register("password")}
                disabled={submitting}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none text-white"
                placeholder="Deixa en blanc per mantenir l'actual"
              />
            </div>
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                submitting
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {submitting ? (
                <>
                  <Loader className="animate-spin h-4 w-4" />
                  Desant canvis...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Desar canvis
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditUser;
