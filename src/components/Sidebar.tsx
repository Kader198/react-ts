import React from "react"
import { NavLink, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  FolderKanban,
  Settings,
  Users
} from "lucide-react"
import { cn } from "../lib/utils"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Tasks",
    icon: CheckSquare,
    path: "/tasks",
  },
  {
    title: "Projects",
    icon: FolderKanban,
    path: "/projects",
  },
  {
    title: "Teams",
    icon: Users,
    path: "/teams",
  },
  {
    title: "Calendar",
    icon: Calendar,
    path: "/calendar",
  },
]

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-sm">
      <div className="flex h-full flex-col">
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                "hover:bg-gray-50",
                isActive(item.path)
                  ? "bg-black text-white hover:bg-black/90"
                  : "text-gray-700"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </NavLink>
          ))}
        </nav>

        <div className="p-4">
          <NavLink
            to="/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
              "hover:bg-gray-50",
              isActive('/settings')
                ? "bg-black text-white hover:bg-black/90"
                : "text-gray-700"
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </NavLink>
        </div>
      </div>
    </aside>
  )
} 