'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil, Clock } from 'lucide-react';
import { Product } from '@/types/products';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ViewAutreOffreDialog } from './ViewAutreOffreDialog';
import { EditAutreOffreDialog } from './EditAutreOffreDialog';
import { AddAutreOffreDialog } from './AddAutreOffreDialog';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/components/ui/use-toast';

// Helper function to map product type to display name
const getProductTypeDisplay = (type: string): string => {
  const typeMap: Record<string, string> = {
    'software': 'Logiciel',
    'tool': 'Outil',
    'hardware': 'Matériel',
    'membership': 'Abonnement',
    'service': 'Service',
    'package': 'Package'
  };
  return typeMap[type] || type;
};

export function AutresOffresList() {
  const { products, loading, fetchProducts, updateProduct, createProduct, deleteProduct } = useProducts();
  const [selectedOffre, setSelectedOffre] = useState<Product | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getAvailabilityColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'text-green-500 border-green-500/20 bg-green-500/10',
      'draft': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'discontinued': 'text-orange-500 border-orange-500/20 bg-orange-500/10',
      'archived': 'text-red-500 border-red-500/20 bg-red-500/10'
    };
    return colors[status] || 'text-gray-500 border-gray-500/20 bg-gray-500/10';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'software': 'text-purple-500 border-purple-500/20 bg-purple-500/10',
      'tool': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'hardware': 'text-cyan-500 border-cyan-500/20 bg-cyan-500/10',
      'membership': 'text-indigo-500 border-indigo-500/20 bg-indigo-500/10',
      'service': 'text-green-500 border-green-500/20 bg-green-500/10',
      'package': 'text-amber-500 border-amber-500/20 bg-amber-500/10'
    };
    return colors[type] || 'text-gray-500 border-gray-500/20 bg-gray-500/10';
  };

  const getAvailabilityText = (status: string) => {
    const texts: Record<string, string> = {
      'active': 'Disponible',
      'draft': 'Bientôt disponible',
      'discontinued': 'Épuisé',
      'archived': 'Archivé'
    };
    return texts[status] || status;
  };
  
  const handleAddOffre = () => {
    setAddDialogOpen(true);
  };
  
  const handleEditOffre = (offre: Product) => {
    setSelectedOffre(offre);
    setEditDialogOpen(true);
  };
  
  const handleSave = async (offre: Product) => {
    try {
      if (offre.id) {
        // Update existing offre
        await updateProduct(offre.id, offre);
        toast({
          title: "Succès",
          description: "L'offre a été mise à jour avec succès.",
        });
      } else {
        // Create new offre
        await createProduct(offre);
        toast({
          title: "Succès",
          description: "L'offre a été créée avec succès.",
        });
      }
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error saving offre:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
        return;
      }
      
      await deleteProduct(id);
      toast({
        title: "Succès",
        description: "L'offre a été supprimée avec succès.",
      });
      setViewDialogOpen(false);
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error deleting offre:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-white">Autres Offres</h2>
          <p className="text-sm text-gray-400">
            Découvrez nos offres spéciales et formations
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-gray-700 via-gray-900 to-black border border-gray-700 text-white hover:opacity-90"
          onClick={handleAddOffre}
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter une offre
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 rounded-2xl border border-gray-800 bg-gray-900/60">
          <p className="text-gray-400">Chargement des offres...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex justify-center items-center h-64 rounded-2xl border border-gray-800 bg-gray-900/60">
          <p className="text-gray-400">Aucune offre disponible</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {products.map((offre) => (
            <Card
              key={offre.id}
              className="overflow-hidden border border-gray-800 bg-gradient-to-br from-gray-950 via-gray-900 to-black backdrop-blur-xl hover:border-purple-500/40 transition-all duration-300 shadow-[0_20px_60px_-30px_rgba(168,85,247,0.9)]"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold text-white">{offre.name}</CardTitle>
                  <Badge variant="outline" className={`${getTypeColor(offre.type)} border-white/10 bg-white/5 text-xs`}> 
                    {getProductTypeDisplay(offre.type)}
                  </Badge>
                </div>
                <CardDescription className="mt-2 line-clamp-2 text-gray-400">
                  {offre.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-400">Prix</span>
                    <span className="font-semibold text-white">{offre.price ? `${offre.price.toLocaleString('fr-FR')  } €` : 'Sur devis'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-400">Disponibilité</span>
                    <Badge variant="outline" className={`${getAvailabilityColor(offre.status)} border-white/10 bg-white/5 text-xs`}>
                      {getAvailabilityText(offre.status)}
                    </Badge>
                  </div>
                  {offre.metadata && 'validUntil' in offre.metadata && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Valide jusqu&apos;au {new Date(String(offre.metadata.validUntil)).toLocaleDateString('fr-FR')}</span>
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
                  className="text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Voir
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditOffre(offre)}
                  className="text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {selectedOffre && (
        <>
          <ViewAutreOffreDialog
            offre={selectedOffre}
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            onEdit={() => {
              setViewDialogOpen(false);
              setEditDialogOpen(true);
            }}
            onDelete={handleDelete}
            getAvailabilityColor={getAvailabilityColor}
            getTypeColor={getTypeColor}
            getAvailabilityText={getAvailabilityText}
            getProductTypeDisplay={getProductTypeDisplay}
          />
          
          <EditAutreOffreDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            offre={selectedOffre}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        </>
      )}
      
      {/* Add new offre dialog */}
      <AddAutreOffreDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleSave}
      />
    </div>
  );
}
