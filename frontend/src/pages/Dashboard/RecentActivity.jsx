import React from "react";
import { ArrowRight } from "lucide-react";
import { formatters } from "../../utils/formatters";

const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <button className="flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700">
          View All <ArrowRight size={16} />
        </button>
      </div>

      {activities.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
      ) : (
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 font-semibold text-orange-600 bg-orange-100 rounded-full">
                {activity.user.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{activity.user}</span>{" "}
                  {activity.action}{" "}
                  <span className="font-medium text-gray-900">{activity.target}</span>
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {formatters.formatRelativeTime(activity.time)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;