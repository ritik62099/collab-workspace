import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatters } from "../../utils/formatters";

const MyAssignedTasks = ({ tasks = [] }) => {
  const navigate = useNavigate();

  const statusStyle = {
    "To Do": "bg-gray-100 text-gray-700",
    "In Progress": "bg-orange-100 text-orange-600",
    Review: "bg-blue-100 text-blue-600",
    Done: "bg-green-100 text-green-600",
    Medium: "bg-yellow-100 text-yellow-600", // Fallback for priority
  };

  return (
    <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl">
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">My Assigned Tasks</h2>
        <button className="flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700">
          View All <ArrowRight size={16} />
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">No tasks assigned to you yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-600 bg-gray-50">
              <tr>
                <th className="px-5 py-3 font-semibold">Task</th>
                <th className="px-5 py-3 font-semibold">Workspace</th>
                <th className="px-5 py-3 font-semibold">Priority</th>
                <th className="px-5 py-3 font-semibold">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900">{task.title}</td>
                  <td className="px-5 py-4 text-gray-600">{task.workspace}</td>
                  <td className={`px-5 py-4 font-semibold ${statusStyle[task.priority] || 'text-gray-600'}`}>
                    {task.priority}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {formatters.formatDate(task.due, { month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAssignedTasks;