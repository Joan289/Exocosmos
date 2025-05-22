"use client";

import { Link } from "react-router-dom";
import PlanetCard from "../cards/PlanetCard";
import PlanetAddCard from "../cards/PlanetAddCard";
import { Plus } from "lucide-react";

/**
 * Displays a grid of planet cards for a given planetary system.
 * Optionally shows a button to create new planets.
 *
 * @param {Object} props
 * @param {Array} props.planets - List of planet objects to display.
 * @param {boolean} props.showCreate - Whether to show the "Add Planet" button.
 * @param {number} props.systemId - ID of the planetary system.
 */
const PlanetList = ({ planets = [], showCreate = false, systemId }) => {
  const hasNoPlanets = planets.length === 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        {showCreate && (
          <Link
            to={`/app/planets/${systemId}/create`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
          >
            <Plus className="h-4 w-4" /> Afegir planeta
          </Link>
        )}
      </div>

      {hasNoPlanets ? (
        <div className="bg-gray-800/50 rounded-xl p-8 text-center">
          <p className="text-gray-400">Aquest sistema encara no té planetes.</p>
          {showCreate && (
            <Link
              to={`/app/planets/${systemId}/create`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm mt-4"
            >
              <Plus className="h-4 w-4" /> Afegir el primer planeta
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {planets.map((planet) => (
            <PlanetCard key={planet.planet_id} planet={planet} />
          ))}
          {showCreate && <PlanetAddCard systemId={systemId} />}
        </div>
      )}
    </div>
  );
};

export default PlanetList;
