import SpaceScene from "./SpaceScene";
import Star3D from "./Star3D";

/**
 * Star3DPreview renders a scaled 3D preview of a star inside a generic space scene.
 * It only shows the star if valid physical parameters (mass and radius) are provided.
 *
 * @param {Object} props
 * @param {Object} props.star - Star object with physical data (mass, radius, temperature, etc.)
 */
export default function Star3DPreview({ star }) {
  // Ensure star has valid physical properties
  const isValidInput = star.mass_solar > 0 && star.radius_solar > 0;

  // Convert radius to scaled scene units (in millions of km)
  const scaledRadius = star.radiusKm / 1_000_000;

  return (
    <SpaceScene objectRadius={scaledRadius} scaleFactor={1_000_000}>
      {/* Render the star if data is valid */}
      {isValidInput && (
        <Star3D star={star} scaleFactor={1_000_000} position={[0, 0, 0]} />
      )}
    </SpaceScene>
  );
}
