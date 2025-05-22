import { useFormContext, useWatch } from "react-hook-form";
import { Planet } from "../../models/Planet";
import Planet3DPreview from "./Planet3DPreview";

/**
 * LivePlanet3DPreview renders a live 3D preview of a planet using form values.
 *
 * It uses React Hook Form's context to observe changes in real-time,
 * creates a Planet model from those values, and passes it to the 3D preview component.
 *
 * @param {Object} props
 * @param {boolean} props.bloomEnabled - Whether bloom effect should be enabled in the preview.
 */
export default function LivePlanet3DPreview({ bloomEnabled }) {
  // Access form context (must be used within a FormProvider)
  const { control } = useFormContext();

  // Observe the current form values reactively
  const values = useWatch({ control }) || {};

  // Instantiate a Planet model using current form values
  const planet = new Planet(values);

  // Render the live preview component with current planet and bloom settings
  return <Planet3DPreview planet={planet} bloomEnabled={bloomEnabled} />;
}
