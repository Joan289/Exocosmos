import { useFormContext, useWatch } from "react-hook-form";
import { Star } from "../../models/Star";
import Star3DPreview from "./Star3DPreview";

/**
 * LiveStar3DPreview renders a real-time 3D star preview that reacts to form input changes.
 *
 * It uses React Hook Form's context to watch star-related form values,
 * constructs a Star model instance from those values,
 * and passes it to the Star3DPreview component for rendering.
 *
 * @param {Object} props
 * @param {boolean} props.showComparison - Whether to show comparison objects (e.g., the Sun).
 * @param {boolean} props.bloomEnabled - Whether bloom post-processing is enabled.
 */
export default function LiveStar3DPreview({ showComparison, bloomEnabled }) {
  // Access the form control object from React Hook Form context
  const { control } = useFormContext();

  // Watch all form values reactively
  const values = useWatch({ control }) || {};

  // Create a Star instance based on current form values
  const star = new Star(values);

  return (
    <Star3DPreview
      star={star}
      showComparison={showComparison}
      bloomEnabled={bloomEnabled}
    />
  );
}
