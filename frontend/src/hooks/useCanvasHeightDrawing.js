/**
 * Custom React hook for enabling drawing on the height map canvas (`#heightCanvas`).
 *
 * Initializes the canvas with a default fill and sets up freehand drawing
 * using different brush types: "round", "square", and "spray".
 *
 * Used to simulate elevation in a planet's surface by encoding intensity in grayscale.
 *
 * @param {Object} options
 * @param {string} options.color - Drawing color (typically grayscale)
 * @param {number} options.size - Brush size in pixels
 * @param {string} options.brush - Brush type: "round", "square", or "spray"
 */
import { useEffect, useRef } from "react";

export function useCanvasHeightDrawing({
  color = "#888888",
  size = 6,
  brush = "round",
}) {
  const configRef = useRef({ color, size, brush });

  // Update brush config on prop change
  useEffect(() => {
    configRef.current = { color, size, brush };
  }, [color, size, brush]);

  useEffect(() => {
    const canvas = document.getElementById("heightCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Fill entire canvas with a default flat color
    ctx.fillStyle = "#888888";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let drawing = false;
    let lastX = null;
    let lastY = null;

    /**
     * Main drawing function, called on mouse move.
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
        // Spray random dots in the brush area
        for (let i = 0; i < 20; i++) {
          const offsetX = (Math.random() - 0.5) * size * 2;
          const offsetY = (Math.random() - 0.5) * size * 2;
          ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
        }
      } else if (brush === "square") {
        // Square brush
        ctx.fillRect(x, y, size, size);
      } else {
        // Round brush with fluid stroke
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
     * Start drawing on mouse down.
     */
    const start = (e) => {
      drawing = true;
      const rect = canvas.getBoundingClientRect();
      lastX = ((e.clientX - rect.left) / rect.width) * canvas.width;
      lastY = ((e.clientY - rect.top) / rect.height) * canvas.height;
    };

    /**
     * End drawing on mouse up or out.
     */
    const end = () => {
      drawing = false;
      lastX = null;
      lastY = null;
      ctx.beginPath(); // reset path
    };

    // Attach mouse events
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mouseout", end);
    canvas.addEventListener("mousemove", draw);

    // Cleanup on unmount
    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mouseup", end);
      canvas.removeEventListener("mouseout", end);
      canvas.removeEventListener("mousemove", draw);
    };
  }, []);
}
