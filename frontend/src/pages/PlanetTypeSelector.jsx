"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import PlanetCreate from "./PlanetCreate";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";
import { Loader, AlertCircle, ArrowLeft, Globe, Info } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

// Predefined planet type metadata used for display and merging with backend data
const PLANET_TYPES = [
  {
    id: 1,
    nom: "Terrestres",
    descripcio:
      "Planetes rocosos com la Terra o Mart, formats principalment per roques i metalls.",
    image: "/images/planets/terrestrial.webp",
    color: "from-blue-900/40 to-green-900/40",
    borderColor: "border-blue-700/50",
    hoverColor: "group-hover:border-blue-500/70",
  },
  {
    id: 2,
    nom: "Superterres",
    descripcio:
      "Més massius que la Terra però més lleugers que els gegants de gas. Poden ser rocosos o amb atmosferes denses.",
    image: "/images/planets/super-earth.webp",
    color: "from-teal-900/40 to-blue-900/40",
    borderColor: "border-teal-700/50",
    hoverColor: "group-hover:border-teal-500/70",
  },
  {
    id: 3,
    nom: "Tipus Neptú",
    descripcio:
      "Planetes gelats amb atmosferes espesses, semblants a Urà o Neptú. No tenen superfície sòlida clara.",
    image: "/images/planets/neptune-like.webp",
    color: "from-blue-900/40 to-indigo-900/40",
    borderColor: "border-blue-700/50",
    hoverColor: "group-hover:border-blue-500/70",
  },
  {
    id: 4,
    nom: "Gegants gasosos",
    descripcio:
      "Enormes planetes de gas com Júpiter o Saturn, compostos principalment d'hidrogen i heli.",
    image: "/images/planets/gas-giant.webp",
    color: "from-orange-900/40 to-yellow-900/40",
    borderColor: "border-orange-700/50",
    hoverColor: "group-hover:border-orange-500/70",
  },
  {
    id: 5,
    nom: "Altres",
    descripcio:
      "Planetes que no encaixen bé en cap categoria concreta, incloent mons exòtics o inclassificables — és el que més llibertat et dona per crear.",
    image: "/images/planets/other.webp",
    color: "from-purple-900/40 to-pink-900/40",
    borderColor: "border-purple-700/50",
    hoverColor: "group-hover:border-purple-500/70",
  },
];

/**
 * Component to select a planet type before creating a new planet.
 * Supports direct access with `?type=X` to preselect a type.
 */
export default function PlanetTypeSelector() {
  const [selectedType, setSelectedType] = useState(null); // Stores selected planet type data
  const [loading, setLoading] = useState(false); // Whether data is loading
  const [searchParams] = useSearchParams(); // For reading query params like ?type=3
  const [error, setError] = useState(null); // To show errors to the user

  const fetch = useFetchWithAuth();
  const navigate = useNavigate();
  const { systemId } = useParams(); // Extract planetary system ID from route

  /**
   * Support direct navigation with ?type=3.
   * If a type is specified in query, try to load it directly.
   */
  useEffect(() => {
    const typeId = searchParams.get("type");
    if (!typeId) return;

    const fetchFromQueryParam = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/planet-types/${typeId}`);
        if (res.status !== "success")
          throw new Error("Tipus de planeta no trobat.");
        const data = res.data;

        const meta = PLANET_TYPES.find((t) => t.id === Number(typeId));
        const merged = {
          ...data,
          nom: meta?.nom ?? "",
          descripcio: meta?.descripcio ?? "",
        };

        setSelectedType(merged);
      } catch (err) {
        console.error("Error carregant tipus des de ?type=", err);
        setError("No s'ha pogut carregar el tipus especificat.");
      } finally {
        setLoading(false);
      }
    };

    fetchFromQueryParam();
  }, [searchParams, fetch]);

  // If a planet type is already selected, render the creation form directly
  if (selectedType) {
    return <PlanetCreate planetType={selectedType} systemId={systemId} />;
  }

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <button
        onClick={() => navigate(`/app/systems/${systemId}`)}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={18} /> Tornar al sistema
      </button>

      <div className="bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-800 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center">
            <Globe className="h-5 w-5 text-blue-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Selecciona un tipus de planeta
          </h1>
        </div>

        <div className="flex items-start gap-3 mb-6 bg-blue-900/20 border border-blue-800/50 rounded-lg p-4">
          <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-blue-200 text-sm">
            Cada tipus de planeta té característiques diferents. Selecciona el
            que millor s'adapti al planeta que vols crear.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-400 h-5 w-5 mt-0.5 flex-shrink-0" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader className="h-8 w-8 text-blue-500 animate-spin" />
            <p className="ml-3 text-lg text-gray-300">
              Carregant tipus de planeta...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLANET_TYPES.map((type) => (
              <div
                key={type.id}
                onClick={async () => {
                  navigate(`/app/planets/${systemId}/create?type=${type.id}`);
                  setLoading(true);
                  setError(null);
                  try {
                    const res = await fetch(
                      `${API_URL}/planet-types/${type.id}`
                    );
                    if (res.status !== "success")
                      throw new Error("No s'ha pogut carregar el tipus.");
                    const fullType = res.data;
                    const merged = {
                      ...fullType,
                      nom: type.nom,
                      descripcio: type.descripcio,
                    };
                    setSelectedType(merged);
                  } catch (err) {
                    console.error(err);
                    setError("Error carregant el tipus seleccionat.");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="group cursor-pointer bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-600/50 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg hover:shadow-blue-900/20"
              >
                <div
                  className={`aspect-square bg-gradient-to-br ${type.color} relative overflow-hidden`}
                >
                  <img
                    src={type.image || "/placeholder.svg"}
                    alt={type.nom}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <h2 className="text-xl font-bold text-white">{type.nom}</h2>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-300 text-sm">{type.descripcio}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
