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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className="pl-64 pt-16 min-h-screen">
        <div className="container mx-auto py-6 px-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
} 