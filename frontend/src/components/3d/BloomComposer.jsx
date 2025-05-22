import { useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// Composer for bloom postprocessing effect
const BloomComposer = ({ bloomEnabled }) => {
  // Access Three.js renderer context
  const { scene, camera, gl, size } = useThree();

  return (
    <EffectComposer
      disableNormalPass
      size={{ width: size.width, height: size.height }}
      scene={scene}
      camera={camera}
      gl={gl}
    >
      {/* Conditionally apply Bloom effect */}
      {bloomEnabled && (
        <Bloom intensity={1} luminanceThreshold={0.1} luminanceSmoothing={0} />
      )}
    </EffectComposer>
  );
};

export default BloomComposer;
