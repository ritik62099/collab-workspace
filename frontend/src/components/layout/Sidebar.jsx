<<<<<<< HEAD
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

const Sidebar = () => {
  const { workspaces } = useWorkspaceStore();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 h-[calc(100vh-64px)] overflow-y-auto p-4 hidden md:block">
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Menu</h3>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Workspaces</h3>
        <nav className="space-y-1">
          {workspaces.map((ws) => (
            <Link
              key={ws._id}
              to={`/workspaces/${ws._id}`}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <span className="w-6 h-6 bg-purple-500 rounded text-white flex items-center justify-center text-xs font-bold">
                {ws.name.charAt(0)}
              </span>
              <span className="truncate">{ws.name}</span>
            </Link>
          ))}
        </nav>
=======
import React from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../config/routes";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  KanbanSquare,
  CheckSquare,
  Search,
  Users,
  Bell,
  Settings,
  UserCircle2,
  LogOut,
} from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import Avatar from "../common/Avatar";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const navItems = [
    {
      name: "Dashboard",
      path: ROUTES.DASHBOARD,
      icon: LayoutDashboard,
    },
    {
      name: "Workspaces",
      path: ROUTES.WORKSPACES,
      icon: BriefcaseBusiness,
    },
    {
      name: "Boards",
      path: ROUTES.BOARDS,
      icon: KanbanSquare,
    },
    {
      name: "My Tasks",
      path: ROUTES.MY_TASKS,
      icon: CheckSquare,
    },
    {
      name: "Search",
      path: ROUTES.SEARCH,
      icon: Search,
    },
    {
      name: "Members",
      path: ROUTES.MEMBERS,
      icon: Users,
    },
    {
      name: "Notifications",
      path: ROUTES.NOTIFICATIONS,
      icon: Bell,
    },
    {
      name: "Settings",
      path: ROUTES.SETTINGS,
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden lg:flex lg:h-screen lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white lg:shadow-sm">
      {/* Logo */}
      <div className="flex items-center h-20 px-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center shadow-md h-11 w-11 rounded-xl bg-gradient-to-br from-orange-500 via-orange-400 to-green-600">
            <span className="text-lg font-bold text-white">CS</span>
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900">
              CollabSpace
            </h1>
            <p className="text-xs text-gray-500">Real-Time Workspace</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }`
              }
            >
              <Icon size={20} strokeWidth={2.2} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-5 border-t border-gray-200">
        {/* User Card */}
        <button
          onClick={() => navigate(ROUTES.PROFILE)}
          className="flex items-center w-full gap-3 p-2 mb-4 transition-all duration-200 rounded-xl hover:bg-gray-100"
        >
          <Avatar src={user?.avatar} alt={user?.name} size="md" />

          <div className="flex-1 min-w-0 text-left">
            <h3 className="text-sm font-semibold text-gray-800 truncate">
              {user?.name}
            </h3>

            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-red-600 transition-all duration-200 hover:bg-red-50"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
      </div>
    </aside>
  );
};

<<<<<<< HEAD
export default Sidebar;
=======
export default Sidebar;
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
