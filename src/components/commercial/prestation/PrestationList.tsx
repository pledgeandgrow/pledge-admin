'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Prestation } from '@/types/prestation';
import { ViewPrestationDialog } from './ViewPrestationDialog';
import { EditPrestationDialog } from './EditPrestationDialog';
import { useToast } from '@/components/ui/use-toast';

const mockPrestations: Prestation[] = [
  {
    id: '1',
    title: 'Site Web Professionnel',
    description: 'Création de site web responsive et moderne pour votre entreprise',
    priceMin: 3000,
    priceMax: 15000,
    duration: '4-8 semaines',
    category: 'Site Web',
    status: 'Available',
    features: [
      'Design responsive',
      'Intégration CMS',
      'Optimisation SEO',
      'Formulaires de contact',
      'Analytics'
    ]
  },
  {
    id: '2',
    title: 'Application SaaS',
    description: 'Développement de solutions logicielles en tant que service',
    priceMin: 15000,
    priceMax: 50000,
    duration: '3-6 mois',
    category: 'SaaS',
    status: 'Available',
    features: [
      'Architecture cloud',
      'Authentification sécurisée',
      'API RESTful',
      'Tableau de bord admin',
      'Facturation récurrente'
    ]
  },
  {
    id: '3',
    title: 'Application Mobile',
    description: 'Création d\'applications mobiles natives ou hybrides',
    priceMin: 10000,
    priceMax: 40000,
    duration: '2-5 mois',
    category: 'Application Mobile',
    status: 'Available',
    features: [
      'iOS et Android',
      'UI/UX moderne',
      'Notifications push',
      'Intégration API',
      'Analytics mobiles'
    ]
  },
  {
    id: '4',
    title: 'Développement Logiciel',
    description: 'Création de logiciels sur mesure pour vos besoins spécifiques',
    priceMin: 8000,
    priceMax: 60000,
    duration: '2-8 mois',
    category: 'Logiciel',
    status: 'Available',
    features: [
      'Analyse des besoins',
      'Architecture robuste',
      'Tests automatisés',
      'Documentation complète',
      'Support post-déploiement'
    ]
  },
  {
    id: '5',
    title: 'Jeu Vidéo',
    description: 'Développement de jeux vidéo pour différentes plateformes',
    priceMin: 20000,
    priceMax: 100000,
    duration: '6-12 mois',
    category: 'Jeux Vidéo',
    status: 'Limited',
    features: [
      'Game design',
      'Développement Unity/Unreal',
      'Assets 2D/3D',
      'Sound design',
      'Monétisation'
    ]
  },
  {
    id: '6',
    title: 'Solution E-commerce',
    description: 'Création de boutiques en ligne performantes et sécurisées',
    priceMin: 5000,
    priceMax: 30000,
    duration: '1-3 mois',
    category: 'E-commerce',
    status: 'Available',
    features: [
      'Catalogue produits',
      'Paiement sécurisé',
      'Gestion des stocks',
      'Optimisation mobile',
      'Intégration logistique'
    ]
  },
  {
    id: '7',
    title: 'IA & Automatisation',
    description: 'Solutions d\'intelligence artificielle et d\'automatisation de processus',
    priceMin: 10000,
    priceMax: 80000,
    duration: '2-6 mois',
    category: 'IA & Automatisation',
    status: 'Coming Soon',
    features: [
      'Machine Learning',
      'Traitement du langage',
      'Computer Vision',
      'Automatisation RPA',
      'Intégration API'
    ]
  },
  {
    id: '8',
    title: 'Solutions Blockchain',
    description: 'Développement d\'applications basées sur la blockchain',
    priceMin: 15000,
    priceMax: 70000,
    duration: '3-8 mois',
    category: 'Blockchain',
    status: 'Limited',
    features: [
      'Smart Contracts',
      'Tokens personnalisés',
      'Wallets sécurisés',
      'DApps',
      'Audit de sécurité'
    ]
  },
  {
    id: '9',
    title: 'Cybersécurité',
    description: 'Services d\'audit et de renforcement de la sécurité informatique',
    priceMin: 5000,
    priceMax: 40000,
    duration: '2-6 semaines',
    category: 'Cybersécurité',
    status: 'Available',
    features: [
      'Tests d\'intrusion',
      'Audit de sécurité',
      'Conformité RGPD',
      'Formation équipes',
      'Plan de réponse aux incidents'
    ]
  },
  {
    id: '10',
    title: 'Cloud & DevOps',
    description: 'Mise en place d\'infrastructures cloud et pratiques DevOps',
    priceMin: 8000,
    priceMax: 50000,
    duration: '1-3 mois',
    category: 'Cloud / DevOps',
    status: 'Available',
    features: [
      'CI/CD',
      'Containerisation',
      'Infrastructure as Code',
      'Monitoring',
      'Scalabilité automatique'
    ]
  },
  {
    id: '11',
    title: 'Documentation Technique',
    description: 'Création de documentation technique complète pour vos projets',
    priceMin: 2000,
    priceMax: 15000,
    duration: '2-8 semaines',
    category: 'Documentation',
    status: 'Available',
    features: [
      'Documentation API',
      'Guides utilisateurs',
      'Documentation technique',
      'Diagrammes d\'architecture',
      'Wikis internes'
    ]
  },
  {
    id: '12',
    title: 'Design UX/UI',
    description: 'Conception d\'interfaces utilisateur modernes et ergonomiques',
    priceMin: 3000,
    priceMax: 20000,
    duration: '2-6 semaines',
    category: 'Design UX/UI',
    status: 'Available',
    features: [
      'Wireframing',
      'Prototypage',
      'Tests utilisateurs',
      'Design system',
      'Responsive design'
    ]
  },
  {
    id: '13',
    title: 'Référencement SEO/SEA',
    description: 'Optimisation du référencement naturel et payant de votre site',
    priceMin: 1500,
    priceMax: 10000,
    duration: '1-3 mois',
    category: 'Référencement',
    status: 'Available',
    features: [
      'Audit SEO',
      'Optimisation on-page',
      'Stratégie de contenu',
      'Campagnes AdWords',
      'Analyse de performance'
    ]
  },
  {
    id: '14',
    title: 'Maintenance Applicative',
    description: 'Services de maintenance et d\'évolution de vos applications',
    priceMin: 1000,
    priceMax: 8000,
    duration: 'Mensuel',
    category: 'Maintenance',
    status: 'Available',
    features: [
      'Correctifs de bugs',
      'Mises à jour de sécurité',
      'Évolutions fonctionnelles',
      'Monitoring 24/7',
      'Support technique'
    ]
  },
  {
    id: '15',
    title: 'Conseil & Formation',
    description: 'Services de conseil IT et formation pour vos équipes',
    priceMin: 2000,
    priceMax: 15000,
    duration: '1-10 jours',
    category: 'Conseil / Formation',
    status: 'Available',
    features: [
      'Conseil stratégique',
      'Formation technique',
      'Accompagnement projet',
      'Audit d\'architecture',
      'Transfert de compétences'
    ]
  }
];

export function PrestationList() {
  const [prestations, setPrestations] = useState<Prestation[]>(mockPrestations);
  const [selectedPrestation, setSelectedPrestation] = useState<Prestation | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Use a more flexible type to handle both Prestation['category'] and string
  const getCategoryColor = (category: string) => {
    // Define colors with a mapping for all known categories
    const colors: Record<string, string> = {
      'Site Web': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'SaaS': 'text-indigo-500 border-indigo-500/20 bg-indigo-500/10',
      'Application Mobile': 'text-purple-500 border-purple-500/20 bg-purple-500/10',
      'Logiciel': 'text-violet-500 border-violet-500/20 bg-violet-500/10',
      'Jeux Vidéo': 'text-pink-500 border-pink-500/20 bg-pink-500/10',
      'E-commerce': 'text-orange-500 border-orange-500/20 bg-orange-500/10',
      'IA & Automatisation': 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10',
      'Blockchain': 'text-amber-500 border-amber-500/20 bg-amber-500/10',
      'Cybersécurité': 'text-red-500 border-red-500/20 bg-red-500/10',
      'Cloud / DevOps': 'text-sky-500 border-sky-500/20 bg-sky-500/10',
      'Documentation': 'text-slate-500 border-slate-500/20 bg-slate-500/10',
      'Design UX/UI': 'text-rose-500 border-rose-500/20 bg-rose-500/10',
      'Référencement': 'text-lime-500 border-lime-500/20 bg-lime-500/10',
      'Maintenance': 'text-teal-500 border-teal-500/20 bg-teal-500/10',
      'Conseil / Formation': 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10'
    };
    return colors[category] || 'text-gray-500 border-gray-500/20 bg-gray-500/10';
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
      <div className="flex justify-end mb-6">
        <Button
          onClick={() => {
            setSelectedPrestation(null);
            setEditDialogOpen(true);
          }}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une prestation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prestations.map((prestation) => (
          <Card key={prestation.id} className="bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl hover:bg-white/20 dark:hover:bg-gray-900/60 transition-colors cursor-pointer" onClick={() => {
              setSelectedPrestation(prestation);
              setViewDialogOpen(true);
            }}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{prestation.title}</CardTitle>
                <Badge variant="outline" className={getCategoryColor(prestation.category)}>
                  {prestation.category}
                </Badge>
              </div>
              <CardDescription className="line-clamp-3 mt-2">{prestation.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click event
                  setSelectedPrestation(prestation);
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
