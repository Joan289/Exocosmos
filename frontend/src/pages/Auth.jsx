"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/loginSchema";
import { registerSchema } from "../schemas/registerSchema";
import { register as registerUser } from "../services/authService";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";
import { Eye, EyeOff, LogIn, UserPlus, AlertCircle } from "lucide-react";

/**
 * Auth component for handling both login and registration logic.
 * It toggles between forms, manages server responses, shows loading state,
 * and uses Zod + React Hook Form for validation.
 */
const Auth = () => {
  const [mode, setMode] = useState("login"); // Current mode: "login" or "register"
  const [serverError, setServerError] = useState(""); // Error message from the backend
  const { login, isLoading: isAuthLoading, setIsLoading } = useAuth(); // Auth context
  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks form submission
  const [showPassword, setShowPassword] = useState(false); // Toggles password visibility

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(mode === "login" ? loginSchema : registerSchema), // Schema-based validation
  });

  // Ensure isLoading is reset when the component mounts
  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  /**
   * Handles form submission for both login and register modes.
   * Calls appropriate service functions and handles errors.
   */
  const onSubmit = async (data) => {
    setServerError("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login({ email: data.email, password: data.password });
      } else {
        await registerUser(data);
        setMode("login");
      }
    } catch (err) {
      console.error("Auth submission failed:", err);
      setServerError(
        err.response?.data?.message || err.message || "Ocurrió un error."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Whether the form inputs and button should be disabled
  const isFormDisabled = isSubmitting || isAuthLoading;

  // Toggle the visibility of the password input
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md z-10">
        <div className="bg-gray-900/70 backdrop-blur-lg p-8 rounded-2xl border border-gray-800 shadow-xl">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <img
                src="/images/logos/logo_white.svg"
                alt="EXOCOSMOS"
                className="h-8"
              />
            </Link>
            <h2 className="text-2xl font-bold text-white mb-2">
              {mode === "login" ? "Inicia sessió" : "Registra't"}
            </h2>
            <p className="text-gray-400">
              {mode === "login"
                ? "Accedeix al teu compte per continuar"
                : "Crea un nou compte per començar"}
            </p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-400 h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-red-200 text-sm">{serverError}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            {mode === "register" && (
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Nom d'usuari
                </label>
                <input
                  id="username"
                  type="text"
                  {...register("username")}
                  disabled={isFormDisabled}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none text-white"
                  placeholder="El teu nom d'usuari"
                />
                {errors.username && (
                  <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.username.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Correu electrònic
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                disabled={isFormDisabled}
                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none text-white"
                placeholder="El teu correu electrònic"
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Contrasenya
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  disabled={isFormDisabled}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none text-white pr-10"
                  placeholder="La teva contrasenya"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isFormDisabled}
              className={`w-full py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                isFormDisabled
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Carregant...
                </>
              ) : mode === "login" ? (
                <>
                  <LogIn size={18} /> Entrar
                </>
              ) : (
                <>
                  <UserPlus size={18} /> Registrar
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                reset();
                setServerError("");
              }}
              disabled={isFormDisabled}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              {mode === "login"
                ? "No tens compte? Registra't"
                : "Ja tens compte? Inicia sessió"}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-gray-400 hover:text-gray-300 text-sm flex items-center justify-center gap-1.5"
          >
            Tornar a la pàgina principal
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Auth;
