import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { ModalForm } from './ModalForm';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading
}) => {
  return (
    <ModalForm
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={(e) => {
        e.preventDefault();
        onConfirm();
      }}
      isLoading={isLoading}
    >
      <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
        <p className="text-sm text-red-600">{message}</p>
      </div>
    </ModalForm>
  );
}; 