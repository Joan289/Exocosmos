"use client";

import { useState } from "react";

export default function CanvasHeightToolbar({ onChange }) {
  /**
   * Selected grayscale color for height map drawing
   */
  const [color, setColor] = useState("#888888");

  /**
   * Brush size in pixels
   */
  const [size, setSize] = useState(18);

  /**
   * Brush type: "round", "square", or "spray"
   */
  const [brush, setBrush] = useState("round");

  /**
   * Updates internal state and emits changes to the parent
   * @param {Object} newValues - Partial brush config update
   */
  const handleUpdate = (newValues) => {
    const updated = { color, size, brush, ...newValues };
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-2 text-sm text-white">
      {/* Color (grayscale tones) */}
      <div>
        <label className="block mb-1 text-gray-300">To de gris</label>
        <div className="flex gap-1 flex-wrap">
          {[
            "#000000", // black
            "#444444",
            "#777777",
            "#aaaaaa",
            "#dddddd",
            "#ffffff", // white
          ].map((preset) => (
            <button
              type="button"
              key={preset}
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
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              handleUpdate({ color: e.target.value });
            }}
            className="w-8 h-6 border rounded bg-transparent"
          />
        </div>
      </div>

      {/* Size */}
      <div>
        <label className="block mb-1 text-gray-300">Gruix</label>
        <input
          type="range"
          min="1"
          max="30"
          value={size}
          onChange={(e) => {
            const newSize = Number.parseInt(e.target.value);
            setSize(newSize);
            handleUpdate({ size: newSize });
          }}
          className="w-full"
        />
        <span className="ml-2">{size}px</span>
      </div>

      {/* Brush type */}
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
          <option value="square">Quadrat</option>
          <option value="spray">Spray</option>
        </select>
      </div>
    </div>
  );
}
