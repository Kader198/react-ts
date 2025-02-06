import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';

interface FilterBadgeProps {
  label: string;
  value: string;
  onRemove: () => void;
  className?: string;
}

export function FilterBadge({ label, value, onRemove, className }: FilterBadgeProps) {
  return (
    <Badge 
      variant="outline"
      className={cn(
        "h-7 px-2 inline-flex items-center gap-1.5 transition-colors",
        "bg-primary/5 border-primary/5 text-primary-foreground/90",
        "hover:bg-primary/10 hover:border-primary/30",
        className
      )}
    >
      <div className="flex items-center gap-1 text-xs">
        <span className="text-muted-foreground">{label}:</span>
        <span className="font-medium">{value}</span>
      </div>
      <button
        onClick={onRemove}
        className={cn(
          "rounded-full p-0.5 transition-colors",
          "hover:bg-primary/15 active:bg-primary/20",
          "focus:outline-none focus:ring-2 focus:ring-primary/20"
        )}
      >
        <X className="h-3 w-3" />
        <span className="sr-only">Remove {label} filter</span>
      </button>
    </Badge>
  );
}