'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil, Mail, Phone } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WaitlistEntry } from '@/types/waitlist';
import { ViewWaitlistDialog } from './ViewWaitlistDialog';
import { EditWaitlistDialog } from './EditWaitlistDialog';
import { useToast } from '@/components/ui/use-toast';

const mockWaitlist: WaitlistEntry[] = [
  {
    id: '1',
    name: 'Sophie Martin',
    email: 'sophie.martin@email.com',
    phone: '+33 6 12 34 56 78',
    service: 'Consultation Stratégique',
    status: 'Pending',
    date: '2025-03-15',
    notes: 'Intéressée par une consultation pour sa startup fintech'
  },
  {
    id: '2',
    name: 'Pierre Dubois',
    email: 'pierre.dubois@email.com',
    phone: '+33 6 23 45 67 89',
    service: 'Développement Web',
    status: 'Contacted',
    date: '2025-03-20',
    notes: 'Besoin d\'un site e-commerce pour son entreprise'
  },
  {
    id: '3',
    name: 'Marie Lambert',
    email: 'marie.lambert@email.com',
    phone: '+33 6 34 56 78 90',
    service: 'Formation Cloud',
    status: 'Scheduled',
    date: '2025-04-01',
    notes: 'Formation AWS pour son équipe de 5 personnes'
  }
];

export function WaitlistList() {
  const [entries, setEntries] = useState<WaitlistEntry[]>(mockWaitlist);
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: WaitlistEntry['status']) => {
    const colors: { [key: string]: string } = {
      'Pending': 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10',
      'Contacted': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'Scheduled': 'text-green-500 border-green-500/20 bg-green-500/10',
      'Cancelled': 'text-red-500 border-red-500/20 bg-red-500/10'
    };
    return colors[status];
  };

  const getStatusText = (status: WaitlistEntry['status']) => {
    const texts: { [key: string]: string } = {
      'Pending': 'En attente',
      'Contacted': 'Contacté',
      'Scheduled': 'Planifié',
      'Cancelled': 'Annulé'
    };
    return texts[status];
  };

  const handleSave = (entryData: Partial<WaitlistEntry>) => {
    if (selectedEntry) {
      // Update existing entry
      setEntries(prev =>
        prev.map(e => (e.id === selectedEntry.id ? { ...e, ...entryData } : e))
      );
      toast({
        title: 'Contact mis à jour',
        description: 'Le contact a été modifié avec succès.',
      });
    } else {
      // Add new entry
      const newEntry = {
        ...entryData,
        id: Math.random().toString(36).substr(2, 9),
      } as WaitlistEntry;
      setEntries(prev => [...prev, newEntry]);
      toast({
        title: 'Contact ajouté',
        description: 'Le nouveau contact a été ajouté avec succès.',
      });
    }
    setEditDialogOpen(false);
    setSelectedEntry(null);
  };

  const handleDelete = () => {
    if (selectedEntry) {
      setEntries(prev => prev.filter(e => e.id !== selectedEntry.id));
      toast({
        title: 'Contact supprimé',
        description: 'Le contact a été supprimé avec succès.',
        variant: 'destructive',
      });
      setEditDialogOpen(false);
      setSelectedEntry(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Liste d'attente</h2>
          <p className="text-sm text-muted-foreground">
            Gérez vos contacts en attente
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedEntry(null);
            setEditDialogOpen(true);
          }}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter un contact
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries.map((entry) => (
          <Card key={entry.id} className="bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl hover:bg-white/20 dark:hover:bg-gray-900/60 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{entry.name}</CardTitle>
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
                  <span className="text-sm text-muted-foreground">Date souhaitée</span>
                  <p className="text-sm font-medium">
                    {new Date(entry.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Notes</span>
                  <p className="text-sm line-clamp-2">{entry.notes}</p>
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
