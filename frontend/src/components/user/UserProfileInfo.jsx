"use client";

import UserAvatar from "../ui/UserAvatar";
import { CalendarDays, MapPin, Star } from "lucide-react";

/**
 * Displays basic user profile information in a card-style layout.
 *
 * @param {Object} props
 * @param {Object} props.user - User object containing profile data
 * @param {boolean} [props.showCreatedAt=false] - Whether to show account creation date
 */
const UserProfileInfo = ({ user, showCreatedAt = false }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 relative">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-purple-600/50">
          <UserAvatar profilePictureUrl={user.profile_picture_url} />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-white mb-1">{user.username}</h1>
      <p className="text-gray-400 text-sm mb-4">Explorador espacial</p>

      <div className="w-full border-t border-gray-800 my-4"></div>

      <div className="w-full space-y-3 text-left">
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-lg bg-gray-800/80 flex items-center justify-center flex-shrink-0">
            <Star className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <p className="text-gray-400">ID d'usuari</p>
            <p className="text-white font-medium truncate max-w-[180px]">
              {user.user_id}
            </p>
          </div>
        </div>

        {user.location && (
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-gray-800/80 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400">Ubicació</p>
              <p className="text-white font-medium">{user.location}</p>
            </div>
          </div>
        )}

        {showCreatedAt && (
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-gray-800/80 flex items-center justify-center flex-shrink-0">
              <CalendarDays className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400">Membre des de</p>
              <p className="text-white font-medium">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileInfo;
