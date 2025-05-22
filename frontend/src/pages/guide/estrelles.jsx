"use client";

import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Info,
  Lightbulb,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Thermometer,
  Scale,
  Ruler,
  Palette,
  Save,
} from "lucide-react";
import { GuideNavigation } from "../../components/ui/GuideNavigation";

const GuideEstrelles = () => {
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
          <span className="text-white">Estrelles</span>
        </div>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-900/50 flex items-center justify-center flex-shrink-0">
              <Star className="h-5 w-5 text-purple-400" />
            </div>
            4. Estrelles
          </h1>
          <p className="text-xl text-gray-300">
            Aprèn a crear i personalitzar estrelles per als teus sistemes
            planetaris.
          </p>
        </header>

        {/* Main content */}
        <div className="space-y-8">
          {/* Introducció a les Estrelles */}
          <section className="bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6" id="introduccio">
              4.1. Introducció a les Estrelles
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Què són les estrelles?
                </h3>
                <p className="text-gray-300 mb-4">
                  Les estrelles són cossos celestes massius que generen energia
                  mitjançant la fusió nuclear al seu nucli. Són el centre dels
                  sistemes planetaris i la seva massa, temperatura i tipus
                  determinen les característiques de la zona habitable i les
                  condicions dels planetes que les orbiten.
                </p>

                <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
                  <img
                    src="/images/screenshots/tipus-estrelles.svg"
                    alt="Diferents tipus d'estrelles"
                    className="w-full h-auto"
                  />
                  <div className="p-3 text-center text-sm text-gray-400">
                    Diferents tipus d'estrelles segons la seva massa i
                    temperatura
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-blue-200 text-sm">
                    <p className="font-medium mb-1">Classificació estel·lar:</p>
                    <p>
                      Les estrelles es classifiquen segons el seu tipus
                      espectral (O, B, A, F, G, K, M) que indica la seva
                      temperatura superficial i color. El nostre Sol és una
                      estrella de tipus G amb una temperatura superficial
                      d'aproximadament 5.800 K.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Importància de les estrelles
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Centre gravitatori
                    </h4>
                    <p className="text-sm text-gray-300">
                      Les estrelles contenen la major part de la massa d'un
                      sistema planetari i determinen les òrbites dels planetes i
                      altres cossos celestes.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Font d'energia
                    </h4>
                    <p className="text-sm text-gray-300">
                      Proporcionen llum i calor als planetes, factors essencials
                      per al desenvolupament de la vida tal com la coneixem.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Zona habitable
                    </h4>
                    <p className="text-sm text-gray-300">
                      La massa i temperatura de l'estrella determinen la
                      ubicació de la zona habitable, on l'aigua pot existir en
                      estat líquid a la superfície d'un planeta.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Evolució del sistema
                    </h4>
                    <p className="text-sm text-gray-300">
                      Les estrelles evolucionen amb el temps, canviant les
                      condicions del sistema planetari al llarg de milers de
                      milions d'anys.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Tipus d'estrelles a Exocosmos
                </h3>
                <p className="text-gray-300 mb-4">
                  A Exocosmos pots crear diferents tipus d'estrelles segons les
                  seves característiques físiques:
                </p>

                <div className="overflow-x-auto mb-6">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-800">
                        <th className="border border-gray-700 px-4 py-2 text-left text-white">
                          Tipus
                        </th>
                        <th className="border border-gray-700 px-4 py-2 text-left text-white">
                          Temperatura (K)
                        </th>
                        <th className="border border-gray-700 px-4 py-2 text-left text-white">
                          Color
                        </th>
                        <th className="border border-gray-700 px-4 py-2 text-left text-white">
                          Massa (Sol=1)
                        </th>
                        <th className="border border-gray-700 px-4 py-2 text-left text-white">
                          Característiques
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-gray-900">
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          O
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          ≥ 30,000
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-blue-300">
                          Blau
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          ≥ 16
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          Molt calentes i lluminoses, vida curta
                        </td>
                      </tr>
                      <tr className="bg-gray-800">
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          B
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          10,000 - 30,000
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-blue-200">
                          Blau-blanc
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          2.1 - 16
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          Molt lluminoses, comunes en braços espirals
                        </td>
                      </tr>
                      <tr className="bg-gray-900">
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          A
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          7,500 - 10,000
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-200">
                          Blanc
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          1.4 - 2.1
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          Comunes, rotació ràpida
                        </td>
                      </tr>
                      <tr className="bg-gray-800">
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          F
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          6,000 - 7,500
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-yellow-100">
                          Blanc-groc
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          1.04 - 1.4
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          Zones habitables àmplies
                        </td>
                      </tr>
                      <tr className="bg-gray-900">
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          G
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          5,200 - 6,000
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-yellow-300">
                          Groc
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          0.8 - 1.04
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          Com el nostre Sol, estables
                        </td>
                      </tr>
                      <tr className="bg-gray-800">
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          K
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          3,700 - 5,200
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-orange-300">
                          Taronja
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          0.45 - 0.8
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          Comunes, vida llarga
                        </td>
                      </tr>
                      <tr className="bg-gray-900">
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          M
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          2,400 - 3,700
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-red-400">
                          Vermell
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          0.08 - 0.45
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                          Nanes vermelles, les més comunes
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-4 mb-4 flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-yellow-200 text-sm">
                    <p className="font-medium mb-1">Consell:</p>
                    <p>
                      Per recordar l'ordre dels tipus espectrals, pots utilitzar
                      la frase mnemotècnica: "Oh Be A Fine Girl/Guy, Kiss Me"
                      (O, B, A, F, G, K, M).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Creació d'Estrelles */}
          <section className="bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6" id="creacio">
              4.2. Creació d'Estrelles
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Creació automàtica d'estrelles
                </h3>
                <p className="text-gray-300 mb-4">
                  A Exocosmos, les estrelles no es creen manualment de forma
                  independent. Quan crees un nou sistema planetari, se't
                  demanarà introduir també la informació de la seva estrella
                  principal. Aquesta estrella es crearà automàticament juntament
                  amb el sistema.
                </p>
                <p className="text-gray-300 mb-4">
                  Un cop creada, pots editar la teva estrella des de la pàgina
                  de detalls del sistema. Les opcions d'edició et permetran
                  modificar el tipus espectral, temperatura, massa, radi i
                  altres propietats.
                </p>
              </div>
            </div>
          </section>

          {/* Gestió d'Estrelles */}
          <section className="bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6" id="gestio">
              4.3. Gestió d'Estrelles
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Visualització de detalls
                </h3>
                <p className="text-gray-300 mb-4">
                  Un cop creada una estrella, pots accedir a la seva pàgina de
                  detalls per veure tota la informació i gestionar-la:
                </p>

                <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
                  <img
                    src="/images/screenshots/detall-estrella.png"
                    alt="Pàgina de detalls d'una estrella"
                    className="w-full h-auto"
                  />
                  <div className="p-3 text-center text-sm text-gray-400">
                    Pàgina de detalls d'una estrella a Exocosmos
                  </div>
                </div>

                <p className="text-gray-300 mb-4">
                  La pàgina de detalls d'una estrella mostra la següent
                  informació:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Propietats de la estrella
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Nom de l'estrella</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Descripció de l'estrella</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Tipus espectral</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Temperatura superficial</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Massa i radi</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Lluminositat</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Visualització
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Model 3D de l'estrella</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          Comparació de mida amb el Sol, Terra i Jupiter.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Edició d'estrelles
                </h3>
                <p className="text-gray-300 mb-4">
                  Pots editar les propietats de la teva estrella en qualsevol
                  moment seguint aquests passos:
                </p>

                <ol className="list-decimal pl-6 mb-6 space-y-3 text-gray-300">
                  <li>
                    Accedeix a la pàgina de detalls de l'estrella que vols
                    editar.
                  </li>
                  <li>
                    Fes clic al botó{" "}
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800 rounded text-white text-sm">
                      <Edit size={14} /> Editar
                    </span>{" "}
                    que trobaràs a la part superior de la pàgina.
                  </li>
                  <li>
                    Modifica els camps que vulguis actualitzar (nom, tipus
                    espectral, temperatura, massa, radi, etc.).
                  </li>
                  <li>
                    Fes clic a{" "}
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-900/30 rounded text-purple-300 text-sm">
                      <Save size={14} /> Desar canvis
                    </span>{" "}
                    per guardar les modificacions.
                  </li>
                </ol>

                <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
                  <img
                    src="/images/screenshots/edicio-estrella.png"
                    alt="Formulari d'edició d'una estrella"
                    className="w-full h-auto"
                  />
                  <div className="p-3 text-center text-sm text-gray-400">
                    Formulari d'edició d'una estrella existent
                  </div>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-yellow-200 text-sm">
                    <p className="font-medium mb-1">Consell:</p>
                    <p>
                      Quan editis una estrella, tingues en compte que els canvis
                      en les seves propietats poden afectar la zona habitable i,
                      per tant, la potencial habitabilitat dels planetes que
                      l'orbiten. L'aplicació t'avisarà si algun planeta passa a
                      estar fora de la zona habitable després de l'edició.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Eliminació d'estrelles
                </h3>
                <p className="text-gray-300 mb-4">
                  A Exocosmos, no és possible eliminar una estrella principal
                  d’un sistema planetari. Les estrelles es creen automàticament
                  en el moment de crear el sistema i són un component essencial
                  del mateix.
                </p>

                <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="text-red-200 text-sm">
                    <p className="font-medium mb-1">Important:</p>
                    <p>
                      Les estrelles principals no es poden eliminar de manera
                      independent. Si vols eliminar completament una estrella,
                      cal eliminar tot el sistema planetari al qual pertany.
                    </p>
                    <p className="mt-2">
                      Aquesta mesura garanteix la coherència estructural dels
                      sistemes, ja que cada sistema planetari ha de tenir com a
                      mínim una estrella.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Guide Navigation */}
        <GuideNavigation currentSection="estrelles" />
      </div>
    </main>
  );
};

export default GuideEstrelles;
