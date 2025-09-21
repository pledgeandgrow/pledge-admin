import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNotifications, Notification, NotificationType } from '@/hooks/useNotifications';
import { 
  Bell, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  CheckSquare, 
  Briefcase, 
  FileText, 
  Calendar, 
  MessageSquare, 
  User, 
  Settings 
} from 'lucide-react';

interface NotificationsPanelProps {
  limit?: number;
  showMarkAllAsRead?: boolean;
  filter?: {
    type?: NotificationType[];
    onlyUnread?: boolean;
  };
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  limit = 5,
  showMarkAllAsRead = true,
  filter
}) => {
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    error, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'task':
        return <CheckSquare className="h-5 w-5 text-purple-500" />;
      case 'project':
        return <Briefcase className="h-5 w-5 text-indigo-500" />;
      case 'document':
        return <FileText className="h-5 w-5 text-cyan-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-pink-500" />;
      case 'contact':
        return <User className="h-5 w-5 text-teal-500" />;
      case 'system':
        return <Settings className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffMinutes < 1) {
      return 'À l\'instant';
    } else if (diffMinutes < 60) {
      return `Il y a ${diffMinutes} min`;
    } else if (diffMinutes < 24 * 60) {
      const hours = Math.floor(diffMinutes / 60);
      return `Il y a ${hours}h`;
    } else {
      const days = Math.floor(diffMinutes / (60 * 24));
      return `Il y a ${days}j`;
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  // Filter notifications based on props
  const filteredNotifications = notifications
    .filter(notification => {
      if (!filter) return true;
      
      if (filter.type && filter.type.length > 0) {
        if (!filter.type.includes(notification.type)) return false;
      }
      
      if (filter.onlyUnread && notification.is_read) return false;
      
      return true;
    })
    .slice(0, limit);

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">{unreadCount}</Badge>
            )}
          </CardTitle>
          {showMarkAllAsRead && unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>
        <CardDescription>Vos notifications récentes</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 animate-pulse rounded-md w-3/4"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded-md w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500">Erreur lors du chargement des notifications</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            Aucune notification
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`flex items-start p-3 rounded-md transition-colors ${
                  notification.is_read ? 'bg-white' : 'bg-blue-50'
                } hover:bg-gray-50`}
              >
                <div className="mr-3 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className={`font-medium ${!notification.is_read && 'text-blue-700'}`}>
                      {notification.title}
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatTimeAgo(notification.created_at)}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    {notification.link ? (
                      <a 
                        href={notification.link} 
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Voir les détails
                      </a>
                    ) : (
                      <span></span>
                    )}
                    
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 px-2"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Marquer comme lu
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <a href="/notifications" className="text-sm text-blue-600 hover:underline">
          Voir toutes les notifications
        </a>
      </CardFooter>
    </Card>
  );
};

export default NotificationsPanel;
