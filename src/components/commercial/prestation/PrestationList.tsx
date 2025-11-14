'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  Pencil,
  Plus,
  Loader2,
  Search,
  Sparkles,
  CheckCircle2,
  FileClock,
  DollarSign,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Product, ProductStatus } from '@/types/products';
import { ViewPrestationDialog } from './ViewPrestationDialog';
import { EditPrestationDialog } from './EditPrestationDialog';
import { useToast } from '@/components/ui/use-toast';
import { useProducts } from '@/hooks/useProducts';

export function PrestationList() {
  const { products, loading, error, fetchProducts, updateProduct, createProduct, deleteProduct } = useProducts({
    type: 'service',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingPrestation, setViewingPrestation] = useState<Product | null>(null);
  const [editingPrestation, setEditingPrestation] = useState<Product | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

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
    setViewingPrestation(prestation);
    setIsViewDialogOpen(true);
  };

  const handleEditPrestation = (prestation: Product) => {
    setEditingPrestation(prestation);
    setIsEditDialogOpen(true);
  };

  const handleAddPrestation = () => {
    setEditingPrestation(null);
    setIsEditDialogOpen(true);
  };

  const handleSave = async (productData: Partial<Product>) => {
    try {
      if (editingPrestation && editingPrestation.id) {
        // Update existing prestation
        // Ensure required fields are present for TypeScript
        const updatedProduct: Partial<Product> = {
          ...productData,
          // If name is undefined, use the existing name
          name: productData.name || editingPrestation.name,
          // Ensure type is always set
          type: productData.type || editingPrestation.type || 'service',
        };
        
        await updateProduct(editingPrestation.id, updatedProduct);
        
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
        
        await createProduct(newProductData);
        
        toast({
          title: 'Prestation créée',
          description: 'La nouvelle prestation a été ajoutée avec succès.',
        });
      }
    } catch (error) {
      console.error('Error saving prestation:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde de la prestation.',
        variant: 'destructive'
      });
    }
    
    setIsEditDialogOpen(false);
    setEditingPrestation(null);
  };

  const handleDelete = async () => {
    if (viewingPrestation && viewingPrestation.id) {
      try {
        await deleteProduct(viewingPrestation.id);
        
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
      
      setIsViewDialogOpen(false);
      setViewingPrestation(null);
    }
  };

  const filteredPrestations = useMemo(() => {
    if (!searchQuery.trim()) {return products;}
    const query = searchQuery.trim().toLowerCase();
    return products.filter((prestation) => {
      const metadata = prestation.metadata || {};
      const category = typeof metadata.category === 'string' ? metadata.category : '';
      return (
        prestation.name.toLowerCase().includes(query) ||
        (prestation.description && prestation.description.toLowerCase().includes(query)) ||
        category.toLowerCase().includes(query)
      );
    });
  }, [products, searchQuery]);

  const statistics = useMemo(() => {
    const statusCounts: Record<ProductStatus, number> = {
      active: 0,
      draft: 0,
      discontinued: 0,
      archived: 0,
    };
    let totalPrice = 0;
    let pricedItems = 0;
    const categorySet = new Set<string>();

    products.forEach((product) => {
      statusCounts[product.status] = (statusCounts[product.status] || 0) + 1;
      if (typeof product.price === 'number' && !Number.isNaN(product.price)) {
        totalPrice += product.price;
        pricedItems += 1;
      }
      const category = product.metadata?.category;
      if (typeof category === 'string' && category.trim()) {
        categorySet.add(category);
      }
    });

    return {
      total: products.length,
      active: statusCounts.active,
      draft: statusCounts.draft,
      discontinued: statusCounts.discontinued,
      averagePrice: pricedItems ? Math.round((totalPrice / pricedItems) * 100) / 100 : 0,
      categories: categorySet.size,
    };
  }, [products]);

  if (error && products.length === 0) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="text-lg font-medium text-destructive">
          Impossible de charger les prestations
        </p>
        <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        <Button className="mt-4" onClick={() => fetchProducts()}>
          Réessayer
        </Button>
      </div>
    );
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/10 border-indigo-200/60 dark:border-indigo-800/60">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardDescription className="text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                  Total services
                </CardDescription>
                <CardTitle className="text-3xl text-indigo-900 dark:text-indigo-100">
                  {statistics.total}
                </CardTitle>
              </div>
              <Sparkles className="h-6 w-6 text-indigo-500" />
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10 border-emerald-200/60 dark:border-emerald-800/60">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardDescription className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
                  Prestations actives
                </CardDescription>
                <CardTitle className="text-3xl text-emerald-900 dark:text-emerald-100">
                  {statistics.active}
                </CardTitle>
              </div>
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border-amber-200/60 dark:border-amber-800/60">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardDescription className="text-xs uppercase tracking-wide text-amber-600 dark:text-amber-300">
                  Brouillons / à venir
                </CardDescription>
                <CardTitle className="text-3xl text-amber-900 dark:text-amber-100">
                  {statistics.draft + statistics.discontinued}
                </CardTitle>
              </div>
              <FileClock className="h-6 w-6 text-amber-500" />
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
              <DollarSign className="h-6 w-6 text-slate-500" />
            </CardHeader>
          </Card>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, catégorie..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-9 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              onClick={handleAddPrestation}
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle prestation
            </Button>
          </div>
        </div>

        {filteredPrestations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-muted-foreground/30 p-12 text-center">
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {searchQuery ? 'Aucune prestation ne correspond à votre recherche' : 'Aucune prestation disponible'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Ajoutez votre première prestation pour commencer à proposer vos services.
            </p>
            <Button className="mt-6" onClick={handleAddPrestation}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une prestation
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrestations.map((prestation) => {
              const metadata = prestation.metadata || {};
              const category = metadata.category as string || 'Non spécifié';
              const duration = metadata.duration as string || 'Non spécifié';
              const features = metadata.features as string[] || [];
              const priceMin = metadata.priceMin as number || prestation.price || 0;
              const priceMax = metadata.priceMax as number || prestation.price || 0;
            
              return (
                <Card key={prestation.id} className="overflow-hidden border border-gray-100/80 dark:border-gray-800/60">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-gray-900 dark:text-gray-100">{prestation.name}</CardTitle>
                      <Badge className={getStatusColor(prestation.status as ProductStatus)}>
                        {getStatusText(prestation.status as ProductStatus)}
                      </Badge>
                    </div>
                    <Badge variant="outline" className={`${getCategoryColor(category)} mt-2`}>
                      {category}
                    </Badge>
                    <CardDescription className="mt-2 line-clamp-2 text-gray-600 dark:text-gray-400">
                      {prestation.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Prix</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {priceMin === priceMax
                            ? `${priceMin.toLocaleString('fr-FR')} €`
                            : `${priceMin.toLocaleString('fr-FR')} € - ${priceMax.toLocaleString('fr-FR')} €`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Durée</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{duration}</span>
                      </div>
                      {features && features.length > 0 && (
                        <div className="pt-2">
                          <span className="text-muted-foreground block mb-1">Fonctionnalités</span>
                          <ul className="list-disc pl-4 space-y-1">
                            {features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="text-xs text-gray-900 dark:text-gray-100">{feature}</li>
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
      </div>

      {viewingPrestation && (
        <ViewPrestationDialog
          open={isViewDialogOpen}
          onOpenChange={(open) => {
            setIsViewDialogOpen(open);
            if (!open) {
              setViewingPrestation(null);
            }
          }}
          prestation={viewingPrestation}
          onEdit={() => {
            setIsViewDialogOpen(false);
            handleEditPrestation(viewingPrestation);
          }}
          onDelete={handleDelete}
          getCategoryColor={getCategoryColor}
          getStatusColor={(status: string) => getStatusColor(status as ProductStatus)}
          getStatusText={(status: string) => getStatusText(status as ProductStatus)}
        />
      )}

      <EditPrestationDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setEditingPrestation(null);
          }
        }}
        prestation={editingPrestation}
        onSave={handleSave}
      />
    </>
  );
}
