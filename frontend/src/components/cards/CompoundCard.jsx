"use client";

export default function CompoundCard({ compound, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`text-left p-2 border border-gray-700 rounded bg-gray-800/50 hover:bg-gray-800 transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <div className="text-xs font-medium text-white truncate">
        {compound.name}
      </div>
      <div className="text-xs text-gray-400 truncate">
        {compound.formula || "—"}
      </div>
    </button>
  );
}
