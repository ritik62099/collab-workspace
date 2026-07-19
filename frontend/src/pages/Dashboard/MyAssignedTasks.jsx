import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes";

const MyAssignedTasks = () => {
    const navigate = useNavigate();
  const tasks = [
    {
      id: 1,
      task: "Design Login UI",
      workspace: "Collab Workspace",
      priority: "High",
      dueDate: "Today",
      status: "In Progress",
    },
    {
      id: 2,
      task: "Setup Socket.io",
      workspace: "Backend",
      priority: "Medium",
      dueDate: "18 Jul",
      status: "To Do",
    },
    {
      id: 3,
      task: "Create Dashboard",
      workspace: "Frontend",
      priority: "High",
      dueDate: "20 Jul",
      status: "Review",
    },
    {
      id: 4,
      task: "Fix Authentication",
      workspace: "API",
      priority: "Low",
      dueDate: "22 Jul",
      status: "Done",
    },
  ];

  const statusStyle = {
    "To Do": "bg-gray-100 text-gray-700",
    "In Progress": "bg-orange-100 text-orange-600",
    Review: "bg-blue-100 text-blue-600",
    Done: "bg-green-100 text-green-600",
  };

  const priorityStyle = {
    High: "text-red-600",
    Medium: "text-yellow-600",
    Low: "text-green-600",
  };

  return (
    <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          My Assigned Tasks
        </h2>

        <button
          onClick={() => navigate(ROUTES.MY_TASKS)}
          className="flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-600 bg-gray-50">
            <tr>
              <th className="px-5 py-3 font-semibold">Task</th>
              <th className="px-5 py-3 font-semibold">Workspace</th>
              <th className="px-5 py-3 font-semibold">Priority</th>
              <th className="px-5 py-3 font-semibold">Due Date</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="border-t border-gray-100 hover:bg-gray-50"
              >
                <td className="px-5 py-4 font-medium text-gray-900">
                  {task.task}
                </td>

                <td className="px-5 py-4 text-gray-600">{task.workspace}</td>

                <td
                  className={`px-5 py-4 font-semibold ${priorityStyle[task.priority]}`}
                >
                  {task.priority}
                </td>

                <td className="px-5 py-4 text-gray-600">{task.dueDate}</td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[task.status]}`}
                  >
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAssignedTasks;
