"use client";

import { useEffect, useRef } from "react";

const SEGMENT_COLORS = {
  default: [
    "#dc2626", // red-600
    "#f97316", // orange-500
    "#facc15", // yellow-400
    "#22c55e", // green-500
    "#2dd4bf", // teal-400
    "#3b82f6", // blue-500
    "#6366f1", // indigo-500
    "#8b5cf6", // purple-500
    "#ec4899", // pink-500
    "#a3a3a3", // gray-400
  ],
  blue: [
    "#3b82f6", // blue-500
    "#60a5fa", // blue-400
    "#93c5fd", // blue-300
    "#2563eb", // blue-600
    "#1d4ed8", // blue-700
    "#38bdf8", // sky-400
    "#0ea5e9", // sky-500
    "#0284c7", // sky-600
    "#0369a1", // sky-700
    "#7dd3fc", // sky-300
  ],
};

/**
 * Renders a donut chart to visualize the distribution of compounds in a planet.
 * @param {Object} props
 * @param {Array} props.compounds - List of compound objects with { name, percentage, CID }
 * @param {string} props.colorScheme - Color scheme name: "default" | "blue"
 */
const PlanetCompoundChart = ({ compounds, colorScheme = "default" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !compounds || compounds.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const colors = SEGMENT_COLORS[colorScheme] || SEGMENT_COLORS.default;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sort compounds by percentage (descending)
    const sortedCompounds = [...compounds].sort(
      (a, b) => b.percentage - a.percentage
    );

    // Draw pie chart
    let startAngle = 0;
    sortedCompounds.forEach((compound, index) => {
      const percentage = Number.parseFloat(compound.percentage);
      const sliceAngle = (percentage / 100) * 2 * Math.PI;

      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        canvas.height / 2 - 10,
        startAngle,
        startAngle + sliceAngle
      );
      ctx.closePath();

      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();

      // Add a subtle border
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Add label if slice is big enough
      if (percentage > 5) {
        const labelAngle = startAngle + sliceAngle / 2;
        const labelRadius = canvas.height / 2 - 40;
        const labelX = canvas.width / 2 + Math.cos(labelAngle) * labelRadius;
        const labelY = canvas.height / 2 + Math.sin(labelAngle) * labelRadius;

        ctx.fillStyle = "white";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${percentage.toFixed(0)}%`, labelX, labelY);
      }

      startAngle += sliceAngle;
    });

    // Draw center circle (for donut chart effect)
    ctx.beginPath();
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      canvas.height / 4,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "#1f2937"; // bg-gray-800
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [compounds, colorScheme]);

  if (!compounds || compounds.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      <div className="w-40 h-40 flex-shrink-0">
        <canvas
          ref={canvasRef}
          width="200"
          height="200"
          className="w-full h-full"
        ></canvas>
      </div>
      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
        {compounds.map((compound, index) => {
          const colors = SEGMENT_COLORS[colorScheme] || SEGMENT_COLORS.default;
          return (
            <div key={compound.CID} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-sm text-gray-300">
                {compound.name} (
                {Number.parseFloat(compound.percentage).toFixed(1)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanetCompoundChart;
