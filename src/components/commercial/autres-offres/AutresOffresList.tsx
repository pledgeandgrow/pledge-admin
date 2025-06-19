'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil, Clock } from 'lucide-react';
import { AutreOffre } from '@/types/commercial';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ViewAutreOffreDialog } from './ViewAutreOffreDialog';

const mockAutresOffres: AutreOffre[] = [
  {
    id: '1',
    title: 'Formation React Avancée',
    description: 'Maîtrisez les concepts avancés de React : Hooks, Context, Performance, Tests',
    type: 'Formation',
    price: 799,
    availability: 'Available',
    validUntil: '2025-06-30'
  },
  {
    id: '2',
    title: 'Pack Migration Cloud AWS',
    description: 'Service complet de migration vers AWS avec optimisation des coûts',
    type: 'Service Cloud',
    price: 2999,
    availability: 'Coming Soon'
  },
  {
    id: '3',
    title: 'Audit Performance Web',
    description: 'Analyse complète des performances de votre site web avec recommandations',
    type: 'Audit',
    price: 499,
    availability: 'Limited Time',
    validUntil: '2025-03-31'
  }
];

export function AutresOffresList() {
  const [selectedOffre, setSelectedOffre] = useState<AutreOffre | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const getAvailabilityColor = (availability: AutreOffre['availability']) => {
    const colors: { [key: string]: string } = {
      'Available': 'text-green-500 border-green-500/20 bg-green-500/10',
      'Coming Soon': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'Limited Time': 'text-orange-500 border-orange-500/20 bg-orange-500/10',
      'Sold Out': 'text-red-500 border-red-500/20 bg-red-500/10'
    };
    return colors[availability] || 'text-gray-500 border-gray-500/20 bg-gray-500/10';
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Formation': 'text-purple-500 border-purple-500/20 bg-purple-500/10',
      'Service Cloud': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'Audit': 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10'
    };
    return colors[type] || 'text-gray-500 border-gray-500/20 bg-gray-500/10';
  };

  const getAvailabilityText = (availability: AutreOffre['availability']) => {
    const texts: { [key: string]: string } = {
      'Available': 'Disponible',
      'Coming Soon': 'Bientôt Disponible',
      'Limited Time': 'Temps Limité',
      'Sold Out': 'Complet'
    };
    return texts[availability] || availability;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Autres Offres</h2>
          <p className="text-sm text-muted-foreground">
            Découvrez nos offres spéciales et formations
          </p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" /> Ajouter une offre
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAutresOffres.map((offre) => (
          <Card key={offre.id} className="bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl hover:bg-white/20 dark:hover:bg-gray-900/60 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{offre.title}</CardTitle>
                <Badge variant="outline" className={getAvailabilityColor(offre.availability)}>
                  {getAvailabilityText(offre.availability)}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">{offre.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Prix</span>
                  <span className="font-semibold">{offre.price.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <Badge variant="outline" className={getTypeColor(offre.type)}>
                    {offre.type}
                  </Badge>
                </div>
                {offre.validUntil && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Valide jusqu&apos;au {new Date(offre.validUntil).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedOffre(offre);
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
              >
                <Pencil className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedOffre && (
        <ViewAutreOffreDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          offre={selectedOffre}
          getAvailabilityColor={getAvailabilityColor}
          getTypeColor={getTypeColor}
          getAvailabilityText={getAvailabilityText}
        />
      )}
    </div>
  );
}
