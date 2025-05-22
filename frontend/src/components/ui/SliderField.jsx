"use client";

import { useController } from "react-hook-form";
import { useEffect, useRef } from "react";
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";

/**
 * SliderField is a form-connected numeric range input using noUiSlider,
 * customizable with min/max/step and visual color themes.
 *
 * @param {Object} props
 * @param {string} props.name - Name of the form field
 * @param {string} [props.label] - Optional label for the field
 * @param {Object} props.control - React Hook Form control object
 * @param {number} [props.min=0] - Minimum value
 * @param {number} [props.max=100] - Maximum value
 * @param {number} [props.step=1] - Step increment
 * @param {Object|null} [props.customOptions=null] - Custom noUiSlider config
 * @param {string} [props.className] - Optional wrapper class
 * @param {"purple"|"blue"|"yellow"} [props.color="purple"] - Theme color
 */
export default function SliderField({
  name,
  label,
  control,
  min = 0,
  max = 100,
  step = 1,
  customOptions = null,
  className = "",
  color = "purple",
}) {
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
  });

  const sliderRef = useRef(null);
  const valueRef = useRef(null);

  useEffect(() => {
    if (!sliderRef.current) return;

    const options = customOptions || {
      start: [value || min],
      connect: [true, false],
      range: {
        min: [min],
        max: [max],
      },
      step: step,
    };

    const slider = noUiSlider.create(sliderRef.current, options);

    slider.on("update", (values, handle) => {
      const newValue = Number.parseFloat(values[handle]);
      if (valueRef.current) {
        valueRef.current.textContent = newValue.toFixed(2);
      }
      onChange(newValue);
    });

    return () => {
      slider.destroy();
    };
  }, [min, max, step, onChange, customOptions, value]);

  const colorClasses = {
    purple: {
      bg: "bg-purple-900/30",
      text: "text-purple-300",
    },
    blue: {
      bg: "bg-blue-900/30",
      text: "text-blue-300",
    },
    yellow: {
      bg: "bg-yellow-900/30",
      text: "text-yellow-300",
    },
  };

  const colorStyle = {
    purple: {
      "--slider-bg": "rgba(139, 92, 246, 0.2)",
      "--slider-connect": "rgba(139, 92, 246, 0.6)",
      "--slider-handle": "rgb(139, 92, 246)",
      "--slider-handle-border": "rgb(139, 92, 246)",
      "--slider-handle-shadow": "rgba(139, 92, 246, 0.5)",
    },
    blue: {
      "--slider-bg": "rgba(59, 130, 246, 0.2)",
      "--slider-connect": "rgba(59, 130, 246, 0.6)",
      "--slider-handle": "rgb(59, 130, 246)",
      "--slider-handle-border": "rgb(59, 130, 246)",
      "--slider-handle-shadow": "rgba(59, 130, 246, 0.5)",
    },
    yellow: {
      "--slider-bg": "rgba(234, 179, 8, 0.2)",
      "--slider-connect": "rgba(234, 179, 8, 0.6)",
      "--slider-handle": "rgb(234, 179, 8)",
      "--slider-handle-border": "rgb(234, 179, 8)",
      "--slider-handle-shadow": "rgba(234, 179, 8, 0.5)",
    },
  };

  const selectedColor = colorClasses[color] || colorClasses.purple;
  const selectedStyle = colorStyle[color] || colorStyle.purple;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">{min}</span>
        <span
          ref={valueRef}
          className={`px-3 py-1 ${selectedColor.bg} ${selectedColor.text} rounded-full text-sm font-medium`}
        >
          {Number(value)?.toFixed(2) || min}
        </span>
        <span className="text-sm text-gray-400">{max}</span>
      </div>
      <div ref={sliderRef} className="slider-custom" style={selectedStyle} />
    </div>
  );
}
