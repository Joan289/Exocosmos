"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import SliderField from "../ui/SliderField";
import { getDefaultTextureForType } from "../../utils/getDefaultTextureForType";
import { useCanvasDrawing } from "../../hooks/useCanvasDrawing";
import CanvasToolbar from "../ui/CanvasToolbar";
import { useCanvasHeightDrawing } from "../../hooks/useCanvasHeightDrawing";
import CanvasHeightToolbar from "../ui/CanvasHeightToolbar";
import AtmosphereToolbar from "../ui/AtmosphereToolbar";
import { useCanvasAtmosphereDrawing } from "../../hooks/useCanvasAtmosphereDrawing";
import CompoundSelector from "../ui/CompoundSelector";
import CompoundDistributionSlider from "../ui/CompoundDistributionSlider";
import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";
import { AlertCircle, Save, ArrowLeft } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function PlanetForm({
  onSubmit,
  errors = {},
  planetType,
  systemId,
}) {
  const methods = useFormContext();
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
    control,
    setError,
    setValue,
  } = methods;

  // Default texture for the current planet type
  const defaultTexture = getDefaultTextureForType(planetType.planet_type_id);

  const fetch = useFetchWithAuth();
  const values = useWatch({ control });
  const navigate = useNavigate();

  // Compound state management
  const [planetCompounds, setPlanetCompounds] = useState([]);
  const [atmosphereCompounds, setAtmosphereCompounds] = useState([]);
  const [planetPercentages, setPlanetPercentages] = useState([]);
  const [atmospherePercentages, setAtmospherePercentages] = useState([]);

  // Watch uploaded texture files
  const surfaceFile = useWatch({ control, name: "surface_texture_file" });
  const heightFile = useWatch({ control, name: "height_texture_file" });
  const atmosphereFile = useWatch({ control, name: "atmosphere_texture_file" });

  // Load file previews to canvas
  useEffect(() => {
    let surfaceUrl, heightUrl, atmosphereUrl;

    if (surfaceFile?.[0]) {
      surfaceUrl = URL.createObjectURL(surfaceFile[0]);
      setValue("surface_texture_url", surfaceUrl);
    }
    if (heightFile?.[0]) {
      heightUrl = URL.createObjectURL(heightFile[0]);
      setValue("height_texture_url", heightUrl);
    }
    if (atmosphereFile?.[0]) {
      atmosphereUrl = URL.createObjectURL(atmosphereFile[0]);
      setValue("atmosphere.texture_url", atmosphereUrl);
    }

    return () => {
      if (surfaceUrl) URL.revokeObjectURL(surfaceUrl);
      if (heightUrl) URL.revokeObjectURL(heightUrl);
      if (atmosphereUrl) URL.revokeObjectURL(atmosphereUrl);
    };
  }, [surfaceFile, heightFile, atmosphereFile, setValue]);

  // Display field-level backend validation errors
  useEffect(() => {
    if (errors) {
      Object.entries(errors).forEach(([field, message]) => {
        setError(field, { type: "manual", message });
      });
    }
  }, [errors, setError]);

  // Go back to system detail
  const handleCancel = () => {
    navigate(`/app/systems/${systemId}`);
  };

  // Slider boundaries based on planet type constraints
  const massSliderOptions = useMemo(
    () => ({
      min: planetType.min_mass === 0 ? 0.01 : planetType.min_mass,
      max: planetType.max_mass,
    }),
    [planetType]
  );

  const radiusSliderOptions = useMemo(
    () => ({
      min: planetType.min_radius === 0 ? 0.01 : planetType.min_radius,
      max: planetType.max_radius,
    }),
    [planetType]
  );

  const maxMoons = planetType.max_moons;
  const hasRings = planetType.has_rings;

  // Drawing config for surface texture canvas
  const [drawingConfig, setDrawingConfig] = useState({
    color: "#ffffff",
    size: 6,
    brush: "round",
  });

  useCanvasDrawing(drawingConfig);

  // Drawing config for height map
  const [heightConfig, setHeightConfig] = useState({
    color: "#888888",
    size: 6,
    brush: "round",
  });

  useCanvasHeightDrawing(heightConfig);

  // Drawing config for atmosphere texture
  const [atmosphereDrawingConfig, setAtmosphereDrawingConfig] = useState({
    color: "rgba(255,255,255,0.4)",
    size: 20,
    brush: "round",
  });

  useCanvasAtmosphereDrawing(atmosphereDrawingConfig);

  // Load surface texture from file or default into canvas
  useEffect(() => {
    const canvas = document.getElementById("textureCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const rawUrl = values.surface_texture_url || defaultTexture;
    const src = rawUrl.startsWith("/uploads") ? `${API_URL}${rawUrl}` : rawUrl;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [values.surface_texture_url, planetType.planet_type_id, defaultTexture]);

  // Load height texture to canvas
  useEffect(() => {
    const canvas = document.getElementById("heightCanvas");
    if (!canvas || !planetType.has_surface) return;

    const ctx = canvas.getContext("2d");
    const rawUrl = values.height_texture_url || null;
    const src = rawUrl?.startsWith("/uploads") ? `${API_URL}${rawUrl}` : rawUrl;
    if (!src) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.height_texture_url, planetType.has_surface, API_URL]);

  // Load atmosphere texture to canvas
  useEffect(() => {
    const canvas = document.getElementById("atmosphereCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rawUrl = values.atmosphere?.texture_url || null;
    const src = rawUrl?.startsWith("/uploads") ? `${API_URL}${rawUrl}` : rawUrl;
    if (!src) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, values.atmosphere, values.atmosphere?.texture_url, API_URL]);

  // Remove selected surface compound
  const handleRemovePlanetCompound = (cid) => {
    setPlanetCompounds((prev) => prev.filter((c) => c.CID !== cid));
    setPlanetPercentages((prev) =>
      prev.filter((_, i) => planetCompounds[i].CID !== cid)
    );
  };

  // Remove selected atmosphere compound
  const handleRemoveAtmosphereCompound = (cid) => {
    setAtmosphereCompounds((prev) => prev.filter((c) => c.CID !== cid));
    setAtmospherePercentages((prev) =>
      prev.filter((_, i) => atmosphereCompounds[i].CID !== cid)
    );
  };

  // Final payload to submit
  const handleEnrichedSubmit = (data) => {
    const enrichedData = {
      ...data,
      surface_texture_url: "https://example.com/surface.webp",
      height_texture_url: planetType.has_surface
        ? "https://example.com/height.webp"
        : null,
      thumbnail_url: "https://example.com/thumb.webp",
      compounds: planetCompounds.map((compound, i) => ({
        CID: compound.CID,
        percentage: planetPercentages[i] ?? 0,
      })),
      atmosphere: {
        ...data.atmosphere,
        texture_url: "https://example.com/atm.png",
        compounds: atmosphereCompounds.map((compound, i) => ({
          CID: compound.CID,
          percentage: atmospherePercentages[i] ?? 0,
        })),
      },
      planetary_system_id: Number(systemId),
    };

    onSubmit(enrichedData);
  };

  // Load full compound data from IDs on mount
  useEffect(() => {
    const loadCompounds = async () => {
      if (values.compounds?.length > 0) {
        try {
          const fetched = await Promise.all(
            values.compounds.map((c) =>
              fetch(`${API_URL}/compounds/${c.CID}`).then((res) => res.data)
            )
          );
          setPlanetCompounds(fetched);
          setPlanetPercentages(
            values.compounds.map((c) => Number(c.percentage))
          );
        } catch (err) {
          console.error("Failed to load surface compounds:", err);
        }
      }

      if (values.atmosphere?.compounds?.length > 0) {
        try {
          const fetched = await Promise.all(
            values.atmosphere.compounds.map((c) =>
              fetch(`${API_URL}/compounds/${c.CID}`).then((res) => res.data)
            )
          );
          setAtmosphereCompounds(fetched);
          setAtmospherePercentages(
            values.atmosphere.compounds.map((c) => Number(c.percentage))
          );
        } catch (err) {
          console.error("Failed to load atmosphere compounds:", err);
        }
      }
    };

    loadCompounds();
  }, [values.compounds, values.atmosphere?.compounds, fetch]);

  return (
    <form onSubmit={handleSubmit(handleEnrichedSubmit)} className="space-y-8">
      {/* BASIC */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white mb-2">
          Informació bàsica
        </h2>

        {/* NOMBRE */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Nom <span className="text-blue-400">*</span>
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full px-3 py-2.5 rounded-lg bg-gray-800/70 border border-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-white"
            placeholder="Nom del planeta"
          />
          {formErrors.name && (
            <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              {formErrors.name.message}
            </p>
          )}
        </div>

        {/* DESCRIPCIÓ */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Descripció
          </label>
          <textarea
            {...register("description")}
            rows="3"
            className="w-full px-3 py-2.5 rounded-lg bg-gray-800/70 border border-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-white resize-none"
            placeholder="Descripció opcional del planeta"
          />
        </div>
      </section>

      {/* CAMPS FÍSICS */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white mb-2">
          Propietats físiques
        </h2>

        <SliderField
          name="mass_earth"
          label={`Massa terrestre (${massSliderOptions.min}–${massSliderOptions.max})`}
          control={control}
          min={massSliderOptions.min}
          max={massSliderOptions.max}
          step={0.01}
          color="blue"
        />

        <SliderField
          name="radius_earth"
          label={`Radi terrestre (${radiusSliderOptions.min}–${radiusSliderOptions.max})`}
          control={control}
          min={radiusSliderOptions.min}
          max={radiusSliderOptions.max}
          step={0.01}
          color="blue"
        />

        <SliderField
          name="inclination_deg"
          label="Inclinació (°)"
          control={control}
          min={0}
          max={180}
          step={1}
          color="blue"
        />

        <SliderField
          name="rotation_speed_kms"
          label="Velocitat de rotació (km/s)"
          control={control}
          min={0}
          max={10}
          step={0.01}
          color="blue"
        />

        <SliderField
          name="albedo"
          label="Albedo (reflectivitat)"
          control={control}
          min={0}
          max={1}
          step={0.01}
          color="blue"
        />

        <SliderField
          name="star_distance_au"
          label="Distància a l'estrella (AU)"
          control={control}
          min={0.1}
          max={100}
          step={0.1}
          color="blue"
        />

        {/* BOOLEAN */}
        {Boolean(hasRings) && (
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("has_rings")}
                className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-700 bg-gray-800 focus:ring-blue-500"
              />
              <span className="text-white">Té anells?</span>
            </label>
          </div>
        )}

        {/* MOONS */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Número de llunes (0–{maxMoons ?? "?"})
          </label>
          <input
            type="number"
            {...register("moon_count", { valueAsNumber: true })}
            min={0}
            max={maxMoons}
            className="w-full px-3 py-2.5 rounded-lg bg-gray-800/70 border border-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-white"
          />
        </div>
      </section>

      {/* COMPOSTOS */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white mb-2">Compostos</h2>

        <CompoundSelector
          label="Compostos de la superfície"
          selectedCompounds={planetCompounds}
          setSelectedCompounds={setPlanetCompounds}
        />

        {planetCompounds.length > 0 && (
          <CompoundDistributionSlider
            compounds={planetCompounds}
            percentages={planetPercentages}
            setPercentages={setPlanetPercentages}
            onRemoveCompound={handleRemovePlanetCompound}
          />
        )}
      </section>

      {/* ATMOSFERA */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white mb-2">Atmosfera</h2>

        <CompoundSelector
          label="Compostos de l'atmosfera"
          selectedCompounds={atmosphereCompounds}
          setSelectedCompounds={setAtmosphereCompounds}
        />

        {atmosphereCompounds.length > 0 && (
          <CompoundDistributionSlider
            compounds={atmosphereCompounds}
            percentages={atmospherePercentages}
            setPercentages={setAtmospherePercentages}
            onRemoveCompound={handleRemoveAtmosphereCompound}
          />
        )}

        <div className="space-y-4 mt-5">
          <SliderField
            name="atmosphere.pressure_atm"
            label="Pressió atmosfèrica (atm)"
            control={control}
            min={0}
            max={10}
            step={0.1}
            color="blue"
          />

          <SliderField
            name="atmosphere.greenhouse_factor"
            label="Factor d'efecte hivernacle"
            control={control}
            min={0}
            max={5}
            step={0.1}
            color="blue"
          />
        </div>
      </section>

      {/* TEXTURES */}
      <section className="space-y-8">
        <h2 className="text-lg font-semibold text-white mb-2">Textures</h2>

        {/* TEXTURA SUPERFÍCIE */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
          <h3 className="text-md font-medium text-white mb-3">
            Editor de textura de superfície
          </h3>
          <div className="p-3 bg-gray-800/70 rounded-lg border border-gray-700 mb-4">
            <CanvasToolbar onChange={setDrawingConfig} />
          </div>
          <input
            type="file"
            accept="image/*"
            className="w-full px-3 py-2.5 rounded-lg bg-gray-800/70 border border-gray-700 mb-3 text-sm text-gray-300"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const img = new Image();
              img.onload = () => {
                const canvas = document.getElementById("textureCanvas");
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              };
              img.src = URL.createObjectURL(file);
            }}
          />
          <div className="flex justify-center mb-3">
            <canvas
              id="textureCanvas"
              width="1024"
              height="512"
              style={{ width: "100%", height: "auto" }}
              className="border border-gray-600 bg-black cursor-crosshair rounded-lg"
            />
          </div>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm flex-1"
              onClick={() => {
                const canvas = document.getElementById("textureCanvas");
                if (canvas) {
                  const dataURL = canvas.toDataURL("image/png");
                  methods.setValue("surface_texture_url", dataURL);
                }
              }}
            >
              Aplicar al planeta
            </button>
            <button
              type="button"
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
              onClick={() => {
                const canvas = document.getElementById("textureCanvas");
                const ctx = canvas.getContext("2d");
                const img = new Image();
                img.onload = () => {
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
                img.src = defaultTexture;
              }}
            >
              Reiniciar
            </button>
          </div>
          <p className="text-sm text-gray-400">
            Pinta lliurement o carrega una imatge base. El contingut del canvas
            es convertirà en la textura de superfície del planeta.
          </p>
        </div>

        {/* TEXTURA RELLEU */}
        {planetType.has_surface && (
          <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
            <h3 className="text-md font-medium text-white mb-3">
              Editor de relleu (height map)
            </h3>
            <div className="p-3 bg-gray-800/70 rounded-lg border border-gray-700 mb-4">
              <CanvasHeightToolbar onChange={setHeightConfig} />
            </div>
            <input
              type="file"
              accept="image/*"
              className="w-full px-3 py-2.5 rounded-lg bg-gray-800/70 border border-gray-700 mb-3 text-sm text-gray-300"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const img = new Image();
                img.onload = () => {
                  const canvas = document.getElementById("heightCanvas");
                  const ctx = canvas.getContext("2d");
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
                img.src = URL.createObjectURL(file);
              }}
            />
            <div className="flex justify-center mb-3">
              <canvas
                id="heightCanvas"
                width="1024"
                height="512"
                style={{ width: "100%", height: "auto" }}
                className="border border-gray-600 bg-gray-700 cursor-crosshair rounded-lg"
              />
            </div>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm flex-1"
                onClick={() => {
                  const canvas = document.getElementById("heightCanvas");
                  if (canvas) {
                    const dataURL = canvas.toDataURL("image/png");
                    methods.setValue("height_texture_url", dataURL);
                  }
                }}
              >
                Aplicar al planeta
              </button>
              <button
                type="button"
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                onClick={() => {
                  const canvas = document.getElementById("heightCanvas");
                  const ctx = canvas.getContext("2d");
                  ctx.fillStyle = "#888888";
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                }}
              >
                Reiniciar
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Utilitza tons de gris: negre representa altitud mínima i blanc
              màxima. Es farà servir com a mapa de relleu.
            </p>
          </div>
        )}

        {/* TEXTURA ATMOSFERA */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
          <h3 className="text-md font-medium text-white mb-3">
            Editor de textura de l'atmosfera
          </h3>
          <div className="p-3 bg-gray-800/70 rounded-lg border border-gray-700 mb-4">
            <AtmosphereToolbar onChange={setAtmosphereDrawingConfig} />
          </div>
          <input
            type="file"
            accept="image/png,image/webp"
            className="w-full px-3 py-2.5 rounded-lg bg-gray-800/70 border border-gray-700 mb-3 text-sm text-gray-300"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const img = new Image();
              img.onload = () => {
                const canvas = document.getElementById("atmosphereCanvas");
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              };
              img.src = URL.createObjectURL(file);
            }}
          />
          <div className="flex justify-center mb-3">
            <canvas
              id="atmosphereCanvas"
              width="1024"
              height="512"
              style={{ width: "100%", height: "auto" }}
              className="border border-blue-600/50 bg-transparent cursor-crosshair rounded-lg"
            />
          </div>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm flex-1"
              onClick={() => {
                const canvas = document.getElementById("atmosphereCanvas");
                if (canvas) {
                  const dataURL = canvas.toDataURL("image/png");
                  methods.setValue("atmosphere.texture_url", dataURL);
                }
              }}
            >
              Aplicar atmosfera
            </button>
            <button
              type="button"
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
              onClick={() => {
                const canvas = document.getElementById("atmosphereCanvas");
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
              }}
            >
              Reiniciar
            </button>
          </div>
          <p className="text-sm text-gray-400">
            Dibuixa una capa translúcida per representar l'atmosfera. La textura
            ha de tenir transparència per aplicar-se correctament al planeta.
          </p>
        </div>
      </section>

      <input type="hidden" {...register("atmosphere.texture_url")} />
      <input type="hidden" {...register("surface_texture_url")} />
      <input type="hidden" {...register("height_texture_url")} />

      {/* BOTONES */}
      <div className="flex flex-col gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Save size={16} />
          {isSubmitting ? "Guardant..." : "Guardar planeta"}
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
