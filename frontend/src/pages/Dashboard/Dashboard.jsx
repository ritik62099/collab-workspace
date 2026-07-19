import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useWorkspaceStore } from "../../store/useWorkspaceStore";
import Button from "../../components/common/Button";
import { ROUTES } from "../../config/routes";

import DashboardHeader from "./DashboardHeader";
import StatsCards from "./StatsCards";
import RecentActivity from "./RecentActivity";
import MyAssignedTasks from "./MyAssignedTasks";
import WorkspaceOverview from "./WorkspaceOverview";
import TaskStatusChart from "./TaskStatusChart";
import UpcomingDeadlines from "./UpcomingDeadlines";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { workspaces, fetchWorkspaces } = useWorkspaceStore();

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const dashboard = {
    totalWorkspaces: 12,
    activeBoards: 28,
    myTasks: 17,
    members: 35,
  };

  return (
    <>
      <DashboardHeader user={user} />

      <StatsCards dashboard={dashboard} />

      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
        <div className="lg:col-span-2">
          <MyAssignedTasks />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mt-6 xl:grid-cols-3">
        <WorkspaceOverview />
        <TaskStatusChart />
        <UpcomingDeadlines />
      </div>
    </>
  );
};

export default Dashboard;
