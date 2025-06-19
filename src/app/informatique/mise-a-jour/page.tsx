'use client';

import { useEffect, useState, useCallback } from "react";
import { Update, UpdateStatistics as UpdateStatisticsType } from '@/components/informatique/mise-a-jour/types';
import { UpdateForm } from '@/components/informatique/mise-a-jour/UpdateForm';
import { UpdateCard } from '@/components/informatique/mise-a-jour/UpdateCard';
import { UpdateStatistics } from '@/components/informatique/mise-a-jour/UpdateStatistics';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PlusCircle, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UpdatesPage() {
  // Using filteredUpdates instead of updates directly
  const [, setUpdates] = useState<Update[]>([]);
  const [filteredUpdates, setFilteredUpdates] = useState<Update[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statistics, setStatistics] = useState<UpdateStatisticsType>({
    total: 0,
    by_type: {
      feature: 0,
      bugfix: 0,
      security: 0,
      performance: 0,
      documentation: 0,
      other: 0,
    },
    by_status: {
      planned: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
    },
    by_priority: {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    },
  });
  const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUpdates = useCallback(async () => {
    setIsLoading(true);
    try {
      const searchParams = new URLSearchParams();
      if (typeFilter !== 'all') searchParams.append('type', typeFilter);
      if (statusFilter !== 'all') searchParams.append('status', statusFilter);
      if (priorityFilter !== 'all') searchParams.append('priority', priorityFilter);
      if (searchQuery) searchParams.append('search', searchQuery);

      const response = await fetch(`/api/mise-a-jour?${searchParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch updates');
      const data = await response.json();
      setUpdates(data);
      setFilteredUpdates(data);
    } catch (error) {
      console.error('Error fetching updates:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les mises à jour',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, typeFilter, statusFilter, priorityFilter, toast]);

  const fetchStatistics = useCallback(async () => {
    try {
      const response = await fetch('/api/mise-a-jour/statistics');
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  }, []);

  useEffect(() => {
    fetchUpdates();
    fetchStatistics();
  }, [fetchUpdates, fetchStatistics]);

  const handleCreate = async (update: Partial<Update>) => {
    try {
      const response = await fetch('/api/mise-a-jour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
      });

      if (!response.ok) throw new Error('Failed to create update');
      
      await fetchUpdates();
      await fetchStatistics();
      setIsCreating(false);
      
      toast({
        title: 'Succès',
        description: 'Mise à jour créée avec succès',
      });
    } catch (error) {
      console.error('Error creating update:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la mise à jour',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async (id: string, update: Partial<Update>) => {
    try {
      const response = await fetch(`/api/mise-a-jour/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
      });

      if (!response.ok) throw new Error('Failed to update update');
      
      await fetchUpdates();
      await fetchStatistics();
      setIsEditing(false);
      setSelectedUpdate(null);
      
      toast({
        title: 'Succès',
        description: 'Mise à jour modifiée avec succès',
      });
    } catch (error) {
      console.error('Error updating update:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier la mise à jour',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette mise à jour ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/mise-a-jour/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete update');
      
      await fetchUpdates();
      await fetchStatistics();
      setSelectedUpdate(null);
      
      toast({
        title: 'Succès',
        description: 'Mise à jour supprimée avec succès',
      });
    } catch (error) {
      console.error('Error deleting update:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la mise à jour',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <MegaMenu />
      <main className="flex-1 ml-64 min-h-screen overflow-auto">
        <div className="max-w-7xl mx-auto py-4">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Mises à jour
                </h1>
                <p className="text-muted-foreground">
                  Gérez les mises à jour et suivez leur progression
                </p>
              </div>
              <Button onClick={() => setIsCreating(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nouvelle mise à jour
              </Button>
            </div>

            {/* Statistics */}
            <div className="rounded-lg border bg-card">
              <UpdateStatistics statistics={statistics} />
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une mise à jour..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="feature">Fonctionnalité</SelectItem>
                  <SelectItem value="bugfix">Correction</SelectItem>
                  <SelectItem value="security">Sécurité</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="planned">Planifié</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={priorityFilter}
                onValueChange={setPriorityFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les priorités</SelectItem>
                  <SelectItem value="low">Basse</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="critical">Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Chargement...</div>
              </div>
            ) : filteredUpdates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUpdates.map((update) => (
                  <UpdateCard
                    key={update.id}
                    update={update}
                    onClick={() => setSelectedUpdate(update)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Aucune mise à jour trouvée</h3>
                <p className="text-muted-foreground">
                  {searchQuery || typeFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? "Aucun résultat ne correspond à vos critères de recherche"
                    : "Commencez par créer votre première mise à jour"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <UpdateForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreating(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View/Edit Dialog */}
      <Dialog 
        open={!!selectedUpdate} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUpdate(null);
            setIsEditing(false);
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedUpdate && (
            isEditing ? (
              <UpdateForm
                update={selectedUpdate}
                onSubmit={(data) => handleUpdate(selectedUpdate.id, data)}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedUpdate.title}</h2>
                    <p className="text-sm text-muted-foreground">Version {selectedUpdate.version}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      Modifier
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(selectedUpdate.id)}>
                      Supprimer
                    </Button>
                  </div>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <h3>Description</h3>
                  <p>{selectedUpdate.description}</p>
                  
                  <h3>Journal des modifications</h3>
                  <p>{selectedUpdate.changelog}</p>

                  {selectedUpdate.affected_components.length > 0 && (
                    <>
                      <h3>Composants affectés</h3>
                      <ul>
                        {selectedUpdate.affected_components.map((component, index) => (
                          <li key={index}>{component}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {selectedUpdate.assigned_to && selectedUpdate.assigned_to.length > 0 && (
                    <>
                      <h3>Assigné à</h3>
                      <ul>
                        {selectedUpdate.assigned_to.map((person, index) => (
                          <li key={index}>{person}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
