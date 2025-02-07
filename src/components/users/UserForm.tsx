import React from 'react';
import { FormInput } from '../ui/form-input';
import { FormSelect } from '../ui/form-select';
import { Label } from "../ui/label";

interface UserFormProps {
  formData: {
    name: string;
    email: string;
    role: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    role: string;
  }>>;
}

export function UserForm({ formData, setFormData }: UserFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <FormInput
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <FormInput
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <FormSelect
          label="Role"
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          options={[
            { label: 'Admin', value: 'admin' },
            { label: 'Manager', value: 'manager' },
            { label: 'Employee', value: 'employee' }
          ]}
          placeholder="Select role"
        />
      </div>
    </div>
  );
} 