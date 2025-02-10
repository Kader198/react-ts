import React from 'react';
import { ModalForm } from '../../../components/common/ModalForm';
import type { User } from '../../../types/models';
import { UserForm } from './UserForm';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser: User | null;
  isLoading: boolean;
  onSubmit: (data: { name: string; email: string; role: string; password?: string }) => Promise<void>;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  editingUser,
  isLoading,
  onSubmit,
}) => {
  return (
    <ModalForm
      title={editingUser ? 'Edit User' : 'New User'}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={(e) => {
        e.preventDefault();
        window.submitForm?.();
      }}
      isLoading={isLoading}
    >
      <div className="max-w-lg mx-auto">
        <UserForm
          isEditing={!!editingUser}
          onSubmit={onSubmit}
          defaultValues={{
            name: editingUser?.name || '',
            email: editingUser?.email || '',
            role: editingUser?.role || 'user',
            password: '',
            repeatPassword: '',
          }}
        />
      </div>
    </ModalForm>
  );
}; 