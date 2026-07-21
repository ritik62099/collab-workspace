import React from "react";
import { CalendarDays, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes";

const UpcomingDeadlines = () => {
  const navigate = useNavigate();

  const deadlines = [
    {
      id: 1,
      title: "Design Dashboard UI",
      workspace: "Frontend",
      due: "Today",
      priority: "High",
    },
    {
      id: 2,
      title: "Socket.io Integration",
      workspace: "Backend",
      due: "Tomorrow",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Deploy API Server",
      workspace: "DevOps",
      due: "21 Jul",
      priority: "Low",
    },
  ];

  const priorityColor = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  return (
  <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
    {/* Header */}
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
      <div>
        <h2 className="text-base font-semibold text-gray-900">
          Upcoming Deadlines
        </h2>

        <p className="mt-0.5 text-xs text-gray-500">
          Tasks that need attention
        </p>
      </div>

      <button
        onClick={() => navigate(ROUTES.MY_TASKS)}
        className="flex items-center gap-1 text-sm font-medium text-orange-600 transition hover:text-orange-700"
      >
        View All
        <ArrowRight size={15} />
      </button>
    </div>

    {/* List */}
    <div className="p-4 space-y-2.5">
      {deadlines.map((task) => (
        <div
          key={task.id}
          className="p-3 transition-all duration-200 border border-gray-200 cursor-pointer group rounded-xl hover:border-orange-200 hover:bg-orange-50 hover:shadow-sm"
        >
          {/* Top */}
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-orange-600">
                {task.title}
              </h3>

              <p className="mt-0.5 text-xs text-gray-500">
                {task.workspace}
              </p>
            </div>

            <span
              className={`rounded-md px-2 py-1 text-[10px] font-semibold ${priorityColor[task.priority]}`}
            >
              {task.priority}
            </span>
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between pt-2 mt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <CalendarDays size={14} />
              <span>{task.due}</span>
            </div>

            {task.due === "Today" && (
              <span className="rounded-md bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600">
                Due Today
              </span>
            )}

            {task.due === "Tomorrow" && (
              <span className="rounded-md bg-yellow-50 px-2 py-1 text-[10px] font-semibold text-yellow-600">
                Tomorrow
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default UpcomingDeadlines;