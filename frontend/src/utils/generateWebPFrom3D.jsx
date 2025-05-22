import React from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";

/**
 * Generates a square transparent .webp thumbnail from 3D JSX content.
 * Waits for an optional external signal (like textures loaded).
 *
 * @param {React.ReactNode} children - JSX elements to render inside the canvas.
 * @param {number} size - Size in pixels (width = height).
 * @param {Promise<void>} [waitUntilReady] - Optional promise to wait before capturing.
 * @param {[number, number, number]} [cameraPosition] - Optional camera position [x, y, z].
 * @returns {Promise<string>} - A dataURL of the generated webp image.
 */
export async function generateWebPFrom3D(
  children,
  size = 512,
  waitUntilReady,
  cameraPosition = [0, 0, 3] // 💡 nueva opción
) {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    container.style.width = `${size}px`;
    container.style.height = `${size}px`;
    container.style.position = "fixed";
    container.style.top = "-10000px";
    document.body.appendChild(container);

    const root = ReactDOM.createRoot(container);

    const SceneWrapper = () => {
      const onCreated = async ({ gl, scene, camera }) => {
        camera.position.set(...cameraPosition);
        camera.lookAt(0, 0, 0);

        gl.setClearColor(0x000000, 0); // fondo transparente

        if (waitUntilReady) {
          await waitUntilReady;
        }

        await new Promise((r) =>
          requestAnimationFrame(() =>
            requestAnimationFrame(() => requestAnimationFrame(r))
          )
        );

        gl.render(scene, camera);
        const webpDataURL = gl.domElement.toDataURL("image/webp");

        resolve(webpDataURL);
        setTimeout(() => {
          root.unmount();
          document.body.removeChild(container);
        }, 100);
      };

      return (
        <Canvas
          dpr={2}
          gl={{ preserveDrawingBuffer: true, alpha: true }}
          onCreated={onCreated}
          camera={{ fov: 50, near: 0.1, far: 100 }}
          style={{ background: "transparent" }}
        >
          {children}
        </Canvas>
      );
    };

    root.render(<SceneWrapper />);
  });
}
