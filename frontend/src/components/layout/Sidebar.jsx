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
      </div>
    </aside>
  );
};

export default Sidebar;