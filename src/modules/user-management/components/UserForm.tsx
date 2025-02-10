import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormInput } from '../../../components/ui/form-input';
import { FormSelect } from '../../../components/ui/form-select';
import { Label } from "../../../components/ui/label";

const baseSchema = {
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .nonempty('Name is required'),
  email: z.string()
    .nonempty('Email is required')
    .email('Please enter a valid email address'),
  role: z.enum(['admin', 'user'])
    .optional()
    .default('user'),
};

const newUserSchema = z.object({
  ...baseSchema,
  password: z.string()
    .nonempty('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  repeatPassword: z.string()
    .nonempty('Please confirm your password'),
}).refine((data) => data.password === data.repeatPassword, {
  message: "Passwords don't match",
  path: ["repeatPassword"],
});

const editUserSchema = z.object({
  ...baseSchema,
  password: z.string().optional(),
  repeatPassword: z.string().optional(),
}).refine((data) => !data.password || !data.repeatPassword || data.password === data.repeatPassword, {
  message: "Passwords don't match",
  path: ["repeatPassword"],
});

export type UserFormData = z.infer<typeof newUserSchema>;

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  defaultValues?: Partial<UserFormData>;
  isEditing?: boolean;
}

export function UserForm({ onSubmit, defaultValues, isEditing }: UserFormProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(isEditing ? editUserSchema : newUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
      role: 'user',
      ...defaultValues,
    },
    mode: 'onBlur',
  });

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    setValue,
    watch 
  } = form;

  // Watch the role field
  const roleValue = watch('role');

  // Set initial values when defaultValues changes
  useEffect(() => {
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        setValue(key as keyof UserFormData, value);
      });
    }
  }, [defaultValues, setValue]);

  useEffect(() => {
    if (window.submitForm) {
      window.submitForm = handleSubmit(onSubmit);
    } else {
      window.submitForm = handleSubmit(onSubmit);
    }
  }, [handleSubmit, onSubmit]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <FormInput
          id="name"
          {...register('name')}
          error={errors.name?.message}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <FormInput
          id="email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          disabled={isSubmitting}
        />
      </div>

      {!isEditing && (
        <>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <FormInput
              id="password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repeatPassword">Repeat Password</Label>
            <FormInput
              id="repeatPassword"
              type="password"
              {...register('repeatPassword')}
              error={errors.repeatPassword?.message}
              disabled={isSubmitting}
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <FormSelect
          label="Role"
          id="role"
          {...register('role')}
          error={errors.role?.message}
          options={[
            { label: 'Admin', value: 'admin' },
            { label: 'User', value: 'user' }
          ]}
          placeholder="Select role"
          disabled={isSubmitting}
          value={roleValue}
        />
      </div>
    </div>
  );
}

// Add type declaration for the global submitForm function
declare global {
  interface Window {
    submitForm: () => void;
  }
} 