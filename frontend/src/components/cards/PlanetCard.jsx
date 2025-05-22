"use client";

import ResourceCard from "./ResourceCard";
import { Globe } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const PlanetCard = ({ planet }) => {
  const { name, thumbnail_url, planet_id, planet_type, diameter } = planet;

  return (
    <ResourceCard
      name={name}
      imageUrl={thumbnail_url ? `${API_URL}${thumbnail_url}` : null}
      to={`/app/planets/${planet_id}`}
    >
      <div className="flex flex-col h-full">
        <div className="relative aspect-square overflow-hidden bg-gray-900/50">
          {thumbnail_url ? (
            <img
              src={`${API_URL}${thumbnail_url}` || "/placeholder.svg"}
              alt={`Planeta ${name}`}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-900/30 to-green-900/30 flex items-center justify-center">
              <Globe className="h-12 w-12 text-blue-400" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>

          {/* Planet type badge */}
          <div className="absolute top-2 left-2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded-full">
            Planeta
          </div>

          {/* Size badge if available */}
          {diameter && (
            <div className="absolute top-2 right-2 bg-blue-900/80 text-blue-200 text-xs px-2 py-1 rounded-full">
              {(diameter / 1000).toFixed(0)}K km
            </div>
          )}
        </div>

        <div className="p-4 flex-grow flex flex-col justify-between">
          <h3 className="font-medium text-white group-hover:text-blue-300 transition-colors">
            {name}
          </h3>

          {planet_type && (
            <p className="text-gray-400 text-sm mt-2">Tipus: {planet_type}</p>
          )}
        </div>
      </div>
    </ResourceCard>
  );
};

export default PlanetCard;
