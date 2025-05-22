"use client";

import { Link } from "react-router-dom";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const ResourceCard = ({ name, imageUrl, to, children }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <Link to={to} className="block group transition-all duration-300 h-full">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-purple-600/50 rounded-xl overflow-hidden h-full transition-all duration-300 group-hover:translate-y-[-4px] group-hover:shadow-lg group-hover:shadow-purple-900/20">
        {children ? (
          children
        ) : (
          <div className="flex flex-col h-full">
            <div className="relative aspect-square overflow-hidden bg-gray-900/50">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                  <div className="w-6 h-6 border-2 border-gray-600 border-t-purple-500 rounded-full animate-spin"></div>
                </div>
              )}

              {imageUrl ? (
                <img
                  src={`${API_URL}${imageUrl}?v=${Date.now()}`}
                  alt={`Miniatura de ${name}`}
                  className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                    isLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={handleImageLoad}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center">
                    <span className="text-gray-400 text-2xl">?</span>
                  </div>
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
            </div>

            <div className="p-4 flex-grow flex flex-col justify-between">
              <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                {name}
              </h3>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ResourceCard;
