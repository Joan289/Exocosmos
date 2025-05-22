import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const vertexShader = `
  uniform float time;
  uniform float scale;
  varying vec3 vTexCoord3D;

  void main(void) {
    vTexCoord3D = scale * (position.xyz + vec3(time));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
// Procedural star shader adapted from Seed of Andromeda

varying vec3 vTexCoord3D;
uniform float highTemp;
uniform float lowTemp;
uniform float time;

// GLSL noise by Ashima Arts
vec4 permute(vec4 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 1.0 / 7.0;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1),
                                dot(p2, x2), dot(p3, x3)));
}

const int octaves = 4;

float noise(vec3 position, float frequency, float persistence) {
  float total = 0.0;
  float maxAmplitude = 0.0;
  float amplitude = 1.0;
  for (int i = 0; i < octaves; i++) {
    total += snoise(position * frequency) * amplitude;
    frequency *= 2.0;
    maxAmplitude += amplitude;
    amplitude *= persistence;
  }
  return total / maxAmplitude;
}

void main(void) {
  float noiseBase = (noise(vTexCoord3D, 0.40, 0.7) + 1.0) / 2.0;

  float t1 = snoise(vTexCoord3D * 0.04) * 2.7 - 1.9;
  float brightNoise = snoise(vTexCoord3D * 0.02) * 1.4 - 0.9;

  float ss = max(0.0, t1);
  float brightSpot = max(0.0, brightNoise);
  float total = noiseBase - ss + brightSpot;

  float temp = highTemp * total + (1.0 - total) * lowTemp;
  float i = max(5.0, (temp - 800.0) * 0.035068);


  // RGB spectrum mapping based on temperature index
  float r =
    step(i, 60.0) * (0.0 + i * 4.25) +
    step(60.0, i) * step(i, 236.0) * 255.0 +
    step(236.0, i) * step(i, 288.0) * (255.0 + (i - 236.0) * -2.442) +
    step(288.0, i) * step(i, 377.0) * (128.0 + (i - 288.0) * -0.764) +
    step(377.0, i) * step(i, 511.0) * (60.0 + (i - 377.0) * -0.4477) +
    step(511.0, i) * 0.0;

  float g =
    step(i, 60.0) * 0.0 +
    step(60.0, i) * step(i, 103.0) * (0.0 + (i - 60.0) * 2.3255) +
    step(103.0, i) * step(i, 133.0) * (100.0 + (i - 103.0) * 4.433) +
    step(133.0, i) * step(i, 174.0) * (233.0 + (i - 133.0) * 0.53658) +
    step(174.0, i) * step(i, 236.0) * 255.0 +
    step(236.0, i) * step(i, 286.0) * (255.0 + (i - 236.0) * -1.24) +
    step(286.0, i) * step(i, 367.0) * (193.0 + (i - 286.0) * -0.7901) +
    step(367.0, i) * step(i, 511.0) * (129.0 + (i - 367.0) * -0.45138) +
    step(511.0, i) * (64.0 + (i - 511.0) * -0.06237);

  float b =
    step(i, 103.0) * 0.0 +
    step(103.0, i) * step(i, 133.0) * (0.0 + (i - 103.0) * 7.0333) +
    step(133.0, i) * step(i, 173.0) * (211.0 + (i - 133.0) * 0.9) +
    step(173.0, i) * step(i, 231.0) * (247.0 + (i - 173.0) * 0.1379) +
    step(231.0, i) * 255.0;

  gl_FragColor = vec4(vec3(r, g, b) / 255.0, 1.0);
}
`;

const Star3D = ({ star, position = [0, 0, 0], scaleFactor = 1_000_000 }) => {
  const meshRef = useRef();

  const targetRadius = useMemo(
    () => star.radiusKm / scaleFactor,
    [star, scaleFactor]
  );
  const currentRadius = useRef(targetRadius);

  const currentPosition = useRef(new THREE.Vector3(...position));
  const targetPosition = useMemo(
    () => new THREE.Vector3(...position),
    [position]
  );

  const baseTemp = useMemo(() => {
    const approxTemp = star.temperature;
    return {
      high: approxTemp,
      low: approxTemp / 6,
    };
  }, [star]);

  const uniforms = useRef({
    time: { value: 0 },
    scale: { value: 10.0 },
    highTemp: { value: baseTemp.high },
    lowTemp: { value: baseTemp.low },
  }).current;

  useEffect(() => {
    uniforms.highTemp.value = baseTemp.high;
    uniforms.lowTemp.value = baseTemp.low;
  }, [baseTemp, uniforms]);

  useFrame((_, delta) => {
    uniforms.time.value += delta * 0.02;

    if (meshRef.current) {
      currentRadius.current = THREE.MathUtils.lerp(
        currentRadius.current,
        targetRadius,
        0.1
      );
      meshRef.current.scale.setScalar(currentRadius.current);

      currentPosition.current.lerp(targetPosition, 0.1);
      meshRef.current.parent.position.copy(currentPosition.current);
    }
  }, 1);

  return (
    <group position={position}>
      <pointLight
        color={0xffffff}
        intensity={star.luminosity * 0.5}
        distance={targetRadius * 100}
        decay={2}
      />
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </group>
  );
};

export default Star3D;
