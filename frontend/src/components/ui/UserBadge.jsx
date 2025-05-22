"use client";

import { Link } from "react-router-dom";
import UserAvatar from "./UserAvatar";

/**
 * Mostra una targeta compacta amb avatar i nom d'usuari que enllaça al seu perfil.
 *
 * @param {Object} props
 * @param {Object} props.user - Objecte usuari amb user_id, username i profile_picture_url
 */
const UserBadge = ({ user }) => {
  if (!user) return null;

  return (
    <Link to={`/app/users/${user.user_id}`} className="block group">
      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <UserAvatar profilePictureUrl={user.profile_picture_url} />
        </div>
        <div>
          <p className="font-medium text-white group-hover:text-purple-300 transition-colors">
            {user.username}
          </p>
          <p className="text-sm text-gray-400">Explorador espacial</p>
        </div>
      </div>
    </Link>
  );
};

export default UserBadge;
