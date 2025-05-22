"use client";

import { Link } from "react-router-dom";
import { Home, Search, AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Content */}
      <div className="z-10 max-w-md w-full bg-gray-900/70 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-xl text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-400" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-white mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-purple-400 mb-6">
          Pàgina no trobada
        </h2>

        <p className="text-gray-300 mb-8">
          Sembla que t'has aventurat massa lluny en l'espai. Aquesta ruta no
          existeix en el nostre sistema.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Home className="h-5 w-5" />
            Tornar a l'inici
          </Link>

          <Link
            to="/app/explore"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Search className="h-5 w-5" />
            Explorar
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
