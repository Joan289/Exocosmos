"use client";

import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  Wifi,
  Lock,
  Eye,
  Globe,
  Lightbulb,
  XCircle,
  CheckCircle,
} from "lucide-react";

import GuideNavigation from "../../components/ui/GuideNavigation";

const GuideResolucioProblemes = () => {
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
          <span className="text-white">Resolució de Problemes</span>
        </div>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-900/50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-purple-400" />
            </div>
            7. Resolució de Problemes
          </h1>
          <p className="text-xl text-gray-300">
            Solucions als problemes més comuns i respostes a les preguntes més
            freqüents sobre Exocosmos.
          </p>
        </header>

        {/* Main content */}
        <div className="space-y-8">
          {/* Problemes Comuns */}
          <section className="bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-800">
            <h2
              className="text-2xl font-bold text-white mb-6"
              id="problemes-comuns"
            >
              7.1. Problemes Comuns
            </h2>

            <div className="space-y-8">
              {/* Problema 1: Problemes de rendiment */}
              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-red-400" /> Problemes de
                  rendiment
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      Descripció del problema
                    </h4>
                    <p className="text-gray-300">
                      L'aplicació pot funcionar lentament en alguns dispositius,
                      especialment durant la visualització de sistemes
                      complexos.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      Solucions bàsiques
                    </h4>
                    <ol className="list-decimal pl-6 space-y-3 text-gray-300">
                      <li>
                        <span className="font-medium">
                          Tanca altres aplicacions:
                        </span>{" "}
                        Assegura't de no tenir massa aplicacions obertes
                        simultàniament.
                      </li>
                      <li>
                        <span className="font-medium">
                          Actualitza el navegador:
                        </span>{" "}
                        Utilitza la versió més recent del teu navegador.
                      </li>
                      <li>
                        <span className="font-medium">
                          Simplifica el sistema:
                        </span>{" "}
                        Redueix la complexitat dels sistemes que estàs
                        visualitzant.
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Problema 2: Problemes de connexió */}
              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-red-400" /> Problemes de
                  connexió
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      Descripció del problema
                    </h4>
                    <p className="text-gray-300">
                      Problemes per accedir a l'aplicació o desar els canvis.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      Solucions bàsiques
                    </h4>
                    <ol className="list-decimal pl-6 space-y-3 text-gray-300">
                      <li>
                        <span className="font-medium">
                          Verifica la teva connexió:
                        </span>{" "}
                        Comprova que el teu dispositiu estigui connectat a
                        internet.
                      </li>
                      <li>
                        <span className="font-medium">Refresca la pàgina:</span>{" "}
                        Intenta recarregar la pàgina.
                      </li>
                      <li>
                        <span className="font-medium">
                          Torna a iniciar sessió:
                        </span>{" "}
                        Si la sessió ha caducat, torna a iniciar sessió.
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Problema 3: Errors en la creació o edició de planetes */}
              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-red-400" /> Errors en la
                  creació o edició de planetes
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      Descripció del problema
                    </h4>
                    <p className="text-gray-300">
                      Apareixen errors quan intentes crear o editar planetes,
                      com missatges d'error en enviar el formulari, problemes
                      amb les textures o impossibilitat de desar els canvis.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      Causes possibles
                    </h4>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>
                        <span className="font-medium">Dades invàlides:</span>{" "}
                        Alguns dels valors introduïts poden estar fora dels
                        rangs permesos o en formats incorrectes.
                      </li>
                      <li>
                        <span className="font-medium">
                          Conflictes amb altres planetes:
                        </span>{" "}
                        Pot haver-hi conflictes d'òrbita o noms duplicats dins
                        del mateix sistema.
                      </li>
                      <li>
                        <span className="font-medium">
                          Problemes amb les textures:
                        </span>{" "}
                        Les imatges o textures personalitzades poden ser massa
                        grans o tenir formats no compatibles.
                      </li>
                      <li>
                        <span className="font-medium">
                          Error en el càlcul de paràmetres:
                        </span>{" "}
                        Algunes combinacions de paràmetres poden generar
                        resultats físicament impossibles.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      Solucions pas a pas
                    </h4>
                    <ol className="list-decimal pl-6 space-y-3 text-gray-300">
                      <li>
                        <span className="font-medium">
                          Verifica els valors introduïts:
                        </span>
                        <ol className="list-alpha pl-6 mt-2 space-y-1 text-sm">
                          <li>
                            Revisa que tots els camps numèrics estiguin dins
                            dels rangs acceptables (indicats normalment sota
                            cada camp).
                          </li>
                          <li>
                            Assegura't que no hi hagi caràcters especials no
                            permesos en els camps de text com el nom del
                            planeta.
                          </li>
                          <li>
                            Comprova que els camps obligatoris (marcats amb *)
                            estiguin tots completats correctament.
                          </li>
                        </ol>
                      </li>

                      <li>
                        <span className="font-medium">
                          Resol conflictes d'òrbita:
                        </span>
                        <ol className="list-alpha pl-6 mt-2 space-y-1 text-sm">
                          <li>
                            Utilitza la visualització del sistema per
                            identificar possibles solapaments d'òrbites entre
                            planetes.
                          </li>
                          <li>
                            Ajusta la distància orbital del nou planeta per
                            evitar col·lisions amb planetes existents.
                          </li>
                          <li>
                            Verifica que el nom del planeta no estigui ja
                            utilitzat dins del mateix sistema planetari.
                          </li>
                        </ol>
                      </li>

                      <li>
                        <span className="font-medium">
                          Optimitza les textures i imatges:
                        </span>
                        <ol className="list-alpha pl-6 mt-2 space-y-1 text-sm">
                          <li>
                            Assegura't que les imatges que puges tenen una
                            resolució adequada (màxim recomanat: 2048 x 2048
                            píxels).
                          </li>
                          <li>
                            Utilitza formats d'imatge compatibles: JPG, PNG o
                            WebP per a textures de superfície i atmosfera.
                          </li>
                          <li>
                            Redueix la mida de les imatges abans de pujar-les si
                            superen els 5 MB per millorar el rendiment.
                          </li>
                        </ol>
                      </li>

                      <li>
                        <span className="font-medium">
                          Utilitza valors preestablerts:
                        </span>
                        <ol className="list-alpha pl-6 mt-2 space-y-1 text-sm">
                          <li>
                            Si continues tenint problemes, utilitza un dels
                            models preestablerts de planeta i després modifica'l
                            gradualment.
                          </li>
                          <li>
                            Fes clic al botó{" "}
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800 rounded text-white text-sm">
                              <RefreshCw size={14} /> Restablir valors
                            </span>{" "}
                            per tornar a valors físicament coherents.
                          </li>
                        </ol>
                      </li>

                      <li>
                        <span className="font-medium">
                          Comprova els missatges d'error específics:
                        </span>
                        <ol className="list-alpha pl-6 mt-2 space-y-1 text-sm">
                          <li>
                            Llegeix atentament els missatges d'error que
                            apareixen, ja que sovint contenen informació
                            específica sobre el problema.
                          </li>
                          <li>
                            Busca el codi d'error (si n'hi ha) a la secció de
                            suport del lloc web d'Exocosmos per solucions
                            específiques.
                          </li>
                        </ol>
                      </li>
                    </ol>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4 flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <div className="text-red-200 text-sm">
                        <p className="font-medium mb-1">Valors incorrectes:</p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Massa: Valor negatiu</li>
                          <li>Radi: Massa gran per al tipus</li>
                          <li>Distància orbital: Conflicte</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-4 flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div className="text-green-200 text-sm">
                        <p className="font-medium mb-1">Valors correctes:</p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Massa: 0.8 - 10 masses terrestres</li>
                          <li>Radi: 0.5 - 2.5 radis terrestres</li>
                          <li>Distància orbital: Sense solapaments</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Problema 4: Problemes amb la visualització 3D */}
              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-red-400" /> Problemes amb la
                  visualització 3D
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      Descripció del problema
                    </h4>
                    <p className="text-gray-300">
                      La visualització 3D no es carrega correctament, apareixen
                      textures negres o faltants, els controls no responen o la
                      pantalla es queda en blanc.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      Causes possibles
                    </h4>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>
                        <span className="font-medium">
                          Suport WebGL limitat:
                        </span>{" "}
                        El teu navegador o targeta gràfica pot no tenir suport
                        complet per a WebGL, necessari per a la visualització
                        3D.
                      </li>
                      <li>
                        <span className="font-medium">
                          Memòria gràfica insuficient:
                        </span>{" "}
                        Els models 3D complexos poden requerir més memòria
                        gràfica de la disponible.
                      </li>
                      <li>
                        <span className="font-medium">
                          Controladors gràfics desactualitzats:
                        </span>{" "}
                        Els controladors de la targeta gràfica poden estar
                        obsolets.
                      </li>
                      <li>
                        <span className="font-medium">
                          Errors en la càrrega de textures:
                        </span>{" "}
                        Les textures poden no haver-se carregat correctament des
                        del servidor.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      Solucions pas a pas
                    </h4>
                    <ol className="list-decimal pl-6 space-y-3 text-gray-300">
                      <li>
                        <span className="font-medium">
                          Verifica la compatibilitat amb WebGL:
                        </span>
                        <ol className="list-alpha pl-6 mt-2 space-y-1 text-sm">
                          <li>
                            Visita{" "}
                            <a
                              href="https://get.webgl.org"
                              className="text-purple-400 hover:underline"
                            >
                              get.webgl.org
                            </a>{" "}
                            per comprovar si el teu navegador suporta WebGL.
                          </li>
                          <li>
                            Si no és compatible, prova amb un navegador diferent
                            (Chrome, Firefox o Edge són els més recomanats).
                          </li>
                          <li>
                            Assegura't que la renderització per hardware està
                            activada a la configuració del navegador.
                          </li>
                        </ol>
                      </li>

                      <li>
                        <span className="font-medium">
                          Actualitza els controladors gràfics:
                        </span>
                        <ol className="list-alpha pl-6 mt-2 space-y-1 text-sm">
                          <li>
                            Visita el lloc web del fabricant de la teva targeta
                            gràfica (NVIDIA, AMD, Intel) i descarrega els
                            controladors més recents.
                          </li>
                          <li>
                            Instal·la els controladors i reinicia l'ordinador.
                          </li>
                        </ol>
                      </li>

                      <li>
                        <span className="font-medium">
                          Neteja la memòria cau del navegador:
                        </span>
                        <ol className="list-alpha pl-6 mt-2 space-y-1 text-sm">
                          <li>
                            Neteja la memòria cau del navegador per eliminar
                            possibles arxius corruptes o obsolets.
                          </li>
                          <li>
                            Torna a carregar la pàgina després de netejar la
                            memòria cau.
                          </li>
                        </ol>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Problema 5: Problemes d'autenticació */}
              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-400" /> Problemes
                  d'autenticació
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      Descripció del problema
                    </h4>
                    <p className="text-gray-300">
                      No pots iniciar sessió a Exocosmos, reps missatges d'error
                      d'autenticació, has oblidat la teva contrasenya o tens
                      problemes amb la verificació del correu electrònic.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      Causes possibles
                    </h4>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>
                        <span className="font-medium">
                          Credencials incorrectes:
                        </span>{" "}
                        El correu electrònic o la contrasenya introduïts poden
                        ser incorrectes.
                      </li>
                      <li>
                        <span className="font-medium">
                          Problemes amb les cookies:
                        </span>{" "}
                        El navegador pot estar bloquejant les cookies
                        necessàries per a l'autenticació.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      Solucions pas a pas
                    </h4>
                    <ol className="list-decimal pl-6 space-y-3 text-gray-300">
                      <li>
                        <span className="font-medium">
                          Verifica les teves credencials:
                        </span>
                        <ol className="list-alpha pl-6 mt-2 space-y-1 text-sm">
                          <li>
                            Assegura't que estàs introduint el correu electrònic
                            correcte amb el qual et vas registrar.
                          </li>
                          <li>
                            Comprova que no hi hagi errors tipogràfics i que les
                            majúscules/minúscules siguin correctes a la
                            contrasenya.
                          </li>
                          <li>
                            Verifica que el bloqueig de majúscules (Caps Lock)
                            no estigui activat accidentalment.
                          </li>
                        </ol>
                      </li>
                      <li>
                        <span className="font-medium">
                          Comprova la configuració del navegador:
                        </span>
                        <ol className="list-alpha pl-6 mt-2 space-y-1 text-sm">
                          <li>
                            Assegura't que el teu navegador accepta cookies de
                            tercers (necessàries per a l'autenticació).
                          </li>
                          <li>
                            Desactiva temporalment les extensions de bloqueig de
                            publicitat o privacitat que puguin interferir.
                          </li>
                          <li>
                            Prova amb un navegador diferent si el problema
                            persisteix.
                          </li>
                        </ol>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-4 flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="text-yellow-200 text-sm">
                      <p className="font-medium mb-1">Consell de seguretat:</p>
                      <p>
                        Utilitza un gestor de contrasenyes per emmagatzemar de
                        forma segura les teves credencials d'Exocosmos. Això
                        t'ajudarà a evitar problemes d'inici de sessió i
                        millorarà la seguretat del teu compte.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Guide Navigation */}
      <GuideNavigation currentSection="resolucio-problemes" />
    </main>
  );
};

export default GuideResolucioProblemes;
