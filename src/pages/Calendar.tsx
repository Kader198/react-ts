import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { TaskForm } from '../components/tasks/TaskForm';
import toast from 'react-hot-toast';

export const Calendar: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ start: string; end: string } | null>(null);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => apiService.listTasks(),
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data: { id: string; dueDate: string }) =>
      apiService.updateTask(data.id, { dueDate: data.dueDate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully');
    },
    onError: () => {
      toast.error('Failed to update task');
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: apiService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsNewTaskModalOpen(false);
      setSelectedDates(null);
      toast.success('Task created successfully');
    },
    onError: () => {
      toast.error('Failed to create task');
    },
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

    return {
      ...statusColors[task.status],
      opacity: priorityOpacity[task.priority],
      className: `task-${task.status} priority-${task.priority}`
    };
  };

  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: task.dueDate,
    ...getTaskStyle(task),
    extendedProps: task
  }));

  const handleEventDrop = async (info: any) => {
    try {
      await updateTaskMutation.mutateAsync({
        id: info.event.id,
        dueDate: info.event.startStr
      });
    } catch (error) {
      info.revert();
    }
  };

  const handleDateSelect = (info: any) => {
    setSelectedDates({
      start: info.startStr,
      end: info.endStr
    });
    setIsNewTaskModalOpen(true);
  };

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
          <Button onClick={() => setIsNewTaskModalOpen(true)}>
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
          select={handleDateSelect}
          eventDrop={handleEventDrop}
          className="fc-theme-custom"
          slotMinTime="06:00:00"
          slotMaxTime="20:00:00"
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: '09:00',
            endTime: '17:00',
          }}
          nowIndicator={true}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
          }}
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

      <ModalForm
        title="New Task"
        isOpen={isNewTaskModalOpen}
        onClose={() => {
          setIsNewTaskModalOpen(false);
          setSelectedDates(null);
        }}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <TaskForm
          onSubmit={async (data) => {
            await createTaskMutation.mutateAsync({
              ...data,
              dueDate: selectedDates?.start || new Date().toISOString()
            });
          }}
          isLoading={createTaskMutation.isPending}
        />
      </ModalForm>
    </div>
  );
}; 