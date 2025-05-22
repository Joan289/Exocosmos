import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import Ring from "./Ring";

/**
 * Planet3DSimple renders a basic 3D planet with optional rings and rotation.
 * Intended for simplified or static visualizations (e.g., quick previews or scenes without data binding).
 *
 * @param {Object} props
 * @param {number} props.radius - Radius of the planet sphere.
 * @param {string} props.surfaceTexture - URL of the texture to apply on the planet.
 * @param {number} props.inclinationDeg - Inclination angle in degrees (tilts the planet).
 * @param {number} props.rotationSpeed - Rotation speed in radians per second.
 * @param {boolean} props.hasRings - Whether to render planetary rings.
 * @param {number[]} props.position - Position in 3D space [x, y, z].
 */
export default function Planet3DSimple({
  radius = 1,
  surfaceTexture = "/images/textures/earth.jpg",
  inclinationDeg = 0,
  rotationSpeed = 0.5,
  hasRings = false,
  position = [0, 0, 0],
}) {
  const meshRef = useRef(); // Reference to the rotating mesh

  // Load the texture for the planet's surface
  const texture = useLoader(TextureLoader, surfaceTexture);

  // Convert inclination from degrees to radians
  const inclinationRad = (inclinationDeg * Math.PI) / 180;

  // Rotate the planet continuously on each frame
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed * delta;
    }
  });

  return (
    <group position={position} rotation={[inclinationRad, 0, 0]}>
      {/* 🌍 Planet mesh with texture */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* 🪐 Optional rings with texture */}
      {hasRings && (
        <Ring innerRadius={radius * 1.3} outerRadius={radius * 2.3} />
      )}
    </group>
  );
}
