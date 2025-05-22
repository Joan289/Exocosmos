"use client";

import { useState } from "react";

export default function AtmosphereToolbar({ onChange }) {
  /**
   * Current RGBA color for atmospheric drawing
   */
  const [color, setColor] = useState("rgba(255,255,255,0.5)");

  /**
   * Brush size in pixels
   */
  const [size, setSize] = useState(20);

  /**
   * Brush type: "round" or "spray"
   */
  const [brush, setBrush] = useState("round");

  /**
   * Updates local state and calls the onChange callback with updated config
   * @param {Object} values - Partial values to update (color, size, brush)
   */
  const handleUpdate = (values) => {
    const updated = { color, size, brush, ...values };
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-2 text-sm text-white">
      {/* Color selector */}
      <div>
        <label className="block mb-1 text-gray-300">Color</label>
        <div className="flex gap-1 flex-wrap">
          {[
            "rgba(255,255,255,0.3)", // translucent white
            "rgba(135,206,235,0.4)", // sky blue
            "rgba(173,216,230,0.4)", // light blue
            "rgba(0,255,255,0.3)", // cyan
            "rgba(255,255,0,0.2)", // yellow haze
          ].map((preset) => (
            <button
              key={preset}
              type="button"
              className="w-6 h-6 rounded-full border border-gray-600"
              style={{ backgroundColor: preset }}
              onClick={() => {
                setColor(preset);
                handleUpdate({ color: preset });
              }}
            />
          ))}
          <input
            type="color"
            onChange={(e) => {
              const rgba = hexToRgba(e.target.value, 0.3);
              setColor(rgba);
              handleUpdate({ color: rgba });
            }}
            className="w-8 h-6 border rounded bg-transparent"
          />
        </div>
      </div>

      {/* Size slider */}
      <div>
        <label className="block mb-1 text-gray-300">Gruix</label>
        <input
          type="range"
          min="5"
          max="50"
          value={size}
          onChange={(e) => {
            const s = Number.parseInt(e.target.value);
            setSize(s);
            handleUpdate({ size: s });
          }}
          className="w-full"
        />
        <span className="ml-2">{size}px</span>
      </div>

      {/* Brush selector */}
      <div>
        <label className="block mb-1 text-gray-300">Tipus de pinzell</label>
        <select
          value={brush}
          onChange={(e) => {
            setBrush(e.target.value);
            handleUpdate({ brush: e.target.value });
          }}
          className="bg-gray-800 border border-gray-600 px-2 py-1 rounded w-full"
        >
          <option value="round">Rodó</option>
          <option value="spray">Spray</option>
        </select>
      </div>
    </div>
  );
}

/**
 * Converts a HEX color string to an RGBA string with given alpha
 * @param {string} hex - Color in hex format (e.g. "#aabbcc")
 * @param {number} alpha - Alpha transparency (0 to 1)
 * @returns {string} - RGBA string (e.g. "rgba(170,187,204,0.5)")
 */
function hexToRgba(hex, alpha = 1) {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
