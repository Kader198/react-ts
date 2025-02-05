import React from "react"
import { cn } from "../../lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="mb-2 block text-sm font-medium text-gray-900">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "block w-full rounded-lg border border-gray-200 bg-white/50 px-3 py-2 text-gray-900",
            "placeholder:text-gray-400",
            "hover:bg-white/80 transition-colors duration-200",
            "focus:outline-none focus:bg-white",
            "disabled:cursor-not-allowed disabled:bg-gray-50/50 disabled:text-gray-500",
            error && "border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

Input.displayName = "Input"
