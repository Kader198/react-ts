import React from 'react';
import { Button } from '../ui/button';
import { Loader, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white rounded-xl shadow-lg"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-6">
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 