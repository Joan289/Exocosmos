"use client";

import { useState, useEffect } from "react";
import { Info, Check, X } from "lucide-react";

const ConsentBanner = () => {
  /**
   * Controls whether the consent banner is visible.
   */
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted cookies
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) {
      // Show the banner after a short delay for smoother UX
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  /**
   * Accepts cookies and hides the banner.
   */
  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setVisible(false);
  };

  /**
   * Rejects cookies and redirects the user away from the app.
   */
  const rejectCookies = () => {
    window.location.replace("https://www.google.com");
  };

  if (!visible) return null;

  return (
    <>
      {/* Black overlay to block interaction with the page */}
      <div className="fixed inset-0 bg-black/80 z-40" />

      {/* Consent dialog at the bottom of the screen */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="bg-gray-900/90 backdrop-blur-md border-t border-purple-800/50 p-4 md:p-6 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Info section */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                  <Info className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Política de cookies
                  </h2>
                  <p className="text-gray-300 mt-1">
                    Aquesta aplicació utilitza cookies per a gestionar la
                    sessió. Si no les acceptes, no podràs continuar.
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-2 md:w-auto">
                <button
                  onClick={rejectCookies}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Rebutjar
                </button>
                <button
                  onClick={acceptCookies}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  Acceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsentBanner;
