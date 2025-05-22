"use client";

import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  ChevronRight,
  HelpCircle,
  Info,
  Lightbulb,
  RefreshCw,
  Wifi,
  Lock,
  Eye,
  Monitor,
  User,
  Globe,
  Settings,
  XCircle,
  CheckCircle,
  Download,
  MessageSquare,
} from "lucide-react";
import { GuideNavigation } from "../../components/ui/GuideNavigation";

const GuideFAQ = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-white transition-colors">
            Inici
          </Link>
          <ChevronRight size={16} />
          <Link to="/guide" className="hover:text-white transition-colors">
            Guia d'Usuari
          </Link>
          <ChevronRight size={16} />
          <span className="text-white">Preguntes Freqüents</span>
        </div>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-900/50 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="h-5 w-5 text-purple-400" />
            </div>
            8. Preguntes Freqüents
          </h1>
          <p className="text-xl text-gray-300">
            Respostes a les preguntes més comunes i solucions als problemes
            habituals.
          </p>
        </header>

        {/* Main content */}
        <section className="bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6" id="pmf">
            8.1. Preguntes Més Freqüents (PMF)
          </h2>

          <div className="space-y-8">
            {/* General */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-purple-400" /> General
              </h3>

              <div className="space-y-4">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-white mb-2">
                    Què és Exocosmos?
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Exocosmos és una aplicació web educativa creada com a
                    projecte d’institut. Permet crear sistemes planetaris amb
                    estrelles i planetes ficticis, afegint dades bàsiques com la
                    massa o l’òrbita.
                  </p>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-white mb-2">
                    Puc utilitzar Exocosmos sense registre?
                  </h4>
                  <p className="text-gray-300 text-sm">
                    No. Cal registrar-se per poder crear i guardar sistemes, ja
                    que la informació es guarda associada a cada usuari.
                  </p>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-white mb-2">
                    El meu compte i creacions es guarden?
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Sí. Les dades es guarden en una base de dades MySQL i estan
                    associades al teu compte. Si tanques sessió o recarregues,
                    no perdràs res.
                  </p>
                </div>
              </div>
            </div>

            {/* Compte i autenticació */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-purple-400" /> Compte i
                Autenticació
              </h3>

              <div className="space-y-4">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-white mb-2">
                    Com puc canviar la meva contrasenya?
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Ves a la pàgina de perfil i fes clic a "Editar perfil". Allà
                    pots posar una nova contrasenya (opcional) i desar els
                    canvis.
                  </p>
                </div>
              </div>
            </div>

            {/* Visualització */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Monitor className="h-5 w-5 text-purple-400" /> Visualització
              </h3>

              <div className="space-y-4">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-white mb-2">
                    Per què no es carrega la visualització dels sistemes?
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Pot ser que el teu dispositiu no sigui compatible amb WebGL
                    o que estigui desactivat al navegador. Prova a utilitzar
                    Chrome o Firefox actualitzats.
                  </p>
                </div>
              </div>
            </div>

            {/* Contacte */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-400" /> Contacte
              </h3>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h4 className="font-medium text-white mb-2">
                  Com puc contactar si tinc problemes?
                </h4>
                <p className="text-gray-300 text-sm">
                  Pots contactar amb el professor encarregat del projecte o
                  enviar un correu a:{" "}
                  <a
                    href="mailto:exocosmos.suport@gmail.com"
                    className="text-purple-400 underline"
                  >
                    exocosmos.suport@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Guide Navigation */}
        <GuideNavigation currentSection="faq" />
      </div>
    </main>
  );
};

export default GuideFAQ;
