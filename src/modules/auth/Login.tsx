import { zodResolver } from '@hookform/resolvers/zod';
import { Loader, Lock, Mail } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthFormLayout } from '../../components/layouts/AuthFormLayout';
import { Button } from '../../components/ui/button';
import { FormInput } from '../../components/ui/form-input';
import { LoginInput, loginSchema } from '../../lib/validations/auth';
import { useAuthStore } from '../../stores/authStore';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const success = await login(data.email, data.password);
      if (success) {
        toast.success(t('auth.loginSuccess'));
        navigate('/');
      } else {
        toast.error(t('auth.invalidCredentials'));
      }
    } catch (err) {
      toast.error(t('auth.error'));
    }
  };

  return (
    <AuthFormLayout
      title={t('auth.welcomeBack')}
      subtitle={t('auth.signInToContinue')}
      footer={{
        text: t('auth.noAccount'),
        linkText: t('auth.createOne'),
        linkTo: "/register"
      }}
      variant="default"
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
            id="email"
            type="email"
            label={t('auth.email')}
            placeholder={t('auth.enterEmail')}
            icon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />

          <FormInput
            id="password"
            type="password"
            label={t('auth.password')}
            placeholder={t('auth.enterPassword')}
            icon={Lock}
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded border-input"
              id="remember"
              name="remember"
            />
            <span className="text-muted-foreground">{t('auth.rememberMe')}</span>
          </label>
          <Button 
            variant="link" 
            className="p-0 h-auto font-normal"
            onClick={() => navigate('/forget-password')}
          >
            {t('auth.forgotPassword')}
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              {t('auth.signingIn')}
            </div>
          ) : (
            t('auth.signIn')
          )}
        </Button>
      </form>
    </AuthFormLayout>
  );
}; 