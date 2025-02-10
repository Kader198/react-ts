import { zodResolver } from '@hookform/resolvers/zod';
import { Loader, Lock, Mail, User } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthFormLayout } from '../../components/layouts/AuthFormLayout';
import { Button } from '../../components/ui/button';
import { FormInput } from '../../components/ui/form-input';
import { RegisterInput, registerSchema } from '../../lib/validations/auth';
import { useAuthStore } from '../../stores/authStore';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const { t } = useTranslation();
  
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
        toast.success(t('auth.registerSuccess'));
        navigate('/');
      } else {
        toast.error(t('auth.registerFailed'));
      }
    } catch (err) {
      toast.error(t('auth.error'));
    }
  };

  return (
    <AuthFormLayout
      title={t('auth.createAccount')}
      subtitle={t('auth.signUpToContinue')}
      footer={{
        text: t('auth.haveAccount'),
        linkText: t('auth.signIn'),
        linkTo: "/login"
      }}
      variant="default"
      image={{
        src: "/auth-background.jpg",
        alt: t('auth.backgroundImage')
      }}
      additionalContent={
        <div className="text-center text-sm text-gray-500">
          <p className="mb-1">{t('auth.demoCredentials')}</p>
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
            label={t('auth.fullName')}
            placeholder={t('auth.enterName')}
            icon={User}
            error={errors.name?.message}
            {...registerField('name')}
          />

          <FormInput
            id="email"
            type="email"
            label={t('auth.email')}
            placeholder={t('auth.enterEmail')}
            icon={Mail}
            error={errors.email?.message}
            {...registerField('email')}
          />

          <FormInput
            id="password"
            type="password"
            label={t('auth.password')}
            placeholder={t('auth.createPassword')}
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
              {t('auth.creatingAccount')}
            </div>
          ) : (
            t('auth.createAccount')
          )}
        </Button>
      </form>
    </AuthFormLayout>
  );
}; 