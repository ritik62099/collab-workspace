import React, { useEffect, useState } from "react";
import { dashboardService } from "../../services/dashboardService";
import Loader from "../../components/common/Loader";
import { useAuthStore } from "../../store/useAuthStore";

import DashboardHeader from "./DashboardHeader";
import StatsCards from "./StatsCards";
import RecentActivity from "./RecentActivity";
import MyAssignedTasks from "./MyAssignedTasks";
import WorkspaceOverview from "./WorkspaceOverview";
import TaskStatusChart from "./TaskStatusChart";
import UpcomingDeadlines from "./UpcomingDeadlines";

const Dashboard = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getStats();
      setData(response);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loader fullScreen />;
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Dashboard</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!data) return null;

  return (
    <div className="space-y-8">
      <DashboardHeader user={user} />
      <StatsCards dashboard={data.stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <RecentActivity activities={data.recentActivity} />
        </div>
        <div className="lg:col-span-7">
          <MyAssignedTasks tasks={data.upcomingDeadlines.slice(0, 4)} /> 
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <WorkspaceOverview workspaces={data.workspaces} />
        </div>
        <div className="lg:col-span-4">
          <TaskStatusChart data={data.taskStatus} />
        </div>
        <div className="lg:col-span-3">
          <UpcomingDeadlines deadlines={data.upcomingDeadlines} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;