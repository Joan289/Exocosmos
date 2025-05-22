"use client";

import { useEffect, useRef } from "react";
import noUiSlider from "nouislider";
import { X } from "lucide-react";

/**
 * Predefined CSS classes for coloring each slider segment
 */
const SEGMENT_COLORS = Array.from(
  { length: 10 },
  (_, i) => `segment-color-${i}`
);

export default function CompoundDistributionSlider({
  compounds,
  percentages,
  setPercentages,
  onRemoveCompound,
}) {
  /**
   * Ref to the HTML element for initializing the noUiSlider
   */
  const sliderRef = useRef(null);

  /**
   * Initializes the slider or updates it when compound list changes
   */
  useEffect(() => {
    if (!sliderRef.current) return;

    // Destroys previous slider instance if exists
    if (sliderRef.current.noUiSlider) {
      sliderRef.current.noUiSlider.destroy();
    }

    const count = compounds.length;
    if (count < 1) return;

    // Determines the initial positions of the handles
    const initial = [];

    if (percentages.length === count) {
      let acc = 0;
      for (let i = 0; i < count - 1; i++) {
        acc += percentages[i];
        initial.push(acc);
      }
    } else {
      // Fallback: distributes evenly if no valid percentages
      const step = Math.round(100 / count);
      for (let i = 1; i < count; i++) {
        initial.push(i * step);
      }
    }

    // Creates the multi-handle slider
    noUiSlider.create(sliderRef.current, {
      start: initial,
      connect: Array(compounds.length).fill(true),
      range: { min: 0, max: 100 },
      tooltips: true,
      step: 1,
      behaviour: "drag-snap",
    });

    const slider = sliderRef.current.noUiSlider;

    /**
     * Updates the external percentage state on slider change
     * @param {string[]} values - The slider handle positions
     */
    const updatePercentages = (values) => {
      const split = [0, ...values.map(Number), 100];
      const result = [];
      for (let i = 0; i < split.length - 1; i++) {
        result.push(Math.round(split[i + 1] - split[i]));
      }
      setPercentages(result);
    };

    slider.on("update", updatePercentages);
    updatePercentages(initial);

    // Add custom segment colors
    const connects = sliderRef.current.querySelectorAll(".noUi-connect");
    connects.forEach((el, i) => {
      el.className =
        "noUi-connect " +
        (SEGMENT_COLORS[i % SEGMENT_COLORS.length] || "segment-color-fallback");
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compounds]);

  return (
    <div className="mt-4 p-4 border border-gray-700 rounded-lg bg-gray-900/50 backdrop-blur-sm">
      <h4 className="text-white text-sm font-semibold mb-3">
        Distribució dels compostos
      </h4>

      {/* Slider visible només si hi ha més d’un compost */}
      {compounds.length > 1 && <div ref={sliderRef} className="mb-4"></div>}

      <ul className="space-y-2">
        {compounds.map((compound, index) => (
          <li
            key={compound.CID}
            className="flex justify-between items-center text-sm text-white bg-gray-800/50 p-2 rounded-md"
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  SEGMENT_COLORS[index % SEGMENT_COLORS.length]
                }`}
                title={`Color del segment`}
              ></span>

              <span>{compound.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="bg-gray-700 px-2 py-0.5 rounded text-xs">
                {percentages[index] ?? 0}%
              </span>
              <button
                type="button"
                onClick={() => onRemoveCompound(compound.CID)}
                className="text-red-400 hover:text-red-300 transition-colors"
                title="Eliminar compost"
              >
                <X size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
