"use client";

import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useState, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import Planet3DSimple from "../components/3d/Planet3DSimple";
import {
  Star,
  Rocket,
  Globe,
  Users,
  BookOpen,
  Sparkles,
  ChevronRight,
} from "lucide-react";

// List of preset planet configurations for random selection
const planetOptions = [
  {
    surfaceTexture: "/images/textures/base/gas-giant.jpg",
    inclinationDeg: 25,
    rotationSpeed: 0.3,
    hasRings: true,
  },
  {
    surfaceTexture: "/images/textures/base/super-earth.jpg",
    inclinationDeg: 15,
    rotationSpeed: 0.4,
    hasRings: false,
  },
  {
    surfaceTexture: "/images/textures/base/neptune-like.jpg",
    inclinationDeg: 10,
    rotationSpeed: 0.2,
    hasRings: true,
  },
];

/**
 * Landing page component for the Exocosmos app.
 * It presents a 3D planet scene and highlights the app’s key features.
 */
const Landing = () => {
  // Randomly select one planet preset to render
  const randomPlanet = useMemo(() => {
    const index = Math.floor(Math.random() * planetOptions.length);
    return planetOptions[index];
  }, []);

  // Ref to track the container holding the canvas
  const canvasContainerRef = useRef();

  // Radius state for the 3D planet (responsive to container size)
  const [radius, setRadius] = useState(2);

  // Observe canvas container width and update radius accordingly
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      const newRadius = Math.min(Math.max(width / 200, 1.2), 5);
      setRadius(newRadius);
    });

    if (canvasContainerRef.current) {
      observer.observe(canvasContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="h-screen flex flex-col md:flex-row">
        {/* Left side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start px-8 md:px-16 py-12 md:py-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <img
              src="/images/logos/logo_white.svg"
              alt="EXOCOSMOS"
              className="max-w-[280px]"
            />
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-xl">
            Benvingut a Exocosmos. Una aplicació educativa per explorar sistemes
            planetaris ficticis, estrelles, planetes i més.
          </p>
          <div className="flex gap-4">
            <Link
              to="/app/menu"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 font-medium"
            >
              Entrar <ChevronRight size={18} />
            </Link>
            <Link
              to="/app/explore"
              className="border border-purple-600 text-purple-400 px-6 py-3 rounded-lg hover:bg-purple-900/20 transition font-medium"
            >
              Explorar
            </Link>
          </div>
        </div>

        {/* Right side */}
        <div
          className="w-full md:w-1/2 h-[50vh] md:h-full relative"
          ref={canvasContainerRef}
        >
          <Canvas
            camera={{ position: [10, 5, 20], fov: 50, far: 10000 }}
            style={{ background: "transparent" }}
          >
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Suspense fallback={null}>
              <Planet3DSimple
                {...randomPlanet}
                radius={radius}
                position={[0, 0, 0]}
              />
            </Suspense>
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              enableDamping={true}
              dampingFactor={0.02}
            />
          </Canvas>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 md:px-16 lg:px-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent opacity-30 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Què pots fer a Exocosmos?
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
            Descobreix, crea i aprèn sobre l'univers amb eines interactives i
            visualitzacions 3D
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-900/50 hover:border-purple-600/50 transition group">
              <div className="w-14 h-14 rounded-xl bg-purple-900/50 flex items-center justify-center mb-6 group-hover:bg-purple-800 transition">
                <Globe className="text-purple-400 h-7 w-7" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">
                Explora planetes
              </h3>
              <p className="text-gray-400">
                Descobreix mons amb atmosferes, composicions i anells diferents.
                Visualitza'ls en 3D i aprèn sobre les seves característiques.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-900/50 hover:border-purple-600/50 transition group">
              <div className="w-14 h-14 rounded-xl bg-purple-900/50 flex items-center justify-center mb-6 group-hover:bg-purple-800 transition">
                <Star className="text-purple-400 h-7 w-7" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">
                Crea sistemes
              </h3>
              <p className="text-gray-400">
                Combina estrelles i planetes per construir sistemes planetaris
                únics. Experimenta amb diferents configuracions i observa els
                resultats.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-900/50 hover:border-purple-600/50 transition group">
              <div className="w-14 h-14 rounded-xl bg-purple-900/50 flex items-center justify-center mb-6 group-hover:bg-purple-800 transition">
                <Users className="text-purple-400 h-7 w-7" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">
                Comparteix i aprèn
              </h3>
              <p className="text-gray-400">
                Consulta informació detallada i visualitza models 3D de forma
                interactiva. Comparteix les teves creacions amb la comunitat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Journey Section */}
      <section className="py-20 px-8 md:px-16 lg:px-24 bg-gray-950/50">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent opacity-30 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            El teu viatge d'aprenentatge
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
            Segueix un camí estructurat per aprendre sobre l'astronomia i la
            formació planetària
          </p>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-purple-900/50"></div>

            {/* Timeline items */}
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="md:w-1/2 md:text-right order-2 md:order-1">
                  <h3 className="text-2xl font-semibold mb-2 text-white">
                    Fonaments astronòmics
                  </h3>
                  <p className="text-gray-400">
                    Aprèn els conceptes bàsics sobre estrelles, planetes i
                    sistemes planetaris.
                  </p>
                </div>
                <div className="relative z-10 order-1 md:order-2">
                  <div className="w-8 h-8 rounded-full bg-purple-700 border-4 border-gray-950 flex items-center justify-center">
                    <BookOpen className="text-white h-4 w-4" />
                  </div>
                </div>
                <div className="md:w-1/2 order-3"></div>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="md:w-1/2 order-1"></div>
                <div className="relative z-10 order-2">
                  <div className="w-8 h-8 rounded-full bg-purple-700 border-4 border-gray-950 flex items-center justify-center">
                    <Rocket className="text-white h-4 w-4" />
                  </div>
                </div>
                <div className="md:w-1/2 order-3">
                  <h3 className="text-2xl font-semibold mb-2 text-white">
                    Creació de planetes
                  </h3>
                  <p className="text-gray-400">
                    Dissenya els teus propis planetes amb diferents
                    característiques i visualitza'ls en 3D.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="md:w-1/2 md:text-right order-2 md:order-1">
                  <h3 className="text-2xl font-semibold mb-2 text-white">
                    Exploració de sistemes
                  </h3>
                  <p className="text-gray-400">
                    Consulta sistemes planetaris creats per altres usuaris i
                    aprèn de les seves idees i estructures.
                  </p>
                </div>
                <div className="relative z-10 order-1 md:order-2">
                  <div className="w-8 h-8 rounded-full bg-purple-700 border-4 border-gray-950 flex items-center justify-center">
                    <Sparkles className="text-white h-4 w-4" />
                  </div>
                </div>
                <div className="md:w-1/2 order-3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 md:px-16 lg:px-24 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Preparat per començar el teu viatge còsmic?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Uneix-te a la nostra comunitat d'exploradors espacials i comença a
            crear els teus propis mons i sistemes planetaris avui mateix.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition font-medium text-lg"
            >
              Crear compte
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 md:px-16 lg:px-24 bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <img
              src="/images/logos/logo_white.svg"
              alt="EXOCOSMOS"
              className="h-8 mb-4"
            />
            <p className="text-gray-400 text-sm">
              Una aplicació educativa per explorar i aprendre sobre l'univers de
              forma interactiva.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Explorar</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="/app/explore/planets"
                  className="hover:text-purple-400 transition"
                >
                  Planetes
                </Link>
              </li>
              <li>
                <Link
                  to="/app/explore/stars"
                  className="hover:text-purple-400 transition"
                >
                  Estrelles
                </Link>
              </li>
              <li>
                <Link
                  to="/app/explore/systems"
                  className="hover:text-purple-400 transition"
                >
                  Sistemes
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-white font-semibold mb-4">Guia d'usuari</h4>
            <div className="grid grid-cols-2 gap-x-8">
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/guide/index"
                    className="hover:text-purple-400 transition"
                  >
                    Introducció
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guide/prefaci"
                    className="hover:text-purple-400 transition"
                  >
                    Prefaci
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guide/primeres-passes"
                    className="hover:text-purple-400 transition"
                  >
                    Primeres passes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guide/sistemes"
                    className="hover:text-purple-400 transition"
                  >
                    Sistemes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guide/estrelles"
                    className="hover:text-purple-400 transition"
                  >
                    Estrelles
                  </Link>
                </li>
              </ul>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/guide/planetes"
                    className="hover:text-purple-400 transition"
                  >
                    Planetes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guide/perfil"
                    className="hover:text-purple-400 transition"
                  >
                    Perfil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guide/resolucio-problemes"
                    className="hover:text-purple-400 transition"
                  >
                    Resolució de problemes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guide/faq"
                    className="hover:text-purple-400 transition"
                  >
                    Preguntes freqüents
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} Exocosmos. Tots els drets reservats.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Landing;
