"use client";

/**
 * Renders a compact data card with an icon, title, value, and optional description.
 * Used to display numerical or descriptive planet-related data.
 */
const PlanetDataCard = ({ title, value, description, icon }) => {
  return (
    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-900/30 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-white text-xl font-semibold">{value}</p>
          {description && (
            <p className="text-gray-400 text-xs mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanetDataCard;
