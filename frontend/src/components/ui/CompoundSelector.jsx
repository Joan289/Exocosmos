"use client";

import { useEffect, useState } from "react";
import CompoundCard from "../cards/CompoundCard";
import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";
import AddCompoundByName from "../AddCompoundByName";
import { Search, Loader } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
const PAGE_SIZE = 12;

export default function CompoundSelector({
  label,
  selectedCompounds,
  setSelectedCompounds,
}) {
  /**
   * Custom fetch wrapper with auth handling
   */
  const fetch = useFetchWithAuth();

  /**
   * Full list of fetched compounds for current page
   */
  const [compounds, setCompounds] = useState([]);

  /**
   * Filter string used for search
   */
  const [filter, setFilter] = useState("");

  /**
   * Current pagination page
   */
  const [page, setPage] = useState(1);

  /**
   * If there are more pages available
   */
  const [hasMore, setHasMore] = useState(true);

  /**
   * Loading state for async fetch
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Whether user has reached the max number of selected compounds
   */
  const isMaxed = selectedCompounds.length >= 10;

  /**
   * Fetch compounds when page or filter changes
   */
  useEffect(() => {
    setIsLoading(true);

    const query = new URLSearchParams({
      limit: PAGE_SIZE,
      page: page.toString(),
    });

    if (filter.trim()) {
      query.append("search", filter.trim());
    }

    fetch(`${API_URL}/compounds?${query.toString()}`)
      .then((res) => {
        setCompounds(res.data);
        setHasMore(res.data.length === PAGE_SIZE);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading compounds:", err);
        setIsLoading(false);
      });
  }, [fetch, filter, page]);

  /**
   * Adds a compound to the selected list if not already present
   * @param {Object} compound - The compound object to select
   */
  const handleSelect = (compound) => {
    if (isMaxed) return;
    const alreadySelected = selectedCompounds.find(
      (c) => c.CID === compound.CID
    );
    if (!alreadySelected) {
      setSelectedCompounds([...selectedCompounds, compound]);
    }
  };

  /**
   * Updates search filter and resets to page 1
   * @param {Event} e - Input change event
   */
  const handleSearchChange = (e) => {
    setFilter(e.target.value);
    setPage(1);
  };

  return (
    <div className="p-4 border border-gray-700 rounded-lg bg-gray-900/50 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white text-sm font-semibold">{label}</h3>
      </div>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Cerca per nom, fórmula o CID"
          value={filter}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/70 border border-gray-700 text-sm text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader className="h-6 w-6 text-blue-500 animate-spin mr-2" />
          <p className="text-gray-400 text-sm">Carregant compostos...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-1">
            {compounds.map((compound) => (
              <CompoundCard
                key={compound.CID}
                compound={compound}
                onClick={() => handleSelect(compound)}
                disabled={isMaxed}
              />
            ))}

            {compounds.length === 0 && (
              <div className="col-span-3 py-8 text-center text-gray-400">
                No s'han trobat compostos amb aquesta cerca
              </div>
            )}
          </div>

          <div className="flex justify-between mt-4 text-sm">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:text-gray-500"
            >
              ← Anterior
            </button>
            <button
              type="button"
              disabled={!hasMore}
              onClick={() => setPage((p) => p + 1)}
              className="text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:text-gray-500"
            >
              Següent →
            </button>
          </div>
        </>
      )}

      <AddCompoundByName
        onAdd={(compound) =>
          setSelectedCompounds((prev) => [...prev, compound])
        }
        existingCompounds={selectedCompounds}
        disabled={isMaxed}
      />

      {selectedCompounds.length > 0 && (
        <div className="mt-4">
          <h4 className="text-white text-sm font-medium mb-2">Seleccionats:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCompounds.map((compound) => (
              <span
                key={compound.CID}
                className="px-2 py-1 rounded-md bg-blue-900/50 border border-blue-700/50 text-sm text-white"
              >
                {compound.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
