"use client";

import { User } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * UserAvatar mostra una imatge de perfil si hi ha URL,
 * o bé un avatar per defecte amb una icona si no n'hi ha.
 *
 * @param {Object} props
 * @param {string} props.profilePictureUrl - Ruta de la imatge de perfil
 * @param {string} [props.className] - Classes addicionals per a l'estil
 */
const UserAvatar = ({ profilePictureUrl, className = "" }) => {
  if (profilePictureUrl) {
    return (
      <img
        src={`${API_URL}${profilePictureUrl}` || "/placeholder.svg"}
        alt="Profile"
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`w-full h-full bg-gray-800 flex items-center justify-center ${className}`}
    >
      <User className="h-1/2 w-1/2 text-gray-400" />
    </div>
  );
};

export default UserAvatar;
