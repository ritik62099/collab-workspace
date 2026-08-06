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

  const cards = [
    {
      title: "Workspaces",
      value: dashboard?.totalWorkspaces || 0,
      subtitle: "Active workspaces",
      icon: FolderKanban,
      route: ROUTES.WORKSPACES,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
    },
    {
      title: "Boards",
      value: dashboard?.activeBoards || 0,
      subtitle: "Across all workspaces",
      icon: LayoutDashboard,
      route: ROUTES.BOARDS,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
    {
      title: "My Tasks",
      value: dashboard?.myTasks || 0,
      subtitle: "Assigned to you",
      icon: CheckSquare,
      route: ROUTES.MY_TASKS,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Team Members",
      value: dashboard?.members || 0,
      subtitle: "Active members",
      icon: Users,
      route: ROUTES.MEMBERS,
      iconColor: "text-violet-600",
      iconBg: "bg-violet-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <button
            key={card.title}
            onClick={() => navigate(card.route)}
            className="group relative bg-white border border-gray-200 rounded-xl p-5 text-left transition-all hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${card.iconBg} transition-transform group-hover:scale-110`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} strokeWidth={2} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-bold text-gray-900 tracking-tight">
                {card.value}
              </div>
              <div className="text-sm font-medium text-gray-900">
                {card.title}
              </div>
              <div className="text-xs text-gray-500">
                {card.subtitle}
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        );
      })}
    </div>
  );
};

export default StatsCards;