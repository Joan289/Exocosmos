import { useMemo, useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import { EARTH_RADIUS_KM } from "../../constants/astro";
import Ring from "./Ring";
import * as THREE from "three";
import { getDefaultTextureForType } from "../../utils/getDefaultTextureForType";

// API base URL for loading remote textures
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Renders a 3D planet with optional atmosphere and rings.
 *
 * @param {object} planet - Planet data with radius, textures, albedo, etc.
 * @param {number[]} position - 3D position in the scene.
 * @param {number} scaleFactor - Scale applied to convert planet radius.
 * @param {number} timeScale - Controls rotation speed.
 * @param {Function} onReady - Callback called once all textures are loaded.
 */
export default function Planet3D({
  planet,
  position = [0, 0, 0],
  scaleFactor = 1_000,
  timeScale = 1,
  onReady = () => {},
}) {
  const meshRef = useRef(); // Reference to the planet mesh
  const groupRef = useRef(); // Reference to the entire planet group
  const atmosphereRef = useRef(); // Reference to the atmosphere mesh

  const [isPlanetReady, setIsPlanetReady] = useState(false); // Load state

  // Convert planet radius from Earth units to scaled scene units
  const radiusKm = planet.radius_earth * EARTH_RADIUS_KM;
  const radius = useMemo(() => radiusKm / scaleFactor, [radiusKm, scaleFactor]);

  // Convert inclination from degrees to radians
  const inclinationRad = useMemo(
    () => (planet.inclination_deg * Math.PI) / 180,
    [planet.inclination_deg]
  );

  /**
   * Returns a fully qualified URL for texture loading.
   * Handles absolute URLs, data URLs, and relative paths starting with "/uploads".
   */
  const getFullUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    if (url.startsWith("/uploads")) return `${API_URL}${url}`;
    return url;
  };

  // Determine URLs for the different texture maps
  const surfaceUrl =
    getFullUrl(planet.surface_texture_url) ||
    getDefaultTextureForType(planet.planet_type_id);
  const heightUrl = getFullUrl(planet.height_texture_url);
  const atmosphereUrl = getFullUrl(planet.atmosphere?.texture_url);

  const [map, setMap] = useState(null); // Surface texture
  const [bumpMap, setBumpMap] = useState(null); // Terrain (displacement) texture
  const [atmosphereMap, setAtmosphereMap] = useState(null); // Atmosphere texture

  /**
   * Fallback bump map (gray texture) for when height map is not available.
   */
  const defaultHeightMap = useMemo(() => {
    const size = 4;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#888888";
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.LinearEncoding;
    texture.anisotropy = 4;
    return texture;
  }, []);

  /**
   * Load textures asynchronously using TextureLoader.
   * Cancels updates if component is unmounted mid-load.
   */
  useEffect(() => {
    let canceled = false;
    const loader = new TextureLoader();

    // Load surface texture
    loader.load(surfaceUrl, (tex) => {
      if (!canceled) setMap(tex);
    });

    // Load height/displacement map if available
    if (heightUrl) {
      loader.load(heightUrl, (tex) => {
        if (!canceled) {
          setBumpMap(tex);
        }
      });
    } else {
      setBumpMap(defaultHeightMap);
    }

    // Load atmosphere texture if available
    if (atmosphereUrl) {
      loader.load(atmosphereUrl, (tex) => {
        if (!canceled) setAtmosphereMap(tex);
      });
    } else {
      setAtmosphereMap(null);
    }

    return () => {
      canceled = true;
    };
  }, [surfaceUrl, heightUrl, atmosphereUrl, defaultHeightMap]);

  /**
   * Updates rotation of planet and atmosphere on each animation frame.
   */
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += planet.angularSpeed * delta * timeScale;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y +=
        planet.angularSpeed * delta * timeScale * 0.8;
    }
  });

  /**
   * Calculate material properties based on albedo.
   * Higher albedo makes the planet brighter and less rough.
   */
  const materialColor = useMemo(() => {
    return new THREE.Color("white").multiplyScalar(planet.albedo * 5);
  }, [planet.albedo]);

  const materialRoughness = useMemo(() => {
    return 1 - planet.albedo * 0.6;
  }, [planet.albedo]);

  /**
   * Set readiness once all required textures are loaded.
   * Triggers `onReady` callback.
   */
  useEffect(() => {
    const needsAtmosphere = !!atmosphereUrl;
    const atmosphereReady = !needsAtmosphere || !!atmosphereMap;

    if (map && (!heightUrl || bumpMap) && atmosphereReady) {
      setIsPlanetReady(true);
      onReady();
    }
  }, [map, bumpMap, heightUrl, atmosphereUrl, atmosphereMap, onReady]);

  // Wait until planet is fully ready before rendering
  if (!isPlanetReady) return null;

  return (
    <group ref={groupRef} position={position} rotation={[inclinationRad, 0, 0]}>
      {/* Planet surface mesh with bump and displacement maps */}
      <mesh ref={meshRef} scale={[1, 1 - planet.flattening * 0.02, 1]}>
        <sphereGeometry args={[radius, 128, 128]} />
        <meshStandardMaterial
          map={map}
          displacementMap={bumpMap}
          displacementScale={bumpMap ? radius * 0.09 : 0}
          bumpMap={bumpMap}
          bumpScale={bumpMap ? radius * 0.01 : 0}
          roughness={materialRoughness}
          metalness={0}
          color={materialColor}
        />
      </mesh>

      {/* Optional atmosphere layer */}
      {atmosphereMap && (
        <mesh
          ref={atmosphereRef}
          scale={[1.05, (1 - planet.flattening * 0.02) * 1.05, 1.05]}
        >
          <sphereGeometry args={[radius, 128, 128]} />
          <meshStandardMaterial
            map={atmosphereMap}
            transparent
            alphaTest={0.01}
            depthWrite={false}
            side={THREE.DoubleSide}
            color={materialColor}
            roughness={materialRoughness}
            metalness={0}
          />
        </mesh>
      )}

      {/* Optional ring system */}
      {planet.has_rings && (
        <Ring innerRadius={radius * 1.2} outerRadius={radius * 2.5} />
      )}
    </group>
  );
}
