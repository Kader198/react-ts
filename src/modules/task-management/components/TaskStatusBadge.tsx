import React from 'react';
import { cn } from '../../../lib/utils';

interface TaskStatusBadgeProps {
  status: 'todo' | 'in-progress' | 'in-review' | 'completed';
}

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
  const styles = {
    'todo': 'bg-gray-100 text-gray-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    'in-review': 'bg-yellow-100 text-yellow-700',
    'completed': 'bg-green-100 text-green-700'
  };

  return (
    <span className={cn(
      'px-2.5 py-0.5 rounded-full text-xs font-medium',
      styles[status]
    )}>
      {status.replace('-', ' ')}
    </span>
  );
}; 