import React from "react";
import { ArrowRight, FolderKanban, Users, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WorkspaceOverview = ({ workspaces = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Workspace Overview</h2>
          <p className="mt-0.5 text-xs text-gray-500">Track all active workspaces</p>
        </div>
        <button onClick={() => navigate('/workspaces')} className="flex items-center gap-1 text-sm font-medium text-orange-600 transition hover:text-orange-700">
          View All <ArrowRight size={15} />
        </button>
      </div>

      {workspaces.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">No workspaces found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              onClick={() => navigate(`/workspaces/${workspace.id}`)}
              className="p-4 transition-all duration-300 bg-white border border-gray-200 cursor-pointer group rounded-xl hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
            >
              <div className="flex items-center flex-1 min-w-0 gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${workspace.color}`}>
                  <FolderKanban size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-orange-600">{workspace.name}</h3>
                  <p className="mt-0.5 text-xs text-gray-500">{workspace.tasks} Tasks</p>
                </div>
              </div>

              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-[11px] text-gray-500">
                  <span>Progress</span>
                  <span>{workspace.progress}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full transition-all duration-700 rounded-full bg-gradient-to-r from-orange-500 to-green-500"
                    style={{ width: `${workspace.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Users size={14} className="text-gray-400" />
                  <span>{workspace.members}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <LayoutGrid size={14} className="text-gray-400" />
                  <span>{workspace.boards}</span>
                </div>
                <div className="rounded-md bg-orange-50 px-2 py-1 text-[11px] font-medium text-orange-600">Active</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkspaceOverview;