'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { useData } from '@/hooks/useData';
import { Data } from '@/types/data';
import { ViewFormationDialog } from './ViewFormationDialog';
import { EditFormationDialog } from './EditFormationDialog';
import { AddFormationDialog } from './AddFormationDialog';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function FormationTable() {
  const { data: formations, loading, fetchData, updateData, createData, deleteData } = useData('formation');
  const [selectedFormation, setSelectedFormation] = useState<Data | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchFormations = useCallback(async () => {
    try {
      await fetchData();
    } catch (error) {
      console.error('Error fetching formations:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les formations.',
        variant: 'destructive',
      });
    }
  }, [fetchData, toast]);

  useEffect(() => {
    fetchFormations();
  }, [fetchFormations]);

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'Beginner': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Intermediate': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Advanced': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Expert': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return colors[level] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Development': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'DevOps': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Security': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'Cloud': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      'Design': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'Management': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'published': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'draft': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'archived': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'published': 'Disponible',
      'draft': 'Bientôt',
      'archived': 'Archivé',
    };
    return texts[status] || status;
  };

  const handleSave = async (formationData: Partial<Data>) => {
    try {
      if (selectedFormation?.id) {
        // Update existing formation
        await updateData(selectedFormation.id, {
          ...formationData,
          data_type: 'formation'
        });
        toast({
          title: 'Formation mise à jour',
          description: 'La formation a été modifiée avec succès.',
        });
      } else {
        // Add new formation
        await createData({
          ...formationData,
          data_type: 'formation',
          title: formationData.title || 'Nouvelle formation',
        } as Data);
        toast({
          title: 'Formation créée',
          description: 'La nouvelle formation a été ajoutée avec succès.',
        });
      }
      setEditDialogOpen(false);
      setAddDialogOpen(false);
      setSelectedFormation(null);
      fetchFormations();
    } catch (error) {
      console.error('Error saving formation:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la formation.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (selectedFormation?.id) {
      try {
        await deleteData(selectedFormation.id);
        toast({
          title: 'Formation supprimée',
          description: 'La formation a été supprimée avec succès.',
          variant: 'destructive',
        });
        setDeleteDialogOpen(false);
        setViewDialogOpen(false);
        setEditDialogOpen(false);
        setSelectedFormation(null);
        fetchFormations();
      } catch (error) {
        console.error('Error deleting formation:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de supprimer la formation.',
          variant: 'destructive',
        });
      }
    }
  };

  const confirmDelete = () => {
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Formations</h2>
        <Button
          onClick={() => {
            setSelectedFormation(null);
            setAddDialogOpen(true);
          }}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter une formation
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>Liste des formations disponibles</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Titre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Niveau</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">Chargement...</TableCell>
              </TableRow>
            ) : formations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">Aucune formation trouvée</TableCell>
              </TableRow>
            ) : (
              formations.map((formation) => {
                const metadata = formation.metadata as Record<string, unknown> || {};
                return (
                  <TableRow key={formation.id}>
                    <TableCell className="font-medium">{formation.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getCategoryColor(String(metadata.category || ''))}>
                        {String(metadata.category || 'Non défini')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getLevelColor(String(metadata.level || ''))}>
                        {String(metadata.level || 'Non défini')}
                      </Badge>
                    </TableCell>
                    <TableCell>{metadata.price ? `${String(metadata.price)} €` : 'Non défini'}</TableCell>
                    <TableCell>{String(metadata.duration || 'Non défini')}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(formation.status)}>
                        {getStatusText(formation.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedFormation(formation);
                            setViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedFormation(formation);
                            setEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                          onClick={() => {
                            setSelectedFormation(formation);
                            confirmDelete();
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {selectedFormation && (
        <ViewFormationDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          formation={selectedFormation}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          getLevelColor={getLevelColor}
          getCategoryColor={getCategoryColor}
        />
      )}

      <EditFormationDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        formation={selectedFormation || undefined}
        onSave={handleSave}
        onDelete={() => Promise.resolve(confirmDelete())}
      />

      <AddFormationDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette formation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La formation sera définitivement supprimée de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}