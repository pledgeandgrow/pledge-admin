'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Eye,
  Pencil,
  FileText,
  Clock,
  User,
  Search,
  GraduationCap,
  TrendingUp,
  Layers3,
} from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingFormation, setViewingFormation] = useState<Data | null>(null);
  const [editingFormation, setEditingFormation] = useState<Data | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

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

  const handleViewFormation = (formation: Data) => {
    setViewingFormation(formation);
    setIsViewDialogOpen(true);
  };

  const handleEditFormation = (formation: Data) => {
    setEditingFormation(formation);
    setIsEditDialogOpen(true);
  };

  const handleAddFormation = () => {
    setEditingFormation(null);
    setIsEditDialogOpen(true);
  };

  const handleSave = async (formationData: Partial<Data>) => {
    try {
      if (editingFormation?.id) {
        await updateData(editingFormation.id, {
          ...formationData,
          data_type: 'formation',
        });
        toast({
          title: 'Formation mise à jour',
          description: 'La formation a été modifiée avec succès.',
        });
      } else {
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
      setIsEditDialogOpen(false);
      setEditingFormation(null);
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
    if (viewingFormation?.id) {
      try {
        await deleteData(viewingFormation.id);
        toast({
          title: 'Formation supprimée',
          description: 'La formation a été supprimée avec succès.',
          variant: 'destructive',
        });
        setIsViewDialogOpen(false);
        setViewingFormation(null);
        if (isEditDialogOpen) {
          setIsEditDialogOpen(false);
          setEditingFormation(null);
        }
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

  const filteredFormations = useMemo(() => {
    if (!searchQuery.trim()) {return formations;}
    const query = searchQuery.trim().toLowerCase();
    return formations.filter((formation) => {
      const metadata = formation.metadata as FormationMetadata | undefined;
      const level = metadata?.level?.toLowerCase?.() || '';
      const category = metadata?.category?.toLowerCase?.() || '';
      const instructor = metadata?.instructor?.toLowerCase?.() || '';
      return (
        formation.title?.toLowerCase().includes(query) ||
        formation.content?.toLowerCase().includes(query) ||
        level.includes(query) ||
        category.includes(query) ||
        instructor.includes(query)
      );
    });
  }, [formations, searchQuery]);

  const statistics = useMemo(() => {
    const statusCounts: Record<DataStatus, number> = {
      draft: 0,
      published: 0,
      archived: 0,
    };
    let totalPrice = 0;
    let pricedItems = 0;
    let upcomingSessions = 0;

    formations.forEach((formation) => {
      statusCounts[formation.status as DataStatus] = (statusCounts[formation.status as DataStatus] || 0) + 1;
      const metadata = formation.metadata as FormationMetadata | undefined;
      if (typeof metadata?.price === 'number') {
        totalPrice += metadata.price;
        pricedItems += 1;
      }
      if (metadata?.nextSession) {
        const date = new Date(metadata.nextSession);
        if (!Number.isNaN(date.getTime()) && date >= new Date()) {
          upcomingSessions += 1;
        }
      }
    });

    return {
      total: formations.length,
      published: statusCounts.published,
      draft: statusCounts.draft,
      archived: statusCounts.archived,
      averagePrice: pricedItems ? Math.round((totalPrice / pricedItems) * 100) / 100 : 0,
      upcomingSessions,
    };
  }, [formations]);

  if (error && formations.length === 0) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="text-lg font-medium text-destructive">Impossible de charger les formations</p>
        <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        <Button className="mt-4" onClick={() => fetchData()}>
          Réessayer
        </Button>
      </div>
    );
  }

  if (loading && formations.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200/60 dark:border-blue-800/60">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardDescription className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-300">
                Total formations
              </CardDescription>
              <CardTitle className="text-3xl text-blue-900 dark:text-blue-100">
                {statistics.total}
              </CardTitle>
            </div>
            <GraduationCap className="h-6 w-6 text-blue-500" />
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200/60 dark:border-emerald-800/60">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardDescription className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
                Formations publiées
              </CardDescription>
              <CardTitle className="text-3xl text-emerald-900 dark:text-emerald-100">
                {statistics.published}
              </CardTitle>
            </div>
            <Layers3 className="h-6 w-6 text-emerald-500" />
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/60 dark:border-amber-800/60">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardDescription className="text-xs uppercase tracking-wide text-amber-600 dark:text-amber-300">
                Sessions à venir
              </CardDescription>
              <CardTitle className="text-3xl text-amber-900 dark:text-amber-100">
                {statistics.upcomingSessions}
              </CardTitle>
            </div>
            <Clock className="h-6 w-6 text-amber-500" />
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-900/40 border-slate-200/60 dark:border-slate-800/60">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardDescription className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">
                Prix moyen
              </CardDescription>
              <CardTitle className="text-3xl text-slate-900 dark:text-slate-100">
                {statistics.averagePrice ? `${statistics.averagePrice.toLocaleString('fr-FR')} €` : '—'}
              </CardTitle>
            </div>
            <TrendingUp className="h-6 w-6 text-slate-500" />
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher une formation (nom, catégorie, formateur)"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="pl-9 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={handleAddFormation}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une formation
          </Button>
        </div>
      </div>

      {filteredFormations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-muted-foreground/30 p-12 text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {searchQuery ? 'Aucune formation ne correspond à votre recherche' : 'Aucune formation disponible'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Ajoutez votre première formation pour proposer vos programmes aux clients.
          </p>
          <Button className="mt-6" onClick={handleAddFormation}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une formation
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFormations.map((formation) => {
            const metadata = formation.metadata as FormationMetadata | undefined;
            const level = metadata?.level || 'Beginner';
            const category = metadata?.category || 'Development';
            const price = typeof metadata?.price === 'number' ? metadata.price : 0;
            const duration = metadata?.duration || 'Non spécifié';
            const pdfUrl = metadata?.pdfUrl;
            const instructor = metadata?.instructor || 'Non spécifié';
            const nextSession = metadata?.nextSession ? new Date(metadata.nextSession) : null;

            return (
              <Card key={formation.id} className="bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl hover:bg-white/20 dark:hover:bg-gray-900/60 transition-colors border border-gray-100/40 dark:border-gray-800/40">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{formation.title}</CardTitle>
                    <Badge variant="outline" className={getStatusColor(formation.status as DataStatus)}>
                      {getStatusText(formation.status as DataStatus)}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2 text-gray-600 dark:text-gray-400">
                    {formation.content || formation.summary || ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Prix</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{price.toLocaleString('fr-FR')} €</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Durée</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Niveau</span>
                      <Badge variant="outline" className={getLevelColor(level)}>
                        {level}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Catégorie</span>
                      <Badge variant="outline" className={getCategoryColor(category)}>
                        {category}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-4 w-4 mr-2" />
                        <span>{instructor}</span>
                      </div>
                      {nextSession && !Number.isNaN(nextSession.getTime()) && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Prochaine session: {nextSession.toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewFormation(formation)}
                    className="hover:bg-white/20 dark:hover:bg-gray-800/50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-white/20 dark:hover:bg-gray-800/50"
                    onClick={() => pdfUrl && window.open(pdfUrl, '_blank')}
                    disabled={!pdfUrl}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditFormation(formation)}
                    className="hover:bg-white/20 dark:hover:bg-gray-800/50"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {viewingFormation && (
        <ViewFormationDialog
          open={isViewDialogOpen}
          onOpenChange={(open) => {
            setIsViewDialogOpen(open);
            if (!open) {
              setViewingFormation(null);
            }
          }}
          formation={viewingFormation}
          getLevelColor={getLevelColor}
          getCategoryColor={getCategoryColor}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
      )}

      <EditFormationDialog
        formation={editingFormation || undefined}
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setEditingFormation(null);
          }
        }}
        onSave={handleSave}
        onDelete={editingFormation ? handleDelete : undefined}
      />
    </div>
  );
}
