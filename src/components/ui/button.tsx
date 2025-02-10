import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = {
  variant: {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 hover:opacity-90 active:shadow-inner shadow-sm",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:opacity-90 active:shadow-inner shadow-sm",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:opacity-90 active:shadow-inner",
    ghost: "hover:bg-accent hover:text-accent-foreground hover:opacity-90 active:shadow-inner",
    link: "text-primary underline-offset-4 hover:underline hover:opacity-90 active:shadow-inner",
  },
  size: {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-8",
    icon: "h-10 w-10",
  },
} as const

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "hover:opacity-70 cursor-pointer", variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          "disabled:pointer-events-none disabled:opacity-50",
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        disabled={isLoading}
        {...props}
      >
        <div className="flex items-center gap-2">
          {children}
        </div>
      </button>
    )
  }
)

Button.displayName = "Button"
