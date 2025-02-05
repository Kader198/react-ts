import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Plus, Loader } from 'lucide-react';
import { Task } from '../types/models';
import { apiService } from '../services/api';
import { Button } from '../components/ui/button';
import { ModalForm } from '../components/common/ModalForm';
import { TaskDetailsModal } from '../components/tasks/TaskDetailsModal';

export const Calendar: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => apiService.listTasks(),
  });

  const getTaskStyle = (task: Task) => {
    const statusColors = {
      'todo': {
        backgroundColor: '#f3f4f6',
        borderColor: '#9ca3af',
        textColor: '#374151'
      },
      'in-progress': {
        backgroundColor: '#dbeafe',
        borderColor: '#3b82f6',
        textColor: '#1e40af'
      },
      'in-review': {
        backgroundColor: '#fef3c7',
        borderColor: '#f59e0b',
        textColor: '#92400e'
      },
      'completed': {
        backgroundColor: '#d1fae5',
        borderColor: '#10b981',
        textColor: '#065f46'
      }
    };

    const priorityOpacity = {
      'high': '1',
      'medium': '0.8',
      'low': '0.6'
    };

    const style = statusColors[task.status];
    return {
      ...style,
      opacity: priorityOpacity[task.priority]
    };
  };

  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: task.dueDate,
    ...getTaskStyle(task),
    extendedProps: task
  }));

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
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage your tasks and deadlines
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          eventContent={(eventInfo) => (
            <div className="p-1">
              <div className="font-medium text-xs truncate">
                {eventInfo.event.title}
              </div>
              {eventInfo.view.type !== 'dayGridMonth' && (
                <div className="text-xs opacity-75 truncate">
                  {eventInfo.event.extendedProps.description}
                </div>
              )}
            </div>
          )}
          eventClick={(info) => {
            setSelectedTask(info.event.extendedProps as Task);
          }}
          height="auto"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          select={(info) => {
            // Handle date selection - could open new task modal
            console.log('Date range selected:', info.startStr, info.endStr);
          }}
          eventDrop={(info) => {
            // Handle event drag and drop - could update task due date
            console.log('Event dropped:', info.event.startStr);
          }}
          className="fc-theme-custom" // Add custom theme class
        />
      </div>

      <ModalForm
        title="Task Details"
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onSubmit={(e) => {
          e.preventDefault();
          setSelectedTask(null);
        }}
      >
        {selectedTask && <TaskDetailsModal task={selectedTask} />}
      </ModalForm>
    </div>
  );
}; 