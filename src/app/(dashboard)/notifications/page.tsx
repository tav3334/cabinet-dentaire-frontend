'use client';

import { useRouter } from 'next/navigation';
import { useNotificationsStore, NotificationType, Notification } from '@/store/notifications-store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  Calendar,
  User,
  ClipboardList,
  Settings,
  Clock,
  Check,
  Trash2,
  CheckCheck,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const typeIcons: Record<NotificationType, React.ReactNode> = {
  appointment: <Calendar className="h-5 w-5" />,
  patient: <User className="h-5 w-5" />,
  treatment: <ClipboardList className="h-5 w-5" />,
  system: <Settings className="h-5 w-5" />,
  reminder: <Clock className="h-5 w-5" />,
};

const typeColors: Record<NotificationType, string> = {
  appointment: 'bg-blue-100 text-blue-600',
  patient: 'bg-green-100 text-green-600',
  treatment: 'bg-purple-100 text-purple-600',
  system: 'bg-gray-100 text-gray-600',
  reminder: 'bg-amber-100 text-amber-600',
};

const typeLabels: Record<NotificationType, string> = {
  appointment: 'Rendez-vous',
  patient: 'Patients',
  treatment: 'Traitements',
  system: 'Système',
  reminder: 'Rappels',
};

export default function NotificationsPage() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotificationsStore();

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link) {
      router.push(link);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Bell className="h-8 w-8 text-blue-600" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Gérez toutes vos notifications
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Tout marquer comme lu
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" onClick={clearAll}>
              <Trash2 className="mr-2 h-4 w-4" />
              Tout supprimer
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {(Object.keys(typeLabels) as NotificationType[]).map((type) => {
          const count = notifications.filter((n) => n.type === type).length;
          return (
            <Card key={type}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-lg', typeColors[type])}>
                    {typeIcons[type]}
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-muted-foreground">{typeLabels[type]}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Notifications Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            Toutes ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Non lues ({unreadNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="read">
            Lues ({readNotifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <NotificationsList
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            onRemove={removeNotification}
            onMarkAsRead={markAsRead}
          />
        </TabsContent>

        <TabsContent value="unread">
          <NotificationsList
            notifications={unreadNotifications}
            onNotificationClick={handleNotificationClick}
            onRemove={removeNotification}
            onMarkAsRead={markAsRead}
            emptyMessage="Aucune notification non lue"
          />
        </TabsContent>

        <TabsContent value="read">
          <NotificationsList
            notifications={readNotifications}
            onNotificationClick={handleNotificationClick}
            onRemove={removeNotification}
            onMarkAsRead={markAsRead}
            emptyMessage="Aucune notification lue"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface NotificationsListProps {
  notifications: Notification[];
  onNotificationClick: (id: string, link?: string) => void;
  onRemove: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  emptyMessage?: string;
}

function NotificationsList({
  notifications,
  onNotificationClick,
  onRemove,
  onMarkAsRead,
  emptyMessage = 'Aucune notification',
}: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = format(new Date(notification.createdAt), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {} as Record<string, typeof notifications>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            {format(new Date(date), 'EEEE d MMMM yyyy', { locale: fr })}
          </h3>
          <Card>
            <CardContent className="p-0 divide-y">
              {dateNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'flex items-start gap-4 p-4 cursor-pointer transition-colors hover:bg-muted/50',
                    !notification.read && 'bg-blue-50/50'
                  )}
                  onClick={() => onNotificationClick(notification.id, notification.link)}
                >
                  <div
                    className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
                      typeColors[notification.type]
                    )}
                  >
                    {typeIcons[notification.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className={cn(
                            'text-base',
                            !notification.read && 'font-semibold'
                          )}
                        >
                          {notification.title}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {typeLabels[notification.type]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkAsRead(notification.id);
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove(notification.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-3 w-3 shrink-0 rounded-full bg-blue-500 mt-1" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
