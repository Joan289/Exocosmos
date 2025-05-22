"use client";

import { useNavigate } from "react-router-dom";
import { Rocket, Globe } from "lucide-react";

const Menu = () => {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      {/* Create Button */}
      <button
        onClick={() => navigate("/app/profile")}
        className="relative flex-1 group transition-all duration-300 overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-white/10"
      >
        {/* Glass Overlay */}
        <div className="absolute inset-0 bg-purple-900/10 group-hover:bg-purple-800/20 transition-all duration-300"></div>

        {/* Content */}
        <div className="relative h-full w-full flex flex-col items-center justify-center p-8 z-10">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-purple-600/50 backdrop-blur-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Rocket className="h-10 w-10 md:h-12 md:w-12 text-white" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 group-hover:scale-105 transition-transform duration-300">
            Crear
          </h2>

          <p className="text-lg md:text-xl text-white/80 text-center max-w-md">
            Dissenya i construeix els teus propis planetes i sistemes
          </p>

          <div className="mt-8 px-6 py-3 border-2 border-white/30 rounded-full text-white/90 group-hover:bg-white/10 transition-all duration-300">
            Els teus planetes
          </div>
        </div>
      </button>

      {/* Explore Button */}
      <button
        onClick={() => navigate("/app/explore")}
        className="relative flex-1 group transition-all duration-300 overflow-hidden"
      >
        {/* Glass Overlay */}
        <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-blue-800/10 transition-all duration-300"></div>

        {/* Content */}
        <div className="relative h-full w-full flex flex-col items-center justify-center p-8 z-10">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-blue-600/50 backdrop-blur-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Globe className="h-10 w-10 md:h-12 md:w-12 text-white" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 group-hover:scale-105 transition-transform duration-300">
            Explorar
          </h2>

          <p className="text-lg md:text-xl text-white/80 text-center max-w-md">
            Descobreix creacions fascinants d'altres exploradors
          </p>

          <div className="mt-8 px-6 py-3 border-2 border-white/30 rounded-full text-white/90 group-hover:bg-white/10 transition-all duration-300">
            Altres usuaris
          </div>
        </div>
      </button>
    </main>
  );
};

export default Menu;
