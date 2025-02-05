import React from "react"
import { cn } from "../../lib/utils"
import { ChevronDown } from "lucide-react"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, label, error, ...props }, ref) => {
    return (
      <div className="relative">
        {label && (
          <label className="mb-2 block text-sm font-medium text-gray-900">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={cn(
              "block w-full appearance-none rounded-lg bg-white px-3 py-2 pr-8 text-gray-900",
              "border border-gray-200 hover:border-gray-300",
              "transition-colors duration-200",
              "focus:outline-none focus:border-primary",
              "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
              error && "border-red-500",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

Select.displayName = "Select"
