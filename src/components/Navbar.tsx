import { LogOut, Settings, User } from "lucide-react"
import React from "react"
import { Link } from "react-router-dom"
import { cn } from "../lib/utils"
import { useAuthStore } from "../stores/authStore"
import { NotificationDropdown } from "./notifications/NotificationDropdown"
import { Button } from "./ui/button"

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore()

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-30">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between">
        {/* Left section with brand */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className="text-xl font-semibold text-primary ml-12 lg:ml-0"
          >
            SmartAI
          </Link>
        </div>

        {/* Right section with notifications and user menu */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <NotificationDropdown />

          {/* User section */}
          <div className="flex items-center pl-4 ml-2 border-l border-gray-200">
            <div className="flex items-center gap-3">
              {/* User info - hidden on mobile */}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-medium text-gray-900">
                  {user?.name}
                </span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </div>
              
              {/* User menu dropdown */}
              <div className="relative group">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full bg-gray-50"
                >
                  <User className="h-5 w-5 text-gray-600" />
                </Button>

                {/* Dropdown menu */}
                <div className={cn(
                  "absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-lg",
                  "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
                  "transition-all duration-200 z-50"
                )}>
                  {/* Show user info on mobile */}
                  <div className="sm:hidden px-4 py-2 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.email}
                    </div>
                  </div>

                  <Link 
                    to="/settings" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>

                  <button
                    onClick={() => logout()}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 