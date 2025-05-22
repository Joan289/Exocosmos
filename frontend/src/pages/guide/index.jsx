"use client";

import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  ChevronRight,
  Book,
  Info,
  Rocket,
  Star,
  Globe,
  Users,
  Settings,
  HelpCircle,
} from "lucide-react";

const GuideIndex = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Hero Section - Portada */}
      <section className="relative py-20 px-4 md:px-8 lg:px-16 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-10 w-72 h-72 bg-purple-700 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-blue-700 rounded-full filter blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block p-2 px-4 bg-purple-900/30 backdrop-blur-sm rounded-full text-purple-300 text-sm font-medium mb-4 border border-purple-800/50">
              Versió 1.0 — Actualitzat: Maig 2025
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Guia d'Usuari <span className="text-purple-400">Exocosmos</span>
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Tot el que necessites saber per explorar, crear i compartir
              sistemes planetaris, estrelles i planetes en el teu viatge còsmic.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link
              to="/guide/prefaci"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Començar <ChevronRight size={18} />
            </Link>

            <Link
              to="/app/explore"
              className="px-6 py-3 border border-purple-600 text-purple-400 hover:bg-purple-900/20 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Explorar l'aplicació
            </Link>
          </div>

          {/* Tabla de contenidos */}
          <div className="bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Book className="h-6 w-6 text-purple-400" />
              Taula de Continguts
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                to="/guide/prefaci"
                className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-600/50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-900/50 transition-colors">
                    <Info className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors">
                      1. Prefaci
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Com utilitzar aquesta guia i informació bàsica
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/guide/primeres-passes"
                className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-600/50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-900/50 transition-colors">
                    <Rocket className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors">
                      2. Primeres Passes
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Registre, inici de sessió i navegació bàsica
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/guide/sistemes"
                className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-600/50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-900/50 transition-colors">
                    <Globe className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors">
                      3. Sistemes Planetaris
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Crear i gestionar sistemes planetaris
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/guide/estrelles"
                className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-600/50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-900/50 transition-colors">
                    <Star className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors">
                      4. Estrelles
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Creació i personalització d'estrelles
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/guide/planetes"
                className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-600/50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-900/50 transition-colors">
                    <Globe className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors">
                      5. Planetes
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Creació i personalització de planetes
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/guide/perfil"
                className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-600/50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-900/50 transition-colors">
                    <Users className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors">
                      6. Perfil
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Gestió del teu perfil d'usuari
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/guide/resolucio-problemes"
                className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-600/50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-900/50 transition-colors">
                    <HelpCircle className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors">
                      7. Resolució de Problemes
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Solucions a problemes comuns
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/guide/faq"
                className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-600/50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-900/50 transition-colors">
                    <HelpCircle className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors">
                      8. Preguntes Freqüents
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Dubtes habituals i informació pràctica
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 lg:px-16 bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <Link to="/" className="inline-block mb-4">
            <img
              src="/images/logos/logo_white.svg"
              alt="EXOCOSMOS"
              className="h-8"
            />
          </Link>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Exocosmos. Tots els drets reservats.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default GuideIndex;
