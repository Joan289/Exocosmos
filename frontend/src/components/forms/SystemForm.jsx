"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSystemFormSchema } from "../../schemas/createSystemFormSchema";
import { useEffect } from "react";
import { AlertCircle, Save, Loader, PenLine, Ruler, Info } from "lucide-react";

const SystemForm = ({
  defaultValues,
  onSubmit,
  title,
  submitLabel,
  errors,
}) => {
  // Initialize form with validation schema
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(createSystemFormSchema),
    defaultValues,
  });

  // Apply external API validation errors to form state
  useEffect(() => {
    if (errors) {
      Object.entries(errors).forEach(([field, message]) => {
        setError(field, { type: "manual", message });
      });
    }
  }, [errors, setError]);

  return (
    <div className="px-6 md:px-8">
      <div className="bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>

        {/* Spinning ring decoration */}
        <div className="absolute top-6 right-6 opacity-10 pointer-events-none">
          <div className="w-32 h-32 rounded-full border-4 border-dashed border-purple-500 animate-spin-slow"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* System Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Nom del sistema <span className="text-purple-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PenLine className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="name"
                type="text"
                {...register("name")}
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none text-white"
                placeholder="Introdueix el nom del sistema planetari"
              />
            </div>
            {formErrors.name && (
              <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                {formErrors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Descripció
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <Info className="h-5 w-5 text-gray-500" />
              </div>
              <textarea
                id="description"
                {...register("description")}
                disabled={isSubmitting}
                rows={4}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none text-white resize-none"
                placeholder="Descriu el sistema planetari (opcional)"
              />
            </div>
            {formErrors.description && (
              <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                {formErrors.description.message}
              </p>
            )}
          </div>

          {/* Distance (light-years) */}
          <div>
            <label
              htmlFor="distance_ly"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Distància (anys llum) <span className="text-purple-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Ruler className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="distance_ly"
                type="number"
                step="1"
                min="0"
                {...register("distance_ly", { valueAsNumber: true })}
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none text-white"
                placeholder="Distància des del Sol en anys llum"
              />
            </div>
            {formErrors.distance_ly && (
              <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                {formErrors.distance_ly.message}
              </p>
            )}
          </div>

          {/* Info box */}
          <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 text-sm text-blue-200">
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Info className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="font-medium mb-1">Què és un sistema planetari?</p>
                <p className="text-blue-300">
                  Un sistema planetari és un conjunt d'objectes no estel·lars
                  (planetes, nans, asteroides, cometes, satèl·lits...) que
                  orbiten al voltant d'una estrella.
                </p>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                isSubmitting
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin h-4 w-4" />
                  Enviant...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {submitLabel}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SystemForm;
