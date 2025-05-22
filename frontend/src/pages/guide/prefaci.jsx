"use client";

import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Book,
  Info,
  AlertTriangle,
  Lightbulb,
  MousePointer,
} from "lucide-react";
import GuideNavigation from "../../components/ui/GuideNavigation";

const GuidePrefaci = () => {
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
          <span className="text-white">Prefaci</span>
        </div>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-900/50 flex items-center justify-center flex-shrink-0">
              <Info className="h-5 w-5 text-purple-400" />
            </div>
            1. Prefaci
          </h1>
          <p className="text-xl text-gray-300">
            Benvingut a la guia d'usuari d'Exocosmos. Aquí trobaràs tota la
            informació necessària per treure el màxim profit de l'aplicació.
          </p>
        </header>

        {/* Main content */}
        <div className="bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-800 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Com utilitzar aquesta guia
          </h2>

          <p className="text-gray-300 mb-6">
            Aquesta guia d'usuari està dissenyada per ajudar-te a entendre i
            utilitzar totes les funcionalitats d'Exocosmos. Està organitzada en
            seccions temàtiques que pots consultar de manera seqüencial o
            accedir directament a la informació específica que necessitis.
          </p>

          <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 mb-6 flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-blue-200 text-sm">
              Recomanem als nous usuaris seguir la guia en ordre, començant per
              les "Primeres Passes" per familiaritzar-se amb l'aplicació abans
              d'explorar funcionalitats més avançades.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-white mb-4">
            A qui va dirigida
          </h3>
          <p className="text-gray-300 mb-6">
            Aquesta guia està pensada per a tots els usuaris d'Exocosmos, des de
            principiants fins a usuaris avançats:
          </p>

          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-300">
            <li>
              <strong className="text-white">Nous usuaris:</strong> Trobareu
              informació bàsica sobre com registrar-vos, iniciar sessió i
              navegar per l'aplicació.
            </li>
            <li>
              <strong className="text-white">Usuaris intermedis:</strong>{" "}
              Descobrireu com crear i personalitzar sistemes planetaris,
              estrelles i planetes.
            </li>
            <li>
              <strong className="text-white">Usuaris avançats:</strong>{" "}
              Aprendreu tècniques avançades de personalització i visualització
              3D.
            </li>
            <li>
              <strong className="text-white">Educadors:</strong> Trobareu
              recursos per utilitzar Exocosmos com a eina educativa.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-white mb-4">
            Convencions utilitzades
          </h3>
          <p className="text-gray-300 mb-6">
            Per facilitar la lectura i comprensió, utilitzem les següents
            convencions al llarg de la guia:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <MousePointer className="h-4 w-4 text-purple-400" />
                <h4 className="font-medium text-white">Elements interactius</h4>
              </div>
              <p className="text-sm text-gray-300">
                Els botons i enllaços es mostren en{" "}
                <span className="text-purple-400">color lila</span> i normalment
                van acompanyats d'icones.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-white mb-4">
            Icones i símbols
          </h3>
          <p className="text-gray-300 mb-4">
            Al llarg de la guia utilitzem diverses icones per destacar
            informació important:
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <Info className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Informació</p>
                <p className="text-gray-300 text-sm">
                  Dades addicionals o consells útils.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="h-4 w-4 text-yellow-400" />
              </div>
              <div>
                <p className="text-white font-medium">Consell</p>
                <p className="text-gray-300 text-sm">
                  Suggeriments per millorar la teva experiència.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </div>
              <div>
                <p className="text-white font-medium">Advertència</p>
                <p className="text-gray-300 text-sm">
                  Informació important per evitar problemes.
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-white mb-4">
            Terminologia bàsica
          </h3>
          <p className="text-gray-300 mb-4">
            Aquests són alguns termes bàsics que s'utilitzen freqüentment a
            Exocosmos:
          </p>

          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mb-6">
            <dl className="space-y-3">
              <div>
                <dt className="text-white font-medium">Sistema Planetari</dt>
                <dd className="text-gray-300 text-sm">
                  Conjunt d'objectes no estel·lars (planetes, nans, asteroides,
                  cometes, satèl·lits...) que orbiten al voltant d'una o més
                  estrelles.
                </dd>
              </div>
              <div>
                <dt className="text-white font-medium">Estrella</dt>
                <dd className="text-gray-300 text-sm">
                  Cos celeste que genera energia mitjançant fusió nuclear. El
                  centre d'un sistema planetari.
                </dd>
              </div>
              <div>
                <dt className="text-white font-medium">Planeta</dt>
                <dd className="text-gray-300 text-sm">
                  Cos celeste que orbita al voltant d'una estrella i té
                  suficient massa para tener forma esfèrica.
                </dd>
              </div>
              <div>
                <dt className="text-white font-medium">Visualització 3D</dt>
                <dd className="text-gray-300 text-sm">
                  Representació tridimensional interactiva d'un objecte celeste.
                </dd>
              </div>
            </dl>
          </div>

          <h3 className="text-xl font-semibold text-white mb-4">
            Notes i advertències
          </h3>

          <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-red-200 text-sm">
              <p className="font-medium mb-1">Important:</p>
              <p>
                Exocosmos és una aplicació educativa i de simulació. Les dades i
                visualitzacions són aproximacions i no representen amb total
                precisió els objectes celestes reals.
              </p>
            </div>
          </div>

          <p className="text-gray-300">
            Recorda que Exocosmos està en constant evolució. Aquesta guia
            s'actualitza regularment per reflectir els canvis i millores de
            l'aplicació. La data de l'última actualització es mostra a la
            portada de la guia.
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Link
            to="/guide"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <ChevronLeft size={16} /> Índex
          </Link>

          <Link
            to="/guide/primeres-passes"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Primeres Passes <ChevronRight size={16} />
          </Link>
        </div>

        {/* Table of contents sidebar (fixed on desktop) */}
        <GuideNavigation currentSection="prefaci" />
      </div>
    </main>
  );
};

export default GuidePrefaci;
