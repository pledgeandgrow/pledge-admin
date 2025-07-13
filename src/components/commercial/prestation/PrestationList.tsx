'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Loader2, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, ProductStatus } from '@/types/products';
import { ViewPrestationDialog } from './ViewPrestationDialog';
import { EditPrestationDialog } from './EditPrestationDialog';
import { useToast } from '@/components/ui/use-toast';
import { productService } from '@/services/productService';

export function PrestationList() {
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
        setPrestations(data as Product[]);
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

  // Helper function to get category color classes
  const getCategoryColor = (category: string) => {
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

  // Helper function to get status color classes
  const getStatusColor = (status: ProductStatus) => {
    const colors: Record<string, string> = {
      'active': 'text-green-500 border-green-500/20 bg-green-500/10',
      'draft': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'discontinued': 'text-orange-500 border-orange-500/20 bg-orange-500/10',
      'archived': 'text-gray-500 border-gray-500/20 bg-gray-500/10'
    };
    return colors[status];
  };

  // Helper function to get status text
  const getStatusText = (status: ProductStatus) => {
    const texts: Record<string, string> = {
      'active': 'Actif',
      'draft': 'Brouillon',
      'discontinued': 'Discontinué',
      'archived': 'Archivé'
    };
    return texts[status];
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

  const handleSave = async (productData: Partial<Product>) => {
    try {
      if (selectedPrestation && selectedPrestation.id) {
        // Update existing prestation
        // Ensure required fields are present for TypeScript
        const updatedProduct: Partial<Product> = {
          ...productData,
          // If name is undefined, use the existing name
          name: productData.name || selectedPrestation.name,
          // Ensure type is always set
          type: productData.type || selectedPrestation.type || 'service',
        };
        
        await productService.updateProduct(selectedPrestation.id, updatedProduct);
        
        // Update local state
        setPrestations(prev =>
          prev.map(p => (p.id === selectedPrestation.id ? { ...p, ...updatedProduct } : p))
        );
        
        toast({
          title: 'Prestation mise à jour',
          description: 'La prestation a été modifiée avec succès.',
        });
      } else {
        // Add new prestation
        // Ensure required fields are present for TypeScript
        const newProductData: Product = {
          ...productData as Partial<Product>,
          name: productData.name || 'Nouvelle prestation',
          type: 'service',
          status: productData.status || 'draft',
        };
        
        const newProduct = await productService.createProduct(newProductData);
        
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
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Prestations</h2>
        <Button onClick={handleAddPrestation}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle prestation
        </Button>
      </div>
      
      {prestations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucune prestation trouvée</p>
          <Button className="mt-4" onClick={handleAddPrestation}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une prestation
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prestations.map((prestation) => {
            const metadata = prestation.metadata || {};
            const category = metadata.category as string || 'Non spécifié';
            const duration = metadata.duration as string || 'Non spécifié';
            const features = metadata.features as string[] || [];
            const priceMin = metadata.priceMin as number || prestation.price || 0;
            const priceMax = metadata.priceMax as number || prestation.price || 0;
            
            return (
              <Card key={prestation.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{prestation.name}</CardTitle>
                    <Badge className={getStatusColor(prestation.status as ProductStatus)}>
                      {getStatusText(prestation.status as ProductStatus)}
                    </Badge>
                  </div>
                  <Badge variant="outline" className={`${getCategoryColor(category)} mt-2`}>
                    {category}
                  </Badge>
                  <CardDescription className="mt-2 line-clamp-2">
                    {prestation.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prix</span>
                      <span className="font-medium">
                        {priceMin === priceMax
                          ? `${priceMin} €`
                          : `${priceMin} € - ${priceMax} €`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Durée</span>
                      <span className="font-medium">{duration}</span>
                    </div>
                    {features && features.length > 0 && (
                      <div className="pt-2">
                        <span className="text-muted-foreground block mb-1">Fonctionnalités</span>
                        <ul className="list-disc pl-4 space-y-1">
                          {features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="text-xs">{feature}</li>
                          ))}
                          {features.length > 3 && (
                            <li className="text-xs text-muted-foreground">
                              +{features.length - 3} autres...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewPrestation(prestation)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Détails
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditPrestation(prestation)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
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
            getCategoryColor={getCategoryColor}
            getStatusColor={(status: string) => getStatusColor(status as ProductStatus)}
            getStatusText={(status: string) => getStatusText(status as ProductStatus)}
          />
          
          <EditPrestationDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            prestation={selectedPrestation}
            onSave={handleSave}
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
    </>
  );
}
