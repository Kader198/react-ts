import React from 'react';
import { Plus, Users, Calendar, CheckCircle } from 'lucide-react';

const projects = [
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Redesign and development of the company website',
    progress: 65,
    members: [
      { name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john' },
      { name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane' },
    ],
    dueDate: '2024-03-15',
    status: 'In Progress',
  },
  // Add more projects...
];

export const Projects: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track and manage your team's projects
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-5 w-5 mr-2" />
            New Project
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{project.description}</p>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.members.map((member, idx) => (
                    <img
                      key={idx}
                      className="h-8 w-8 rounded-full ring-2 ring-white"
                      src={member.avatar}
                      alt={member.name}
                    />
                  ))}
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {project.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 