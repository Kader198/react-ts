import React from "react"
import { NavLink } from "react-router-dom"
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  FolderKanban,
  Settings
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
    title: "Calendar",
    icon: Calendar,
    path: "/calendar",
  },
  {
    title: "Projects",
    icon: FolderKanban,
    path: "/projects",
  },
]

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-white">
      <div className="flex h-full flex-col">
        <nav className="space-y-1 p-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-gray-50",
                  isActive 
                    ? "bg-primary/5 text-primary" 
                    : "text-gray-700"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-gray-50",
                isActive 
                  ? "bg-primary/5 text-primary" 
                  : "text-gray-700"
              )
            }
          >
            <Settings className="h-5 w-5" />
            Settings
          </NavLink>
        </div>
      </div>
    </aside>
  )
} 