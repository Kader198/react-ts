import React from "react"
import { useTranslation } from "react-i18next"
import { Navigate, Outlet } from "react-router-dom"
import { cn } from "../../lib/utils"
import { useAuthStore } from "../../stores/authStore"
import { Navbar } from "../Navbar"
import { Sidebar } from "../Sidebar"

export const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuthStore()
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className={cn(
        "pt-16 min-h-screen",
        isRTL ? "lg:pr-64" : "lg:pl-64"
      )}>
        <div className="container mx-auto p-4 lg:py-6 lg:px-4">
          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
} 