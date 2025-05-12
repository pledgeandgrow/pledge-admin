'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package } from '@/types/package';
import { ViewPackageDialog } from './ViewPackageDialog';
import { EditPackageDialog } from './EditPackageDialog';
import { useToast } from '@/components/ui/use-toast';

const mockPackages: Package[] = [
  {
    id: '1',
    title: 'Pack Startup',
    description: 'Solution complète pour les startups en phase de lancement',
    price: 15000,
    duration: '6 mois',
    status: 'Available',
    features: [
      'Développement site web',
      'Configuration cloud',
      'Support technique',
      'Formation équipe',
      'Audit sécurité'
    ],
    category: 'Development',
    level: 'Standard'
  },
  {
    id: '2',
    title: 'Pack Enterprise Cloud',
    description: 'Solution cloud complète pour les grandes entreprises',
    price: 50000,
    duration: '12 mois',
    status: 'Limited',
    features: [
      'Architecture cloud',
      'Migration données',
      'Sécurité avancée',
      'Support 24/7',
      'Formation personnel'
    ],
    category: 'Consulting',
    level: 'Enterprise'
  },
  {
    id: '3',
    title: 'Pack DevOps',
    description: 'Optimisez votre pipeline de développement',
    price: 25000,
    duration: '3 mois',
    status: 'Coming Soon',
    features: [
      'CI/CD Pipeline',
      'Containerisation',
      'Monitoring',
      'Automatisation',
      'Documentation'
    ],
    category: 'Support',
    level: 'Premium'
  }
];

export function PackageList() {
  const [packages, setPackages] = useState<Package[]>(mockPackages);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const getLevelColor = (level: Package['level']) => {
    const colors: { [key: string]: string } = {
      'Basic': 'text-green-500 border-green-500/20 bg-green-500/10',
      'Standard': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'Premium': 'text-purple-500 border-purple-500/20 bg-purple-500/10',
      'Enterprise': 'text-red-500 border-red-500/20 bg-red-500/10'
    };
    return colors[level];
  };

  const getCategoryColor = (category: Package['category']) => {
    const colors: { [key: string]: string } = {
      'Consulting': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'Development': 'text-purple-500 border-purple-500/20 bg-purple-500/10',
      'Support': 'text-green-500 border-green-500/20 bg-green-500/10',
      'Training': 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10'
    };
    return colors[category];
  };

  const getStatusColor = (status: Package['status']) => {
    const colors: { [key: string]: string } = {
      'Available': 'text-green-500 border-green-500/20 bg-green-500/10',
      'Coming Soon': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'Limited': 'text-orange-500 border-orange-500/20 bg-orange-500/10',
      'Archived': 'text-gray-500 border-gray-500/20 bg-gray-500/10'
    };
    return colors[status];
  };

  const getStatusText = (status: Package['status']) => {
    const texts: { [key: string]: string } = {
      'Available': 'Disponible',
      'Coming Soon': 'Bientôt',
      'Limited': 'Limité',
      'Archived': 'Archivé'
    };
    return texts[status];
  };

  const handleSave = (packageData: Partial<Package>) => {
    if (selectedPackage) {
      // Update existing package
      setPackages(prev =>
        prev.map(p => (p.id === selectedPackage.id ? { ...p, ...packageData } : p))
      );
      toast({
        title: 'Package mis à jour',
        description: 'Le package a été modifié avec succès.',
      });
    } else {
      // Add new package
      const newPackage = {
        ...packageData,
        id: Math.random().toString(36).substr(2, 9),
      } as Package;
      setPackages(prev => [...prev, newPackage]);
      toast({
        title: 'Package créé',
        description: 'Le nouveau package a été ajouté avec succès.',
      });
    }
    setEditDialogOpen(false);
    setSelectedPackage(null);
  };

  const handleDelete = () => {
    if (selectedPackage) {
      setPackages(prev => prev.filter(p => p.id !== selectedPackage.id));
      toast({
        title: 'Package supprimé',
        description: 'Le package a été supprimé avec succès.',
        variant: 'destructive',
      });
      setEditDialogOpen(false);
      setSelectedPackage(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Packages</h2>
          <p className="text-sm text-muted-foreground">
            Gérez vos offres de services packagées
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedPackage(null);
            setEditDialogOpen(true);
          }}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter un package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl hover:bg-white/20 dark:hover:bg-gray-900/60 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{pkg.title}</CardTitle>
                <Badge variant="outline" className={getStatusColor(pkg.status)}>
                  {getStatusText(pkg.status)}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">{pkg.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Prix</span>
                  <span className="font-semibold">{pkg.price.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Durée</span>
                  <span className="font-semibold">{pkg.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Niveau</span>
                  <Badge variant="outline" className={getLevelColor(pkg.level)}>
                    {pkg.level}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Catégorie</span>
                  <Badge variant="outline" className={getCategoryColor(pkg.category)}>
                    {pkg.category}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Fonctionnalités</span>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {pkg.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="line-clamp-1">{feature}</li>
                    ))}
                    {pkg.features.length > 3 && (
                      <li className="text-muted-foreground">
                        +{pkg.features.length - 3} autres...
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedPackage(pkg);
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
                  setSelectedPackage(pkg);
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

      {selectedPackage && (
        <ViewPackageDialog
          package={selectedPackage}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          getLevelColor={getLevelColor}
          getCategoryColor={getCategoryColor}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
      )}

      <EditPackageDialog
        package={selectedPackage}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSave}
        onDelete={selectedPackage ? handleDelete : undefined}
      />
    </div>
  );
}
