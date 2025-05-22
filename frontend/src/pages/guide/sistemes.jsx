"use client";

import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Info,
  Lightbulb,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Search,
  Star,
  Share2,
  Eye,
  Save,
  Ruler,
  PenLine,
} from "lucide-react";
import GuideNavigation from "../../components/ui/GuideNavigation";

const GuideSistemes = () => {
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
          <span className="text-white">Sistemes Planetaris</span>
        </div>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-900/50 flex items-center justify-center flex-shrink-0">
              <Globe className="h-5 w-5 text-purple-400" />
            </div>
            4. Sistemes Planetaris
          </h1>
          <p className="text-xl text-gray-300">
            Aprèn a crear, gestionar i explorar sistemes planetaris complets amb
            Exocosmos.
          </p>
        </header>

        {/* Main content */}
        <div className="space-y-8">
          {/* Introducció als Sistemes Planetaris */}
          <section className="bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6" id="introduccio">
              4.1. Introducció als Sistemes Planetaris
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Descripció
                </h3>
                <p className="text-gray-300 mb-4">
                  Un sistema planetari a Exocosmos és un conjunt d'objectes
                  celestes (estrelles, planetes, llunes, etc.) que orbiten al
                  voltant d'una o més estrelles centrals. Els sistemes
                  planetaris són la base de l'aplicació i el punt de partida per
                  a totes les teves creacions.
                </p>

                <p className="text-gray-300 mb-4">
                  Cada sistema planetari conté com a mínim una estrella central
                  i pot tenir múltiples planetes orbitant al seu voltant. Pots
                  personalitzar cada element del sistema amb gran detall, des de
                  les propietats físiques de l'estrella fins a la composició
                  atmosfèrica dels planetes.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Característiques principals
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Estrella central
                    </h4>
                    <p className="text-sm text-gray-300">
                      Cada sistema té una estrella central amb propietats
                      personalitzables com massa, radi, temperatura i tipus
                      espectral.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Múltiples planetes
                    </h4>
                    <p className="text-sm text-gray-300">
                      Pots afegir diversos planetes al teu sistema, cadascun amb
                      les seves pròpies característiques i òrbites.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Creació de Sistemes Planetaris */}
          <section className="bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6" id="creacio">
              4.2. Creació de Sistemes Planetaris
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Passos detallats
                </h3>
                <p className="text-gray-300 mb-4">
                  Crear un nou sistema planetari a Exocosmos és senzill. Segueix
                  aquests passos:
                </p>

                <ol className="list-decimal pl-6 mb-6 space-y-4 text-gray-300">
                  <li>
                    <strong className="text-white">
                      Accedeix al teu perfil:
                    </strong>{" "}
                    Inicia sessió i fes clic a la teva imatge de perfil per
                    accedir al teu espai personal.
                  </li>
                  <li>
                    <strong className="text-white">Inicia la creació:</strong>{" "}
                    Fes clic al botó{" "}
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-900/30 rounded text-purple-300 text-sm">
                      <Plus size={14} /> Nou Sistema
                    </span>{" "}
                    que trobaràs a la secció "Els meus sistemes".
                  </li>
                  <li>
                    <strong className="text-white">Omple el formulari:</strong>{" "}
                    Introdueix les dades bàsiques del teu sistema:
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>
                        <strong className="text-white">Nom del sistema:</strong>{" "}
                        Escull un nom descriptiu per al teu sistema planetari.
                      </li>
                      <li>
                        <strong className="text-white">
                          Descripció (opcional):
                        </strong>{" "}
                        Afegeix detalls sobre el teu sistema per ajudar altres
                        usuaris a entendre'l.
                      </li>
                      <li>
                        <strong className="text-white">
                          Distància (anys llum):
                        </strong>{" "}
                        Especifica la distància des del Sol en anys llum.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong className="text-white">Desa el sistema:</strong> Fes
                    clic a "Crear sistema" per guardar el teu nou sistema
                    planetari.
                  </li>
                  <li>
                    <strong className="text-white">Edita la estrella:</strong>{" "}
                    Un cop creat el sistema, pots editar la estrella central del
                    sistema. Segueix les instruccions per configurar l'estrella
                    del teu sistema.
                  </li>
                  <li>
                    <strong className="text-white">Afegeix planetes:</strong>{" "}
                    Després de crear l'estrella, podràs començar a afegir
                    planetes al teu sistema.
                  </li>
                </ol>

                <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
                  <img
                    src="/images/screenshots/crear-sistema.png"
                    alt="Formulari de creació d'un sistema planetari"
                    className="w-full h-auto"
                  />
                  <div className="p-3 text-center text-sm text-gray-400">
                    Formulari de creació d'un nou sistema planetari
                  </div>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-yellow-200 text-sm">
                    <p className="font-medium mb-1">Consell:</p>
                    <p>
                      Pensa en el teu sistema planetari com un projecte complet.
                      És recomanable tenir una idea general del tipus de sistema
                      que vols crear abans de començar, considerant aspectes com
                      el tipus d'estrella, el nombre de planetes i les seves
                      característiques principals.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Camps del formulari
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <PenLine className="h-5 w-5 text-purple-400" />
                      <h4 className="font-medium text-white">
                        Nom del sistema
                      </h4>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      Escull un nom descriptiu i únic per al teu sistema
                      planetari. Pot ser un nom científic, creatiu o inspirat en
                      la mitologia.
                    </p>
                    <div className="bg-gray-700/50 p-2 rounded text-sm text-gray-300">
                      <strong>Exemple:</strong> "Kepler-186", "Trappist",
                      "Asgard"
                    </div>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-5 w-5 text-purple-400" />
                      <h4 className="font-medium text-white">Descripció</h4>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      Camp opcional on pots afegir detalls sobre el teu sistema,
                      com la seva història, característiques especials o
                      qualsevol altra informació rellevant.
                    </p>
                    <div className="bg-gray-700/50 p-2 rounded text-sm text-gray-300">
                      <strong>Exemple:</strong> "Sistema amb una nana vermella i
                      tres planetes rocosos, un dels quals es troba a la zona
                      habitable."
                    </div>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Ruler className="h-5 w-5 text-purple-400" />
                      <h4 className="font-medium text-white">
                        Distància (anys llum)
                      </h4>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      Especifica la distància des del nostre Sol fins al teu
                      sistema planetari, mesurada en anys llum. Aquest valor
                      ajuda a situar el teu sistema en el context galàctic.
                    </p>
                    <div className="bg-gray-700/50 p-2 rounded text-sm text-gray-300">
                      <strong>Exemple:</strong> "4.2" (distància aproximada a
                      l'estrella més propera, Proxima Centauri)
                    </div>
                  </div>
                </div>

                <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="text-red-200 text-sm">
                    <p className="font-medium mb-1">Important:</p>
                    <p>
                      Tots els camps marcats amb un asterisc (*) són
                      obligatoris. Assegura't d'omplir-los correctament abans
                      d'intentar crear el sistema.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Exemples d'ús
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Sistema solar analògic
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Crea un sistema similar al nostre Sistema Solar, amb una
                      estrella tipus G i diversos planetes a diferents
                      distàncies.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">Nom:</strong> "Sol
                          Analògic"
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">Descripció:</strong>{" "}
                          "Sistema planetari similar al nostre Sistema Solar,
                          amb una estrella tipus G i vuit planetes"
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">Distància:</strong> 50
                          anys llum
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Sistema de nana vermella
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Crea un sistema compacte al voltant d'una estrella nana
                      vermella, amb planetes petits i propers a l'estrella.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">Nom:</strong> "Proxima
                          Nova"
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">Descripció:</strong>{" "}
                          "Sistema compacte amb una nana vermella i tres
                          planetes rocosos en òrbites properes"
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">Distància:</strong> 12
                          anys llum
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Sistema de gegant gasós
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Crea un sistema dominat per un gran planeta gasós amb
                      múltiples llunes, similar a Júpiter.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">Nom:</strong> "Olympus"
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">Descripció:</strong>{" "}
                          "Sistema amb una estrella massiva i un gegant gasós
                          dominant amb un extens sistema de llunes"
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">Distància:</strong> 75
                          anys llum
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 mb-4 flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-200 text-sm">
                    Pots trobar més exemples i inspiració explorant els sistemes
                    planetaris creats per altres usuaris a la secció "Explorar"
                    de l'aplicació.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Gestió de Sistemes Planetaris */}
          <section className="bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6" id="gestio">
              4.3. Gestió de Sistemes Planetaris
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Visualització de detalls
                </h3>
                <p className="text-gray-300 mb-4">
                  Un cop creat un sistema planetari, pots accedir a la seva
                  pàgina de detalls per veure tota la informació i gestionar els
                  seus components:
                </p>

                <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
                  <img
                    src="/images/screenshots/detall-sistema.png"
                    alt="Pàgina de detalls d'un sistema planetari"
                    className="w-full h-auto"
                  />
                  <div className="p-3 text-center text-sm text-gray-400">
                    Pàgina de detalls d'un sistema planetari a Exocosmos
                  </div>
                </div>

                <p className="text-gray-300 mb-4">
                  La pàgina de detalls d'un sistema planetari mostra la següent
                  informació:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Informació bàsica
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Nom del sistema</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Descripció</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Distància en anys llum</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Estrella central
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Nom de l'estrella</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Tipus d'estrella</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Temperatura</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Massa i radi</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">Planetes</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Llista de planetes del sistema</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          Miniatures i informació bàsica de cada planeta
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Opció per afegir nous planetes</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Informació del creador
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Nom d'usuari del creador</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Avatar i enllaç al perfil</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>Estadístiques del sistema</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Edició de sistemes
                </h3>
                <p className="text-gray-300 mb-4">
                  Pots editar els detalls del teu sistema planetari en qualsevol
                  moment seguint aquests passos:
                </p>

                <ol className="list-decimal pl-6 mb-6 space-y-3 text-gray-300">
                  <li>
                    Accedeix a la pàgina de detalls del sistema que vols editar.
                  </li>
                  <li>
                    Fes clic al botó{" "}
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800 rounded text-white text-sm">
                      <Edit size={14} /> Editar
                    </span>{" "}
                    que trobaràs a la part superior de la pàgina.
                  </li>
                  <li>
                    Modifica els camps que vulguis actualitzar (nom, descripció,
                    distància).
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
                    src="/images/screenshots/edicio-sistema.png"
                    alt="Formulari d'edició d'un sistema planetari"
                    className="w-full h-auto"
                  />
                  <div className="p-3 text-center text-sm text-gray-400">
                    Formulari d'edició d'un sistema planetari existent
                  </div>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-yellow-200 text-sm">
                    <p className="font-medium mb-1">Consell:</p>
                    <p>
                      Si vols fer canvis més profunds al teu sistema, com
                      modificar l'estrella o els planetes, hauràs d'accedir a
                      les pàgines de detalls específiques d'aquests elements.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Eliminació de sistemes
                </h3>
                <p className="text-gray-300 mb-4">
                  Si vols eliminar un sistema planetari complet, segueix aquests
                  passos:
                </p>

                <ol className="list-decimal pl-6 mb-6 space-y-3 text-gray-300">
                  <li>
                    Accedeix a la pàgina de detalls del sistema que vols
                    eliminar.
                  </li>
                  <li>
                    Fes clic al botó{" "}
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-900/30 rounded text-red-300 text-sm">
                      <Trash2 size={14} /> Eliminar
                    </span>{" "}
                    que trobaràs a la part superior de la pàgina.
                  </li>
                  <li>
                    Confirma l'acció al diàleg de confirmació que apareixerà.
                  </li>
                </ol>

                <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="text-red-200 text-sm">
                    <p className="font-medium mb-1">Advertència:</p>
                    <p>
                      L'eliminació d'un sistema planetari és permanent i no es
                      pot desfer. Tots els planetes i l'estrella associats al
                      sistema també seran eliminats.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <Link
            to="/guide/guia-rapida"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <ChevronLeft size={16} /> Guia Ràpida
          </Link>

          <Link
            to="/guide/estrelles"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Estrelles <ChevronRight size={16} />
          </Link>
        </div>

        {/* Guide Navigation */}
        <GuideNavigation currentSection="sistemes" />
      </div>
    </main>
  );
};

export default GuideSistemes;
