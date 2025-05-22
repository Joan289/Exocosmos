"use client";

import ResourceCard from "./ResourceCard";
import { SpaceIcon as Planet } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const SystemCard = ({ system }) => {
  const { name, thumbnail_url, planetary_system_id } = system;

  return (
    <ResourceCard
      name={name}
      imageUrl={thumbnail_url ? `${API_URL}${thumbnail_url}` : null}
      to={`/app/systems/${planetary_system_id}`}
    >
      <div className="flex flex-col h-full">
        <div className="relative aspect-square overflow-hidden bg-gray-900/50">
          {thumbnail_url ? (
            <img
              src={`${API_URL}${thumbnail_url}` || "/placeholder.svg"}
              alt={`Sistema ${name}`}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex items-center justify-center">
              <Planet className="h-12 w-12 text-purple-400" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>

          <div className="absolute top-2 left-2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded-full">
            Sistema
          </div>

          {/* Planet count badge */}
          {system.planets && (
            <div className="absolute top-2 right-2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded-full">
              {system.planets.length}{" "}
              {system.planets.length === 1 ? "planeta" : "planetes"}
            </div>
          )}
        </div>

        <div className="p-4 flex-grow flex flex-col justify-between">
          <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors">
            {name}
          </h3>

          {system.description && (
            <p className="text-gray-400 text-sm mt-2 line-clamp-2">
              {system.description}
            </p>
          )}
        </div>
      </div>
    </ResourceCard>
  );
};

export default SystemCard;
