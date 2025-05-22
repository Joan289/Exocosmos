import SystemCard from "../components/cards/SystemCard";
import StarCard from "../components/cards/StarCard";
import PlanetCard from "../components/cards/PlanetCard";

/**
 * Default number of resources to fetch per page for pagination.
 */
export const PAGE_SIZE = 20;

/**
 * Configuration object defining the supported resource types.
 * Each key maps to an object with:
 * - label: UI label in Catalan
 * - endpoint: API path segment
 */
export const RESOURCE_OPTIONS = {
  systems: { label: "Sistemes", endpoint: "planetary-systems" },
  planets: { label: "Planetes", endpoint: "planets" },
  stars: { label: "Estrelles", endpoint: "stars" },
};

/**
 * Maps each resource type to:
 * - a React component to render it
 * - the expected prop name
 * - the unique key field for React rendering
 */
export const RESOURCE_COMPONENTS = {
  systems: {
    component: SystemCard,
    prop: "system",
    keyField: "planetary_system_id",
  },
  planets: {
    component: PlanetCard,
    prop: "planet",
    keyField: "planet_id",
  },
  stars: {
    component: StarCard,
    prop: "star",
    keyField: "star_id",
  },
};

/**
 * Sorting options for star resources.
 */
export const STAR_SORT_OPTIONS = [
  { value: "name", label: "Nom" },
  { value: "mass_solar", label: "Massa solar" },
  { value: "radius_solar", label: "Radi solar" },
];

/**
 * Sorting options for planetary system resources.
 */
export const SYSTEM_SORT_OPTIONS = [
  { value: "planetary_system_id", label: "ID" },
  { value: "name", label: "Nom" },
  { value: "distance_ly", label: "Distància (ly)" },
];

/**
 * Sorting options for planet resources.
 */
export const PLANET_SORT_OPTIONS = [
  { value: "name", label: "Nom" },
  { value: "mass_earth", label: "Massa terrestre" },
  { value: "radius_earth", label: "Radi terrestre" },
  { value: "inclination_deg", label: "Inclinació" },
  { value: "rotation_speed_kms", label: "Velocitat de rotació" },
  { value: "albedo", label: "Albedo" },
  { value: "star_distance_au", label: "Distància a l'estrella" },
  { value: "moon_count", label: "Nombre de llunes" },
];
