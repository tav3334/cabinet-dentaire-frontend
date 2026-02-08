'use client';

import { useRouter } from 'next/navigation';
import { useNotificationsStore, NotificationType } from '@/store/notifications-store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  Calendar,
  User,
  ClipboardList,
  Settings,
  Clock,
  Check,
  X,
  Trash2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const typeIcons: Record<NotificationType, React.ReactNode> = {
  appointment: <Calendar className="h-4 w-4" />,
  patient: <User className="h-4 w-4" />,
  treatment: <ClipboardList className="h-4 w-4" />,
  system: <Settings className="h-4 w-4" />,
  reminder: <Clock className="h-4 w-4" />,
};

const typeColors: Record<NotificationType, string> = {
  appointment: 'bg-blue-100 text-blue-600',
  patient: 'bg-green-100 text-green-600',
  treatment: 'bg-purple-100 text-purple-600',
  system: 'bg-gray-100 text-gray-600',
  reminder: 'bg-amber-100 text-amber-600',
};

export function NotificationsDropdown() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } =
    useNotificationsStore();

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link) {
      router.push(link);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 md:w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="text-base font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-1 px-2 text-xs text-blue-600 hover:text-blue-700"
              onClick={(e) => {
                e.preventDefault();
                markAllAsRead();
              }}
            >
              <Check className="mr-1 h-3 w-3" />
              Tout marquer comme lu
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Aucune notification</p>
            </div>
          ) : (
            <div className="space-y-1 p-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50',
                    !notification.read && 'bg-blue-50/50'
                  )}
                  onClick={() => handleNotificationClick(notification.id, notification.link)}
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                      typeColors[notification.type]
                    )}
                  >
                    {typeIcons[notification.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          'text-sm',
                          !notification.read && 'font-semibold'
                        )}
                      >
                        {notification.title}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 shrink-0 rounded-full bg-blue-500 mt-2" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center text-sm text-muted-foreground cursor-pointer"
              onClick={() => router.push('/notifications')}
            >
              Voir toutes les notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
