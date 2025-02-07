import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { NotificationItem } from './NotificationItem';

export const NotificationDropdown = () => {
  const notifications = [
    {
      id: '1',
      title: 'New Task Assigned',
      description: 'You have been assigned a new task',
      time: '5m ago',
      read: false,
    },
    {
      id: '2',
      title: 'Project Update',
      description: 'Project X has been updated',
      time: '1h ago',
      read: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-semibold px-4 py-3 border-b">
          Notifications
        </DropdownMenuLabel>
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} {...notification} />
          ))}
        </div>
        {notifications.length === 0 && (
          <DropdownMenuItem className="text-muted-foreground text-center py-6">
            No notifications
          </DropdownMenuItem>
        )}
        {notifications.length > 0 && (
          <Button
            variant="ghost"
            className="w-full rounded-none border-t h-auto py-3 px-4 hover:bg-gray-50"
          >
            View all notifications
          </Button>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 