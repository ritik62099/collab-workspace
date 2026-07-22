import React from "react";

const DashboardHeader = ( { user } ) => {


  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
         <h1 className="text-3xl font-bold text-gray-900">
        {getGreeting()}, {user?.name || "User"}! 👋
      </h1>

        <p className="mt-2 text-gray-500">
          Here's what's happening with your projects today.
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;