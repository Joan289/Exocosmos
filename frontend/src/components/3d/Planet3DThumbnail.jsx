import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";
import Ring from "./Ring";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Planet3DThumbnail renders a simplified 3D thumbnail of a planet with textures.
 * It includes surface, optional atmosphere, and rings, with minimal lighting or interactivity.
 * Designed for use in small previews, lists, or galleries where performance is key.
 *
 * @param {Object} props
 * @param {Object} props.planet - Planet object with textures and orbital parameters.
 * @param {number[]} [props.position=[0, 0, 0]] - Planet's position in 3D space.
 * @param {Function} [props.onReady] - Callback triggered when textures are fully loaded.
 */
export default function Planet3DThumbnail({
  planet,
  position = [0, 0, 0],
  onReady = () => {},
}) {
  const meshRef = useRef(); // Reference to the main sphere mesh
  const atmosphereRef = useRef(); // Reference to the atmosphere mesh

  const [map, setMap] = useState(null); // Surface texture
  const [atmosphereMap, setAtmosphereMap] = useState(null); // Atmosphere texture

  /**
   * Converts texture paths into fully qualified URLs if needed.
   */
  const getFullUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    if (url.startsWith("/uploads")) return `${API_URL}${url}`;
    return url;
  };

  const surfaceUrl = getFullUrl(planet.surface_texture_url);
  const atmosphereUrl = getFullUrl(planet.atmosphere?.texture_url);

  /**
   * Load surface and atmosphere textures asynchronously using TextureLoader.
   * Marks them as updated and stores them in state.
   */
  useEffect(() => {
    const loader = new TextureLoader();
    loader.setCrossOrigin("anonymous");
    let cancelled = false;

    loader.load(surfaceUrl, (tex) => {
      if (!cancelled) {
        tex.needsUpdate = true;
        setMap(tex);
      }
    });

    if (atmosphereUrl) {
      loader.load(atmosphereUrl, (tex) => {
        if (!cancelled) {
          tex.needsUpdate = true;
          setAtmosphereMap(tex);
        }
      });
    }

    return () => {
      cancelled = true;
    };
  }, [surfaceUrl, atmosphereUrl]);

  /**
   * Once all required textures are loaded, notify parent via `onReady`.
   */
  useEffect(() => {
    const ready = !!map && (!atmosphereUrl || !!atmosphereMap);
    if (ready) onReady();
  }, [map, atmosphereMap, atmosphereUrl, onReady]);

  // Don't render anything until the required textures are loaded
  if (!map || (atmosphereUrl && !atmosphereMap)) return null;

  // Constants for size and orientation
  const radius = 3;
  const inclinationRad = ((planet.inclination_deg || 0) * Math.PI) / 180;
  const flattening = 1 - (planet.flattening || 0) * 0.02;

  return (
    <group position={position} rotation={[inclinationRad, 0, 0]}>
      {/* Flattened planet surface */}
      <mesh ref={meshRef} scale={[1, flattening, 1]}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial map={map} />
      </mesh>

      {/* Optional atmosphere with same flattening */}
      {atmosphereMap && (
        <mesh ref={atmosphereRef} scale={[1.05, flattening * 1.05, 1.05]}>
          <sphereGeometry args={[radius, 64, 64]} />
          <meshStandardMaterial
            map={atmosphereMap}
            transparent
            opacity={0.3}
            depthWrite={false}
            side={THREE.FrontSide}
          />
        </mesh>
      )}

      {/* Optional rings (no flattening) */}
      {planet.has_rings && (
        <Ring innerRadius={radius * 1.2} outerRadius={radius * 2.5} />
      )}
    </group>
  );
}
