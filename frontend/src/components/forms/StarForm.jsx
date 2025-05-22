"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { getSpectralType } from "../../utils/getSpectralType";
import { useNavigate, useParams } from "react-router-dom";
import SliderField from "../ui/SliderField";
import { useMemo, useEffect } from "react";
import {
  AlertCircle,
  Save,
  ArrowLeft,
  Star,
  Thermometer,
  Sun,
  Ruler,
} from "lucide-react";

export default function StarForm({ onSubmit, errors = {} }) {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
    control,
    setError,
  } = useFormContext();

  // Apply backend validation errors (if any)
  useEffect(() => {
    if (errors) {
      Object.entries(errors).forEach(([field, message]) => {
        setError(field, { type: "manual", message });
      });
    }
  }, [errors, setError]);

  const values = useWatch({ control }) || {};
  const navigate = useNavigate();
  const { id } = useParams();

  // Derived physical properties
  const radiusKm = values?.radius_solar * 695700 || 0;
  const luminosity = Math.pow(values?.mass_solar || 1, 3.5);
  const temperature = 5800 * Math.pow(values?.mass_solar || 1, 0.505);
  const spectralType = getSpectralType(temperature);

  // Cancel and go back to star detail
  const handleCancel = () => {
    navigate(`/app/stars/${id}`);
  };

  // Slider configuration for mass (with non-linear scale and mark at 1)
  const massSliderOptions = useMemo(
    () => ({
      start: [values?.mass_solar ?? 1],
      connect: [true, false],
      range: {
        min: [0.08],
        "50%": [1],
        max: [5],
      },
      step: 0.01,
      pips: {
        mode: "values",
        values: [1],
        density: 100,
      },
    }),
    [values?.mass_solar]
  );

  // Slider configuration for radius (wide range with marker at 1)
  const radiusSliderOptions = useMemo(
    () => ({
      start: [values?.radius_solar ?? 1],
      connect: [true, false],
      range: {
        min: [0.1],
        "25%": [1],
        max: [100],
      },
      step: 0.01,
      pips: {
        mode: "values",
        values: [1],
        density: 100,
      },
    }),
    [values?.radius_solar]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name input */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-300 mb-1.5"
        >
          Nom <span className="text-yellow-400">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full px-3 py-2.5 rounded-lg bg-gray-800/70 border border-gray-700 focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all outline-none text-white"
          placeholder="Nom de l'estrella"
        />
        {formErrors.name && (
          <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            {formErrors.name.message}
          </p>
        )}
      </div>

      {/* Description input */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-300 mb-1.5"
        >
          Descripció
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows="3"
          className="w-full px-3 py-2.5 rounded-lg bg-gray-800/70 border border-gray-700 focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all outline-none text-white resize-none"
          placeholder="Descripció opcional de l'estrella"
        />
        {formErrors.description && (
          <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            {formErrors.description.message}
          </p>
        )}
      </div>

      {/* Mass input with custom slider */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Massa solar <span className="text-yellow-400">*</span>
        </label>
        <SliderField
          name="mass_solar"
          control={control}
          min={0.08}
          max={5}
          step={0.01}
          customOptions={massSliderOptions}
          className="mt-2"
        />
        {formErrors.mass_solar && (
          <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            {formErrors.mass_solar.message}
          </p>
        )}
      </div>

      {/* Radius input with custom slider */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Radi solar <span className="text-yellow-400">*</span>
        </label>
        <SliderField
          name="radius_solar"
          control={control}
          min={0.1}
          max={100}
          step={0.01}
          customOptions={radiusSliderOptions}
          className="mt-2"
        />
        {formErrors.radius_solar && (
          <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            {formErrors.radius_solar.message}
          </p>
        )}
      </div>

      {/* Derived read-only values */}
      <div className="mt-6 pt-5 border-t border-gray-700 space-y-3">
        <h3 className="text-sm font-medium text-gray-300 mb-2">
          Propietats calculades
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Temperature */}
          <div className="bg-gray-800/50 p-3 rounded-lg flex items-start gap-2">
            <Thermometer className="h-4 w-4 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400">Temperatura</p>
              <p className="text-sm font-medium text-white">
                {temperature.toFixed(0)} K
              </p>
            </div>
          </div>

          {/* Luminosity */}
          <div className="bg-gray-800/50 p-3 rounded-lg flex items-start gap-2">
            <Sun className="h-4 w-4 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400">Luminositat</p>
              <p className="text-sm font-medium text-white">
                {luminosity.toFixed(2)} L☉
              </p>
            </div>
          </div>

          {/* Radius in km */}
          <div className="bg-gray-800/50 p-3 rounded-lg flex items-start gap-2">
            <Ruler className="h-4 w-4 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400">Radi</p>
              <p className="text-sm font-medium text-white">
                {(radiusKm / 1000).toFixed(0)}K km
              </p>
            </div>
          </div>

          {/* Spectral type */}
          <div className="bg-gray-800/50 p-3 rounded-lg flex items-start gap-2">
            <Star className="h-4 w-4 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400">Tipus espectral</p>
              <p className="text-sm font-medium text-white">{spectralType}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit / Cancel */}
      <div className="flex flex-col gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2.5 rounded-lg bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Save size={16} />
          {isSubmitting ? "Guardant..." : "Guardar canvis"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="w-full px-4 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={16} />
          Tornar sense canvis
        </button>
      </div>
    </form>
  );
}
