import React from 'react';
import { FormInput } from '../ui/form-input';
import { Textarea } from '../ui/textarea';

interface TeamFormData {
  name: string;
  description: string;
}

interface TeamFormProps {
  formData: TeamFormData;
  setFormData: React.Dispatch<React.SetStateAction<TeamFormData>>;
  isEditing: boolean;
}

export const TeamForm: React.FC<TeamFormProps> = ({
  formData,
  setFormData,
  isEditing,
}) => {
  return (
    <div className="space-y-4">
      <FormInput
        id="name"
        name="name"
        label="Team Name"
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
    </div>
  );
}; 