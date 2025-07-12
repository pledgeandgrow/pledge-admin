'use client';

import { useState, useEffect } from 'react';
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
import { Eye, Pencil, Plus, Loader2 } from 'lucide-react';
import { Product, ProductStatus } from '@/types/products';
import { ViewPrestationDialog } from './ViewPrestationDialog';
import { EditPrestationDialog } from './EditPrestationDialog';
import { useToast } from '@/components/ui/use-toast';
import { productService } from '@/services/productService';

export default function PrestationTable() {
  const [prestations, setPrestations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrestation, setSelectedPrestation] = useState<Product | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPrestations = async () => {
      try {
        const data = await productService.getPrestations();
        setPrestations(data);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les prestations",
          variant: "destructive"
        });
        console.error('Error fetching prestations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrestations();
  }, [toast]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Consulting': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'Development': 'text-purple-500 border-purple-500/20 bg-purple-500/10',
      'Support': 'text-green-500 border-green-500/20 bg-green-500/10',
      'Training': 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10',
      'Site Web': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'SaaS': 'text-purple-500 border-purple-500/20 bg-purple-500/10',
      'Application Mobile': 'text-pink-500 border-pink-500/20 bg-pink-500/10',
      'Logiciel': 'text-green-500 border-green-500/20 bg-green-500/10',
      'Jeux Vidéo': 'text-red-500 border-red-500/20 bg-red-500/10',
      'E-commerce': 'text-orange-500 border-orange-500/20 bg-orange-500/10',
      'IA & Automatisation': 'text-indigo-500 border-indigo-500/20 bg-indigo-500/10',
      'Blockchain': 'text-cyan-500 border-cyan-500/20 bg-cyan-500/10',
      'Cybersécurité': 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10',
      'Cloud / DevOps': 'text-sky-500 border-sky-500/20 bg-sky-500/10',
      'Documentation': 'text-gray-500 border-gray-500/20 bg-gray-500/10',
      'Design UX/UI': 'text-violet-500 border-violet-500/20 bg-violet-500/10',
      'Référencement': 'text-amber-500 border-amber-500/20 bg-amber-500/10',
      'Maintenance': 'text-teal-500 border-teal-500/20 bg-teal-500/10',
      'Conseil / Formation': 'text-lime-500 border-lime-500/20 bg-lime-500/10'
    };
    return colors[category] || 'text-gray-500 border-gray-500/20 bg-gray-500/10';
  };

  const getStatusColor = (status: ProductStatus) => {
    const colors: Record<string, string> = {
      'active': 'text-green-500 border-green-500/20 bg-green-500/10',
      'draft': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'discontinued': 'text-orange-500 border-orange-500/20 bg-orange-500/10',
      'archived': 'text-gray-500 border-gray-500/20 bg-gray-500/10'
    };
    return colors[status] || 'text-gray-500 border-gray-500/20 bg-gray-500/10';
  };

  const getStatusText = (status: ProductStatus) => {
    const texts: Record<string, string> = {
      'active': 'Disponible',
      'draft': 'Bientôt',
      'discontinued': 'Limité',
      'archived': 'Archivé'
    };
    return texts[status] || status;
  };

  const handleViewPrestation = (prestation: Product) => {
    setSelectedPrestation(prestation);
    setViewDialogOpen(true);
  };

  const handleEditPrestation = (prestation: Product) => {
    setSelectedPrestation(prestation);
    setEditDialogOpen(true);
  };

  const handleAddPrestation = () => {
    setSelectedPrestation(null);
    setEditDialogOpen(true);
  };

  const handleSave = async (prestationData: Partial<Product>) => {
    try {
      if (selectedPrestation && selectedPrestation.id) {
        // Update existing prestation
        const productData: Partial<Product> = {
          name: prestationData.name || selectedPrestation.name,
          description: prestationData.description || selectedPrestation.description,
          price: prestationData.price !== undefined ? prestationData.price : selectedPrestation.price,
          status: prestationData.status || selectedPrestation.status,
          metadata: {
            ...selectedPrestation.metadata,
            duration: prestationData.metadata?.duration || selectedPrestation.metadata?.duration,
            category: prestationData.metadata?.category || selectedPrestation.metadata?.category,
            features: prestationData.metadata?.features || selectedPrestation.metadata?.features
          }
        };
        
        await productService.updateProduct(selectedPrestation.id, productData);
        
        // Update local state
        setPrestations(prev =>
          prev.map(p => (p.id === selectedPrestation.id ? { ...p, ...productData } as Product : p))
        );
        
        toast({
          title: 'Prestation mise à jour',
          description: 'La prestation a été modifiée avec succès.',
        });
      } else {
        // Add new prestation
        const productData: Product = {
          name: prestationData.name || 'Nouvelle prestation',
          description: prestationData.description || '',
          type: 'service',
          price: prestationData.price || 0,
          status: prestationData.status || 'active',
          metadata: {
            duration: prestationData.metadata?.duration || '',
            category: prestationData.metadata?.category || 'Consulting',
            features: prestationData.metadata?.features || []
          }
        };
        
        const newProduct = await productService.createProduct(productData);
        
        if (newProduct) {
          setPrestations(prev => [...prev, newProduct]);
          
          toast({
            title: 'Prestation créée',
            description: 'La nouvelle prestation a été ajoutée avec succès.',
          });
        }
      }
    } catch (error) {
      console.error('Error saving prestation:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde de la prestation.',
        variant: 'destructive'
      });
    }
    
    setEditDialogOpen(false);
    setSelectedPrestation(null);
  };

  const handleDelete = async () => {
    if (selectedPrestation && selectedPrestation.id) {
      try {
        await productService.deleteProduct(selectedPrestation.id);
        
        setPrestations(prev => prev.filter(p => p.id !== selectedPrestation.id));
        
        toast({
          title: 'Prestation supprimée',
          description: 'La prestation a été supprimée avec succès.',
        });
      } catch (error) {
        console.error('Error deleting prestation:', error);
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la suppression de la prestation.',
          variant: 'destructive'
        });
      }
      
      setViewDialogOpen(false);
      setSelectedPrestation(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Liste des Prestations</h2>
        <Button
          onClick={handleAddPrestation}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prestations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Aucune prestation trouvée
                  </TableCell>
                </TableRow>
              ) : (
                prestations.map((prestation) => (
                  <TableRow key={prestation.id}>
                    <TableCell className="font-medium">{prestation.name}</TableCell>
                    <TableCell>{prestation.price ? `${prestation.price.toLocaleString('fr-FR')} €` : 'Sur devis'}</TableCell>
                    <TableCell>{prestation.metadata?.duration || 'Non spécifié'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getCategoryColor(prestation.metadata?.category || 'Development')}>
                        {prestation.metadata?.category || 'Development'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(prestation.status as ProductStatus)}>
                        {getStatusText(prestation.status as ProductStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewPrestation(prestation)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditPrestation(prestation)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {selectedPrestation && (
        <>
          <ViewPrestationDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            prestation={selectedPrestation}
            onEdit={() => {
              setViewDialogOpen(false);
              setEditDialogOpen(true);
            }}
            onDelete={handleDelete}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            getCategoryColor={getCategoryColor}
          />
          
          <EditPrestationDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            prestation={selectedPrestation}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        </>
      )}
      
      {!selectedPrestation && (
        <EditPrestationDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          prestation={null}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
