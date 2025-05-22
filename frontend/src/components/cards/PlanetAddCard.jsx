"use client";

import { Link } from "react-router-dom";
import { Plus, Globe } from "lucide-react";

const PlanetAddCard = ({ systemId }) => {
  return (
    <Link
      to={`/app/planets/${systemId}/create`}
      className="block group transition-all duration-300 h-full"
    >
      <div className="bg-gray-800/30 backdrop-blur-sm border border-dashed border-gray-700 hover:border-blue-600/50 rounded-xl overflow-hidden h-full transition-all duration-300 group-hover:translate-y-[-4px] group-hover:bg-gray-800/50">
        <div className="flex flex-col items-center justify-center text-center h-full p-6">
          <div className="w-16 h-16 rounded-full bg-blue-900/30 flex items-center justify-center mb-4 group-hover:bg-blue-900/50 transition-colors">
            <div className="relative">
              <Globe className="h-8 w-8 text-blue-400" />
              <Plus className="h-4 w-4 text-blue-300 absolute -top-1 -right-1 bg-blue-900 rounded-full p-0.5" />
            </div>
          </div>
          <h3 className="font-medium text-white group-hover:text-blue-300 transition-colors">
            Afegir planeta
          </h3>
          <p className="text-gray-400 text-sm mt-2">
            Crea un nou planeta per aquest sistema
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PlanetAddCard;
