"use client";

import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import GalaxyBackground from "./GalaxyBackground";
import BloomComposer from "./BloomComposer";
import Star3D from "./Star3D";
import { Star } from "../../models/Star";
import { Planet } from "../../models/Planet";
import Planet3D from "./Planet3D";
import { ChevronDown, Eye, Settings } from "lucide-react";

/**
 * SpaceScene renders a complete 3D environment with interactive controls,
 * optional bloom postprocessing, and toggleable comparison objects (Sun, Earth, Jupiter).
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 3D content to render inside the scene.
 * @param {number} [props.objectRadius=1] - Radius of the main object, used to adjust camera and spacing.
 * @param {boolean} [props.bloomEnabledInitial=true] - Whether bloom is initially enabled.
 * @param {number} [props.scaleFactor=1_000_000] - Scale used to convert physical units to scene units.
 * @param {boolean} [props.controlsEnabled=true] - Whether orbit controls are active.
 */
const SpaceScene = ({
  children,
  objectRadius = 1,
  bloomEnabledInitial = true,
  scaleFactor = 1_000_000,
  controlsEnabled = true,
}) => {
  const [bloomEnabled, setBloomEnabled] = useState(bloomEnabledInitial);
  const [showComparison, setShowComparison] = useState(false);
  const [showEarth, setShowEarth] = useState(false);
  const [showJupiter, setShowJupiter] = useState(false);
  const [pixelScale, setPixelScale] = useState(1);
  const [visualizationOpen, setVisualizationOpen] = useState(false);
  const [performanceOpen, setPerformanceOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const visualRadius = objectRadius;

  const minDistance = visualRadius * 1.2;
  const maxDistance = visualRadius * 5;
  const initDistance = (minDistance + maxDistance) / 2;

  const zoomSpeed = Math.min(Math.max(0.5, visualRadius / 5), 3);

  const sun = new Star({ mass_solar: 1, radius_solar: 1 });

  const earth = new Planet({
    name: "Earth",
    mass_earth: 1,
    radius_earth: 1,
    inclination_deg: 23.44,
    rotation_speed_kms: 0.465,
    albedo: 0.3,
    surface_texture_url: "/images/textures/earth.jpg",
  });

  const jupiter = new Planet({
    name: "Jupiter",
    mass_earth: 317.8,
    radius_earth: 11.2,
    inclination_deg: 3.13,
    rotation_speed_kms: 12.6,
    albedo: 0.52,
    surface_texture_url: "/images/textures/jupiter.jpg",
  });

  return (
    <div className="relative w-full h-full">
      {/* Controls container - responsive positioning */}
      <div
        className={`absolute z-40 ${
          isMobile
            ? "bottom-4 left-4 right-4 flex flex-col gap-2"
            : "top-4 right-4 flex gap-2"
        }`}
      >
        {/* Visualization Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setVisualizationOpen(!visualizationOpen);
              if (performanceOpen) setPerformanceOpen(false);
            }}
            className="flex items-center justify-between w-full md:w-60 px-4 py-2 text-sm font-medium text-white bg-gray-900/60 backdrop-blur-md rounded-lg border border-gray-700/50 hover:bg-gray-800/70 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-blue-400" />
              <span>Visualització</span>
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                visualizationOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {visualizationOpen && (
            <div className="absolute mt-2 w-full md:w-60 p-3 bg-gray-900/80 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl z-50 animate-in fade-in duration-200">
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-800/50 p-2 rounded-md transition-colors">
                  <input
                    type="checkbox"
                    checked={showComparison}
                    onChange={() => setShowComparison((v) => !v)}
                    className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                  />
                  <span className="text-sm text-gray-200">
                    Mostrar Sol de comparació
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-800/50 p-2 rounded-md transition-colors">
                  <input
                    type="checkbox"
                    checked={showEarth}
                    onChange={() => setShowEarth((v) => !v)}
                    className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                  />
                  <span className="text-sm text-gray-200">
                    Mostrar Terra de comparació
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-800/50 p-2 rounded-md transition-colors">
                  <input
                    type="checkbox"
                    checked={showJupiter}
                    onChange={() => setShowJupiter((v) => !v)}
                    className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                  />
                  <span className="text-sm text-gray-200">
                    Mostrar Júpiter de comparació
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Performance Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setPerformanceOpen(!performanceOpen);
              if (visualizationOpen) setVisualizationOpen(false);
            }}
            className="flex items-center justify-between w-full md:w-60 px-4 py-2 text-sm font-medium text-white bg-gray-900/60 backdrop-blur-md rounded-lg border border-gray-700/50 hover:bg-gray-800/70 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Settings size={16} className="text-purple-400" />
              <span>Rendiment</span>
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                performanceOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {performanceOpen && (
            <div className="absolute mt-2 w-full md:w-60 p-3 bg-gray-900/80 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl z-50 animate-in fade-in duration-200">
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-800/50 p-2 rounded-md transition-colors">
                  <input
                    type="checkbox"
                    checked={bloomEnabled}
                    onChange={() => setBloomEnabled((v) => !v)}
                    className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                  />
                  <span className="text-sm text-gray-200">
                    Post-processat (bloom)
                  </span>
                </label>

                <div className="space-y-2 px-2">
                  <p className="text-sm text-gray-300">Escala de píxel:</p>
                  <div className="relative">
                    <select
                      className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-md px-3 py-1.5 text-sm appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={pixelScale}
                      onChange={(e) =>
                        setPixelScale(Number.parseFloat(e.target.value))
                      }
                    >
                      <option value={1}>Alta (100%)</option>
                      <option value={0.75}>Mitjana (75%)</option>
                      <option value={0.5}>Baixa (50%)</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Canvas with 3D scene */}
      <Canvas
        dpr={pixelScale}
        camera={{
          position: [0, 0, initDistance],
          fov: 60,
          near: 0.01,
          far: 5000,
        }}
        style={{ background: "#000", width: "100%", height: "100%" }}
      >
        <GalaxyBackground />
        {children}

        {showComparison &&
          (() => {
            const sunRadiusKm = sun.radiusKm;
            const sunRadiusScaled = sunRadiusKm / scaleFactor;
            const safeMargin = (objectRadius + sunRadiusScaled) * 0.25;

            return (
              <Star3D
                star={sun}
                scaleFactor={scaleFactor}
                position={[objectRadius + sunRadiusScaled + safeMargin, 0, 0]}
              />
            );
          })()}

        {showEarth &&
          (() => {
            const earthRadiusKm = earth.radius_earth * 6371;
            const earthRadiusScaled = earthRadiusKm / scaleFactor;
            const safeMargin = (objectRadius + earthRadiusScaled) * 0.25;

            return (
              <Planet3D
                planet={earth}
                scaleFactor={scaleFactor}
                position={[
                  0,
                  0,
                  -(objectRadius + earthRadiusScaled + safeMargin),
                ]}
              />
            );
          })()}

        {showJupiter &&
          (() => {
            const jupiterRadiusKm = jupiter.radius_earth * 6371;
            const jupiterRadiusScaled = jupiterRadiusKm / scaleFactor;
            const safeMargin = (objectRadius + jupiterRadiusScaled) * 0.25;

            return (
              <Planet3D
                planet={jupiter}
                scaleFactor={scaleFactor}
                position={[
                  0,
                  0,
                  objectRadius + jupiterRadiusScaled + safeMargin,
                ]}
              />
            );
          })()}

        <OrbitControls
          minDistance={minDistance}
          maxDistance={maxDistance}
          zoomSpeed={zoomSpeed}
          enabled={controlsEnabled}
        />
        <BloomComposer bloomEnabled={bloomEnabled} />
      </Canvas>
    </div>
  );
};

export default SpaceScene;
