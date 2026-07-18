import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
  <div className="flex h-screen bg-gray-50">
    {/* Sidebar */}
    <Sidebar />

    {/* Right Side */}
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </div>
);
};

export default MainLayout;
