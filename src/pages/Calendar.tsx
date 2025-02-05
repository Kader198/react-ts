import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const days = [
  { date: '2024-01-01', events: [] },
  { date: '2024-01-02', events: [{ name: 'Project Review', time: '10:00 AM', type: 'meeting' }] },
  // Add more days...
];

export const Calendar: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="mt-2 text-sm text-gray-700">
            Schedule and manage your meetings and deadlines
          </p>
        </div>
        <div className="mt-4 flex space-x-3 sm:mt-0">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Previous
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
            <ChevronRight className="h-5 w-5 ml-1" />
          </button>
        </div>
      </div>

      {/* Calendar grid will go here */}
      <div className="bg-white shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
          <div className="bg-white py-2">Sun</div>
          <div className="bg-white py-2">Mon</div>
          <div className="bg-white py-2">Tue</div>
          <div className="bg-white py-2">Wed</div>
          <div className="bg-white py-2">Thu</div>
          <div className="bg-white py-2">Fri</div>
          <div className="bg-white py-2">Sat</div>
        </div>
        {/* Calendar days will go here */}
      </div>
    </div>
  );
}; 