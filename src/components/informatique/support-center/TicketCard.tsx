'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, MessageSquare, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { Data } from '@/types/data';

interface TicketCardProps {
  ticket: Data;
  onView?: (ticket: Data) => void;
}

export function TicketCard({ ticket, onView }: TicketCardProps) {
  const handleView = () => {
    if (onView) {
      onView(ticket);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'new': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'open': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'in_progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'waiting': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      'resolved': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'closed': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'low': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      'critical': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="h-4 w-4" />;
      case 'open':
        return <HelpCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'waiting':
        return <Clock className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'closed':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const status = ticket.metadata?.status as string || 'new';
  const priority = ticket.metadata?.priority as string || 'medium';
  const requester = ticket.metadata?.requester as string || 'Anonyme';
  const createdAt = ticket.metadata?.created_at as string || ticket.created_at;
  const messageCount = ticket.metadata?.message_count as number || 0;

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{ticket.title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={getPriorityColor(priority)}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Badge>
            <Badge variant="outline" className={getStatusColor(status)}>
              <span className="flex items-center gap-1">
                {getStatusIcon(status)}
                {status === 'in_progress' ? 'En cours' : 
                 status === 'waiting' ? 'En attente' : 
                 status === 'resolved' ? 'Résolu' : 
                 status === 'closed' ? 'Fermé' : 
                 status === 'new' ? 'Nouveau' : 'Ouvert'}
              </span>
            </Badge>
          </div>
        </div>
        <CardDescription className="mt-2 line-clamp-2">
          {ticket.summary || ticket.content}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Demandeur:</span>
            <span className="ml-2 font-medium">{requester}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Créé le:</span>
            <span className="ml-2 font-medium">{formatDate(createdAt)}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Messages:</span>
            <span className="ml-2 font-medium">{messageCount}</span>
          </div>
          
          {ticket.tags && ticket.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {ticket.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" onClick={handleView}>
          Voir le ticket
        </Button>
      </CardFooter>
    </Card>
  );
}
