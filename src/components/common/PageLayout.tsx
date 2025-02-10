import { Loader, Plus } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';

interface PageLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onAddNew?: () => void;
  addNewLabel?: string;
  isLoading?: boolean;
}

export function PageLayout({ 
  title, 
  description, 
  children, 
  onAddNew,
  addNewLabel = 'New',
  isLoading = false
}: PageLayoutProps) {
  if (isLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-sm text-gray-700">{description}</p>
        </div>
        {onAddNew && (
          <div className="mt-4 sm:mt-0 flex justify-end">
            <Button onClick={onAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              <span>{addNewLabel}</span>
            </Button>
          </div>
        )}
      </div>
      {children}
    </div>
  );
} 