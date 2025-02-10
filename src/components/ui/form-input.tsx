import { LucideIcon } from 'lucide-react';
import React from 'react';
import { cn } from '../../lib/utils';

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  icon?: LucideIcon;
  rightIcon?: React.ReactNode;
  error?: string;
  isLoading?: boolean;
  required?: boolean;
  success?: boolean;
  size?: 'sm' | 'md' | 'lg';
  containerClassName?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ 
    label, 
    helperText, 
    icon: Icon, 
    className, 
    id, 
    rightIcon, 
    error,
    isLoading,
    required,
    success,
    size = 'md',
    containerClassName,
    disabled,
    type = "text",
    ...props 
  }, ref) => {
    const inputId = id || React.useId();
    
    const inputHeight = {
      sm: 'h-8',
      md: 'h-10',
      lg: 'h-12'
    }[size];

    const iconSize = {
      sm: 'h-3.5 w-3.5',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    }[size];

    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label && (
          <label 
            htmlFor={inputId} 
            className={cn(
              "mb-2 block text-sm font-medium text-gray-900",
              "flex items-center gap-1.5",
              required && "after:content-['*'] after:text-red-500 after:ml-0.5"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2",
              disabled ? "text-gray-300" : "text-gray-500"
            )}>
              <Icon className={iconSize} />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            aria-invalid={!!error}
            aria-describedby={helperText ? `${inputId}-description` : undefined}
            disabled={disabled || isLoading}
            className={cn(
              "block w-full rounded-lg bg-white px-3 py-2 text-gray-900",
              inputHeight,
              "placeholder:text-gray-400",
              "ring-1 ring-gray-200 hover:ring-gray-300",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary",
              "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
              Icon && "pl-9",
              error && "ring-2 ring-red-500",
              success && "ring-2 ring-green-500",
              className
            )}
            {...props}
          />
          <div className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2",
            disabled && "opacity-50"
          )}>
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-primary" />
            )}
            {rightIcon}
          </div>
        </div>
        {(helperText || error) && (
          <p 
            id={`${inputId}-description`}
            className={cn(
              "mt-1 text-sm",
              error ? "text-red-500" : "text-gray-500"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';