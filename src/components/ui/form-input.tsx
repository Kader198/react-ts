import React from 'react';
import { Input } from './input';
import { Label } from './label';
import { LucideIcon } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  icon?: LucideIcon;
  rightIcon?: React.ReactNode;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, helperText, icon: Icon, className, id, rightIcon, inputRef, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative">
          {Icon && (
            <Icon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          )}
          <Input
            ref={inputRef || ref}
            id={id}
            className={`${Icon ? 'pl-10' : ''} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>
        {helperText && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput'; 