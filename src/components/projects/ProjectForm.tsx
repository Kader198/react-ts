import React from 'react';
import { FormInput } from '../ui/form-input';
import { Textarea } from '../ui/textarea';
import { Select } from '../ui/select';

interface ProjectFormData {
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  startDate: string;
  endDate: string;
  teamId: string;
}

interface ProjectFormProps {
  formData: ProjectFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>;
  isEditing: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  formData,
  setFormData,
  isEditing,
}) => {
  return (
    <div className="space-y-4">
      <FormInput
        id="name"
        name="name"
        label="Project Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <Textarea
        id="description"
        name="description"
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />

      <Select
        label="Status"
        name="status"
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
      >
        <option value="active">Active</option>
        <option value="completed">Completed</option>
        <option value="on-hold">On Hold</option>
      </Select>

      <FormInput
        id="startDate"
        name="startDate"
        type="date"
        label="Start Date"
        value={formData.startDate}
        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
      />

      <FormInput
        id="endDate"
        name="endDate"
        type="date"
        label="End Date"
        value={formData.endDate}
        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
      />

      {/* Add team selection component here */}
    </div>
  );
}; 