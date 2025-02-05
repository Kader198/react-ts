import React from "react"
import { useAuthStore } from "../stores/authStore"
import { Bell, Settings, LogOut, User } from "lucide-react"
import { Button } from "./ui/button"
import { Link } from "react-router-dom"

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore()

  return (
    <nav className="bg-white border-b h-16 fixed top-0 left-0 right-0 z-30">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xl font-semibold text-primary">
            SmartAI
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
          </Button>

          <div className="flex items-center border-l pl-4 ml-2">
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="text-sm font-medium text-gray-900">
                  {user?.name}
                </span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </div>
              
              <div className="relative group">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full bg-gray-100 p-1"
                >
                  <User className="h-5 w-5 text-gray-600" />
                </Button>

                <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
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