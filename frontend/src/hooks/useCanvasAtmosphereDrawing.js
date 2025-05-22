/**
 * Custom React hook for drawing atmospheric effects on the `#atmosphereCanvas` element.
 *
 * Supports multiple brush types ("round", "square", "spray") and responds to mouse input.
 * Designed to render translucent overlays that simulate gas layers, clouds, etc.
 *
 * @param {Object} options
 * @param {string} options.color - Brush color (supports transparency)
 * @param {number} options.size - Brush size in pixels
 * @param {string} options.brush - Brush type: "round", "square", or "spray"
 */
import { useEffect, useRef } from "react";

export function useCanvasAtmosphereDrawing({
  color = "rgba(255,255,255,0.4)",
  size = 20,
  brush = "round",
}) {
  const configRef = useRef({ color, size, brush });

  // Keep config updated with latest props
  useEffect(() => {
    configRef.current = { color, size, brush };
  }, [color, size, brush]);

  useEffect(() => {
    const canvas = document.getElementById("atmosphereCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let drawing = false;
    let lastX = null;
    let lastY = null;

    /**
     * Handles drawing onto the canvas when mouse is moved while drawing.
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
        // Randomized spray effect for texture
        for (let i = 0; i < 20; i++) {
          const offsetX = (Math.random() - 0.5) * size * 2;
          const offsetY = (Math.random() - 0.5) * size * 2;
          ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
        }
      } else if (brush === "square") {
        // Simple square brush
        ctx.fillRect(x, y, size, size);
      } else {
        // Default: round brush with stroke
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
     * Activates drawing and records initial position.
     */
    const start = (e) => {
      drawing = true;
      const rect = canvas.getBoundingClientRect();
      lastX = ((e.clientX - rect.left) / rect.width) * canvas.width;
      lastY = ((e.clientY - rect.top) / rect.height) * canvas.height;
    };

    /**
     * Ends drawing and resets stroke path.
     */
    const end = () => {
      drawing = false;
      lastX = null;
      lastY = null;
      ctx.beginPath();
    };

    // Event listeners for mouse drawing
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
