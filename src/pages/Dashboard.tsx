import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, Users, CheckCircle, Clock, ArrowUp, ArrowDown, Loader } from 'lucide-react';
import { apiService } from '../services/api';

export const Dashboard: React.FC = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => apiService.getDashboardStats(),
  });

  const stats = [
    { 
      name: 'Total Tasks', 
      value: dashboardData?.totalTasks ?? '-',
      change: '+12.5%',
      trend: 'up',
      icon: CheckCircle 
    },
    { 
      name: 'Team Members', 
      value: dashboardData?.teamMembers ?? '-',
      change: '+2.1%',
      trend: 'up',
      icon: Users 
    },
    { 
      name: 'Hours Tracked', 
      value: dashboardData?.hoursTracked ?? '-',
      change: '-4.5%',
      trend: 'down',
      icon: Clock 
    },
    { 
      name: 'Projects Active', 
      value: dashboardData?.activeProjects ?? '-',
      change: '+8.2%',
      trend: 'up',
      icon: BarChart3 
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track your team's performance and project progress
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden bg-white rounded-lg shadow-[0_2px_8px_rgb(0,0,0,0.04)] px-4 py-5"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-primary/5 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </dd>
                </div>
              </div>
              <div className={`mt-4 flex items-center text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
                <span className="ml-1">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgb(0,0,0,0.04)] p-6">
          <h3 className="text-lg font-medium text-gray-900">Tasks by Status</h3>
          {dashboardData?.tasksByStatus && (
            <div className="mt-4">
              {/* Add your chart component here using dashboardData.tasksByStatus */}
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgb(0,0,0,0.04)] p-6">
          <h3 className="text-lg font-medium text-gray-900">Project Progress</h3>
          {dashboardData?.projectProgress && (
            <div className="mt-4">
              {/* Add your chart component here using dashboardData.projectProgress */}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          {dashboardData?.recentActivity && (
            <div className="mt-4 space-y-4">
              {dashboardData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">{activity.user}</span>
                    <span className="text-gray-500"> {activity.action}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 