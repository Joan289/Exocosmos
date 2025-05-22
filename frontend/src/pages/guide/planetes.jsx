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
  Droplets,
  Wind,
  Mountain,
  Thermometer,
  Scale,
  Ruler,
  Save,
} from "lucide-react";
import { GuideNavigation } from "../../components/ui/GuideNavigation";

const GuidePlanetes = () => {
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
          <span className="text-white">Planetes</span>
        </div>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-900/50 flex items-center justify-center flex-shrink-0">
              <Globe className="h-5 w-5 text-purple-400" />
            </div>
            5. Planetes
          </h1>
          <p className="text-xl text-gray-300">
            Aprèn a crear i personalitzar planetes amb diferents
            característiques i propietats.
          </p>
        </header>

        {/* Main content */}
        <div className="space-y-8">
          {/* Introducció als Planetes */}
          <section className="bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6" id="introduccio">
              5.1. Introducció als Planetes
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Què són els planetes?
                </h3>
                <p className="text-gray-300 mb-4">
                  Els planetes són cossos celestes que orbiten al voltant d'una
                  estrella, tenen suficient massa per tenir forma esfèrica i han
                  netejat el seu entorn orbital. A Exocosmos, pots crear una
                  àmplia varietat de planetes, des de petits mons rocosos fins a
                  gegants gasosos, cadascun amb les seves pròpies
                  característiques úniques.
                </p>

                <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
                  <img
                    src="/images/screenshots/planeta-tipus.png"
                    alt="Diferents tipus de planetes"
                    className="w-full h-auto"
                  />
                  <div className="p-3 text-center text-sm text-gray-400">
                    Diferents tipus de planetes que pots crear a Exocosmos
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-blue-200 text-sm">
                    <p className="font-medium mb-1">
                      Classificació planetària:
                    </p>
                    <p>
                      Els planetes es classifiquen principalment en dos grans
                      grups: planetes terrestres (rocosos) i gegants gasosos.
                      Entre aquests extrems hi ha categories com super-Terres,
                      mini-Neptuns i moltes altres varietats que s'han descobert
                      en sistemes exoplanetaris.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Tipus de planetes a Exocosmos
                </h3>
                <p className="text-gray-300 mb-4">
                  A Exocosmos pots crear diversos tipus de planetes, cadascun
                  amb característiques i propietats diferents:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Planetes rocosos
                    </h4>
                    <p className="text-sm text-gray-300">
                      Similars a Mercuri, Venus, la Terra i Mart. Tenen una
                      superfície sòlida, compostos principalment de roques i
                      metalls. Poden tenir atmosferes de diferents densitats i
                      composicions.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Super-Terres
                    </h4>
                    <p className="text-sm text-gray-300">
                      Planetes rocosos més massius que la Terra però menys
                      massius que Neptú. Poden tenir atmosferes denses i són
                      candidats interessants per a l'habitabilitat.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Gegants gasosos
                    </h4>
                    <p className="text-sm text-gray-300">
                      Similars a Júpiter i Saturn. Compostos principalment
                      d'hidrogen i heli, amb possibles nuclis rocosos. Tenen
                      atmosferes extremadament profundes i poden tenir sistemes
                      d'anells i moltes llunes.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Gegants gelats
                    </h4>
                    <p className="text-sm text-gray-300">
                      Similars a Urà i Neptú. Contenen més elements pesants que
                      els gegants gasosos, com aigua, amoníac i metà en estat
                      gelat o líquid a alta pressió.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">Altres</h4>
                    <p className="text-sm text-gray-300">
                      Categoria especial per a una llibertat total de creació.
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-4 mb-4 flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-yellow-200 text-sm">
                    <p className="font-medium mb-1">Consell:</p>
                    <p>
                      Quan creïs un planeta, considera la seva posició respecte
                      a l'estrella. Els planetes més propers tendeixen a ser més
                      petits i rocosos, mentre que els més llunyans solen ser
                      més grans i gasosos. Aquesta distribució s'observa en
                      molts sistemes planetaris, inclòs el nostre Sistema Solar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Creació de Planetes */}
          <section className="bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6" id="creacio">
              5.2. Creació de Planetes
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Passos per crear un planeta
                </h3>
                <p className="text-gray-300 mb-4">
                  A Exocosmos, els planetes es creen dins d'un sistema
                  planetari. Segueix aquests passos per crear un nou planeta:
                </p>

                <ol className="list-decimal pl-6 mb-6 space-y-4 text-gray-300">
                  <li>
                    <strong className="text-white">
                      Accedeix al sistema planetari:
                    </strong>{" "}
                    Primer has de tenir un sistema planetari creat amb almenys
                    una estrella. Si encara no en tens cap, crea'n un seguint
                    les instruccions de la secció "Sistemes Planetaris".
                  </li>
                  <li>
                    <strong className="text-white">Inicia la creació:</strong> A
                    la pàgina de detalls del sistema, fes clic al botó{" "}
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-900/30 rounded text-purple-300 text-sm">
                      <Plus size={14} /> Nou Planeta
                    </span>{" "}
                    que trobaràs a la secció de planetes.
                  </li>
                  <li>
                    <strong className="text-white">
                      Selecciona el tipus de planeta:
                    </strong>{" "}
                    Escull entre les diferents categories de planetes
                    disponibles (rocós, gegant gasós, oceànic, etc.). Aquesta
                    selecció determinarà les opcions i paràmetres disponibles en
                    els passos següents.
                  </li>
                  <li>
                    <strong className="text-white">
                      Configura les propietats bàsiques:
                    </strong>{" "}
                    Introdueix les dades bàsiques del teu planeta:
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>
                        <strong className="text-white">Nom del planeta:</strong>{" "}
                        Escull un nom descriptiu.
                      </li>
                      <li>
                        <strong className="text-white">Massa:</strong>{" "}
                        Especifica la massa en masses terrestres.
                      </li>
                      <li>
                        <strong className="text-white">Radi:</strong> Indica el
                        radi en radis terrestres.
                      </li>
                      <li>
                        <strong className="text-white">
                          Distància a l'estrella:
                        </strong>{" "}
                        Especifica la distància en unitats astronòmiques (UA).
                      </li>
                      <li>
                        <strong className="text-white">Període orbital:</strong>{" "}
                        La durada de l'any del planeta (es pot calcular
                        automàticament a partir de la distància).
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong className="text-white">
                      Personalitza l'atmosfera:
                    </strong>{" "}
                    Configura la composició i propietats de l'atmosfera del
                    planeta:
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>
                        Selecciona els gasos principals i les seves proporcions
                      </li>
                      <li>Ajusta la pressió atmosfèrica</li>
                      <li>Configura l'opacitat i els efectes visuals</li>
                    </ul>
                  </li>
                  <li>
                    <strong className="text-white">
                      Dissenya la superfície:
                    </strong>{" "}
                    Personalitza l'aparença i composició de la superfície del
                    planeta:
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Distribució de terres i oceans</li>
                      <li>Topografia i relleu</li>
                      <li>Colors i textures</li>
                      <li>Característiques especials (anells, taques, etc.)</li>
                    </ul>
                  </li>
                  <li>
                    <strong className="text-white">
                      Previsualitza el planeta:
                    </strong>{" "}
                    Utilitza l'eina de previsualització 3D per veure com quedarà
                    el teu planeta abans de crear-lo.
                  </li>
                  <li>
                    <strong className="text-white">Desa el planeta:</strong> Fes
                    clic a "Crear planeta" per guardar-lo al teu sistema
                    planetari.
                  </li>
                </ol>

                <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
                  <img
                    src="/images/screenshots/crear-planeta.png"
                    alt="Formulari de creació d'un planeta"
                    className="w-full h-auto"
                  />
                  <div className="p-3 text-center text-sm text-gray-400">
                    Formulari de creació d'un nou planeta a Exocosmos
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Editor de textures
                </h3>
                <p className="text-gray-300 mb-4">
                  Exocosmos permet personalitzar l’aspecte visual dels planetes
                  mitjançant tres textures: la de superfície, la de relleu i la
                  de l’atmosfera. Totes es poden pintar en un llenç interactiu,
                  carregar des del teu ordinador o reiniciar a la versió
                  predeterminada.
                </p>

                <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
                  <img
                    src="/images/screenshots/textures.png"
                    alt="Editor de textures planetàries"
                    className="w-full h-auto"
                  />
                  <div className="p-3 text-center text-sm text-gray-400">
                    Personalitza visualment la superfície, relleu i atmosfera
                    del teu planeta
                  </div>
                </div>

                <div className="space-y-6 mb-6">
                  {/* Superfície */}
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Textura de superfície
                    </h4>
                    <p className="text-sm text-gray-300">
                      Defineix el color i patró visual del planeta. Pots pintar
                      directament, pujar una imatge (PNG/JPG) o utilitzar una
                      textura per defecte segons el tipus de planeta.
                    </p>
                  </div>

                  {/* Heightmap */}
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Mapa de relleu
                    </h4>
                    <p className="text-sm text-gray-300">
                      Permet afegir altituds al model mitjançant tons de gris:
                      negre representa les zones més baixes, blanc les més
                      altes. Funciona amb edició manual o càrrega d’imatges.
                    </p>
                  </div>

                  {/* Atmosfera */}
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Textura d’atmosfera
                    </h4>
                    <p className="text-sm text-gray-300">
                      Representa una capa translúcida al voltant del planeta. Es
                      recomana utilitzar imatges amb transparència (PNG) per
                      representar boires, aurores o núvols.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 mb-4 flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-blue-200 text-sm">
                    <p>
                      Totes les textures es poden editar amb un pinzell
                      configurable, carregar com a fitxer o reiniciar. La
                      resolució recomanada és 1024×512 o superior per garantir
                      qualitat al model 3D. Els canvis es reflecteixen quan es
                      clica a "Aplicar al planeta".
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Exemples de planetes
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Terra analògica
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Un planeta similar a la Terra, amb oceans, continents i
                      una atmosfera respirable.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">Tipus:</strong> Rocós
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">Massa:</strong> 1 massa
                          terrestre
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">Atmosfera:</strong> 78%
                          nitrogen, 21% oxigen, 1% altres gasos
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">Superfície:</strong>{" "}
                          70% aigua, 30% terra
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Gegant gasós
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Un planeta massiu similar a Júpiter, amb bandes de núvols
                      i un sistema d'anells.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">Tipus:</strong> Gegant
                          gasós
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">Massa:</strong> 318
                          masses terrestres
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">Atmosfera:</strong> 90%
                          hidrogen, 10% heli, traces d'altres gasos
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">
                            Característiques:
                          </strong>{" "}
                          Bandes de núvols, Gran Taca Vermella, sistema d'anells
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">Món oceànic</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Un planeta cobert completament per un oceà profund, amb
                      una atmosfera densa.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">Tipus:</strong> Oceànic
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">Massa:</strong> 2.5
                          masses terrestres
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">Atmosfera:</strong> 65%
                          nitrogen, 30% diòxid de carboni, 5% altres gasos
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>
                          <strong className="text-white">Superfície:</strong>{" "}
                          100% aigua, amb possibles illes flotants o plataformes
                          de gel
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Gestió de Planetes */}
          <section className="bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6" id="gestio">
              5.3. Gestió de Planetes
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Visualització de detalls
                </h3>
                <p className="text-gray-300 mb-4">
                  Un cop creat un planeta, pots accedir a la seva pàgina de
                  detalls per consultar-ne totes les propietats i visualitzar-lo
                  en 3D.
                </p>

                <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
                  <img
                    src="/images/screenshots/detall-planeta.png"
                    alt="Pàgina de detalls d'un planeta"
                    className="w-full h-auto"
                  />
                  <div className="p-3 text-center text-sm text-gray-400">
                    Pàgina de detalls d'un planeta a Exocosmos
                  </div>
                </div>

                <p className="text-gray-300 mb-4">
                  La pàgina mostra informació agrupada en pestanyes temàtiques:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Visió general
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>Nom, descripció i tipus del planeta</li>
                      <li>Massa, radi, gravetat i temperatura</li>
                      <li>Òrbita: distància a l’estrella i període orbital</li>
                      <li>Número de llunes i presència d’anells</li>
                      <li>Vista 3D interactiva</li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Propietats físiques
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>Gravetat calculada amb la massa i el radi</li>
                      <li>
                        Temperatura estimada a partir de l’albedo i distància a
                        l’estrella
                      </li>
                      <li>Velocitat d’escapament i aplanament</li>
                      <li>Índex d’habitabilitat calculat</li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Òrbita i rotació
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>Duració del dia (rotació)</li>
                      <li>Velocitat orbital i període</li>
                      <li>Inclinació axial visualitzada gràficament</li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">Composició</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>Gràfics circulars de compostos químics</li>
                      <li>Composició de la superfície i de l’atmosfera</li>
                      <li>Pressió atmosfèrica i efecte hivernacle</li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-white mb-2">
                      Altres detalls
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>Informació del sistema estel·lar</li>
                      <li>Informació del creador del planeta</li>
                      <li>Curiositats calculades automàticament</li>
                      <li>Opció per editar o eliminar el planeta</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Edició de planetes
                </h3>
                <p className="text-gray-300 mb-4">
                  Pots editar les propietats del teu planeta en qualsevol moment
                  seguint aquests passos:
                </p>

                <ol className="list-decimal pl-6 mb-6 space-y-3 text-gray-300">
                  <li>
                    Accedeix a la pàgina de detalls del planeta que vols editar.
                  </li>
                  <li>
                    Fes clic al botó{" "}
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800 rounded text-white text-sm">
                      <Edit size={14} /> Editar
                    </span>{" "}
                    que trobaràs a la part superior de la pàgina.
                  </li>
                  <li>
                    Modifica els camps que vulguis actualitzar (nom, propietats
                    físiques, atmosfera, superfície, etc.).
                  </li>
                  <li>
                    Fes clic a{" "}
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-900/30 rounded text-purple-300 text-sm">
                      <Save size={14} /> Desar canvis
                    </span>{" "}
                    per guardar les modificacions.
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Eliminació de planetes
                </h3>
                <p className="text-gray-300 mb-4">
                  Si vols eliminar un planeta, segueix aquests passos:
                </p>

                <ol className="list-decimal pl-6 mb-6 space-y-3 text-gray-300">
                  <li>
                    Accedeix a la pàgina de detalls del planeta que vols
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
                      L'eliminació d'un planeta és permanent i no es pot desfer.
                      Tots els detalls i personalitzacions del planeta es
                      perdran definitivament.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Guide Navigation */}
        <GuideNavigation currentSection="planetes" />
      </div>
    </main>
  );
};

export default GuidePlanetes;
