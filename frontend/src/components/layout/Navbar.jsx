import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Plus, Settings, ChevronDown } from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import Avatar from "../common/Avatar";
import { ROUTES } from "../../config/routes";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Search */}
        <div className="flex justify-center flex-1 px-8">
          <div className="w-full max-w-2xl">
            <div className="flex items-center px-4 py-2 transition border border-gray-200 rounded-xl bg-gray-50 focus-within:border-primary-500 focus-within:bg-white">
              <Search size={18} className="mr-3 text-gray-400" />

              <input
                type="text"
                placeholder="Search workspaces, boards, tasks..."
                className="w-full text-sm bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Quick Create */}
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition bg-primary-500 rounded-xl hover:bg-primary-600">
            <Plus size={18} />
            Create
          </button>

          {/* Notifications */}
          <button
            onClick={() => navigate(ROUTES.NOTIFICATIONS)}
            className="relative p-2 transition rounded-xl hover:bg-gray-100"
          >
            <Bell size={20} />

            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500"></span>
          </button>

          {/* Settings */}
          <button
            onClick={() => navigate(ROUTES.SETTINGS)}
            className="p-2 transition rounded-xl hover:bg-gray-100"
          >
            <Settings size={20} />
          </button>

          {/* User */}
          <button
            onClick={() => navigate(ROUTES.PROFILE)}
            className="transition-all duration-200 rounded-full hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Avatar src={user?.avatar} alt={user?.name} size="md" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
