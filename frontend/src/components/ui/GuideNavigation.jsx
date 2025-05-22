import { Link } from "react-router-dom";
import { Book, ChevronRight } from "lucide-react";

export const GuideNavigation = ({ currentSection }) => {
  const sections = [
    { id: "prefaci", title: "1. Prefaci", path: "/guide/prefaci" },
    {
      id: "primeres-passes",
      title: "2. Primeres Passes",
      path: "/guide/primeres-passes",
    },
    {
      id: "sistemes",
      title: "3. Sistemes Planetaris",
      path: "/guide/sistemes",
    },
    { id: "estrelles", title: "4. Estrelles", path: "/guide/estrelles" },
    { id: "planetes", title: "5. Planetes", path: "/guide/planetes" },
    { id: "perfil", title: "6. Perfil i Comunitat", path: "/guide/perfil" },
    {
      id: "resolucio-problemes",
      title: "7. Resolució de Problemes",
      path: "/guide/resolucio-problemes",
    },
    { id: "faq", title: "8. Preguntes Freqüents", path: "/guide/faq" },
  ];

  // Find current section index
  const currentIndex = sections.findIndex(
    (section) => section.id === currentSection
  );
  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection =
    currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  return (
    <div className="hidden lg:block fixed top-1/2 right-8 transform -translate-y-1/2 w-64 bg-gray-900/70 backdrop-blur-md p-4 rounded-xl border border-gray-800">
      <h3 className="text-white font-medium mb-3 flex items-center gap-2">
        <Book className="h-4 w-4 text-purple-400" /> Seccions de la guia
      </h3>

      <ul className="space-y-2 text-sm">
        {sections.map((section) => (
          <li
            key={section.id}
            className={currentSection === section.id ? "text-purple-400" : ""}
          >
            {currentSection === section.id ? (
              section.title
            ) : (
              <Link
                to={section.path}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {section.title}
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* Navigation buttons */}
      <div className="mt-6 pt-4 border-t border-gray-700 flex flex-col gap-2">
        {prevSection && (
          <Link
            to={prevSection.path}
            className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1"
          >
            <ChevronRight size={14} className="rotate-180" />{" "}
            {prevSection.title}
          </Link>
        )}

        {nextSection && (
          <Link
            to={nextSection.path}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
          >
            {nextSection.title} <ChevronRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default GuideNavigation;
