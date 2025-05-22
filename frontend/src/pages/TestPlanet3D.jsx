import { useEffect, useState, useRef } from "react";
import { Planet } from "../models/Planet";
import SpaceScene from "../components/3d/SpaceScene";
import Planet3D from "../components/3d/Planet3D";

// 📊 FPS overlay
import Stats from "stats.js";

export default function TestPlanet3D() {
  const [bloomEnabled, setBloomEnabled] = useState(true);
  const statsRef = useRef(null);

  const [planet, setPlanet] = useState(null);

  // 🌍 Simulated test data
  useEffect(() => {
    const mockPlanet = new Planet({
      name: "Planeta Test",
      description: "Planeta generat localment.",
      mass_earth: 1,
      radius_earth: 1,
      inclination_deg: 50,
      rotation_speed_kms: 1,
      albedo: 0.3,
      star_distance_au: 1,
      has_rings: true,
      moon_count: 1,
      surface_texture_url: "/images/cat.png",
      height_texture_url: null,
      thumbnail_url: "",
      planetary_system_id: 1,
      planet_type_id: 1,
      atmosphere: {
        pressure_atm: 1,
        greenhouse_factor: 0.2,
        texture_url: "/images/clouds.png", // Usa aquí la textura que quieras
      },
    });

    setPlanet(mockPlanet);
  }, []);

  // 📈 Setup FPS stats
  useEffect(() => {
    const stats = new Stats();
    stats.showPanel(0);
    stats.dom.style.position = "absolute";
    stats.dom.style.top = "0px";
    stats.dom.style.left = "0px";
    document.body.appendChild(stats.dom);
    statsRef.current = stats;

    let animationFrameId;

    const update = () => {
      stats.begin();
      stats.end();
      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (stats.dom && stats.dom.parentNode) {
        stats.dom.parentNode.removeChild(stats.dom);
      }
    };
  }, []);

  if (!planet)
    return <p className="text-white p-4">Inicialitzant planeta...</p>;

  const scaledRadius = (planet.radius_earth * 6371) / 1_000;

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <SpaceScene objectRadius={scaledRadius} scaleFactor={1_000}>
        <ambientLight intensity={0.01} />
        <directionalLight position={[10, 0, 0]} intensity={1} />
        <Planet3D planet={planet} timeScale={2400} scaleFactor={1_000} />
      </SpaceScene>
    </div>
  );
}
