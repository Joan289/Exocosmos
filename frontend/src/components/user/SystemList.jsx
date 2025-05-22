"use client";

import SystemCard from "../cards/SystemCard";
import SystemAddCard from "../cards/SystemAddCard";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

/**
 * Renders a grid of planetary systems.
 * Optionally shows a "create system" button and placeholder if no systems exist.
 *
 * @param {Object} props
 * @param {Array} props.systems - List of planetary system objects
 * @param {string} [props.title="Sistemes planetaris"] - Section title
 * @param {boolean} [props.showCreate=false] - Whether to allow creation of new systems
 */
const SystemList = ({
  systems = [],
  title = "Sistemes planetaris",
  showCreate = false,
}) => {
  /**
   * Determines if the user has no systems and creation is disabled
   */
  const hasNoSystems = systems.length === 0;

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">{title}</h3>

        {showCreate && (
          <Link
            to="/app/systems/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
          >
            <Plus className="h-4 w-4" /> Crear sistema
          </Link>
        )}
      </div>

      {hasNoSystems && !showCreate ? (
        <div className="bg-gray-800/50 rounded-xl p-8 text-center">
          <p className="text-gray-400">No té cap sistema creat.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Render each system as a card */}
          {systems.map((system) => (
            <SystemCard key={system.planetary_system_id} system={system} />
          ))}
          {/* Optionally show a card to create a new system */}
          {showCreate && <SystemAddCard />}
        </div>
      )}
    </section>
  );
};

export default SystemList;
