import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../../stores/authStore"
import { Navbar } from "../Navbar"
import { Sidebar } from "../Sidebar"

export const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <Sidebar />
      <main className="pl-64 pt-16 min-h-screen">
        <div className="container mx-auto p-6">
          <div className=" bg-white/50 rounded-xl p-6 shadow-sm">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
} 