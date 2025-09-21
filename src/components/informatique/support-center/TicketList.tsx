'use client';

import { useState } from 'react';
import { Data } from '@/types/data';
import { TicketCard } from './TicketCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LifeBuoy, Plus, Loader2, Search, X, Filter } from 'lucide-react';

interface TicketListProps {
  tickets: Data[];
  isLoading: boolean;
  error: Error | null;
  onAddTicket: () => void;
  onViewTicket: (ticket: Data) => void;
}

export function TicketList({ 
  tickets, 
  isLoading, 
  error, 
  onAddTicket,
  onViewTicket
}: TicketListProps) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'new', label: 'Nouveaux' },
    { value: 'open', label: 'Ouverts' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'waiting', label: 'En attente' },
    { value: 'resolved', label: 'Résolus' },
    { value: 'closed', label: 'Fermés' }
  ];

  const priorities = [
    { value: 'all', label: 'Toutes priorités' },
    { value: 'low', label: 'Basse' },
    { value: 'medium', label: 'Moyenne' },
    { value: 'high', label: 'Haute' },
    { value: 'critical', label: 'Critique' }
  ];

  const filteredTickets = tickets.filter(ticket => {
    // Filter by status
    if (statusFilter !== 'all' && ticket.metadata?.status !== statusFilter) {
      return false;
    }
    
    // Filter by priority
    if (priorityFilter !== 'all' && ticket.metadata?.priority !== priorityFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = ticket.title.toLowerCase().includes(query);
      const matchesSummary = ticket.summary?.toLowerCase().includes(query) || false;
      const matchesContent = ticket.content?.toLowerCase().includes(query) || false;
      const matchesRequester = (ticket.metadata?.requester as string || '').toLowerCase().includes(query);
      const matchesTags = ticket.tags?.some(tag => tag.toLowerCase().includes(query)) || false;
      
      if (!matchesTitle && !matchesSummary && !matchesContent && !matchesRequester && !matchesTags) {
        return false;
      }
    }
    
    return true;
  });

  const clearFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setSearchQuery('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (statusFilter !== 'all') count++;
    if (priorityFilter !== 'all') count++;
    if (searchQuery) count++;
    return count;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des tickets...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg">
        <p>Une erreur est survenue lors du chargement des tickets.</p>
        <p className="text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <LifeBuoy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-medium">Aucun ticket disponible</h3>
        <p className="text-muted-foreground mt-2">Créez votre premier ticket de support</p>
        <Button 
          onClick={onAddTicket}
          className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white hover:opacity-90 mt-4"
        >
          <Plus className="mr-2 h-4 w-4" /> Créer un ticket
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Tickets</h2>
            <Badge count={tickets.length} />
          </div>
          
          <Button 
            onClick={onAddTicket}
            className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white hover:opacity-90 w-full md:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Nouveau ticket
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par titre, contenu, demandeur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Priorité" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {getActiveFiltersCount() > 0 && (
            <Button variant="outline" onClick={clearFilters} className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Effacer les filtres ({getActiveFiltersCount()})
            </Button>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-muted-foreground">Aucun ticket ne correspond à vos critères de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <TicketCard 
                key={ticket.id} 
                ticket={ticket}
                onView={onViewTicket}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// Badge component for ticket count
function Badge({ count }: { count: number }) {
  return (
    <div className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
      {count}
    </div>
  );
}
