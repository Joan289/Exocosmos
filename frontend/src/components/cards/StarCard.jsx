"use client";

import ResourceCard from "./ResourceCard";
import { Sun } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const StarCard = ({ star }) => {
  const { name, thumbnail_url, star_id, star_type, temperature } = star;

  return (
    <ResourceCard
      name={name}
      imageUrl={thumbnail_url ? `${API_URL}${thumbnail_url}` : null}
      to={`/app/stars/${star_id}`}
    >
      <div className="flex flex-col h-full">
        <div className="relative aspect-square overflow-hidden bg-gray-900/50">
          {thumbnail_url ? (
            <img
              src={`${API_URL}${thumbnail_url}` || "/placeholder.svg"}
              alt={`Estrella ${name}`}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-yellow-600/30 to-orange-700/30 flex items-center justify-center">
              <Sun className="h-12 w-12 text-yellow-400" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>

          {/* Star type badge */}
          <div className="absolute top-2 left-2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded-full">
            Estrella
          </div>

          {/* Temperature badge if available */}
          {temperature && (
            <div className="absolute top-2 right-2 bg-orange-900/80 text-orange-200 text-xs px-2 py-1 rounded-full">
              {temperature}K
            </div>
          )}
        </div>

        <div className="p-4 flex-grow flex flex-col justify-between">
          <h3 className="font-medium text-white group-hover:text-yellow-300 transition-colors">
            {name}
          </h3>

          {star_type && (
            <p className="text-gray-400 text-sm mt-2">Tipus: {star_type}</p>
          )}
        </div>
      </div>
    </ResourceCard>
  );
};

export default StarCard;
