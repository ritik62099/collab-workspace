import React from "react";

const DashboardHeader = ({ user }) => {
  return (
    <div className="mb-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="mt-3 text-base text-gray-600 max-w-2xl">
            Overview of your workspaces, tasks, and recent activity
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;