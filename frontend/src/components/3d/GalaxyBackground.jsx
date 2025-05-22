import { useLoader, useThree } from "@react-three/fiber";
import { TextureLoader, EquirectangularReflectionMapping } from "three";
import { useEffect } from "react";

// Path to the star texture
const GALAXY_BACKGROUND = "/images/textures/stars.png";

export default function GalaxyBackground() {
  // Load texture using Three.js TextureLoader
  const texture = useLoader(TextureLoader, GALAXY_BACKGROUND);

  // Access the scene from the Three.js context
  const { scene } = useThree();

  useEffect(() => {
    // Set the texture mapping mode
    texture.mapping = EquirectangularReflectionMapping;

    // Apply the texture as the scene background
    scene.background = texture;
  }, [texture, scene]);

  return null;
}
