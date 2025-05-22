/**
 * Normalizes and sanitizes raw planet data to ensure consistent types and default values.
 *
 * - Converts strings or nulls to proper numbers and booleans.
 * - Ensures compound and atmosphere data are well-formed arrays.
 * - Provides sensible defaults for optional or missing fields.
 *
 * @param {Object} planet - The raw planet data (possibly from an API or form)
 * @returns {Object} The normalized planet object with clean, typed fields
 */
export default function normalizePlanetData(planet) {
  return {
    ...planet,
    has_rings: Boolean(planet.has_rings),
    moon_count: planet.moon_count !== null ? Number(planet.moon_count) : 0,
    mass_earth: Number(planet.mass_earth),
    radius_earth: Number(planet.radius_earth),
    inclination_deg: Number(planet.inclination_deg),
    rotation_speed_kms: Number(planet.rotation_speed_kms),
    albedo: Number(planet.albedo),
    star_distance_au: Number(planet.star_distance_au),

    compounds:
      planet.compounds?.map((c) => ({
        CID: c.CID,
        percentage: Number(c.percentage),
      })) ?? [],

    atmosphere: {
      texture_url: planet.atmosphere?.texture_url ?? "",
      pressure_atm: Number(planet.atmosphere?.pressure_atm ?? 1),
      greenhouse_factor: Number(planet.atmosphere?.greenhouse_factor ?? 0.5),
      compounds:
        planet.atmosphere?.compounds?.map((c) => ({
          CID: c.CID,
          percentage: Number(c.percentage),
        })) ?? [],
    },
  };
}
