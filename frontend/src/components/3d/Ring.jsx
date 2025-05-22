import * as THREE from "three";
import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

/**
 * Ring renders a textured planetary ring as a flat ring geometry with a custom UV mapping.
 *
 * @param {Object} props
 * @param {number} props.innerRadius - Inner radius of the ring.
 * @param {number} props.outerRadius - Outer radius of the ring.
 */
export default function Ring({ innerRadius, outerRadius }) {
  // Load the ring texture (transparent PNG)
  const texture = useLoader(
    TextureLoader,
    "/images/textures/rings-texture.png"
  );

  /**
   * Create and customize the ring geometry with modified UVs for texture mapping.
   * The UVs are adjusted so that the texture is split into two halves radially:
   * - Inner half uses uv.x = 0
   * - Outer half uses uv.x = 1
   */
  const geometry = useMemo(() => {
    const geom = new THREE.RingGeometry(innerRadius, outerRadius, 128);

    // Access positions and UV attributes of the geometry
    const pos = geom.attributes.position;
    const uvAttr = geom.attributes.uv;

    const v3 = new THREE.Vector3();

    // Iterate over each vertex to modify UV mapping
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i); // Get vertex position

      const radial = v3.length(); // Distance from center
      // Decide UV.x based on radius: inner half = 0, outer half = 1
      const uvx = radial < (innerRadius + outerRadius) / 2 ? 0 : 1;
      uvAttr.setXY(i, uvx, 1);
    }

    return geom;
  }, [innerRadius, outerRadius]);

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.01]}>
      {/* Use custom ring geometry */}
      <primitive object={geometry} attach="geometry" />

      {/* Material with texture, double-sided, transparent for realistic look */}
      <meshBasicMaterial
        map={texture}
        color={0x888888}
        side={THREE.DoubleSide}
        transparent
      />
    </mesh>
  );
}
