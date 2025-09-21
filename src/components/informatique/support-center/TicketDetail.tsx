'use client';

import { useState } from 'react';
import { Data } from '@/types/data';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, Clock, MessageSquare, Tag, PaperclipIcon, 
  Send, CheckCircle2, AlertCircle, XCircle, 
  PlayCircle, PauseCircle, RotateCw
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Message {
  id: string;
  content: string;
  sender: string;
  sender_email?: string;
  sender_role: 'user' | 'support';
  timestamp: string;
  attachments?: string[];
}

interface TicketDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket?: Data;
  onUpdateStatus?: (ticketId: string, newStatus: string) => void;
}

export function TicketDetail({ open, onOpenChange, ticket, onUpdateStatus }: TicketDetailProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!ticket) return null;

  const status = ticket.metadata?.status as string || 'new';
  const priority = ticket.metadata?.priority as string || 'medium';
  const requester = ticket.metadata?.requester as string || 'Anonyme';
  const requesterEmail = ticket.metadata?.requester_email as string || '';
  const category = ticket.metadata?.category as string || 'Autre';
  const createdAt = ticket.metadata?.created_at as string || ticket.created_at;
  const updatedAt = ticket.metadata?.updated_at as string || ticket.updated_at;
  
  // Mock messages for demonstration
  const messages: Message[] = [
    {
      id: '1',
      content: ticket.content || 'Pas de description fournie.',
      sender: requester,
      sender_email: requesterEmail,
      sender_role: 'user',
      timestamp: createdAt || new Date().toISOString(),
    }
  ];

  if (ticket.metadata?.messages && Array.isArray(ticket.metadata.messages)) {
    messages.push(...(ticket.metadata.messages as Message[]));
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate sending a message
    setTimeout(() => {
      toast({
        title: "Message envoyé",
        description: "Votre message a été ajouté au ticket",
      });
      setNewMessage('');
      setIsSubmitting(false);
    }, 1000);
  };

  const handleStatusChange = (newStatus: string) => {
    if (onUpdateStatus && ticket.id) {
      onUpdateStatus(ticket.id, newStatus);
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="h-4 w-4" />;
      case 'open':
        return <AlertCircle className="h-4 w-4" />;
      case 'in_progress':
        return <PlayCircle className="h-4 w-4" />;
      case 'waiting':
        return <PauseCircle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'closed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Nouveau';
      case 'open': return 'Ouvert';
      case 'in_progress': return 'En cours';
      case 'waiting': return 'En attente';
      case 'resolved': return 'Résolu';
      case 'closed': return 'Fermé';
      default: return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{ticket.title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Ticket metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Statut</span>
              <div className="flex items-center mt-1">
                <Select defaultValue={status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Nouveau</SelectItem>
                    <SelectItem value="open">Ouvert</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="waiting">En attente</SelectItem>
                    <SelectItem value="resolved">Résolu</SelectItem>
                    <SelectItem value="closed">Fermé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Priorité</span>
              <Badge variant="outline" className={`mt-1 ${getPriorityColor(priority)}`}>
                {priority === 'low' ? 'Basse' : 
                 priority === 'medium' ? 'Moyenne' : 
                 priority === 'high' ? 'Haute' : 'Critique'}
              </Badge>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Catégorie</span>
              <span className="mt-1 text-sm font-medium">
                {category === 'hardware' ? 'Matériel' :
                 category === 'software' ? 'Logiciel' :
                 category === 'network' ? 'Réseau' :
                 category === 'access' ? 'Accès' :
                 category === 'security' ? 'Sécurité' : 'Autre'}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Créé le</span>
              <span className="mt-1 text-sm font-medium">{formatDate(createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Demandeur:</span>
            <span className="text-sm font-medium">{requester}</span>
            {requesterEmail && (
              <span className="text-sm text-muted-foreground">({requesterEmail})</span>
            )}
          </div>

          {ticket.tags && ticket.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {ticket.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-4" />

          {/* Messages section */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-6">
            {messages.map((message, index) => (
              <div key={message.id || index} className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.sender}`} />
                    <AvatarFallback>{message.sender.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{message.sender}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(message.timestamp)}</div>
                  </div>
                  {message.sender_role === 'support' && (
                    <Badge variant="outline" className="ml-auto bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                      Support
                    </Badge>
                  )}
                </div>
                <div className="pl-10 pr-4 whitespace-pre-wrap">{message.content}</div>
                {message.attachments && message.attachments.length > 0 && (
                  <div className="pl-10 mt-2 flex items-center gap-2">
                    <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-2">
                      {message.attachments.map((attachment, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {attachment}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Reply section */}
          <div className="mt-auto">
            <Separator className="mb-4" />
            <div className="flex flex-col gap-4">
              <Textarea 
                placeholder="Répondre au ticket..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="resize-none"
                rows={3}
              />
              <div className="flex justify-between">
                <Button variant="outline" size="sm">
                  <PaperclipIcon className="mr-2 h-4 w-4" />
                  Joindre un fichier
                </Button>
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim() || isSubmitting}
                  size="sm"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
