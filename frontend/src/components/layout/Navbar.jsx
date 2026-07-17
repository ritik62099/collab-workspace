import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import Avatar from '../common/Avatar';
import Dropdown, { DropdownItem } from '../common/Dropdown';
import { ROUTES } from '../../config/routes';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-white to-green-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-lg font-bold text-orange-600">CS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CollabSpace</h1>
              <p className="text-xs text-gray-500">Made in India 🇮🇳</p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            <Dropdown
              align="right"
              trigger={
                <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <Avatar src={user?.avatar} alt={user?.name} size="md" />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              }
            >
              <DropdownItem
                onClick={() => navigate(ROUTES.PROFILE)}
                icon={({ className }) => (
                  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              >
                Profile
              </DropdownItem>
              <DropdownItem
                onClick={handleLogout}
                danger
                icon={({ className }) => (
                  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                )}
              >
                Logout
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
