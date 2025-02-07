import React from 'react';
import { cn } from '../../lib/utils';
interface NotificationItemProps {
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  description,
  time,
  read,
}) => {
  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors",
        !read && "bg-primary/5"
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {title}
        </p>
        <p className="text-sm text-gray-500 truncate">
          {description}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {time}
        </p>
      </div>
      {!read && (
        <div className="h-2 w-2 bg-primary rounded-full mt-2" />
      )}
    </div>
  );
}; 