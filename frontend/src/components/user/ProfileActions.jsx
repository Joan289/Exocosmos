"use client";

import { useNavigate } from "react-router-dom";
import { LogOut, Settings, Plus, Rocket } from "lucide-react";

/**
 * Renders user action buttons in the profile page.
 * Includes navigation to create system, edit profile, explore, and logout.
 *
 * @param {Object} props
 * @param {Function} props.onLogout - Callback function to trigger logout
 */
const ProfileActions = ({ onLogout }) => {
  /**
   * Programmatic navigation utility from React Router
   */
  const navigate = useNavigate();

  return (
    <div className="mt-6 space-y-3">
      {/* Create new system button */}
      <button
        onClick={() => navigate("/app/create")}
        className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" /> Crear nou sistema
      </button>

      {/* Edit user profile */}
      <button
        onClick={() => navigate("/app/users/edit")}
        className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Settings className="h-4 w-4" /> Editar perfil
      </button>

      {/* Explore the universe */}
      <button
        onClick={() => navigate("/app/explore")}
        className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Rocket className="h-4 w-4" /> Explorar
      </button>

      {/* Divider */}
      <div className="w-full border-t border-gray-800 my-4"></div>

      {/* Logout action */}
      <button
        onClick={onLogout}
        className="w-full py-2.5 px-4 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <LogOut className="h-4 w-4" /> Tanca sessió
      </button>
    </div>
  );
};

export default ProfileActions;
