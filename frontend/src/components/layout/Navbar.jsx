<<<<<<< HEAD
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import Avatar from '../common/Avatar';
import Button from '../common/Button';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <Link to="/dashboard" className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
          C
        </div>
        <span className="text-xl font-bold text-gray-800">Collab Workspace</span>
      </Link>

      <div className="flex items-center space-x-4">
        <Link to="/search" className="text-gray-600 hover:text-primary-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </Link>
        
        <Link to="/notifications" className="text-gray-600 hover:text-primary-600 relative">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </Link>

        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
          <Avatar src={user?.avatar} alt={user?.name} size="sm" />
          <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
=======
import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell , Plus, Settings, ChevronDown } from "lucide-react";

import useAuthStore from "../../store/useAuthStore";
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
            <div className="flex items-center px-4 py-2 transition border border-gray-200 rounded-xl bg-gray-50 focus-within:border-orange-500 focus-within:bg-white">
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
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition bg-orange-500 rounded-xl hover:bg-orange-600">
            <Plus size={18} />
            Create
          </button>

          {/* Notifications */}
          <button onClick={() => navigate(ROUTES.NOTIFICATIONS)} className="relative p-2 transition rounded-xl hover:bg-gray-100">
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
            className="transition-all duration-200 rounded-full hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <Avatar src={user?.avatar} alt={user?.name} size="md" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
