import React, { useEffect, useState } from 'react';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import type { Column } from '../components/common/DataTable';
import { DataTable } from '../components/common/DataTable';
import { ModalForm } from '../components/common/ModalForm';
import { PageLayout } from '../components/common/PageLayout';
import { UserForm } from '../components/users/UserForm';
import { useDebounce } from '../hooks/useDebounce';
import { useUsers } from '../hooks/useUsers';
import { useDataTableStore } from '../stores/dataTableStore';
import type { User } from '../types/models';

const roleColors = {
  'admin': 'bg-purple-100 text-purple-800',
  'manager': 'bg-blue-100 text-blue-800',
  'employee': 'bg-green-100 text-green-800',
} as const;

interface FilterOption {
  label: string;
  value: string;
  className?: string;
}

export const Users: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [pageSize] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
  });

  const {
    searchTerm,
    filters,
    page,
    reset: resetDataTable,
  } = useDataTableStore();

  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [debouncedFilters] = useDebounce(filters, 500);

  const {
    data: usersData,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useUsers(page, pageSize, debouncedSearch, debouncedFilters);

  const columns: Column<User>[] = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Email', accessorKey: 'email' },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: (user: User) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role as keyof typeof roleColors]}`}>
          {user.role}
        </span>
      ),
    },
    { header: 'Department', accessorKey: 'department' },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (user: User) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(user)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setDeletingUser(user);
              setIsDeleteModalOpen(true);
            }}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      await updateMutation.mutateAsync({
        id: editingUser.id,
        data: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
    handleCloseModal();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: '',
      department: '',
    });
  };

  const handleConfirmDelete = () => {
    if (deletingUser) {
      deleteMutation.mutate(deletingUser.id);
      setIsDeleteModalOpen(false);
      setDeletingUser(null);
    }
  };

  useEffect(() => {
    return () => {
      resetDataTable();
    };
  }, [resetDataTable]);

  return (
    <PageLayout
      title="Users"
      description="Manage your team members"
      onAddNew={() => setIsModalOpen(true)}
      addNewLabel="New User"
      isLoading={isLoading}
    >
      <DataTable
        data={usersData?.data ?? []}
        columns={columns}
        searchable={true}
        pageSize={pageSize}
        totalCount={usersData?.total ?? 0}
        isLoading={isLoading}
        onPageChange={(page) => {}}
        onSearchChange={(value) => {}}
        onFilterChange={(key, value) => {}}
        filters={[
          {
            key: 'role',
            label: 'Role',
            options: [
              { label: 'All', value: '' },
              { label: 'Admin', value: 'admin', className: roleColors['admin'] },
              { label: 'Manager', value: 'manager', className: roleColors['manager'] },
              { label: 'Employee', value: 'employee', className: roleColors['employee'] },
            ],
          },
        ]}
      />

      <ModalForm
        title={editingUser ? 'Edit User' : 'New User'}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      >
        <div className="max-w-lg mx-auto">
          <UserForm
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      </ModalForm>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingUser(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${deletingUser?.name}? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </PageLayout>
  );
}; 