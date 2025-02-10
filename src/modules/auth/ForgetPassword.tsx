import { zodResolver } from '@hookform/resolvers/zod';
import { Loader, Mail, Phone } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { AuthFormLayout } from '../../components/layouts/AuthFormLayout';
import { Button } from '../../components/ui/button';
import { FormInput } from '../../components/ui/form-input';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

const phoneSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits')
});

type EmailInput = z.infer<typeof emailSchema>;
type PhoneInput = z.infer<typeof phoneSchema>;

export const ForgetPassword: React.FC<{ method: 'email' | 'phone' }> = ({ method }) => {
  const navigate = useNavigate();

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting }
  } = useForm<EmailInput>({
    resolver: zodResolver(emailSchema)
  });

  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors, isSubmitting: isPhoneSubmitting }
  } = useForm<PhoneInput>({
    resolver: zodResolver(phoneSchema)
  });

  const onEmailSubmit = async (data: EmailInput) => {
    try {
      // TODO: Implement forget password API call here
      toast.success('Reset password link has been sent to your email!');
      navigate('/login');
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const onPhoneSubmit = async (data: PhoneInput) => {
    try {
      // TODO: Implement OTP sending API call here
      toast.success('OTP has been sent to your phone!');
      navigate('/verify-otp');
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <AuthFormLayout
      title="Forgot Password"
      subtitle="Reset your password using email or phone number"
      footer={{
        text: "Remember your password?",
        linkText: "Sign in",
        linkTo: "/login"
      }}
      variant="default"
    >
      <div className="space-y-4">
        {method === 'email' ? (
          <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-4">
            <FormInput
              id="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              icon={Mail}
              error={emailErrors.email?.message}
              {...registerEmail('email')}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isEmailSubmitting}
            >
              {isEmailSubmitting ? (
                <div className="flex items-center">
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Sending reset link...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handlePhoneSubmit(onPhoneSubmit)} className="space-y-4">
            <FormInput
              id="phone"
              type="tel"
              label="Phone Number"
              placeholder="Enter your phone number"
              icon={Phone}
              error={phoneErrors.phone?.message}
              {...registerPhone('phone')}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isPhoneSubmitting}
            >
              {isPhoneSubmitting ? (
                <div className="flex items-center">
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </div>
              ) : (
                'Send OTP'
              )}
            </Button>
          </form>
        )}
      </div>
    </AuthFormLayout>
  );
}; 