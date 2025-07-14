'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil, Mail, Phone } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WaitlistContact } from '@/types/contact';
import { ViewWaitlistDialog } from './ViewWaitlistDialog';
import { EditWaitlistDialog } from './EditWaitlistDialog';
import { useToast } from '@/components/ui/use-toast';

// Helper function to prepare contact data for Supabase
const prepareContactData = (contact: Partial<WaitlistContact>) => {
  return {
    first_name: contact.first_name || '',
    last_name: contact.last_name || '',
    email: contact.email || '',
    phone: contact.phone || '',
    type: 'waitlist',
    status: contact.status || 'Pending',
    service: contact.service || '',
    metadata: {
      ...(contact.metadata || {}),
      notes: (contact.metadata?.notes as string) || ''
    },
    joined_at: contact.joined_at || new Date().toISOString()
  };
};

export function WaitlistList() {
  const [entries, setEntries] = useState<WaitlistContact[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<WaitlistContact | undefined>(undefined);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const supabase = createClient();
  
  const fetchWaitlistEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('type', 'waitlist');
      
      if (error) {
        throw error;
      }
      
      // Use the data directly as WaitlistContact objects
      setEntries(data as WaitlistContact[]);
    } catch (err) {
      console.error('Error fetching waitlist entries:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger la liste d\'attente',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, toast]);
  
  // Fetch waitlist entries from Supabase on component mount
  useEffect(() => {
    fetchWaitlistEntries();
  }, [fetchWaitlistEntries]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Pending': 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10',
      'Contacted': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'Scheduled': 'text-green-500 border-green-500/20 bg-green-500/10',
      'Cancelled': 'text-red-500 border-red-500/20 bg-red-500/10'
    };
    return colors[status] || colors['Pending'];
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      'Pending': 'En attente',
      'Contacted': 'Contacté',
      'Scheduled': 'Planifié',
      'Cancelled': 'Annulé'
    };
    return texts[status] || texts['Pending'];
  };

  const handleSave = async (entryData: Partial<WaitlistContact>) => {
    try {
      const contactData = prepareContactData(entryData);
      
      if (selectedEntry) {
        // Update existing entry
        const { error } = await supabase
          .from('contacts')
          .update(contactData)
          .eq('id', selectedEntry.id);
        
        if (error) {
          throw error;
        }
        
        // Update local state
        setEntries(prev =>
          prev.map(e => (e.id === selectedEntry.id ? { ...e, ...entryData } : e))
        );
        
        toast({
          title: 'Contact mis à jour',
          description: 'Le contact a été modifié avec succès.',
        });
      } else {
        // Add new entry
        const { data, error } = await supabase
          .from('contacts')
          .insert([contactData])
          .select();
        
        if (error) {
          throw error;
        }
        
        if (data && data[0]) {
          // Use the data directly instead of mapContactToWaitlistEntry
          const newEntry = data[0];
          setEntries(prev => [...prev, newEntry]);
          
          toast({
            title: 'Contact ajouté',
            description: 'Le nouveau contact a été ajouté avec succès.',
          });
        }
      }
      
      setEditDialogOpen(false);
      setSelectedEntry(undefined);
    } catch (err) {
      console.error('Error saving waitlist entry:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder le contact',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async () => {
    if (selectedEntry) {
      try {
        const { error } = await supabase
          .from('contacts')
          .delete()
          .eq('id', selectedEntry.id);
        
        if (error) {
          throw error;
        }
        
        // Update local state
        setEntries(prev => prev.filter(e => e.id !== selectedEntry.id));
        
        toast({
          title: 'Contact supprimé',
          description: 'Le contact a été supprimé avec succès.',
        });
        
        setViewDialogOpen(false);
        setSelectedEntry(undefined);
      } catch (err) {
        console.error('Error deleting waitlist entry:', err);
        toast({
          title: 'Erreur',
          description: 'Impossible de supprimer le contact',
          variant: 'destructive'
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Liste d&apos;attente</h2>
        </div>
        <Button onClick={() => {
          setSelectedEntry(undefined);
          setEditDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un contact
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          <span className="ml-3">Chargement...</span>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>Aucun contact dans la liste d&apos;attente</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSelectedEntry(undefined);
              setEditDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Ajouter un contact
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <Card key={entry.id} className="bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl hover:bg-white/20 dark:hover:bg-gray-900/60 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{`${entry.first_name} ${entry.last_name}`}</CardTitle>
                  <Badge variant="outline" className={getStatusColor(entry.status)}>
                    {getStatusText(entry.status)}
                  </Badge>
              </div>
              <CardDescription className="line-clamp-2">{entry.service}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${entry.email}`} className="text-blue-500 hover:underline">
                    {entry.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${entry.phone}`} className="text-blue-500 hover:underline">
                    {entry.phone}
                  </a>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Date d&apos;inscription</span>
                  <p className="text-sm font-medium">
                    {entry.joined_at ? new Date(entry.joined_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }) : 'Non spécifiée'}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Notes</span>
                  <p className="text-sm line-clamp-2">{String(entry.metadata?.notes || '')}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedEntry(entry);
                  setViewDialogOpen(true);
                }}
                className="hover:bg-white/20 dark:hover:bg-gray-800/50"
              >
                <Eye className="h-4 w-4 mr-2" />
                Voir
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedEntry(entry);
                  setEditDialogOpen(true);
                }}
                className="hover:bg-white/20 dark:hover:bg-gray-800/50"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      )}

      {selectedEntry && (
        <ViewWaitlistDialog
          entry={selectedEntry}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
      )}

      <EditWaitlistDialog
        entry={selectedEntry}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSave}
        onDelete={selectedEntry ? handleDelete : undefined}
      />
    </div>
  );
}
