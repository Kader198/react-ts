import React, { useState, useEffect } from 'react';
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
import { TaskStatusBadge } from '../components/tasks/TaskStatusBadge';
import { PriorityBadge } from '../components/tasks/PriorityBadge';
import { useDataTableStore } from '../stores/dataTableStore';
import { useDebounce } from '../hooks/useDebounce';

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
  const [pageSize] = useState(10);
  
  const {
    searchTerm,
    filters,
    page,
    reset: resetDataTable,
    setIsSearching,
  } = useDataTableStore();

  // Debounce search and filter changes
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [debouncedFilters] = useDebounce(filters, 500);

  // Separate query key from search/filter state
  const queryKey = ['tasks', page, pageSize];

  const { data: tasksData, isLoading: isLoadingTasks } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await apiService.listTasks({
        page,
        pageSize,
        search: debouncedSearch, // Use debounced values
        filters: debouncedFilters,
      });
      setIsSearching(false);
      return result;
    },
    keepPreviousData: true,
  });

  // Mutations with simpler query key
  const createMutation = useMutation({
    mutationFn: (newTask: Partial<Task>) => apiService.createTask(newTask),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['tasks', page],
        exact: true,
      });
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      apiService.updateTask(id, data),
    onSuccess: () => {
      // Only refetch the current page
      queryClient.refetchQueries({
        queryKey: ['tasks', { page }],
        exact: false,
      });
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteTask(id),
    onSuccess: () => {
      // Only refetch the current page
      queryClient.refetchQueries({
        queryKey: ['tasks', { page }],
        exact: false,
      });
    },
  });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    dueDate: new Date().toISOString().split('T')[0],
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
    { header: 'Title', accessorKey: 'title' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (task: Task) => <TaskStatusBadge status={task.status} />
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      cell: (task: Task) => <PriorityBadge priority={task.priority} />
    },
    {
      header: 'Due Date',
      accessorKey: 'dueDate',
      cell: (task: Task) => new Date(task.dueDate).toLocaleDateString()
    },
    {
      header: 'Assignee',
      accessorKey: 'assigneeId',
      cell: (task: Task) => task.assignee?.name || '-'
    }
  ];

  const filterOptions = [
    {
      key: 'status' as keyof Task,
      label: 'Status',
      options: [
        { label: 'Todo', value: 'todo' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'In Review', value: 'in-review' },
        { label: 'Completed', value: 'completed' }
      ]
    },
    {
      key: 'priority' as keyof Task,
      label: 'Priority',
      options: [
        { label: 'High', value: 'high' },
        { label: 'Medium', value: 'medium' },
        { label: 'Low', value: 'low' }
      ]
    }
  ];

  // Reset datatable state when component unmounts
  useEffect(() => {
    return () => {
      resetDataTable();
    };
  }, [resetDataTable]);

  if (isLoadingTasks) {
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
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and track your team's tasks
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            <span>New Task</span>
          </Button>
        </div>
      </div>
  
        <DataTable
          data={tasksData?.data ?? []}
          columns={columns}
          filters={filterOptions}
          searchable={true}
          pageSize={pageSize}
          totalCount={tasksData?.total ?? 0}
          isLoading={isLoadingTasks}
          onPageChange={(page) => {}}
          onSearchChange={(value) => {}}
          onFilterChange={(key, value) => {}}
          onEdit={handleEdit}
          onDelete={handleDelete}
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