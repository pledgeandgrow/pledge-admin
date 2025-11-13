import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';

// Create supabase client once outside the hook (singleton pattern)
// Reserved for future real-time notifications
const _supabase = createClient();

export type NotificationType = 
  'info' | 'warning' | 'success' | 'error' | 
  'task' | 'project' | 'document' | 'event' | 
  'message' | 'contact' | 'system';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  link?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  // Generate mock notifications for demonstration purposes
  const generateMockNotifications = useCallback((userId: string) => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        user_id: userId,
        title: 'Nouvelle tâche assignée',
        message: 'Vous avez été assigné à une nouvelle tâche "Mise à jour du site web"',
        type: 'task',
        is_read: false,
        link: '/tasks/123',
        created_at: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
        updated_at: new Date(Date.now() - 30 * 60000).toISOString()
      },
      {
        id: '2',
        user_id: userId,
        title: 'Réunion à venir',
        message: 'Rappel: Réunion d\'équipe dans 1 heure',
        type: 'event',
        is_read: false,
        link: '/calendar',
        created_at: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
        updated_at: new Date(Date.now() - 60 * 60000).toISOString()
      },
      {
        id: '3',
        user_id: userId,
        title: 'Document partagé',
        message: 'Jean Dupont a partagé un document "Cahier des charges v2" avec vous',
        type: 'document',
        is_read: true,
        link: '/documents/456',
        created_at: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
        updated_at: new Date(Date.now() - 3 * 3600000).toISOString()
      },
      {
        id: '4',
        user_id: userId,
        title: 'Nouveau message',
        message: 'Vous avez reçu un nouveau message de Marie Martin',
        type: 'message',
        is_read: true,
        link: '/messages/789',
        created_at: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
        updated_at: new Date(Date.now() - 5 * 3600000).toISOString()
      },
      {
        id: '5',
        user_id: userId,
        title: 'Projet mis à jour',
        message: 'Le projet "Refonte Application Mobile" a été mis à jour',
        type: 'project',
        is_read: false,
        link: '/projects/101',
        created_at: new Date(Date.now() - 8 * 3600000).toISOString(), // 8 hours ago
        updated_at: new Date(Date.now() - 8 * 3600000).toISOString()
      },
      {
        id: '6',
        user_id: userId,
        title: 'Nouveau contact',
        message: 'Un nouveau contact a été ajouté: Sophie Lefebvre',
        type: 'contact',
        is_read: true,
        link: '/contacts/202',
        created_at: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
        updated_at: new Date(Date.now() - 24 * 3600000).toISOString()
      },
      {
        id: '7',
        user_id: userId,
        title: 'Maintenance système',
        message: 'Une maintenance système est prévue ce soir à 22h00',
        type: 'system',
        is_read: false,
        created_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString(), // 2 days ago
        updated_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString()
      }
    ];
    
    return mockNotifications;
  }, []); // Empty deps - function is stable

  const fetchNotifications = useCallback(async () => {
    try {
      console.log('🔄 Fetching notifications...');
      setIsLoading(true);
      setError(null);
      
      if (!user) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      
      // In a real app, we would fetch from Supabase
      // const { data, error } = await supabase
      //   .from('notifications')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .order('created_at', { ascending: false });
      
      // For now, use mock data
      const mockData = generateMockNotifications(user.id);
      
      console.log('✅ Fetched', mockData.length, 'notifications');
      setNotifications(mockData);
      setUnreadCount(mockData.filter(n => !n.is_read).length);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch notifications');
      console.error('❌ Error fetching notifications:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // user and generateMockNotifications accessed from closure - stable for hook lifetime

  const markAsRead = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app: await supabase.from('notifications').update({ is_read: true }).eq('id', id);
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, is_read: true, updated_at: new Date().toISOString() } 
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      console.log('✅ Notification marked as read:', id);
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to mark notification as read');
      console.error('❌ Error marking notification as read:', error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty deps - function is stable

  const markAllAsRead = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app: await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id);
      
      setNotifications(prev => 
        prev.map(notification => ({ 
          ...notification, 
          is_read: true,
          updated_at: new Date().toISOString()
        }))
      );
      
      // Update unread count
      setUnreadCount(0);
      console.log('✅ All notifications marked as read');
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to mark all notifications as read');
      console.error('❌ Error marking all notifications as read:', error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty deps - function is stable

  const deleteNotification = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app: await supabase.from('notifications').delete().eq('id', id);
      
      setNotifications(prev => {
        const notificationToDelete = prev.find(n => n.id === id);
        const filtered = prev.filter(notification => notification.id !== id);
        
        // Update unread count if needed
        if (notificationToDelete && !notificationToDelete.is_read) {
          setUnreadCount(count => Math.max(0, count - 1));
        }
        
        return filtered;
      });
      
      console.log('✅ Notification deleted:', id);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete notification');
      console.error('❌ Error deleting notification:', error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty deps - function is stable

  // Load notifications on component mount or when user changes
  useEffect(() => {
    console.log('🚀 useNotifications: Initial fetch on mount');
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only depend on user ID

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};

export default useNotifications;
