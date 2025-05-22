"use client";

import { Link } from "react-router-dom";
import { useEffect } from "react";
import { ChevronRight, Users, AlertTriangle, Search } from "lucide-react";
import { GuideNavigation } from "../../components/ui/GuideNavigation";

const GuidePerfil = () => {
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
          <span className="text-white">Perfil i Comunitat</span>
        </div>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-900/50 flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5 text-purple-400" />
            </div>
            6. Perfil i Comunitat
          </h1>
          <p className="text-xl text-gray-300">
            Aprèn a gestionar el teu perfil d'usuari i a interactuar amb la
            comunitat d'Exocosmos.
          </p>
        </header>

        {/* Main content */}
        <div className="space-y-8">
          {/* Gestió del Perfil */}
          <section className="bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-800">
            <h2
              className="text-2xl font-bold text-white mb-6"
              id="gestio-perfil"
            >
              6.1. Gestió del Perfil
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  El teu perfil d'usuari
                </h3>
                <p className="text-gray-300 mb-4">
                  A la pàgina de perfil pots consultar la teva informació bàsica
                  i accedir a les teves creacions dins de Exocosmos. La
                  informació es carrega automàticament segons l’usuari
                  autenticat.
                </p>

                <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
                  <img
                    src="/images/screenshots/perfil.png"
                    alt="Perfil d'usuari a Exocosmos"
                    className="w-full h-auto"
                  />
                  <div className="p-3 text-center text-sm text-gray-400">
                    Vista del perfil amb la informació bàsica i sistemes creats
                  </div>
                </div>

                <p className="text-gray-300 mb-4">El perfil mostra:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Informació d'usuari
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>Nom d’usuari</li>
                      <li>Correu electrònic</li>
                      <li>Imatge de perfil</li>
                      <li>Data de creació del compte</li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Les teves creacions
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>Llista de sistemes planetaris creats</li>
                      <li>Botó per crear un nou sistema</li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Estadístiques
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>Nombre total de sistemes creats</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Edició del perfil
                </h3>
                <p className="text-gray-300 mb-4">
                  Pots editar el teu perfil des de la pàgina “Editar perfil” amb
                  els següents camps:
                </p>

                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>Nom d’usuari</li>
                  <li>Correu electrònic</li>
                  <li>Nova contrasenya (opcional)</li>
                  <li>Canvi d’imatge de perfil (amb previsualització)</li>
                </ul>

                <p className="text-gray-300 mt-4">
                  Un cop desats els canvis, es refresca automàticament la sessió
                  per reflectir les actualitzacions.
                </p>
              </div>

              <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-red-200 text-sm">
                  <p className="font-medium mb-1">Important:</p>
                  <p>
                    Si elimines el teu compte (a través de suport), totes les
                    teves creacions s'esborraran permanentment. Aquesta acció no
                    es pot desfer.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Interacció amb la Comunitat */}
          <section className="bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-800">
            <h2
              className="text-2xl font-bold text-white mb-6"
              id="interaccio-comunitat"
            >
              6. Interacció amb la Comunitat
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Exploració de la comunitat
                </h3>
                <p className="text-gray-300 mb-4">
                  Exocosmos és més que una eina de creació; és una comunitat
                  d'entusiastes de l'astronomia i la ciència planetària. Pots
                  explorar les creacions d'altres usuaris i interactuar amb ells
                  de diverses maneres:
                </p>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Search className="h-5 w-5 text-purple-400" />
                      <h4 className="font-medium text-white">
                        Descobriment de contingut
                      </h4>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      Explora les creacions d'altres usuaris a través de
                      diferents mètodes:
                    </p>
                    <ul className="space-y-1 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          Pàgina d'exploració: mostra les creacions més populars
                          i recents
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          Cerca avançada: filtra per tipus, característiques,
                          popularitat, etc.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
                  <img
                    src="/images/screenshots/explorar.png"
                    alt="Pàgina d'exploració d'Exocosmos"
                    className="w-full h-auto"
                  />
                  <div className="p-3 text-center text-sm text-gray-400">
                    Llistat de sistemes i planetes creats per la comunitat amb
                    filtres i cerca
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Guide Navigation */}
        <GuideNavigation currentSection="perfil" />
      </div>
    </main>
  );
};

export default GuidePerfil;
