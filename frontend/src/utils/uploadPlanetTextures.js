/**
 * Uploads planet texture images (surface, atmosphere, and optionally height map)
 * by extracting them from canvas elements and sending them to the backend.
 *
 * @param {Object} params
 * @param {number} params.planetId - The ID of the planet to associate textures with
 * @param {boolean} params.hasSurface - Whether the planet has a surface texture and height map
 */
export const uploadPlanetTextures = async ({ planetId, hasSurface }) => {
  // Get references to the canvas elements by their IDs
  const textureCanvas = document.getElementById("textureCanvas");
  const atmosphereCanvas = document.getElementById("atmosphereCanvas");
  const heightCanvas = hasSurface
    ? document.getElementById("heightCanvas")
    : null;

  /**
   * Converts a canvas element to a WebP file blob.
   *
   * @param {HTMLCanvasElement} canvas
   * @returns {Promise<File>} A promise that resolves to a File object
   */
  const getBlobFromCanvas = (canvas) =>
    new Promise((resolve) =>
      canvas.toBlob(
        (blob) => {
          const file = new File([blob], "canvas.webp", { type: "image/webp" });
          resolve(file);
        },
        "image/webp",
        0.92 // quality
      )
    );

  /**
   * Uploads a blob to the server under a specific texture type.
   *
   * @param {string} type - Texture type: "surface", "atmosphere", or "height"
   * @param {Blob} blob - Image blob to upload
   * @returns {Promise<string>} URL of the uploaded texture
   * @throws Will throw an object with message, details, and status if the upload fails
   */
  const uploadImage = async (type, blob) => {
    const formData = new FormData();
    formData.append("file", blob);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/upload/planets/${planetId}/${type}`,
      {
        method: "POST",
        body: formData,
        credentials: "include", // Required for cookie-based auth
      }
    );

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw {
        message: error.message || `Error subiendo ${type}`,
        details: error.details || null,
        status: res.status,
      };
    }

    const data = await res.json();
    return data.url;
  };

  // Convert each canvas to a WebP file blob
  const surfaceBlob = await getBlobFromCanvas(textureCanvas);
  const atmosphereBlob = await getBlobFromCanvas(atmosphereCanvas);
  const heightBlob = hasSurface ? await getBlobFromCanvas(heightCanvas) : null;

  // Upload required textures
  await uploadImage("surface", surfaceBlob);
  await uploadImage("atmosphere", atmosphereBlob);

  // Upload height map only if applicable
  if (hasSurface && heightBlob) {
    await uploadImage("height", heightBlob);
  }
};
