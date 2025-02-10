import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { AuthFormLayout } from '../../components/layouts/AuthFormLayout';
import { Button } from '../../components/ui/button';
import { FormInput } from '../../components/ui/form-input';

const otpSchema = z.object({
  otp: z.string().min(4, 'OTP must be at least 4 digits').max(6, 'OTP cannot exceed 6 digits')
});

type OTPInput = z.infer<typeof otpSchema>;

export const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<OTPInput>({
    resolver: zodResolver(otpSchema)
  });

  const onSubmit = async (data: OTPInput) => {
    try {
      // TODO: Implement OTP verification API call here
      toast.success('OTP verified successfully!');
      navigate('/reset-password');
    } catch (err) {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  return (
    <AuthFormLayout
      title="Verify OTP"
      subtitle="Enter the OTP sent to your phone"
      footer={{
        text: "Didn't receive the code?",
        linkText: "Resend OTP",
        linkTo: "#",
        onClick: () => {
          // TODO: Implement resend OTP functionality
          toast.success('New OTP has been sent!');
        }
      }}
      variant="default"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          id="otp"
          type="text"
          label="OTP Code"
          placeholder="Enter OTP"
          error={errors.otp?.message}
          {...register('otp')}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </div>
          ) : (
            'Verify OTP'
          )}
        </Button>
      </form>
    </AuthFormLayout>
  );
}; 