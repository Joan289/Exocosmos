/**
 * Generates and uploads a 3D thumbnail image for a given star.
 *
 * The star is rendered as a 3D object, converted to a WebP image,
 * and then uploaded to the backend using a multipart FormData POST request.
 *
 * @param {Object} params
 * @param {Object} params.star - The star object containing at least a `star_id`
 * @returns {Promise<void>} Resolves once the upload is complete
 */
import { generateWebPFrom3D } from "./generateWebPFrom3D";
import { dataURLToBlob } from "./dataURLToBlob";
import Star3D from "../components/3d/Star3D";

const API_URL = import.meta.env.VITE_API_URL;

export async function uploadStarThumbnail({ star }) {
  // Force radius to ensure consistent visual scale in thumbnails
  star.radius_solar = 1.5;

  // Render the star to a WebP image using the 3D component
  const webpDataURL = await generateWebPFrom3D(
    <Star3D star={star} position={[0, 0, 0]} scaleFactor={1_000_000} />
  );

  // Convert the base64 image to a Blob
  const blob = dataURLToBlob(webpDataURL);

  // Prepare the FormData for upload
  const imageData = new FormData();
  imageData.append("file", blob, "thumbnail.webp");

  // Upload the thumbnail to the backend
  await fetch(`${API_URL}/upload/stars/${star.star_id}/thumbnail`, {
    method: "POST",
    body: imageData,
    credentials: "include", // Necessary for cookie-based authentication
  });
}
