'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil, FileText, Clock, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Data, DataStatus } from '@/types/data';
import { useData } from '@/hooks/useData';
import { ViewFormationDialog } from './ViewFormationDialog';
import { EditFormationDialog } from './EditFormationDialog';
import { useToast } from '@/components/ui/use-toast';

// Define FormationMetadata interface for type safety
interface FormationMetadata extends Record<string, unknown> {
  category: string;
  level: string;
  duration: string;
  price: number;
  instructor: string;
  nextSession: string;
  pdfUrl: string;
  prerequisites: string[];
  objectives: string[];
}

export function FormationList() {
  const { data: formations, loading, error, fetchData, updateData, createData, deleteData } = useData('formation');
  const [selectedFormation, setSelectedFormation] = useState<Data | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load formations from Supabase
  useEffect(() => {
    const loadFormations = async () => {
      try {
        await fetchData();
      } catch (err) {
        console.error('Error loading formations:', err);
      }
    };
    
    loadFormations();
  }, [fetchData]);

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'Beginner': 'text-green-500 border-green-500/20 bg-green-500/10',
      'Intermediate': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'Advanced': 'text-purple-500 border-purple-500/20 bg-purple-500/10',
      'Expert': 'text-red-500 border-red-500/20 bg-red-500/10'
    };
    return colors[level] || colors['Beginner'];
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Development': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'DevOps': 'text-purple-500 border-purple-500/20 bg-purple-500/10',
      'Security': 'text-red-500 border-red-500/20 bg-red-500/10',
      'Cloud': 'text-cyan-500 border-cyan-500/20 bg-cyan-500/10',
      'Design': 'text-pink-500 border-pink-500/20 bg-pink-500/10',
      'Management': 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10'
    };
    return colors[category] || colors['Development'];
  };

  const getStatusColor = (status: DataStatus) => {
    const colors: { [key: string]: string } = {
      'draft': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'published': 'text-green-500 border-green-500/20 bg-green-500/10',
      'archived': 'text-gray-500 border-gray-500/20 bg-gray-500/10'
    };
    return colors[status] || 'text-gray-500 border-gray-500/20 bg-gray-500/10';
  };

  const getStatusText = (status: DataStatus) => {
    const texts: { [key: string]: string } = {
      'draft': 'Brouillon',
      'published': 'Publié',
      'archived': 'Archivé'
    };
    return texts[status] || 'Inconnu';
  };

  const handleSave = async (formationData: Partial<Data>) => {
    try {
      if (selectedFormation?.id) {
        // Update existing formation
        await updateData(selectedFormation.id, formationData);
        toast({
          title: 'Formation mise à jour',
          description: 'La formation a été modifiée avec succès.',
        });
      } else {
        // Add new formation
        await createData({
          ...formationData,
          data_type: 'formation',
        } as Data);
        toast({
          title: 'Formation créée',
          description: 'La nouvelle formation a été ajoutée avec succès.',
        });
      }
      setEditDialogOpen(false);
      setSelectedFormation(null);
    } catch (error) {
      console.error('Error saving formation:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'enregistrement de la formation.',
        variant: 'destructive'
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
        setEditDialogOpen(false);
        setSelectedFormation(null);
      } catch (error) {
        console.error('Error deleting formation:', error);
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la suppression de la formation.',
          variant: 'destructive'
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
          {error.message || 'An error occurred'}
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">Formations</h2>
              <p className="text-sm text-muted-foreground">
                Découvrez nos formations professionnelles
              </p>
            </div>
            <Button
              onClick={() => {
                setSelectedFormation(null);
                setEditDialogOpen(true);
              }}
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
            >
              <Plus className="mr-2 h-4 w-4" /> Ajouter une formation
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formations.length === 0 ? (
              <div className="col-span-3 text-center py-10">
                <p className="text-muted-foreground">Aucune formation trouvée</p>
              </div>
            ) : (
              formations.map((formation) => (
          <Card key={formation.id} className="bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl hover:bg-white/20 dark:hover:bg-gray-900/60 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{formation.title}</CardTitle>
                <Badge variant="outline" className={getStatusColor(formation.status as DataStatus)}>
                  {getStatusText(formation.status as DataStatus)}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">{formation.content || formation.summary || ''}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Prix</span>
                  <span className="font-semibold">{((formation.metadata as FormationMetadata)?.price || 0).toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Durée</span>
                  <span className="font-semibold">{(formation.metadata as FormationMetadata)?.duration || 'Non spécifié'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Niveau</span>
                  <Badge variant="outline" className={getLevelColor((formation.metadata as FormationMetadata)?.level || 'Beginner')}>
                    {(formation.metadata as FormationMetadata)?.level || 'Beginner'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Catégorie</span>
                  <Badge variant="outline" className={getCategoryColor((formation.metadata as FormationMetadata)?.category || 'Development')}>
                    {(formation.metadata as FormationMetadata)?.category || 'Development'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-2" />
                    <span>{(formation.metadata as FormationMetadata)?.instructor || 'Non spécifié'}</span>
                  </div>
                  {(formation.metadata as FormationMetadata)?.nextSession && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Prochaine session: {new Date((formation.metadata as FormationMetadata)?.nextSession || '').toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFormation(formation);
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
                className="hover:bg-white/20 dark:hover:bg-gray-800/50"
                onClick={() => window.open((formation.metadata as FormationMetadata)?.pdfUrl, '_blank')}
                disabled={!(formation.metadata as FormationMetadata)?.pdfUrl}
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFormation(formation);
                  setEditDialogOpen(true);
                }}
                className="hover:bg-white/20 dark:hover:bg-gray-800/50"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </CardFooter>
          </Card>
              ))
            )}
          </div>
        </>
      )}
      {selectedFormation && (
        <ViewFormationDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          formation={selectedFormation}
          getLevelColor={getLevelColor}
          getCategoryColor={getCategoryColor}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
      )}

      <EditFormationDialog
        formation={selectedFormation || undefined}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSave}
        onDelete={selectedFormation ? handleDelete : undefined}
      />
    </div>
  );
}
