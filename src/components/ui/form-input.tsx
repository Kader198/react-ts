import { LucideIcon } from 'lucide-react';
import React from 'react';
import { cn } from '../../lib/utils';
import { Input } from './input';
import { Label } from './label';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  icon?: LucideIcon;
  rightIcon?: React.ReactNode;
  inputRef?: React.RefObject<HTMLInputElement>;
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
    inputRef, 
    error,
    isLoading,
    required,
    success,
    size = 'md',
    containerClassName,
    disabled,
    ...props 
  }, ref) => {
    // Generate unique ID if none provided
    const inputId = id || React.useId();
    
    // Determine input height based on size
    const inputHeight = {
      sm: 'h-8',
      md: 'h-10',
      lg: 'h-12'
    }[size];

    // Determine icon size based on input size
    const iconSize = {
      sm: 'h-3.5 w-3.5',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    }[size];

    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label && (
          <Label 
            htmlFor={inputId} 
            className={cn(
              "flex items-center gap-1.5",
              required && "after:content-['*'] after:text-red-500 after:ml-0.5"
            )}
          >
            {label}
            {error && (
              <span className="text-xs font-normal text-destructive">
                ({error})
              </span>
            )}
          </Label>
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
          <Input
            ref={inputRef || ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={helperText ? `${inputId}-description` : undefined}
            disabled={disabled || isLoading}
            className={cn(
              inputHeight,
              "w-full rounded-md bg-white px-3 py-2 text-sm outline-none transition-all",
              "placeholder:text-gray-400",
              "focus:ring-2 focus:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
              Icon && "pl-9",
              error && "ring-2 ring-destructive focus:ring-destructive",
              success && "ring-2 ring-green-500 focus:ring-green-500",
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
              "text-sm",
              error ? "text-destructive" : "text-muted-foreground"
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