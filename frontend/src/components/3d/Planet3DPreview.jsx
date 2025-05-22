import { useState } from "react";
import SpaceScene from "./SpaceScene";
import Planet3D from "./Planet3D";

/**
 * Planet3DPreview renders a 3D planet inside a space scene with lighting and camera controls.
 * It only shows the planet if valid physical parameters are provided (mass and radius).
 * Controls are enabled only after the planet is fully loaded.
 *
 * @param {Object} props
 * @param {Object} props.planet - An instance of Planet with physical and visual properties.
 * @param {boolean} props.bloomEnabled - Whether bloom post-processing effect is enabled.
 */
export default function Planet3DPreview({ planet, bloomEnabled }) {
  const [planetReady, setPlanetReady] = useState(false);

  // Validate that planet has physical size (mass and radius must be > 0)
  const isValidInput = planet.mass_earth > 0 && planet.radius_earth > 0;

  // Calculate scaled radius (in Earth radius units)
  const scaledRadius = planet.radiusKm / 1_000;

  return (
    <SpaceScene
      objectRadius={scaledRadius}
      scaleFactor={1_000}
      bloomEnabled={bloomEnabled}
      controlsEnabled={planetReady}
    >
      {/* Basic lighting setup for the scene */}
      <ambientLight intensity={0.01} />
      <directionalLight position={[10, 0, 0]} intensity={1} />

      {/* Render the planet only if its parameters are valid */}
      {isValidInput && (
        <Planet3D
          planet={planet}
          scaleFactor={1_000}
          position={[0, 0, 0]}
          timeScale={700}
          onReady={() => setPlanetReady(true)} // Enables controls once loaded
        />
      )}
    </SpaceScene>
  );
}
