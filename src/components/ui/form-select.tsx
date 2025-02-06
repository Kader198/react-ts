import { ChevronDown } from 'lucide-react';
import React from 'react';
import { cn } from '../../lib/utils';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ label: string; value: string }>;
  error?: string;
  helperText?: string;
  placeholder?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({ 
  label, 
  options, 
  className,
  error,
  helperText,
  disabled,
  placeholder,
  ...props 
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            "flex h-10 w-full rounded-md bg-background px-3 py-2 text-sm",
            "border border-gray-200 hover:border-gray-300",
            "appearance-none",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          disabled={disabled}
          {...props}
        >
          {placeholder && (
            <option value="" disabled selected hidden>
              {placeholder}
            </option>
          )}
          {options.map(option => (
            <option 
              key={option.value} 
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className={cn(
          "h-4 w-4 absolute right-3 top-3 pointer-events-none",
          error ? "text-red-500" : "text-gray-500",
          disabled && "opacity-50"
        )} />
      </div>
      {error && (
        <p className="text-sm font-medium text-red-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}; 