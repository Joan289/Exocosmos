"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * Displays a mathematical formula with KaTeX, its explanation, result, and optional variable breakdown.
 */
const PlanetFormula = ({ formula, explanation, result, variables = [] }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center gap-3">
        <div className="bg-gray-900/50 px-4 py-2 rounded-lg overflow-x-auto max-w-full flex-1">
          <div
            className="text-white text-lg font-mono overflow-x-auto"
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(formula, {
                throwOnError: false,
                displayMode: true,
              }),
            }}
          />
        </div>
        <div className="text-white text-xl font-semibold">{result}</div>
      </div>

      <p className="text-gray-400 text-sm">{explanation}</p>

      {variables.length > 0 && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {expanded ? "Ocultar variables" : "Mostrar variables"}
          </button>

          {expanded && (
            <div className="mt-2 space-y-1 pl-2 border-l-2 border-gray-700">
              {variables.map((variable, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-blue-300">{variable.name} =</span>
                  <span className="text-gray-300">{variable.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlanetFormula;
