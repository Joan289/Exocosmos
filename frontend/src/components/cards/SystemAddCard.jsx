"use client";

import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const SystemAddCard = () => {
  return (
    <Link
      to="/app/systems/create"
      className="block group transition-all duration-300 h-full"
    >
      <div className="bg-gray-800/30 backdrop-blur-sm border border-dashed border-gray-700 hover:border-purple-600/50 rounded-xl overflow-hidden h-full transition-all duration-300 group-hover:translate-y-[-4px] group-hover:bg-gray-800/50">
        <div className="flex flex-col items-center justify-center text-center h-full p-6">
          <div className="w-16 h-16 rounded-full bg-purple-900/30 flex items-center justify-center mb-4 group-hover:bg-purple-900/50 transition-colors">
            <Plus className="h-8 w-8 text-purple-400" />
          </div>
          <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors">
            Crear nou sistema
          </h3>
          <p className="text-gray-400 text-sm mt-2">
            Dissenya el teu propi sistema planetari
          </p>
        </div>
      </div>
    </Link>
  );
};

export default SystemAddCard;
