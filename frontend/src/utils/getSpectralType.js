export const spectralTypes = {
  M: { tempMax: 3700 },
  K: { tempMax: 5200 },
  G: { tempMax: 6000 },
  F: { tempMax: 7500 },
  A: { tempMax: 10000 },
  B: { tempMax: 30000 },
  O: { tempMax: Infinity },
};

/**
 * Determines the spectral type of a star based on its surface temperature.
 *
 * Spectral types are assigned using predefined temperature upper bounds.
 *
 * @param {number} temperature - The star's temperature in Kelvin
 * @returns {string} A spectral type letter (e.g. "G", "M", etc.) or "?" if not matched
 */
export function getSpectralType(temperature) {
  const match = Object.entries(spectralTypes).find(
    ([, data]) => temperature < data.tempMax
  );
  return match?.[0] || "?";
}
