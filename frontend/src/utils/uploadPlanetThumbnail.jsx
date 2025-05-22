/**
 * Generates and uploads a 3D thumbnail image for a given planet.
 *
 * The thumbnail is rendered using a 3D scene with lighting and the Planet3DThumbnail component,
 * then converted to a WebP image and uploaded to the backend as a FormData file.
 *
 * @param {Object} params
 * @param {Object} params.planet - The planet object containing at least a `planet_id`
 * @returns {Promise<void>} Resolves when the upload is complete
 */
import { generateWebPFrom3D } from "./generateWebPFrom3D";
import { dataURLToBlob } from "./dataURLToBlob";
import Planet3DThumbnail from "../components/3d/Planet3DThumbnail";

const API_URL = import.meta.env.VITE_API_URL;

export async function uploadPlanetThumbnail({ planet }) {
  // Promise to wait for the 3D rendering to complete
  let readyResolver;
  const readyPromise = new Promise((res) => (readyResolver = res));

  // Generate a WebP image from a 3D rendered component
  const webpDataURL = await generateWebPFrom3D(
    <>
      {/* Lighting setup for rendering */}
      <ambientLight intensity={0.01} />
      <directionalLight position={[10, 0, 0]} intensity={1} />

      {/* 3D planet thumbnail renderer */}
      <Planet3DThumbnail
        planet={planet}
        position={[0, 0, 0]}
        scaleFactor={1000}
        onReady={readyResolver} // triggers the readyPromise when rendering is done
      />
    </>,
    512, // size in pixels
    readyPromise, // wait for 3D scene to be ready
    [17, 5, 5] // camera position
  );

  // Convert the resulting data URL to a binary Blob
  const blob = dataURLToBlob(webpDataURL);

  // Prepare the image as FormData for upload
  const imageData = new FormData();
  imageData.append("file", blob, "thumbnail.webp");

  // Send POST request to upload the thumbnail image
  await fetch(`${API_URL}/upload/planets/${planet.planet_id}/thumbnail`, {
    method: "POST",
    body: imageData,
    credentials: "include", // include cookie for auth
  });
}
