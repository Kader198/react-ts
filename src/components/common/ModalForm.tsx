import React from 'react';
import { Button } from '../ui/button';
import { Loader } from 'lucide-react';

interface ModalFormProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  children: React.ReactNode;
}

export function ModalForm({
  title,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  children
}: ModalFormProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl shadow-lg max-w-md w-full p-6 border">
        <h2 className="text-xl font-semibold mb-6">{title}</h2>
        <form onSubmit={onSubmit} className="space-y-6">
          {children}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 