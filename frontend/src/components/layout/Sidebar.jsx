import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  KanbanSquare,
  Bell,
  Settings,
  UserCircle2,
  LogOut,
  Search,
  MemoryStick,
  CheckSquare,
  User,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Workspaces",
    path: "/workspaces",
    icon: BriefcaseBusiness,
  },
  {
    title: "Boards",
    path: "/boards",
    icon: KanbanSquare,
  },
  {
    title: "My Tasks",
    path: "/mytasks",
    icon: CheckSquare,
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    title: "Search",
    path: "/search",
    icon: Search,
  },
  {
    title: "Members",
    path: "/members",
    icon: User,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  return (
    <aside className="flex flex-col w-64 h-screen bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">
          CollabSpace
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Real-Time Workspace
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
            <UserCircle2 size={28} className="text-blue-600" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              Sohel Shaikh
            </h3>

            <p className="text-xs text-gray-500">
              Workspace Admin
            </p>
          </div>
        </div>

        <button className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-medium text-red-600 transition border border-red-200 rounded-xl hover:bg-red-50">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;