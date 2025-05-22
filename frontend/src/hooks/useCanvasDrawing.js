/**
 * Custom React hook that enables freehand drawing on a canvas element with different brush types.
 *
 * Targets a canvas with the ID "textureCanvas". Supports round, square, and spray brushes.
 * Automatically handles mouse events and adapts to changes in color, size, and brush shape.
 *
 * @param {Object} options
 * @param {string} options.color - Brush color (CSS color string)
 * @param {number} options.size - Brush size in pixels
 * @param {string} options.brush - Brush type: "round", "square", or "spray"
 */
import { useEffect, useRef } from "react";

export function useCanvasDrawing({
  color = "white",
  size = 6,
  brush = "round",
}) {
  const configRef = useRef({ color, size, brush });

  // Update the drawing config whenever props change
  useEffect(() => {
    configRef.current = { color, size, brush };
  }, [color, size, brush]);

  useEffect(() => {
    const canvas = document.getElementById("textureCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let drawing = false;
    let lastX = null;
    let lastY = null;

    /**
     * Handles the actual drawing on the canvas based on the current brush config.
     */
    const draw = (e) => {
      if (!drawing) return;

      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
      const { color, size, brush } = configRef.current;

      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineCap = "round";

      if (brush === "spray") {
        // Spray effect using random points
        for (let i = 0; i < 20; i++) {
          const offsetX = (Math.random() - 0.5) * size * 2;
          const offsetY = (Math.random() - 0.5) * size * 2;
          ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
        }
      } else if (brush === "square") {
        // Draw filled square
        ctx.fillRect(x, y, size, size);
      } else {
        // Default: round brush with smooth line
        ctx.beginPath();
        if (lastX !== null && lastY !== null) {
          ctx.moveTo(lastX, lastY);
        } else {
          ctx.moveTo(x, y);
        }
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      lastX = x;
      lastY = y;
    };

    /**
     * Starts the drawing action on mouse down.
     */
    const start = (e) => {
      drawing = true;
      const rect = canvas.getBoundingClientRect();
      lastX = ((e.clientX - rect.left) / rect.width) * canvas.width;
      lastY = ((e.clientY - rect.top) / rect.height) * canvas.height;
    };

    /**
     * Ends the drawing action on mouse up or mouse out.
     */
    const end = () => {
      drawing = false;
      lastX = null;
      lastY = null;
      ctx.beginPath(); // Reset path
    };

    // Register mouse event listeners
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mouseout", end);
    canvas.addEventListener("mousemove", draw);

    // Cleanup event listeners on unmount
    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mouseup", end);
      canvas.removeEventListener("mouseout", end);
      canvas.removeEventListener("mousemove", draw);
    };
  }, []);
}
