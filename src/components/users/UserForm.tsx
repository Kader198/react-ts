import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormInput } from '../ui/form-input';
import { FormSelect } from '../ui/form-select';
import { Label } from "../ui/label";

const userFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .nonempty('Name is required'),
  email: z.string()
    .nonempty('Email is required')
    .email('Please enter a valid email address'),
  password: z.string()
    .nonempty('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  repeatPassword: z.string()
    .nonempty('Please confirm your password'),
  role: z.enum(['admin', 'manager', 'employee'], {
    required_error: 'Please select a role',
  }),
}).refine((data) => data.password === data.repeatPassword, {
  message: "Passwords don't match",
  path: ["repeatPassword"],
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  defaultValues?: Partial<UserFormData>;
}

export function UserForm({ onSubmit, defaultValues }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
      role: 'employee',
      ...defaultValues,
    },
    mode: 'onBlur', // Validate on blur
  });

  const onSubmitForm = handleSubmit(async (data) => {
    try {
       onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  return (
    <form onSubmit={onSubmitForm} className="space-y-4">
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

      <div className="space-y-2">
        <FormSelect
          label="Role"
          id="role"
          {...register('role')}
          error={errors.role?.message}
          options={[
            { label: 'Admin', value: 'admin' },
            { label: 'Manager', value: 'manager' },
            { label: 'Employee', value: 'employee' }
          ]}
          placeholder="Select role"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
} 