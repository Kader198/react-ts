import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Mail, Lock, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { FormInput } from '../components/ui/form-input';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    isValidEmail: false,
    isValidPassword: false,
  });

  const validateEmail = (email: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setFormState(prev => ({ ...prev, email, isValidEmail: isValid }));
  };

  const validatePassword = (password: string) => {
    const isValid = password.length >= 6;
    setFormState(prev => ({ ...prev, password, isValidPassword: isValid }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(formState.email, formState.password);
      if (success) {
        // Show success animation before navigating
        await new Promise(resolve => setTimeout(resolve, 500));
        navigate('/');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formState.isValidEmail && formState.isValidPassword;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="w-full max-w-sm">
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Sign in to your account to continue
          </p>
        </motion.div>

        <motion.div 
          className="bg-white/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-100"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 text-sm text-destructive bg-destructive/10 rounded-md flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <FormInput
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                icon={Mail}
                label="Email"
                placeholder="Enter your email"
                value={formState.email}
                onChange={(e) => validateEmail(e.target.value)}
                rightIcon={formState.email && (
                  formState.isValidEmail 
                    ? <CheckCircle className="h-4 w-4 text-success" />
                    : <AlertCircle className="h-4 w-4 text-destructive" />
                )}
              />

              <FormInput
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                icon={Lock}
                label="Password"
                placeholder="Enter your password"
                value={formState.password}
                onChange={(e) => validatePassword(e.target.value)}
                rightIcon={formState.password && (
                  formState.isValidPassword 
                    ? <CheckCircle className="h-4 w-4 text-success" />
                    : <AlertCircle className="h-4 w-4 text-destructive" />
                )}
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
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <Button variant="link" className="p-0 h-auto font-normal">
                Forgot password?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center"
                >
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </motion.div>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </motion.div>

        <motion.div 
          className="mt-6 space-y-4 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Create one
            </Link>
          </p>
          <div>
            <p className="mb-1">Demo credentials</p>
            <code className="px-2 py-1 bg-muted rounded text-xs">
              demo@example.com / demo123
            </code>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}; 