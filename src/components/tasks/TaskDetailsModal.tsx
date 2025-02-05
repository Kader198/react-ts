import React from 'react';
import { Clock, Calendar, AlertCircle, CheckCircle2, User } from 'lucide-react';
import { Task } from '../../types/models';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

interface TaskDetailsModalProps {
  task: Task;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task }) => {
  const statusColors = {
    'todo': 'bg-gray-100 text-gray-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    'in-review': 'bg-yellow-100 text-yellow-700',
    'completed': 'bg-green-100 text-green-700'
  };

  const priorityIcons = {
    'high': <AlertCircle className="h-4 w-4 text-red-500" />,
    'medium': <AlertCircle className="h-4 w-4 text-yellow-500" />,
    'low': <AlertCircle className="h-4 w-4 text-green-500" />
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
        <div className="flex items-center gap-2">
          <span className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            statusColors[task.status]
          )}>
            {task.status}
          </span>
          {priorityIcons[task.priority]}
        </div>
      </div>

      <div className="text-sm text-gray-600">{task.description}</div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Due: {format(new Date(task.dueDate), 'PPP')}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>Created: {format(new Date(task.createdAt), 'PPP')}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>Assignee: {task.assigneeId}</span>
        </div>
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {task.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}; 