import React from "react";
import { FolderKanban, Users, LayoutGrid, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WorkspaceOverview = ({ workspaces = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Workspaces</h2>
      </div>

      {workspaces.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
            <Briefcase size={20} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">No workspaces yet</p>
          <p className="text-sm text-gray-500 mb-4">Create a workspace to get started</p>
          <button 
            onClick={() => navigate('/workspaces')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Create Workspace
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {workspaces.slice(0, 4).map((workspace) => (
            <button
              key={workspace.id}
              onClick={() => navigate(`/workspaces/${workspace.id}`)}
              className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 ${workspace.color}`}>
                    <FolderKanban size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {workspace.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <LayoutGrid size={12} />
                        {workspace.boards} boards
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {workspace.members} members
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-xs font-medium text-gray-900 ml-2">
                  {workspace.tasks} tasks
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-600 font-medium">Progress</span>
                  <span className="text-gray-900 font-semibold">{workspace.progress}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-orange-600 transition-all duration-500"
                    style={{ width: `${workspace.progress}%` }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {workspaces.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
          <button 
            onClick={() => navigate('/workspaces')}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            View all workspaces →
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkspaceOverview;