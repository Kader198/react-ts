import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Loader, Filter, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Task } from '../types/models';
import { apiService } from '../services/api';
import { TaskForm } from '../components/tasks/TaskForm';
import { DataTable } from '../components/common/DataTable';
import { DataTableFilters } from '../components/common/DataTableFilters';
import { ModalForm } from '../components/common/ModalForm';
import { Button } from '../components/ui/button';
import { FormInput } from '../components/ui/form-input';
import { Textarea } from '../components/ui/textarea';
import { Select } from '../components/ui/select';

interface TaskFormData {
  title: string;
  description: string;
  priority: Task['priority'];
  dueDate: string;
}

export const Tasks: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    dueDate: new Date().toISOString().split('T')[0],
  });

  // Queries
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', searchQuery, filterValue],
    queryFn: async () => {
      const allTasks = await apiService.listTasks();
      return allTasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterValue === 'all' || task.priority === filterValue;
        return matchesSearch && matchesFilter;
      });
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newTask: Partial<Task>) => apiService.createTask(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      apiService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      updateMutation.mutate({
        id: editingTask.id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
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
    setIsModalOpen(true);
  };

  const handleDelete = async (task: Task) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(task.id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
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
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${task.priority === 'high' ? 'bg-red-100 text-red-800' : 
            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-green-100 text-green-800'}`}
        >
          {task.priority}
        </span>
      ),
    },
    {
      header: 'Due Date',
      accessorKey: 'dueDate' as const,
      cell: (task: Task) => new Date(task.dueDate).toLocaleDateString(),
    },
    {
      header: 'Status',
      accessorKey: 'status' as const,
      cell: (task: Task) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 
            task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
            'bg-gray-100 text-gray-800'}`}
        >
          {task.status}
        </span>
      ),
    },
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
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and track your team's tasks
          </p>
        </div>
      </div>

      <DataTableFilters
        onSearch={setSearchQuery}
        onFilter={setFilterValue}
        filterOptions={[
          { label: 'All', value: 'all' },
          { label: 'High Priority', value: 'high' },
          { label: 'Medium Priority', value: 'medium' },
          { label: 'Low Priority', value: 'low' },
        ]}
        onAdd={() => setIsModalOpen(true)}
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
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      >
        <div className="space-y-4">
          <FormInput
            id="title"
            name="title"
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Textarea
            id="description"
            name="description"
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>

            <FormInput
              id="dueDate"
              name="dueDate"
              type="date"
              label="Due Date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      </ModalForm>
    </div>
  );
}; 