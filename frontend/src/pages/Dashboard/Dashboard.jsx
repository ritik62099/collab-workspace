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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardService.getStats();
        setData(response);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader fullScreen />;
  if (!data) return <div className="p-10 text-center">Failed to load dashboard.</div>;

  return (
    <div className="space-y-6">
      <DashboardHeader user={user} />
      <StatsCards dashboard={data.stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <RecentActivity activities={data.recentActivity} />
        </div>
        <div className="lg:col-span-2">
          <MyAssignedTasks tasks={data.upcomingDeadlines.slice(0, 4)} /> 
          {/* Using upcoming deadlines as assigned tasks for now, or you can pass all myCards */}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <WorkspaceOverview workspaces={data.workspaces} />
        <TaskStatusChart data={data.taskStatus} />
        <UpcomingDeadlines deadlines={data.upcomingDeadlines} />
      </div>
    </div>
  );
};

export default Dashboard;