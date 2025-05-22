"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";
import { PlanetFull } from "../models/PlanetFull";
import SystemCard from "../components/cards/SystemCard";
import Planet3DPreview from "../components/3d/Planet3DPreview";
import UserBadge from "../components/ui/UserBadge";
import PlanetDataCard from "../components/planet/PlanetDataCard";
import PlanetFormula from "../components/planet/PlanetFormula";
import PlanetCompoundChart from "../components/planet/PlanetCompoundChart";
import PlanetHabitabilityIndex from "../components/planet/PlanetHabitabilityIndex";
import {
  Loader,
  AlertCircle,
  ArrowLeft,
  Edit,
  Trash2,
  Info,
  Thermometer,
  Ruler,
  Scale,
  Orbit,
  CloudSun,
  Layers,
  Moon,
  BellRingIcon as Rings,
} from "lucide-react";

// Load API base URL
const API_URL = import.meta.env.VITE_API_URL;

/**
 * PlanetDetail is a comprehensive view of a single planet.
 * It includes 3D preview, physical/orbital properties, composition,
 * formulas, and interactive tabs.
 */
export default function PlanetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetch = useFetchWithAuth();
  const { user } = useAuth();

  // State for planet data, loading, errors, and tab selection
  const [planet, setPlanet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch full planet data on mount
  useEffect(() => {
    fetch(`${API_URL}/planets/${id}/full`)
      .then((res) => setPlanet(new PlanetFull(res.data)))
      .catch((err) => {
        if (err.message?.includes("404")) {
          setNotFound(true);
        } else {
          console.error("Error carregant planeta:", err.message);
          setError(
            "No s'ha pogut carregar el planeta. Si us plau, torna-ho a provar més tard."
          );
        }
      })
      .finally(() => setLoading(false));
  }, [id, fetch]);

  /**
   * Handle planet deletion with confirmation.
   * On success, navigates back to the system page.
   */
  const handleDelete = async () => {
    const confirmed = window.confirm("Segur que vols eliminar aquest planeta?");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await fetch(`${API_URL}/planets/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      navigate(`/app/systems/${planet.system.planetary_system_id}`);
    } catch (err) {
      console.error("Error eliminant planeta:", err.message);
      setError(
        "No s'ha pogut eliminar el planeta. Si us plau, torna-ho a provar més tard."
      );
      setIsDeleting(false);
    }
  };

  /**
   * Calculates a simplified habitability score for the planet
   * based on temperature, gravity, and atmospheric composition.
   */
  const habitabilityScore = useMemo(() => {
    if (!planet) return null;

    let score = 0;
    const idealTemp = 288;
    const idealGravity = 9.8;

    if (planet.surfaceTemperature) {
      const tempDiff = Math.abs(planet.surfaceTemperature - idealTemp);
      score += Math.max(0, 40 - tempDiff / 3);
    }

    const gravityDiff = Math.abs(planet.gravity - idealGravity);
    score += Math.max(0, 30 - gravityDiff * 3);

    if (planet.atmosphere) {
      const pressureDiff = Math.abs(planet.atmosphere.pressure_atm - 1);
      score += Math.max(0, 15 - pressureDiff * 7.5);

      const hasOxygen = planet.atmosphere.compounds?.some(
        (c) =>
          c.name.toLowerCase().includes("oxygen") || c.formula.includes("O2")
      );
      const hasNitrogen = planet.atmosphere.compounds?.some(
        (c) =>
          c.name.toLowerCase().includes("nitrogen") || c.formula.includes("N2")
      );
      if (hasOxygen) score += 10;
      if (hasNitrogen) score += 5;
    }

    return Math.min(100, Math.round(score));
  }, [planet]);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader className="h-12 w-12 text-blue-500 animate-spin" />
          <p className="text-xl text-gray-300">Carregant planeta...</p>
        </div>
      </main>
    );
  }

  if (notFound || !planet) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-gray-900/70 backdrop-blur-md p-8 rounded-2xl border border-red-900/50 max-w-md w-full">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Planeta no trobat</h2>
            <p className="text-gray-300">
              No hem pogut trobar el planeta que estàs buscant. Pot ser que hagi
              estat eliminat o que no tinguis permisos per accedir-hi.
            </p>
            <button
              onClick={() => navigate("/app/profile")}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Tornar al perfil
            </button>
          </div>
        </div>
      </main>
    );
  }

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
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Recarregar
            </button>
          </div>
        </div>
      </main>
    );
  }

  const { system, star } = planet;
  const isOwner = user && system?.user_id === user.user_id;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <button
        onClick={() =>
          navigate(`/app/systems/${planet.system.planetary_system_id}`)
        }
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={18} /> Tornar al sistema
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Planet Header */}
          <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold text-white">{planet.name}</h1>
              </div>

              {isOwner && (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/app/planets/${id}/edit`)}
                    className="px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Edit size={16} /> Editar
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isDeleting ? (
                      <Loader size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}{" "}
                    Eliminar
                  </button>
                </div>
              )}
            </div>

            {planet.description && (
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Descripció</p>
                  <p className="text-white italic">{planet.description}</p>
                </div>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="border-b border-gray-800 mb-6">
              <nav className="flex space-x-4 overflow-x-auto pb-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === "overview"
                      ? "bg-blue-900/30 text-blue-300 border-b-2 border-blue-500"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Visió general
                </button>
                <button
                  onClick={() => setActiveTab("physical")}
                  className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === "physical"
                      ? "bg-blue-900/30 text-blue-300 border-b-2 border-blue-500"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Propietats físiques
                </button>
                <button
                  onClick={() => setActiveTab("orbital")}
                  className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === "orbital"
                      ? "bg-blue-900/30 text-blue-300 border-b-2 border-blue-500"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Òrbita i rotació
                </button>
                <button
                  onClick={() => setActiveTab("composition")}
                  className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === "composition"
                      ? "bg-blue-900/30 text-blue-300 border-b-2 border-blue-500"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Composició
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PlanetDataCard
                    title="Massa"
                    value={`${planet.mass_earth} M⊕`}
                    description="Massa del planeta en relació a la Terra"
                    icon={<Scale className="h-5 w-5 text-blue-400" />}
                  />
                  <PlanetDataCard
                    title="Radi"
                    value={`${planet.radius_earth} R⊕`}
                    description={`${planet.radiusKm.toLocaleString()} km`}
                    icon={<Ruler className="h-5 w-5 text-blue-400" />}
                  />
                  <PlanetDataCard
                    title="Gravetat superficial"
                    value={`${planet.gravity.toFixed(2)} m/s²`}
                    description={`${(planet.gravity / 9.8).toFixed(2)} g`}
                    icon={<Scale className="h-5 w-5 text-blue-400" />}
                  />
                  <PlanetDataCard
                    title="Temperatura superficial"
                    value={`${planet.surfaceTemperature?.toFixed(1) || "?"} K`}
                    description={`${
                      planet.surfaceTemperature
                        ? (planet.surfaceTemperature - 273.15).toFixed(1)
                        : "?"
                    } °C`}
                    icon={<Thermometer className="h-5 w-5 text-blue-400" />}
                  />
                  <PlanetDataCard
                    title="Distància a l'estrella"
                    value={`${planet.star_distance_au} AU`}
                    description={`${(
                      planet.star_distance_au * 149.6
                    ).toLocaleString()} milions de km`}
                    icon={<Orbit className="h-5 w-5 text-blue-400" />}
                  />
                  <PlanetDataCard
                    title="Període orbital"
                    value={`${
                      planet.orbitalPeriodDays?.toFixed(1) || "?"
                    } dies`}
                    description={`${
                      planet.orbitalPeriodDays
                        ? (planet.orbitalPeriodDays / 365.25).toFixed(2)
                        : "?"
                    } anys`}
                    icon={<Orbit className="h-5 w-5 text-blue-400" />}
                  />
                  <PlanetDataCard
                    title="Llunes"
                    value={planet.moon_count}
                    description={`${
                      planet.moon_count === 1
                        ? "satèl·lit natural"
                        : "satèl·lits naturals"
                    }`}
                    icon={<Moon className="h-5 w-5 text-blue-400" />}
                  />
                  <PlanetDataCard
                    title="Anells"
                    value={planet.has_rings ? "Sí" : "No"}
                    description={
                      planet.has_rings
                        ? "El planeta té sistema d'anells"
                        : "Sense sistema d'anells"
                    }
                    icon={<Rings className="h-5 w-5 text-blue-400" />}
                  />
                </div>
              )}

              {/* Physical Properties Tab */}
              {activeTab === "physical" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Gravetat superficial
                      </h3>
                      <PlanetFormula
                        formula="g = \frac{G \cdot M}{r^2}"
                        explanation="On G és la constant gravitacional, M és la massa del planeta i r és el radi."
                        result={`${planet.gravity.toFixed(2)} m/s²`}
                        variables={[
                          { name: "G", value: "6.674 × 10⁻¹¹ m³/kg·s²" },
                          {
                            name: "M",
                            value: `${(
                              planet.mass_earth * 5.972e24
                            ).toExponential(4)} kg`,
                          },
                          {
                            name: "r",
                            value: `${(planet.radiusKm * 1000).toExponential(
                              4
                            )} m`,
                          },
                        ]}
                      />
                    </div>

                    <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Velocitat d'escapament
                      </h3>
                      <PlanetFormula
                        formula="v_e = \sqrt{\frac{2GM}{r}}"
                        explanation="Velocitat mínima necessària per escapar de la gravetat del planeta."
                        result={`${planet.escapeVelocity.toFixed(2)} km/s`}
                        variables={[
                          { name: "G", value: "6.674 × 10⁻¹¹ m³/kg·s²" },
                          {
                            name: "M",
                            value: `${(
                              planet.mass_earth * 5.972e24
                            ).toExponential(4)} kg`,
                          },
                          {
                            name: "r",
                            value: `${(planet.radiusKm * 1000).toExponential(
                              4
                            )} m`,
                          },
                        ]}
                      />
                    </div>

                    <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Temperatura superficial
                      </h3>
                      <PlanetFormula
                        formula="T = 278 \cdot \frac{(1-A)^{1/4} \cdot L^{1/4}}{\sqrt{d}}"
                        explanation="On A és l'albedo, L és la lluminositat de l'estrella i d és la distància en AU."
                        result={`${
                          planet.surfaceTemperature?.toFixed(1) || "?"
                        } K`}
                        variables={[
                          { name: "A", value: planet.albedo.toFixed(2) },
                          {
                            name: "L",
                            value: `${
                              planet.star.luminosity?.toFixed(4) || "?"
                            } L☉`,
                          },
                          { name: "d", value: `${planet.star_distance_au} AU` },
                        ]}
                      />
                      <p className="text-sm text-gray-400 mt-2">
                        Nota: Aquesta és una temperatura teòrica sense tenir en
                        compte efectes atmosfèrics.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Aplanament
                      </h3>
                      <PlanetFormula
                        formula="f = \frac{\omega^2 r}{2g}"
                        explanation="Mesura de l'aplanament del planeta degut a la rotació."
                        result={`${planet.flattening.toExponential(4)}`}
                        variables={[
                          {
                            name: "ω",
                            value: `${planet.angularSpeed.toExponential(
                              4
                            )} rad/s`,
                          },
                          {
                            name: "r",
                            value: `${(planet.radiusKm * 1000).toExponential(
                              4
                            )} m`,
                          },
                          {
                            name: "g",
                            value: `${planet.gravity.toFixed(4)} m/s²`,
                          },
                        ]}
                      />
                    </div>
                  </div>

                  {habitabilityScore !== null && (
                    <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Índex d'habitabilitat
                      </h3>
                      <PlanetHabitabilityIndex score={habitabilityScore} />
                      <p className="text-sm text-gray-400 mt-4">
                        L'índex d'habitabilitat és una estimació basada en la
                        temperatura, gravetat i composició atmosfèrica del
                        planeta. Un valor més alt indica condicions més
                        favorables per a la vida tal com la coneixem.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Orbital Properties Tab */}
              {activeTab === "orbital" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Període orbital
                      </h3>
                      <PlanetFormula
                        formula="T = 2\pi \sqrt{\frac{a^3}{GM}}"
                        explanation="Llei de Kepler: el temps que tarda el planeta en completar una òrbita."
                        result={`${
                          planet.orbitalPeriodDays?.toFixed(1) || "?"
                        } dies`}
                        variables={[
                          {
                            name: "a",
                            value: `${(
                              planet.star_distance_au * 1.496e11
                            ).toExponential(4)} m`,
                          },
                          { name: "G", value: "6.674 × 10⁻¹¹ m³/kg·s²" },
                          {
                            name: "M",
                            value: `${(
                              planet.star.mass_solar * 1.989e30
                            ).toExponential(4)} kg`,
                          },
                        ]}
                      />
                    </div>

                    <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Velocitat orbital
                      </h3>
                      <PlanetFormula
                        formula="v = \sqrt{\frac{GM}{r}}"
                        explanation="Velocitat a la qual el planeta orbita al voltant de la seva estrella."
                        result={`${
                          planet.orbitalSpeed?.toFixed(2) || "?"
                        } km/s`}
                        variables={[
                          { name: "G", value: "6.674 × 10⁻¹¹ m³/kg·s²" },
                          {
                            name: "M",
                            value: `${(
                              planet.star.mass_solar * 1.989e30
                            ).toExponential(4)} kg`,
                          },
                          {
                            name: "r",
                            value: `${(
                              planet.star_distance_au * 1.496e11
                            ).toExponential(4)} m`,
                          },
                        ]}
                      />
                    </div>

                    <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Duració del dia
                      </h3>
                      <PlanetFormula
                        formula="T_{dia} = \frac{2\pi}{\omega}"
                        explanation="Temps que tarda el planeta en completar una rotació sobre el seu eix."
                        result={`${planet.dayDurationHours.toFixed(2)} hores`}
                        variables={[
                          {
                            name: "ω",
                            value: `${planet.angularSpeed.toExponential(
                              4
                            )} rad/s`,
                          },
                        ]}
                      />
                    </div>

                    <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Inclinació axial
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-white">
                            {planet.inclination_deg}°
                          </p>
                          <p className="text-sm text-gray-400">
                            Inclinació de l'eix de rotació respecte al pla
                            orbital
                          </p>
                        </div>
                        <div className="relative w-20 h-20">
                          <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full"></div>
                          <div
                            className="absolute w-full h-0.5 bg-blue-500/70 top-1/2 left-0 transform -translate-y-1/2"
                            style={{
                              transform: `translateY(-50%) rotate(${planet.inclination_deg}deg)`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-4">
                        La inclinació axial causa les estacions. Una inclinació
                        de 0° significa que no hi ha estacions, mentre que
                        inclinacions més grans causen estacions més extremes.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Composition Tab */}
              {activeTab === "composition" && (
                <div className="space-y-6">
                  {planet.compounds.length > 0 && (
                    <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Composició de la superfície
                      </h3>
                      <PlanetCompoundChart compounds={planet.compounds} />
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {planet.compounds.map((compound) => (
                          <div
                            key={compound.CID}
                            className="bg-gray-700/50 p-3 rounded-lg border border-gray-600 flex flex-col"
                          >
                            <span className="text-white font-medium">
                              {compound.name}
                            </span>
                            <span className="text-gray-400 text-sm">
                              {compound.formula}
                            </span>
                            <span className="text-blue-300 text-sm mt-1">
                              {Number.parseFloat(compound.percentage).toFixed(
                                1
                              )}
                              %
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {planet.atmosphere?.compounds?.length > 0 && (
                    <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Composició atmosfèrica
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <PlanetDataCard
                          title="Pressió atmosfèrica"
                          value={`${planet.atmosphere.pressure_atm} atm`}
                          description={`${(
                            planet.atmosphere.pressure_atm * 101.325
                          ).toFixed(1)} kPa`}
                          icon={<CloudSun className="h-5 w-5 text-blue-400" />}
                        />
                        <PlanetDataCard
                          title="Factor d'efecte hivernacle"
                          value={Number(
                            planet.atmosphere.greenhouse_factor
                          ).toFixed(2)}
                          description="Capacitat de l'atmosfera per retenir calor"
                          icon={
                            <Thermometer className="h-5 w-5 text-blue-400" />
                          }
                        />
                      </div>
                      <PlanetCompoundChart
                        compounds={planet.atmosphere.compounds}
                        colorScheme="blue"
                      />
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {planet.atmosphere.compounds.map((compound) => (
                          <div
                            key={compound.CID}
                            className="bg-blue-900/30 p-3 rounded-lg border border-blue-800/50 flex flex-col"
                          >
                            <span className="text-white font-medium">
                              {compound.name}
                            </span>
                            <span className="text-gray-400 text-sm">
                              {compound.formula}
                            </span>
                            <span className="text-blue-300 text-sm mt-1">
                              {Number.parseFloat(compound.percentage).toFixed(
                                1
                              )}
                              %
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!planet.compounds.length &&
                    !planet.atmosphere?.compounds?.length && (
                      <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700 text-center">
                        <p className="text-gray-400">
                          No hi ha informació de composició disponible per
                          aquest planeta.
                        </p>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>

          {/* 3D Preview */}
          <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">
              Visualització 3D
            </h2>
            <div className="aspect-[2/1] w-full bg-gray-950/50 rounded-xl overflow-hidden">
              <Planet3DPreview planet={planet} />
            </div>
            <p className="text-gray-400 text-sm mt-3 text-center">
              Pots fer zoom i rotar el planeta utilitzant el ratolí o els gestos
              tàctils
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* System Info */}
          <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">
              Sistema planetari
            </h3>
            <div className="mb-4">
              <SystemCard system={{ ...system, star }} />
            </div>
            <button
              onClick={() =>
                navigate(`/app/systems/${system.planetary_system_id}`)
              }
              className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors mt-4"
            >
              Veure sistema complet
            </button>
          </div>

          {/* Creator Info */}
          <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Creador</h3>
            <UserBadge user={{ ...system, ...system.user }} />
          </div>

          {/* Planet Facts */}
          <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">
              Curiositats
            </h3>
            <div className="space-y-4 text-gray-300">
              {planet.mass_earth > 10 ? (
                <p>
                  <span className="text-blue-400">•</span> Aquest planeta té una
                  massa {planet.mass_earth.toFixed(1)} vegades superior a la
                  Terra, el que el classifica com un gegant.
                </p>
              ) : planet.mass_earth < 0.1 ? (
                <p>
                  <span className="text-blue-400">•</span> Amb només{" "}
                  {(planet.mass_earth * 100).toFixed(1)}% de la massa terrestre,
                  aquest és un planeta molt petit.
                </p>
              ) : null}

              {planet.gravity > 15 ? (
                <p>
                  <span className="text-blue-400">•</span> La gravetat d'aquest
                  planeta és {(planet.gravity / 9.8).toFixed(1)} vegades la de
                  la Terra, fent que qualsevol objecte pesi molt més aquí.
                </p>
              ) : planet.gravity < 3 ? (
                <p>
                  <span className="text-blue-400">•</span> Amb una gravetat de
                  només {(planet.gravity / 9.8).toFixed(2)} vegades la
                  terrestre, saltaries molt més alt en aquest planeta.
                </p>
              ) : null}

              {planet.dayDurationHours > 100 ? (
                <p>
                  <span className="text-blue-400">•</span> Un dia en aquest
                  planeta dura {(planet.dayDurationHours / 24).toFixed(1)} dies
                  terrestres, creant períodes molt llargs de llum i foscor.
                </p>
              ) : planet.dayDurationHours < 10 ? (
                <p>
                  <span className="text-blue-400">•</span> Aquest planeta gira
                  molt ràpidament, completant una rotació en només{" "}
                  {planet.dayDurationHours.toFixed(1)} hores.
                </p>
              ) : null}

              {planet.surfaceTemperature && planet.surfaceTemperature > 373 ? (
                <p>
                  <span className="text-blue-400">•</span> Amb una temperatura
                  de {(planet.surfaceTemperature - 273.15).toFixed(1)}°C,
                  l'aigua líquida no pot existir a la superfície d'aquest
                  planeta.
                </p>
              ) : planet.surfaceTemperature &&
                planet.surfaceTemperature < 273 ? (
                <p>
                  <span className="text-blue-400">•</span> La temperatura
                  mitjana de {(planet.surfaceTemperature - 273.15).toFixed(1)}°C
                  fa que l'aigua estigui congelada a la superfície.
                </p>
              ) : null}

              {planet.moon_count > 5 ? (
                <p>
                  <span className="text-blue-400">•</span> Aquest planeta té{" "}
                  {planet.moon_count} llunes, creant un sistema complex de
                  satèl·lits.
                </p>
              ) : null}

              {planet.has_rings ? (
                <p>
                  <span className="text-blue-400">•</span> Els anells d'aquest
                  planeta són formats per partícules de gel, pols i roques que
                  orbiten al seu voltant.
                </p>
              ) : null}

              <p>
                <span className="text-blue-400">•</span> La velocitat
                d'escapament de {planet.escapeVelocity.toFixed(1)} km/s
                significa que un objecte necessita aquesta velocitat mínima per
                escapar de la gravetat del planeta.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen loading overlay for delete operation */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="bg-gray-900/80 p-8 rounded-2xl border border-red-900/50 flex flex-col items-center">
            <Loader className="h-12 w-12 text-red-500 animate-spin" />
            <p className="mt-4 text-white text-lg font-medium">
              Eliminant planeta...
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
