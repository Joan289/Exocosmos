const textureMap = {
  1: "terrestrial.jpg",
  2: "super-earth.jpg",
  3: "neptune-like.jpg",
  4: "gas-giant.jpg",
};

/**
 * Returns the default texture path for a given planet type.
 *
 * @param {number} [type=1] - The planet type ID (1–4). Defaults to 1 if not provided or invalid.
 * @returns {string} The relative path to the corresponding texture image
 */
export function getDefaultTextureForType(type = 1) {
  const filename = textureMap[type] || textureMap[1];
  return `/images/textures/base/${filename}`;
}
