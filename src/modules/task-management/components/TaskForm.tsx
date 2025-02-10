import React from 'react';
import { FormInput } from '../../../components/ui/form-input';
import { FormSelect } from '../../../components/ui/form-select';
import { Label } from "../../../components/ui/label";
import { Task } from '../../../types/models';

interface TaskFormProps {
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
}

export function TaskForm({ formData, setFormData }: TaskFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <FormInput
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <FormInput
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <FormSelect
          label="Priority"
          id="priority"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
          options={[
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' }
          ]}
          placeholder="Select priority"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <FormInput
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        />
      </div>
    </div>
  );
} 