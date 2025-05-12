'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil, Plus } from 'lucide-react';
import { Prestation } from '@/types/prestation';
import { ViewPrestationDialog } from './ViewPrestationDialog';
import { EditPrestationDialog } from './EditPrestationDialog';
import { useToast } from '@/components/ui/use-toast';

const mockPrestations: Prestation[] = [
  {
    id: '1',
    title: 'Consultation Stratégique',
    description: 'Analyse approfondie et recommandations pour votre stratégie digitale',
    price: 1500,
    duration: '2 jours',
    category: 'Consulting',
    status: 'Available',
    features: [
      'Audit de l\'existant',
      'Analyse concurrentielle',
      'Recommandations stratégiques',
      'Plan d\'action détaillé',
      'Suivi post-consultation'
    ]
  },
  {
    id: '2',
    title: 'Développement Site Web',
    description: 'Création de site web professionnel sur mesure',
    price: 5000,
    duration: '4 semaines',
    category: 'Development',
    status: 'Limited',
    features: [
      'Design responsive',
      'Intégration CMS',
      'Optimisation SEO',
      'Formulaires de contact',
      'Analytics'
    ]
  },
  {
    id: '3',
    title: 'Formation DevOps',
    description: 'Formation complète aux pratiques et outils DevOps',
    price: 2500,
    duration: '5 jours',
    category: 'Training',
    status: 'Coming Soon',
    features: [
      'CI/CD',
      'Docker',
      'Kubernetes',
      'Monitoring',
      'Sécurité'
    ]
  }
];

export function PrestationTable() {
  const [prestations, setPrestations] = useState<Prestation[]>(mockPrestations);
  const [selectedPrestation, setSelectedPrestation] = useState<Prestation | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const getCategoryColor = (category: Prestation['category']) => {
    const colors: { [key: string]: string } = {
      'Consulting': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'Development': 'text-purple-500 border-purple-500/20 bg-purple-500/10',
      'Support': 'text-green-500 border-green-500/20 bg-green-500/10',
      'Training': 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10'
    };
    return colors[category];
  };

  const getStatusColor = (status: Prestation['status']) => {
    const colors: { [key: string]: string } = {
      'Available': 'text-green-500 border-green-500/20 bg-green-500/10',
      'Coming Soon': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'Limited': 'text-orange-500 border-orange-500/20 bg-orange-500/10',
      'Archived': 'text-gray-500 border-gray-500/20 bg-gray-500/10'
    };
    return colors[status];
  };

  const getStatusText = (status: Prestation['status']) => {
    const texts: { [key: string]: string } = {
      'Available': 'Disponible',
      'Coming Soon': 'Bientôt',
      'Limited': 'Limité',
      'Archived': 'Archivé'
    };
    return texts[status];
  };

  const handleSave = (prestationData: Partial<Prestation>) => {
    if (selectedPrestation) {
      // Update existing prestation
      setPrestations(prev =>
        prev.map(p => (p.id === selectedPrestation.id ? { ...p, ...prestationData } : p))
      );
      toast({
        title: 'Prestation mise à jour',
        description: 'La prestation a été modifiée avec succès.',
      });
    } else {
      // Add new prestation
      const newPrestation = {
        ...prestationData,
        id: Math.random().toString(36).substr(2, 9),
      } as Prestation;
      setPrestations(prev => [...prev, newPrestation]);
      toast({
        title: 'Prestation créée',
        description: 'La nouvelle prestation a été ajoutée avec succès.',
      });
    }
    setEditDialogOpen(false);
    setSelectedPrestation(null);
  };

  const handleDelete = () => {
    if (selectedPrestation) {
      setPrestations(prev => prev.filter(p => p.id !== selectedPrestation.id));
      toast({
        title: 'Prestation supprimée',
        description: 'La prestation a été supprimée avec succès.',
        variant: 'destructive',
      });
      setEditDialogOpen(false);
      setSelectedPrestation(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Prestations</h2>
          <p className="text-sm text-muted-foreground">
            Gérez vos prestations de services
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedPrestation(null);
            setEditDialogOpen(true);
          }}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter une prestation
        </Button>
      </div>

      <div className="rounded-md border bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prestations.map((prestation) => (
              <TableRow key={prestation.id} className="hover:bg-white/5">
                <TableCell className="font-medium">{prestation.title}</TableCell>
                <TableCell className="max-w-md">
                  <p className="line-clamp-2">{prestation.description}</p>
                </TableCell>
                <TableCell>{prestation.price.toLocaleString('fr-FR')} €</TableCell>
                <TableCell>{prestation.duration}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getCategoryColor(prestation.category)}>
                    {prestation.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(prestation.status)}>
                    {getStatusText(prestation.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedPrestation(prestation);
                      setViewDialogOpen(true);
                    }}
                    className="hover:bg-white/20 dark:hover:bg-gray-800/50"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedPrestation(prestation);
                      setEditDialogOpen(true);
                    }}
                    className="hover:bg-white/20 dark:hover:bg-gray-800/50"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedPrestation && (
        <ViewPrestationDialog
          prestation={selectedPrestation}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          getCategoryColor={getCategoryColor}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
      )}

      <EditPrestationDialog
        prestation={selectedPrestation}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSave}
        onDelete={selectedPrestation ? handleDelete : undefined}
      />
    </div>
  );
}
