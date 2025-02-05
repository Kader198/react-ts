import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Loader, Filter, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Task } from '../types/models';
import { apiService } from '../services/api';
import { TaskForm } from '../components/tasks/TaskForm';
import { DataTable } from '../components/common/DataTable';
import { DataTableFilters } from '../components/common/DataTableFilters';
import { ModalForm } from '../components/common/ModalForm';

interface TaskFormData {
  title: string;
  description: string;
  priority: Task['priority'];
  dueDate: string;
}

export const Tasks: React.FC = () => {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
  });

  // Queries
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => apiService.listTasks(),
  });

  // Mutations
  const createTaskMutation = useMutation({
    mutationFn: (newTask: Partial<Task>) => apiService.createTask(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsAddModalOpen(false);
      resetForm();
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      apiService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setEditingTask(null);
      resetForm();
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const toggleTaskStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Task['status'] }) =>
      apiService.updateTask(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taskData = {
      ...formData,
      status: 'todo' as const,
    };

    if (editingTask) {
      updateTaskMutation.mutate({
        id: editingTask.id,
        data: taskData,
      });
    } else {
      createTaskMutation.mutate(taskData);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate.split('T')[0],
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(id);
    }
  };

  const handleToggleStatus = (task: Task) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    toggleTaskStatusMutation.mutate({ id: task.id, status: newStatus });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
    });
  };

  const columns = [
    {
      header: 'Title',
      accessorKey: 'title' as const,
    },
    {
      header: 'Priority',
      accessorKey: 'priority' as const,
      cell: (task: Task) => (
        <span className={getPriorityClass(task.priority)}>
          {task.priority}
        </span>
      ),
    },
    // ... other columns
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DataTableFilters
        onSearch={(value) => {/* handle search */}}
        onFilter={(value) => {/* handle filter */}}
        filterOptions={[
          { label: 'All', value: 'all' },
          { label: 'High Priority', value: 'high' },
          { label: 'Medium Priority', value: 'medium' },
          { label: 'Low Priority', value: 'low' },
        ]}
        onAdd={() => setIsAddModalOpen(true)}
        addButtonText="Add Task"
      />

      <DataTable
        data={tasks}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <ModalForm
        title={editingTask ? 'Edit Task' : 'New Task'}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      >
        {/* Your form fields */}
      </ModalForm>
    </div>
  );
}; 