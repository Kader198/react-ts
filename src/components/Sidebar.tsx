import {
  CheckSquare,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  X
} from "lucide-react"
import React, { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
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
    title: "Users",
    icon: Users,
    path: "/users",
  },
]

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
      className="fixed top-4 left-4 z-50 p-2 rounded-md lg:hidden"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-white shadow-sm z-40 transition-transform duration-300 ease-in-out",
        "lg:translate-x-0 lg:top-16 lg:h-[calc(100vh-4rem)]",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo or brand for mobile view */}
          <div className="p-4 border-b lg:hidden">
            <h1 className="text-xl font-bold">Your App</h1>
          </div>

          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  "hover:bg-gray-50",
                  isActive
                    ? "bg-black text-white hover:bg-black/90"
                    : "text-gray-700"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.title}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t">
            <NavLink
              to="/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                "hover:bg-gray-50",
                isActive
                  ? "bg-black text-white hover:bg-black/90"
                  : "text-gray-700"
              )}
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">Settings</span>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  )
} 