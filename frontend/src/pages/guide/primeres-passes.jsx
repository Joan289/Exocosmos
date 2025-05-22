"use client";

import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Book,
  Rocket,
  Monitor,
  Info,
  Lightbulb,
  Globe,
  Star,
  Users,
  Search,
  Settings,
} from "lucide-react";
import GuideNavigation from "../../components/ui/GuideNavigation";

const GuidePrimeresPasses = () => {
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
          <span className="text-white">Primeres Passes</span>
        </div>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-900/50 flex items-center justify-center flex-shrink-0">
              <Rocket className="h-5 w-5 text-purple-400" />
            </div>
            2. Introducció a l'Aplicació
          </h1>
          <p className="text-xl text-gray-300">
            Descobreix què és Exocosmos, les seves funcionalitats principals i
            com començar a utilitzar-la.
          </p>
        </header>

        {/* Main content */}
        <div className="space-y-8">
          {/* Visió General */}
          <section className="bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-800">
            <h2
              className="text-2xl font-bold text-white mb-6"
              id="visio-general"
            >
              2.1. Visió General
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Descripció general de l'aplicació
                </h3>
                <p className="text-gray-300 mb-4">
                  Exocosmos és una plataforma educativa interactiva que permet
                  explorar, crear i compartir sistemes planetaris, estrelles i
                  planetes. Dissenyada tant per a aficionats a l'astronomia com
                  per a educadors, Exocosmos combina la precisió científica amb
                  una interfície intuïtiva i visualment atractiva.
                </p>
                <p className="text-gray-300 mb-4">
                  L'aplicació ofereix eines per dissenyar sistemes planetaris
                  complets, des de l'estrella central fins als planetes que
                  l'orbiten, amb opcions detallades de personalització que
                  inclouen composició química, atmosfera, superfície i molt més.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Principals funcionalitats
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-5 w-5 text-purple-400" />
                      <h4 className="font-medium text-white">
                        Creació de Sistemes
                      </h4>
                    </div>
                    <p className="text-sm text-gray-300">
                      Dissenya sistemes planetaris complets amb múltiples
                      estrelles i planetes.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-purple-400" />
                      <h4 className="font-medium text-white">
                        Estrelles Personalitzades
                      </h4>
                    </div>
                    <p className="text-sm text-gray-300">
                      Crea estrelles amb diferents tipus, mides, temperatures i
                      colors.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-5 w-5 text-purple-400" />
                      <h4 className="font-medium text-white">
                        Planetes Detallats
                      </h4>
                    </div>
                    <p className="text-sm text-gray-300">
                      Dissenya planetes amb atmosferes, compostos químics i
                      característiques superficials.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Monitor className="h-5 w-5 text-purple-400" />
                      <h4 className="font-medium text-white">
                        Visualització 3D
                      </h4>
                    </div>
                    <p className="text-sm text-gray-300">
                      Explora models tridimensionals interactius dels teus
                      sistemes i planetes.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-purple-400" />
                      <h4 className="font-medium text-white">Comunitat</h4>
                    </div>
                    <p className="text-sm text-gray-300">
                      Comparteix les teves creacions i explora les d'altres
                      usuaris.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Search className="h-5 w-5 text-purple-400" />
                      <h4 className="font-medium text-white">Exploració</h4>
                    </div>
                    <p className="text-sm text-gray-300">
                      Descobreix sistemes planetaris, estrelles i planetes
                      creats per la comunitat.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Requeriments del sistema
                </h3>
                <p className="text-gray-300 mb-4">
                  Exocosmos és una aplicació web que funciona directament al
                  navegador, sense necessitat d'instal·lar res. Està pensada per
                  ser accessible des de la majoria de dispositius moderns,
                  incloent ordinadors, portàtils i també mòbils o tauletes amb
                  bones prestacions.
                </p>
              </div>

              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-center">
                    <p className="text-white font-medium">Navegador</p>
                    <p className="text-xs text-gray-400">
                      Chrome, Edge, Firefox, Safari
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-center">
                    <p className="text-white font-medium">Dispositius</p>
                    <p className="text-xs text-gray-400">
                      Ordinador, mòbil o tauleta
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-center">
                    <p className="text-white font-medium">Memòria RAM</p>
                    <p className="text-xs text-gray-400">
                      Mínim 4 GB (8 GB recomanat)
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-center">
                    <p className="text-white font-medium">WebGL</p>
                    <p className="text-xs text-gray-400">
                      Compatible (WebGL 2.0)
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-yellow-200 text-sm space-y-2">
                    <p>
                      Si utilitzes un dispositiu més antic o amb poc rendiment
                      (com un portàtil escolar o un mòbil bàsic), pots ajustar
                      la configuració de rendiment des del menú de
                      visualització. Allà pots:
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Desactivar el post-processat com el bloom</li>
                      <li>Reduir l’escala de píxel (resolució)</li>
                      <li>Millorar el rendiment sense perdre funcionalitat</li>
                    </ul>
                    <p>
                      Per una millor experiència, recomanem navegadors com
                      Google Chrome o Microsoft Edge en les seves versions més
                      recents.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">
                    Nota sobre dispositius mòbils
                  </h4>
                  <p className="text-gray-300 text-sm">
                    L'aplicació funciona també en mòbils i tauletes. Tot i això,
                    l'experiència pot variar segons el rendiment del dispositiu.
                    En mòbils de gamma mitjana-alta funciona correctament,
                    especialment si es redueix la qualitat gràfica des de les
                    opcions de rendiment.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Primers Passos */}
          <section className="bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-800">
            <h2
              className="text-2xl font-bold text-white mb-6"
              id="primers-passos"
            >
              2.2. Primers Passos
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Com accedir a l'aplicació
                </h3>
                <p className="text-gray-300 mb-4">
                  Exocosmos és una aplicació web accessible des de qualsevol
                  dispositiu amb un navegador compatible. Per accedir-hi:
                </p>

                <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-300">
                  <li>Obre el teu navegador web preferit.</li>
                  <li>
                    Visita{" "}
                    <a
                      href="https://exocosmos.vercel.app"
                      className="text-purple-400 hover:underline"
                    >
                      https://exocosmos.vercel.app
                    </a>
                  </li>
                  <li>Seràs dirigit a la pàgina d'inici d'Exocosmos.</li>
                </ol>

                <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
                  <img
                    src="/images/screenshots/inici.webp"
                    alt="Pàgina d'inici d'Exocosmos"
                    className="w-full h-auto"
                  />
                  <div className="p-3 text-center text-sm text-gray-400">
                    Pàgina d'inici d'Exocosmos
                  </div>
                </div>

                <p className="text-gray-300 mb-4">
                  Des de la pàgina d'inici, pots explorar la informació sobre
                  l'aplicació o iniciar sessió per accedir a totes les
                  funcionalitats.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Procés de registre
                </h3>
                <p className="text-gray-300 mb-4">
                  Per utilitzar totes les funcionalitats d'Exocosmos, necessites
                  crear un compte. El procés de registre és senzill i gratuït:
                </p>

                <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-300">
                  <li>
                    A la pàgina d'inici, fes clic al botó{" "}
                    <span className="text-purple-400">Registrar-se</span>.
                  </li>
                  <li>
                    Omple el formulari amb les teves dades:
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Nom d'usuari</li>
                      <li>Correu electrònic</li>
                      <li>Contrasenya (mínim 8 caràcters)</li>
                    </ul>
                  </li>
                  <li>Accepta els termes i condicions.</li>
                  <li>
                    Fes clic a{" "}
                    <span className="text-purple-400">Crear compte</span>.
                  </li>
                  <li>
                    Rebràs un correu electrònic de confirmació. Fes clic a
                    l'enllaç per verificar el teu compte.
                  </li>
                </ol>

                <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
                  <img
                    src="/images/screenshots/registre.png"
                    alt="Formulari de registre d'Exocosmos"
                    className="w-full h-auto"
                  />
                  <div className="p-3 text-center text-sm text-gray-400">
                    Formulari de registre d'Exocosmos
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Inici de sessió
                </h3>
                <p className="text-gray-300 mb-4">
                  Un cop tinguis un compte, pots iniciar sessió a Exocosmos
                  seguint aquests passos:
                </p>

                <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-300">
                  <li>
                    A la pàgina d'inici, fes clic al botó{" "}
                    <span className="text-purple-400">Iniciar sessió</span>.
                  </li>
                  <li>Introdueix el teu correu electrònic i contrasenya.</li>
                  <li>
                    Fes clic a <span className="text-purple-400">Entrar</span>.
                  </li>
                </ol>

                <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
                  <img
                    src="/images/screenshots/inici-sessio.png"
                    alt="Formulari d'inici de sessió d'Exocosmos"
                    className="w-full h-auto"
                  />
                  <div className="p-3 text-center text-sm text-gray-400">
                    Formulari d'inici de sessió d'Exocosmos
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Tour inicial de la interfície
                </h3>
                <p className="text-gray-300 mb-4">
                  Després d'iniciar sessió, accediràs al menú principal
                  d'Exocosmos.
                </p>

                <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
                  <img
                    src="/images/screenshots/menu.png"
                    alt="Menú principal d'Exocosmos"
                    className="w-full h-auto"
                  />
                  <div className="p-3 text-center text-sm text-gray-400">
                    Menú principal d'Exocosmos
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-purple-400" />
                      <h4 className="font-medium text-white">Crear</h4>
                    </div>
                    <p className="text-sm text-gray-300">
                      Accedeix a les eines de creació per dissenyar els teus
                      propis sistemes planetaris, estrelles i planetes.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-5 w-5 text-purple-400" />
                      <h4 className="font-medium text-white">Explorar</h4>
                    </div>
                    <p className="text-sm text-gray-300">
                      Descobreix sistemes planetaris, estrelles i planetes
                      creats per altres usuaris. Pots filtrar per popularitat,
                      data de creació o tipus.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <GuideNavigation currentSection="primeres-passes" />
      </div>
    </main>
  );
};

export default GuidePrimeresPasses;
