import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
=======
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
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
