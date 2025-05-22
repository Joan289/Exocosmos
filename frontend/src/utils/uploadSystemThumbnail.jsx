import { generateWebPFrom3D } from "./generateWebPFrom3D";
import { dataURLToBlob } from "./dataURLToBlob";
import Star3D from "../components/3d/Star3D";
import Planet3DThumbnail from "../components/3d/Planet3DThumbnail";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Generates and uploads a thumbnail image for a planetary system,
 * rendering the central star and up to 3 planets using a 3D scene.
 *
 * The rendered image is converted to WebP format and uploaded
 * to the API endpoint associated with the system.
 *
 * @param {Object} params
 * @param {Object} params.system - A PlanetarySystemFull object with star and planets
 * @throws Will throw an error if the system is missing a star or ID
 */
export async function uploadSystemThumbnail({ system }) {
  if (!system?.star || !system?.planetary_system_id) {
    throw new Error("Falta estrella o ID del sistema");
  }

  let readyCount = 0; // Track when all 3D objects are ready

  // Promise that resolves once all Planet3D components have called onReady
  let readyResolver;
  const readyPromise = new Promise((res) => (readyResolver = res));

  // Normalize star appearance for consistency
  const star = system.star;
  star.radius_solar = 20;

  // Limit to 3 planets for thumbnail purposes
  const planets = system.planets?.slice(0, 3) ?? [];
  const totalPlanets = planets.length;

  // If there are no planets, resolve immediately
  if (totalPlanets === 0) {
    readyResolver();
  }

  /**
   * Called by each Planet3DThumbnail once it's ready in the scene.
   * Resolves the promise when all have reported readiness.
   */
  function handleReady() {
    readyCount++;
    if (readyCount === totalPlanets) {
      readyResolver();
    }
  }

  // Generate a WebP image by rendering the star and planets in a 3D scene
  const webpDataURL = await generateWebPFrom3D(
    <>
      {/* Lighting for the 3D scene */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} />

      {/* Central star */}
      <Star3D star={star} position={[-20, 0, 0]} scaleFactor={1_000_000} />

      {/* Up to 3 planets, spaced horizontally */}
      {planets[0] && (
        <Planet3DThumbnail
          planet={planets[0]}
          position={[2, -1, 3]}
          scaleFactor={1000}
          onReady={handleReady}
        />
      )}

      {planets[1] && (
        <Planet3DThumbnail
          planet={planets[1]}
          position={[12, -2, -5]}
          scaleFactor={1000}
          onReady={handleReady}
        />
      )}

      {planets[2] && (
        <Planet3DThumbnail
          planet={planets[2]}
          position={[19, -3, 3]}
          scaleFactor={1000}
          onReady={handleReady}
        />
      )}
    </>,
    512, // Output image size in pixels
    readyPromise, // Wait for all planet components to be ready
    [25, 0, 0] // Camera position
  );

  // Convert the rendered data URL to a binary blob
  const blob = dataURLToBlob(webpDataURL);

  // Prepare image as FormData for upload
  const imageData = new FormData();
  imageData.append("file", blob, "thumbnail.webp");

  // Upload the image to the backend
  await fetch(
    `${API_URL}/upload/planetary_systems/${system.planetary_system_id}/thumbnail`,
    {
      method: "POST",
      body: imageData,
      credentials: "include", // Required for cookie-based auth
    }
  );
}
