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
import { Product } from '@/types/products';
import { ViewAutreOffreDialog } from './ViewAutreOffreDialog';
import { EditAutreOffreDialog } from './EditAutreOffreDialog';
import { useToast } from '@/components/ui/use-toast';
import { useProducts } from '@/hooks/useProducts';

export default function AutresOffresTable() {
  const { products, loading, fetchProducts, updateProduct, createProduct, deleteProduct } = useProducts();
  const [selectedOffre, setSelectedOffre] = useState<Product | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'software': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'tool': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'hardware': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'membership': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'discontinued': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'draft': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'archived': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'active': 'Disponible',
      'discontinued': 'Épuisé',
      'draft': 'Bientôt disponible',
      'archived': 'Archivé'
    };
    return texts[status] || status;
  };

  // Main handler for viewing an offer
  const handleView = (offre: Product) => {
    setSelectedOffre(offre);
    setViewDialogOpen(true);
  };

  // Main handler for editing an offer
  const handleEdit = (offre: Product) => {
    setSelectedOffre(offre);
    setEditDialogOpen(true);
  };

  const handleAddOffre = () => {
    setSelectedOffre(null);
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
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      try {
        await deleteProduct(id);
        toast({
          title: "Succès",
          description: "Offre supprimée avec succès",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'offre",
          variant: "destructive"
        });
        console.error('Error deleting offre:', error);
      }
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Liste des Autres Offres</h2>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={handleAddOffre}
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter une offre
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Chargement des offres...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Aucune offre trouvée
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((offre) => (
                <TableRow key={offre.id}>
                  <TableCell className="font-medium">{offre.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getTypeColor(offre.type)}>
                      {getProductTypeDisplay(offre.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>{offre.price ? `${offre.price.toLocaleString('fr-FR')} €` : 'Sur devis'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(offre.status)}>
                      {getStatusText(offre.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(offre)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(offre)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => offre.id && handleDelete(offre.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" x2="10" y1="11" y2="17" />
                          <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {selectedOffre && (
        <>
          <ViewAutreOffreDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            offre={selectedOffre}
            onEdit={() => {
              setViewDialogOpen(false);
              setEditDialogOpen(true);
            }}
            onDelete={handleDelete}
            getAvailabilityColor={getStatusColor}
            getAvailabilityText={getStatusText}
            getTypeColor={getTypeColor}
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
      {!selectedOffre && editDialogOpen && (
        <EditAutreOffreDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          offre={null}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
