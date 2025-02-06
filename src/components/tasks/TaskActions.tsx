import { ArrowRight, Edit2, Trash2 } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import { Task } from '../../types/models';
import { Button } from '../ui/button';

interface TaskActionsProps {
  task: Task;
  onMoveNext: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskActions({ task, onMoveNext, onEdit, onDelete }: TaskActionsProps) {
  const nextStatus: Record<Task['status'], Task['status']> = {
    'todo': 'in-progress',
    'in-progress': 'in-review',
    'in-review': 'completed',
    'completed': 'completed'
  };

  return (
    <div className="flex items-center gap-2">
      {task.status !== 'completed' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onMoveNext(task)}
          className="text-blue-600"
          data-tooltip-id="task-action "
          data-tooltip-content="Move to next status"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(task)}
        data-tooltip-id="task-action"
        data-tooltip-content="Edit task"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(task)}
        className="text-red-600"
        data-tooltip-id="task-action"
        data-tooltip-content="Delete task"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Tooltip
        id="task-action"
        place="top"
        className="z-50 px-2 py-1 text-xs bg-gray-900 text-white rounded shadow-lg"
      />
    </div>
  );
} 