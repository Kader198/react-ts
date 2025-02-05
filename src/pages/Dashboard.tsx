import React from 'react';
import { BarChart3, Users, CheckCircle, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import { Analytics } from '../types/models';

const stats = [
  { 
    name: 'Total Tasks', 
    value: '245', 
    change: '+12.5%',
    trend: 'up',
    icon: CheckCircle 
  },
  { 
    name: 'Team Members', 
    value: '12', 
    change: '+2.1%',
    trend: 'up',
    icon: Users 
  },
  { 
    name: 'Hours Tracked', 
    value: '1,234', 
    change: '-4.5%',
    trend: 'down',
    icon: Clock 
  },
  { 
    name: 'Projects Active', 
    value: '8', 
    change: '+8.2%',
    trend: 'up',
    icon: BarChart3 
  },
];

export const Dashboard: React.FC = () => {
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
              className="relative overflow-hidden bg-white/50 backdrop-blur-sm px-4 py-5 rounded-xl shadow-sm 
                hover:shadow-md transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
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
        <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">Tasks by Status</h3>
          {/* Add chart component here */}
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">Project Progress</h3>
          {/* Add chart component here */}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          {/* Add activity feed component here */}
        </div>
      </div>
    </div>
  );
}; 