import React from 'react';
import { Task } from '../../types/models';
import { Loader, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select } from '../ui/select';
import { FormInput } from '../ui/form-input';
import { FormSelect } from '../ui/form-select';

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