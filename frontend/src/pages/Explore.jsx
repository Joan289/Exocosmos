"use client";

import { useEffect, useState } from "react";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";
import {
  RESOURCE_COMPONENTS,
  RESOURCE_OPTIONS,
  PAGE_SIZE,
  STAR_SORT_OPTIONS,
  PLANET_SORT_OPTIONS,
  SYSTEM_SORT_OPTIONS,
} from "../constants/explore";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  ArrowUpDown,
  Filter,
  Loader,
  Circle as Planet,
  Star,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Explore component handles listing and filtering of systems, stars, and planets.
 * It supports pagination, sorting, and switching between resource types.
 */
export default function Explore() {
  const fetch = useFetchWithAuth();
  const navigate = useNavigate();
  const { resourceType: paramResource } = useParams();

  // Determine initial resource type from URL or default to "systems"
  const initialType = RESOURCE_OPTIONS[paramResource]
    ? paramResource
    : "systems";

  // Component state
  const [resourceType, setResourceType] = useState(initialType);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState(
    initialType === "stars"
      ? "name"
      : initialType === "planets"
      ? "planet_id"
      : "planetary_system_id"
  );
  const [isDescending, setIsDescending] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const endpoint = RESOURCE_OPTIONS[resourceType].endpoint;

  // Sync state with route parameter when it changes
  useEffect(() => {
    if (RESOURCE_OPTIONS[paramResource] && paramResource !== resourceType) {
      setResourceType(paramResource);
      setPage(1);
      setSearch("");
      setItems([]);
      setSortField(
        paramResource === "stars"
          ? "name"
          : paramResource === "planets"
          ? "planet_id"
          : "planetary_system_id"
      );
      setIsDescending(false);
    }
  }, [paramResource, resourceType]);

  // Fetch resource list when filters change
  useEffect(() => {
    if (RESOURCE_OPTIONS[paramResource] && paramResource !== resourceType) {
      return;
    }

    setItems([]);
    setIsLoading(true);

    const sort = isDescending ? `-${sortField}` : sortField;

    const query = new URLSearchParams({
      limit: PAGE_SIZE,
      page: page.toString(),
      sort,
    });

    if (search.trim()) query.append("search", search.trim());

    fetch(`${API_URL}/${endpoint}?${query.toString()}`)
      .then((res) => {
        setItems(res.data);
        setHasMore(res.data.length === PAGE_SIZE);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading items:", err);
        setIsLoading(false);
      });
  }, [
    fetch,
    resourceType,
    search,
    page,
    sortField,
    isDescending,
    endpoint,
    paramResource,
  ]);

  // Handle input change in search bar
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Change resource type via navigation
  const handleChangeResource = (type) => {
    if (isLoading || type === resourceType) return;
    navigate(`/app/explore/${type}`);
  };

  // Determine which sorting options to show based on resource
  const sortOptions =
    resourceType === "stars"
      ? STAR_SORT_OPTIONS
      : resourceType === "planets"
      ? PLANET_SORT_OPTIONS
      : SYSTEM_SORT_OPTIONS;

  // Get icon for each resource type
  const getResourceIcon = (type) => {
    switch (type) {
      case "systems":
        return <Globe className="w-5 h-5" />;
      case "stars":
        return <Star className="w-5 h-5" />;
      case "planets":
        return <Planet className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-scree">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-gray-900/70 backdrop-blur-md rounded-2xl border border-gray-800 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Search className="h-7 w-7 text-purple-400" />
              Explora
            </h1>

            {/* Resource Type Tabs */}
            <div className="flex overflow-x-auto hide-scrollbar p-1">
              <div className="inline-flex bg-gray-800/50 rounded-lg p-1">
                {Object.entries(RESOURCE_OPTIONS).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => handleChangeResource(key)}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      resourceType === key
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    } ${
                      isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    {getResourceIcon(key)}
                    {label}
                    {resourceType === key && isLoading && (
                      <Loader className="ml-1 h-3 w-3 animate-spin" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Cerca pel nom..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-400"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/70 hover:bg-gray-700 border border-gray-700 rounded-lg text-white transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span className="hidden sm:inline">Filtres</span>
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-300">Ordenar per:</label>
                  <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {sortOptions.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setIsDescending((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  {isDescending ? "Descendent" : "Ascendent"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-gray-900/70 backdrop-blur-md rounded-2xl border border-gray-800 p-6 min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Resultats</h2>
            <div className="text-sm text-gray-400">
              {items.length > 0 && (
                <span>
                  Mostrant {items.length}{" "}
                  {items.length === 1 ? "resultat" : "resultats"}
                </span>
              )}
            </div>
          </div>

          <div className="w-full min-h-[400px]">
            {isLoading ? (
              <div className="w-full h-full flex flex-col items-center justify-center py-16">
                <Loader className="h-10 w-10 text-purple-500 animate-spin mb-4" />
                <p className="text-gray-400">Carregant resultats...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  No s'han trobat resultats
                </h3>
                <p className="text-gray-400 max-w-md">
                  Prova amb una altra cerca o canvia els filtres per trobar el
                  que estàs buscant.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => {
                  const {
                    component: CardComponent,
                    prop,
                    keyField,
                  } = RESOURCE_COMPONENTS[resourceType];

                  const uniqueKey = `${resourceType}-${uuidv4()}`;

                  return (
                    <div key={uniqueKey} className="flex-1 h-full">
                      <CardComponent {...{ [prop]: item }} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && items.length > 0 && (
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-800">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  page === 1
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-white bg-gray-800 hover:bg-gray-700 active:bg-gray-600"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </button>

              <span className="text-gray-400">Pàgina {page}</span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasMore}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  !hasMore
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-white bg-gray-800 hover:bg-gray-700 active:bg-gray-600"
                }`}
              >
                Següent
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
