import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useContacts, ContactActivity, ContactType } from '@/hooks/useContacts';
import { UserIcon, Users2Icon, UserPlusIcon, MessageSquareIcon, FileTextIcon, CalendarIcon } from 'lucide-react';

interface ContactsActivityFeedProps {
  limit?: number;
  filter?: {
    contactType?: ContactType[];
    activityType?: string[];
  };
}

const ContactsActivityFeed: React.FC<ContactsActivityFeedProps> = ({
  limit = 10,
  filter
}) => {
  const { recentActivities, contacts, isLoading, error, fetchContacts } = useContacts();

  useEffect(() => {
    fetchContacts({
      type: filter?.contactType,
      updatedAfter: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
    });
  }, [fetchContacts, filter]);

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'added':
        return <UserPlusIcon className="h-4 w-4 text-green-500" />;
      case 'updated':
        return <FileTextIcon className="h-4 w-4 text-blue-500" />;
      case 'contacted':
        return <MessageSquareIcon className="h-4 w-4 text-purple-500" />;
      case 'meeting':
        return <CalendarIcon className="h-4 w-4 text-orange-500" />;
      case 'note':
        return <FileTextIcon className="h-4 w-4 text-yellow-500" />;
      default:
        return <UserIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getContactTypeColor = (type?: string) => {
    switch (type) {
      case 'client':
        return 'bg-green-500';
      case 'lead':
        return 'bg-blue-500';
      case 'partner':
        return 'bg-purple-500';
      case 'member':
        return 'bg-yellow-500';
      case 'freelance':
        return 'bg-orange-500';
      case 'investor':
        return 'bg-cyan-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Filter activities based on props
  const filteredActivities = recentActivities
    .filter(activity => {
      if (!filter) return true;
      
      if (filter.activityType && filter.activityType.length > 0) {
        return filter.activityType.includes(activity.activity_type);
      }
      
      return true;
    })
    .slice(0, limit);

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Activité des contacts</span>
          <Badge variant="outline" className="ml-2">{filteredActivities.length}</Badge>
        </CardTitle>
        <CardDescription>Activités récentes des contacts</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 animate-pulse rounded-md w-3/4"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded-md w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500">Erreur lors du chargement des activités</div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            Aucune activité récente
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${activity.contact_name}`} alt={activity.contact_name} />
                  <AvatarFallback>{getInitials(activity.contact_name)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{activity.contact_name}</div>
                    <div className="text-xs text-gray-500">{formatDate(activity.timestamp)}</div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {activity.description}
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center text-xs text-gray-500">
                      {getActivityIcon(activity.activity_type)}
                      <span className="ml-1 capitalize">{activity.activity_type}</span>
                    </div>
                    
                    {activity.metadata?.contact_type && (
                      <Badge className={`${getContactTypeColor(activity.metadata.contact_type)} text-white text-xs`}>
                        {activity.metadata.contact_type}
                      </Badge>
                    )}
                    
                    {activity.metadata?.company && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Users2Icon className="h-3 w-3 mr-1" />
                        <span>{activity.metadata.company}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <a href="/contacts" className="text-sm text-blue-600 hover:underline">
          Voir tous les contacts
        </a>
      </CardFooter>
    </Card>
  );
};

export default ContactsActivityFeed;
