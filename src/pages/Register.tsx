import { zodResolver } from '@hookform/resolvers/zod';
import { Loader, Lock, Mail, User } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AuthFormLayout } from '../components/layouts/AuthFormLayout';
import { Button } from '../components/ui/button';
import { FormInput } from '../components/ui/form-input';
import { RegisterInput, registerSchema } from '../lib/validations/auth';
import { useAuthStore } from '../stores/authStore';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const success = await register(data.email, data.password, data.name);
      if (success) {
        toast.success('Account created successfully!');
        navigate('/');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <AuthFormLayout
      title="Create Account"
      subtitle="Sign up to get started with our platform"
      footer={{
        text: "Already have an account?",
        linkText: "Sign in",
        linkTo: "/login"
      }}
      variant="default"
      image={{
        src: "/auth-background.jpg",
        alt: "Authentication background"
      }}
      additionalContent={
        <div className="text-center text-sm text-gray-500">
          <p className="mb-1">Demo credentials</p>
          <code className="px-2 py-1 bg-gray-100 rounded text-xs">
            demo@example.com / demo123
          </code>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <FormInput
            id="name"
            label="Full Name"
            placeholder="Enter your name"
            icon={User}
            error={errors.name?.message}
            {...registerField('name')}
          />

          <FormInput
            id="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            icon={Mail}
            error={errors.email?.message}
            {...registerField('email')}
          />

          <FormInput
            id="password"
            type="password"
            label="Password"
            placeholder="Create a password"
            icon={Lock}
            error={errors.password?.message}
            {...registerField('password')}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </div>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </AuthFormLayout>
  );
}; 