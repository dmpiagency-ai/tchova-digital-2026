/**
 * ============================================
 * GSM NOTIFICATIONS COMPONENT
 * ============================================
 * Componente de notificações em tempo real para GSM
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  Wallet,
  X,
  Loader2,
  Check
} from 'lucide-react';
import {
  GSMNotification,
  subscribeToNotifications,
  markNotificationAsRead,
  getNotificationsFromFirestore
} from '@/services/gsmFirebase';

// ============================================
// TYPES
// ============================================

interface GSMNotificationsProps {
  userId: string;
  onNotificationClick?: (notification: GSMNotification) => void;
}

// ============================================
// COMPONENT
// ============================================

const GSMNotifications: React.FC<GSMNotificationsProps> = ({
  userId,
  onNotificationClick
}) => {
  const [notifications, setNotifications] = useState<GSMNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Subscribe to notifications in real-time
  useEffect(() => {
    if (!userId) return;

    setIsLoading(true);

    // Subscribe to real-time updates
    const unsubscribe = subscribeToNotifications(userId, (notifs) => {
      setNotifications(notifs);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Get icon for notification type
  const getNotificationIcon = (type: GSMNotification['type']) => {
    switch (type) {
      case 'payment_success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'payment_failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'rental_created':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'rental_expiring':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'rental_expired':
        return <Clock className="w-5 h-5 text-gray-500" />;
      case 'low_balance':
        return <Wallet className="w-5 h-5 text-orange-500" />;
      case 'credits_added':
        return <Wallet className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Handle mark as read
  const handleMarkAsRead = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markNotificationAsRead(notificationId);
    
    // Update local state
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  // Handle notification click
  const handleNotificationClick = async (notification: GSMNotification) => {
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
      setNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      );
    }

    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  // Format time ago
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações
          </SheetTitle>
          <SheetDescription>
            {unreadCount > 0
              ? `Você tem ${unreadCount} notificação${unreadCount > 1 ? 'ões' : ''} não lida${unreadCount > 1 ? 's' : ''}`
              : 'Todas as notificações foram lidas'}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)] mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhuma notificação ainda
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md ${
                    notification.read
                      ? 'bg-muted/30 border-border'
                      : 'bg-primary/5 border-primary/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`font-semibold text-sm ${
                          notification.read ? 'text-muted-foreground' : 'text-foreground'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 flex-shrink-0"
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Mark all as read */}
        {unreadCount > 0 && (
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                for (const n of notifications.filter(n => !n.read)) {
                  await markNotificationAsRead(n.id);
                }
                setNotifications(prev =>
                  prev.map(n => ({ ...n, read: true }))
                );
              }}
            >
              <Check className="w-4 h-4 mr-2" />
              Marcar todas como lidas
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default GSMNotifications;
