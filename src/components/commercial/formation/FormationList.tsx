'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil, FileText, Clock, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Formation } from '@/types/formation';
import { ViewFormationDialog } from './ViewFormationDialog';
import { EditFormationDialog } from './EditFormationDialog';
import { useToast } from '@/components/ui/use-toast';

const mockFormations: Formation[] = [
  {
    id: '1',
    title: 'React.js Avancé',
    description: 'Maîtrisez les concepts avancés de React : Hooks, Context, Performance, Tests',
    category: 'Development',
    level: 'Advanced',
    duration: '3 jours',
    price: 1500,
    status: 'Available',
    pdfUrl: '/formations/react-advanced.pdf',
    instructor: 'Marie Dubois',
    nextSession: '2025-04-15',
    prerequisites: ['JavaScript ES6+', 'React basics', 'Node.js fundamentals'],
    objectives: [
      'Maîtriser les Hooks personnalisés',
      'Optimiser les performances',
      'Implémenter des tests avancés',
      'Gérer l\'état global avec Context'
    ]
  },
  {
    id: '2',
    title: 'DevOps & CI/CD',
    description: 'Formation complète sur les pratiques DevOps et l\'intégration continue',
    category: 'DevOps',
    level: 'Intermediate',
    duration: '4 jours',
    price: 2000,
    status: 'Coming Soon',
    pdfUrl: '/formations/devops-cicd.pdf',
    instructor: 'Thomas Martin',
    nextSession: '2025-05-01',
    prerequisites: ['Git', 'Linux basics', 'Docker fundamentals'],
    objectives: [
      'Mettre en place des pipelines CI/CD',
      'Automatiser les déploiements',
      'Gérer les conteneurs Docker',
      'Monitorer les applications'
    ]
  },
  {
    id: '3',
    title: 'Sécurité Web',
    description: 'Apprenez à sécuriser vos applications web contre les attaques courantes',
    category: 'Security',
    level: 'Expert',
    duration: '5 jours',
    price: 2500,
    status: 'Available',
    pdfUrl: '/formations/web-security.pdf',
    instructor: 'Sophie Bernard',
    nextSession: '2025-04-20',
    prerequisites: ['Web development', 'Network basics', 'HTTP protocol'],
    objectives: [
      'Identifier les vulnérabilités',
      'Implémenter l\'authentification sécurisée',
      'Protéger contre les injections SQL',
      'Sécuriser les API REST'
    ]
  }
];

export function FormationList() {
  const [formations, setFormations] = useState<Formation[]>(mockFormations);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const getLevelColor = (level: Formation['level']) => {
    const colors: { [key: string]: string } = {
      'Beginner': 'text-green-500 border-green-500/20 bg-green-500/10',
      'Intermediate': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'Advanced': 'text-purple-500 border-purple-500/20 bg-purple-500/10',
      'Expert': 'text-red-500 border-red-500/20 bg-red-500/10'
    };
    return colors[level];
  };

  const getCategoryColor = (category: Formation['category']) => {
    const colors: { [key: string]: string } = {
      'Development': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'DevOps': 'text-purple-500 border-purple-500/20 bg-purple-500/10',
      'Security': 'text-red-500 border-red-500/20 bg-red-500/10',
      'Cloud': 'text-cyan-500 border-cyan-500/20 bg-cyan-500/10',
      'Design': 'text-pink-500 border-pink-500/20 bg-pink-500/10',
      'Management': 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10'
    };
    return colors[category];
  };

  const getStatusColor = (status: Formation['status']) => {
    const colors: { [key: string]: string } = {
      'Available': 'text-green-500 border-green-500/20 bg-green-500/10',
      'Coming Soon': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'Full': 'text-orange-500 border-orange-500/20 bg-orange-500/10',
      'Archived': 'text-gray-500 border-gray-500/20 bg-gray-500/10'
    };
    return colors[status];
  };

  const getStatusText = (status: Formation['status']) => {
    const texts: { [key: string]: string } = {
      'Available': 'Disponible',
      'Coming Soon': 'Bientôt',
      'Full': 'Complet',
      'Archived': 'Archivé'
    };
    return texts[status];
  };

  const handleSave = (formationData: Partial<Formation>) => {
    if (selectedFormation) {
      // Update existing formation
      setFormations(prev =>
        prev.map(f => (f.id === selectedFormation.id ? { ...f, ...formationData } : f))
      );
      toast({
        title: 'Formation mise à jour',
        description: 'La formation a été modifiée avec succès.',
      });
    } else {
      // Add new formation
      const newFormation = {
        ...formationData,
        id: Math.random().toString(36).substr(2, 9),
      } as Formation;
      setFormations(prev => [...prev, newFormation]);
      toast({
        title: 'Formation créée',
        description: 'La nouvelle formation a été ajoutée avec succès.',
      });
    }
    setEditDialogOpen(false);
    setSelectedFormation(null);
  };

  const handleDelete = () => {
    if (selectedFormation) {
      setFormations(prev => prev.filter(f => f.id !== selectedFormation.id));
      toast({
        title: 'Formation supprimée',
        description: 'La formation a été supprimée avec succès.',
        variant: 'destructive',
      });
      setEditDialogOpen(false);
      setSelectedFormation(null);
    }
  };

  return (
    <div className="space-y-6">
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
        {formations.map((formation) => (
          <Card key={formation.id} className="bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl hover:bg-white/20 dark:hover:bg-gray-900/60 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{formation.title}</CardTitle>
                <Badge variant="outline" className={getStatusColor(formation.status)}>
                  {getStatusText(formation.status)}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">{formation.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Prix</span>
                  <span className="font-semibold">{formation.price.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Durée</span>
                  <span className="font-semibold">{formation.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Niveau</span>
                  <Badge variant="outline" className={getLevelColor(formation.level)}>
                    {formation.level}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Catégorie</span>
                  <Badge variant="outline" className={getCategoryColor(formation.category)}>
                    {formation.category}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-2" />
                    <span>{formation.instructor}</span>
                  </div>
                  {formation.nextSession && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Prochaine session: {new Date(formation.nextSession).toLocaleDateString('fr-FR')}</span>
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
                onClick={() => window.open(formation.pdfUrl, '_blank')}
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
        ))}
      </div>

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
        formation={selectedFormation}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSave}
        onDelete={selectedFormation ? handleDelete : undefined}
      />
    </div>
  );
}
