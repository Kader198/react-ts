import React, { useEffect, useState } from 'react';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import type { Column } from '../components/common/DataTable';
import { DataTable } from '../components/common/DataTable';
import { ModalForm } from '../components/common/ModalForm';
import { PageLayout } from '../components/common/PageLayout';
import { PriorityBadge } from '../components/tasks/PriorityBadge';
import { TaskActions } from '../components/tasks/TaskActions';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskStatusBadge } from '../components/tasks/TaskStatusBadge';
import { useDebounce } from '../hooks/useDebounce';
import { useTasks } from '../hooks/useTasks';
import { useDataTableStore } from '../stores/dataTableStore';
import { Task } from '../types/models';

// Add this status color mapping near the top of the component
const statusColors = {
  'todo': 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'in-review': 'bg-yellow-100 text-yellow-800',
  'completed': 'bg-green-100 text-green-800',
} as const;

// Add this interface after the imports
interface FilterOption {
  label: string;
  value: string;
  className?: string;
}

export const Tasks: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [pageSize] = useState(10);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    dueDate: new Date().toISOString().split('T')[0],
  });

  const {
    searchTerm,
    filters,
    page,
    reset: resetDataTable,
    setIsSearching,
  } = useDataTableStore();

  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [debouncedFilters] = useDebounce(filters, 500);

  const {
    data: tasksData,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
    updateStatusMutation,
  } = useTasks(page, pageSize, debouncedSearch, debouncedFilters);

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
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (task: Task) => (
        <TaskActions
          task={task}
          onMoveNext={handleMoveToNextStatus}
          onEdit={handleEdit}
          onDelete={(task) => {
            setDeletingTask(task);
            setIsDeleteModalOpen(true);
          }}
        />
      ),
    },
  ];

  // Add status progression map
  const nextStatus: Record<Task['status'], Task['status']> = {
    'todo': 'in-progress',
    'in-progress': 'in-review',
    'in-review': 'completed',
    'completed': 'completed'
  };

  // Add handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      await updateMutation.mutateAsync({
        id: editingTask.id,
        data: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
    handleCloseModal();
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

  const handleMoveToNextStatus = async (task: Task) => {
    const nextTaskStatus = nextStatus[task.status];
    if (nextTaskStatus === task.status) return;
    
    await updateStatusMutation.mutateAsync({
      id: task.id,
      status: nextTaskStatus,
    });
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

  const handleConfirmDelete = () => {
    if (deletingTask) {
      deleteMutation.mutate(deletingTask.id);
    }
  };

  // Reset datatable state when component unmounts
  useEffect(() => {
    return () => {
      resetDataTable();
    };
  }, [resetDataTable]);

  

  return (
    <PageLayout
      title="Tasks"
      description="Manage and track your team's tasks"
      onAddNew={() => setIsModalOpen(true)}
      addNewLabel="New Task"
      isLoading={isLoading}
    >
      <DataTable
        data={tasksData?.data ?? []}
        columns={columns as Column<Task>[]}
        searchable={true}
        pageSize={pageSize}
        totalCount={tasksData?.total ?? 0}
        isLoading={isLoading}
        onPageChange={(page) => {}}
        onSearchChange={(value) => {}}
        onFilterChange={(key, value) => {}}
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: [
              {label: 'All', value: ''} as FilterOption,
              {label: 'Todo', value: 'todo', className: statusColors['todo']} as FilterOption,
              {label: 'In Progress', value: 'in-progress', className: statusColors['in-progress']} as FilterOption,
              {label: 'In Review', value: 'in-review', className: statusColors['in-review']} as FilterOption,
              {label: 'Completed', value: 'completed', className: statusColors['completed']} as FilterOption,
            ]
          },
          {
            key: 'priority',
            label: 'Priority',
            options: [
              {label: 'All', value: ''} as FilterOption,
              {label: 'Low', value: 'low', className: 'bg-green-100 text-green-800'} as FilterOption,
              {label: 'Medium', value: 'medium', className: 'bg-yellow-100 text-yellow-800'} as FilterOption,
              {label: 'High', value: 'high', className: 'bg-red-100 text-red-800'} as FilterOption,
            ]
          }
        ]}
      />

      <ModalForm
        title={editingTask ? 'Edit Task' : 'New Task'}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      >
        <div className="max-w-lg mx-auto">
          <TaskForm
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      </ModalForm>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingTask(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </PageLayout>
  );
}; 