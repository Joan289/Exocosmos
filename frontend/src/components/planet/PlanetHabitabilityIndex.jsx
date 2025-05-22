"use client";

/**
 * Displays a visual indicator and label for a planet's habitability score.
 */
const PlanetHabitabilityIndex = ({ score }) => {
  // Determine color based on score
  const getColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-green-600";
    if (score >= 40) return "bg-yellow-500";
    if (score >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  // Determine label based on score
  const getLabel = (score) => {
    if (score >= 80) return "Molt habitable";
    if (score >= 60) return "Habitable";
    if (score >= 40) return "Moderadament habitable";
    if (score >= 20) return "Poc habitable";
    return "No habitable";
  };

  const color = getColor(score);
  const label = getLabel(score);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-sm">No habitable</span>
        <span className="text-white font-semibold">{score}/100</span>
        <span className="text-gray-400 text-sm">Molt habitable</span>
      </div>
      <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <div className="text-center">
        <span
          className={`text-sm font-medium ${color.replace("bg-", "text-")}`}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default PlanetHabitabilityIndex;
