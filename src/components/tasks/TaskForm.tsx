import React from 'react';
import { Task } from '../../types/models';
import { Loader, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select } from '../ui/select';

interface TaskFormProps {
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    title: string;
    description: string;
    priority: Task['priority'];
    dueDate: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    title: string;
    description: string;
    priority: Task['priority'];
    dueDate: string;
  }>>;
  isLoading: boolean;
  isEditing: boolean;
  onCancel: () => void;
}
  
export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  formData,
  setFormData,
  isLoading,
  isEditing,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl shadow-lg max-w-md w-full p-6 border">
        <h2 className="text-xl font-semibold mb-8 flex items-center">
          {isEditing ? 'Edit Task' : 'New Task'}
        </h2>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="What needs to be done?"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-opacity">
                {formData.title ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Add more details about this task..."
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as Task['priority'] })
                }
                label="Priority"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <div className="relative">
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  min={new Date().toISOString().split('T')[0]}
                />
                <Calendar className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 