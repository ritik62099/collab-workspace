import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderKanban,
  LayoutDashboard,
  CheckSquare,
  Users,
} from "lucide-react";

import { ROUTES } from "../../config/routes";

const StatsCards = ({ dashboard }) => {
  const navigate = useNavigate();
    console.log(dashboard)
  const cards = [
    {
      title: "Workspaces",
      value: dashboard?.totalWorkspaces || 0,
      subtitle: "Manage all workspaces",
      icon: FolderKanban,
      route: ROUTES.WORKSPACES,
      bg: "bg-orange-100",
      color: "text-orange-600",
    },
    {
      title: "Boards",
      value: dashboard?.activeBoards || 0,
      subtitle: "Across all workspaces",
      icon: LayoutDashboard,
      route: ROUTES.BOARDS,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "My Tasks",
      value: dashboard?.myTasks || 0,
      subtitle: "Assigned to you",
      icon: CheckSquare,
      route: ROUTES.MY_TASKS,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Members",
      value: dashboard?.members || 0,
      subtitle: "Workspace members",
      icon: Users,
      route: ROUTES.MEMBERS,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            onClick={() => navigate(card.route)}
            className="p-6 transition-all duration-300 bg-white border border-gray-200 shadow-sm cursor-pointer rounded-2xl hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {card.value}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {card.subtitle}
                </p>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg}`}
              >
                <Icon className={`h-7 w-7 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;