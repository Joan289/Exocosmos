"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/**
 * FloatingFormPanel is a slide-in panel used to render forms or content
 * in a collapsible sidebar, typically anchored to the left side.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to display inside the panel.
 * @param {string} props.title - Title displayed at the top of the panel.
 */
export default function FloatingFormPanel({ children, title }) {
  const [open, setOpen] = useState(true); // Toggles the visibility of the panel

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="absolute top-4 left-4 z-40 px-4 py-2 rounded-lg bg-gray-900/70 backdrop-blur-md text-sm text-white hover:bg-gray-800/90 transition pointer-events-auto flex items-center gap-2 border border-gray-800"
      >
        {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        {open ? "Ocultar formulari" : "Mostrar formulari"}
      </button>

      <div className="fixed inset-0 z-30 pointer-events-none">
        <div
          className={`
            absolute transition-all duration-300 ease-in-out pointer-events-auto
            bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-2xl
            border border-gray-800
            max-w-md w-[90vw]
            md:top-6 md:left-6 md:bottom-6 md:h-auto
            md:translate-x-0
            ${
              open ? "translate-y-0" : "translate-y-full md:translate-x-[-120%]"
            }
            bottom-0 left-0 right-0 md:left-6 md:right-auto md:translate-x-0 md:w-100
          `}
          style={{ maxHeight: "90vh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div
            className="p-6 overflow-y-auto"
            style={{ maxHeight: "calc(90vh - 60px)" }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
