import React from "react";
import { Activity } from "lucide-react";
import { formatters } from "../../utils/formatters";

const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
      </div>

      {activities.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
            <Activity size={20} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">No recent activity</p>
          <p className="text-sm text-gray-500">Activity from your workspaces will appear here</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {activities.map((activity) => (
            <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-9 h-9 font-medium text-sm text-orange-700 bg-orange-100 rounded-full flex-shrink-0">
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">{activity.user}</span>
                    {" "}{activity.action}{" "}
                    <span className="font-medium text-gray-900">{activity.target}</span>
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatters.formatRelativeTime(activity.time)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;