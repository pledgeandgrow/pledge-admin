'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Eye, Pencil, Loader2, Search, Layers3, Target, Rocket, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, ProductStatus } from '@/types/products';
import { ViewPackageDialog } from './ViewPackageDialog';
import { EditPackageDialog } from './EditPackageDialog';
import { useToast } from '@/components/ui/use-toast';
import { useProducts } from '@/hooks/useProducts';

// Helper function to get status display text
const getStatusText = (status: ProductStatus): string => {
  const statusMap: Record<string, string> = {
    'active': 'Disponible',
    'draft': 'Brouillon',
    'discontinued': 'Limité',
    'archived': 'Archivé'
  };
  return statusMap[status] || 'Disponible';
};

export function PackageList() {
  const { products, loading, error, fetchProducts, updateProduct, createProduct, deleteProduct } = useProducts({
    type: 'package',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingPackage, setViewingPackage] = useState<Product | null>(null);
  const [editingPackage, setEditingPackage] = useState<Product | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'Basic': 'text-green-500 border-green-500/20 bg-green-500/10',
      'Standard': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'Premium': 'text-purple-500 border-purple-500/20 bg-purple-500/10',
      'Enterprise': 'text-red-500 border-red-500/20 bg-red-500/10'
    };
    return colors[level] || 'text-gray-500 border-gray-500/20 bg-gray-500/10';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Consulting': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'Development': 'text-purple-500 border-purple-500/20 bg-purple-500/10',
      'Support': 'text-green-500 border-green-500/20 bg-green-500/10',
      'Training': 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10'
    };
    return colors[category] || 'text-gray-500 border-gray-500/20 bg-gray-500/10';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'text-green-500 border-green-500/20 bg-green-500/10',
      'draft': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'discontinued': 'text-orange-500 border-orange-500/20 bg-orange-500/10',
      'archived': 'text-gray-500 border-gray-500/20 bg-gray-500/10'
    };
    return colors[status] || 'text-gray-500 border-gray-500/20 bg-gray-500/10';
  };

  const handleViewPackage = (pkg: Product) => {
    setViewingPackage(pkg);
    setIsViewDialogOpen(true);
  };

  const handleEditPackage = (pkg: Product) => {
    setEditingPackage(pkg);
    setIsEditDialogOpen(true);
  };

  const handleAddPackage = () => {
    setEditingPackage(null);
    setIsEditDialogOpen(true);
  };

  const handleSave = async (productData: Partial<Product>) => {
    try {
      if (editingPackage && editingPackage.id) {
        await updateProduct(editingPackage.id, {
          ...productData,
          type: productData.type || editingPackage.type || 'package',
        });

        toast({
          title: 'Package mis à jour',
          description: 'Le package a été modifié avec succès.',
        });
      } else {
        const newProductData: Product = {
          ...productData,
          name: productData.name || 'Nouveau package',
          type: 'package',
          status: productData.status || 'draft',
        } as Product;

        await createProduct(newProductData);

        toast({
          title: 'Package créé',
          description: 'Le nouveau package a été ajouté avec succès.',
        });
      }
    } catch (error) {
      console.error('Error saving package:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde du package.',
        variant: 'destructive'
      });
    }
    
    setIsEditDialogOpen(false);
    setEditingPackage(null);
  };

  const handleDelete = async () => {
    if (viewingPackage && viewingPackage.id) {
      try {
        await deleteProduct(viewingPackage.id);
        
        toast({
          title: 'Package supprimé',
          description: 'Le package a été supprimé avec succès.',
        });
      } catch (error) {
        console.error('Error deleting package:', error);
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la suppression du package.',
          variant: 'destructive'
        });
      }
      
      setIsViewDialogOpen(false);
      setViewingPackage(null);
    }
  };

  const filteredPackages = useMemo(() => {
    if (!searchQuery.trim()) {return products;}
    const query = searchQuery.trim().toLowerCase();
    return products.filter((pkg) => {
      const metadata = pkg.metadata || {};
      const category = typeof metadata.category === 'string' ? metadata.category : '';
      const level = typeof metadata.level === 'string' ? metadata.level : '';
      return (
        pkg.name.toLowerCase().includes(query) ||
        (pkg.description && pkg.description.toLowerCase().includes(query)) ||
        category.toLowerCase().includes(query) ||
        level.toLowerCase().includes(query)
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
    const levelCount = new Set<string>();

    products.forEach((pkg) => {
      statusCounts[pkg.status] = (statusCounts[pkg.status] || 0) + 1;
      if (typeof pkg.price === 'number' && !Number.isNaN(pkg.price)) {
        totalPrice += pkg.price;
        pricedItems += 1;
      }
      const level = pkg.metadata?.level;
      if (typeof level === 'string' && level.trim()) {
        levelCount.add(level);
      }
    });

    return {
      total: products.length,
      active: statusCounts.active,
      draft: statusCounts.draft,
      discontinued: statusCounts.discontinued,
      averagePrice: pricedItems ? Math.round((totalPrice / pricedItems) * 100) / 100 : 0,
      levels: levelCount.size,
    };
  }, [products]);

  if (error && products.length === 0) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="text-lg font-medium text-destructive">Impossible de charger les packages</p>
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
                  Total packages
                </CardDescription>
                <CardTitle className="text-3xl text-indigo-900 dark:text-indigo-100">
                  {statistics.total}
                </CardTitle>
              </div>
              <Layers3 className="h-6 w-6 text-indigo-500" />
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 border-green-200/60 dark:border-green-800/60">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardDescription className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
                  Actifs
                </CardDescription>
                <CardTitle className="text-3xl text-emerald-900 dark:text-emerald-100">
                  {statistics.active}
                </CardTitle>
              </div>
              <Target className="h-6 w-6 text-emerald-500" />
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border-amber-200/60 dark:border-amber-800/60">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardDescription className="text-xs uppercase tracking-wide text-amber-600 dark:text-amber-300">
                  Brouillons & limités
                </CardDescription>
                <CardTitle className="text-3xl text-amber-900 dark:text-amber-100">
                  {statistics.draft + statistics.discontinued}
                </CardTitle>
              </div>
              <Rocket className="h-6 w-6 text-amber-500" />
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
              <RefreshCw className="h-6 w-6 text-slate-500" />
            </CardHeader>
          </Card>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un package (nom, catégorie, niveau)"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-9 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              onClick={handleAddPackage}
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouveau package
            </Button>
          </div>
        </div>

        {filteredPackages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-muted-foreground/30 p-12 text-center">
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {searchQuery ? 'Aucun package ne correspond à votre recherche' : 'Aucun package disponible'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Ajoutez votre premier package pour commencer à les proposer à vos clients.
            </p>
            <Button className="mt-6" onClick={handleAddPackage}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un package
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPackages.map((pkg) => {
              const metadata = pkg.metadata || {};
              const category = metadata.category as string || 'Development';
              const duration = metadata.duration as string || 'Non spécifié';
              const features = Array.isArray(metadata.features) ? metadata.features : [];
              const level = metadata.level as string || 'Standard';

              return (
                <Card key={pkg.id} className="overflow-hidden border border-gray-100/80 dark:border-gray-800/60">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-gray-900 dark:text-gray-100">{pkg.name}</CardTitle>
                      <Badge variant="outline" className={getLevelColor(level)}>
                        {level}
                      </Badge>
                    </div>
                    <Badge variant="outline" className={`${getCategoryColor(category)} mt-2`}>
                      {category}
                    </Badge>
                    <CardDescription className="mt-2 line-clamp-2 text-gray-600 dark:text-gray-400">
                      {pkg.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Prix</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {pkg.price ? `${pkg.price.toLocaleString('fr-FR')} €` : 'Sur devis'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Durée</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{duration}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Statut</span>
                        <Badge className={getStatusColor(pkg.status)}>
                          {getStatusText(pkg.status)}
                        </Badge>
                      </div>
                      {features.length > 0 && (
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
                    <Button variant="outline" size="sm" onClick={() => handleViewPackage(pkg)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Détails
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditPackage(pkg)}>
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

      {viewingPackage && (
        <ViewPackageDialog
          open={isViewDialogOpen}
          onOpenChange={(open) => {
            setIsViewDialogOpen(open);
            if (!open) {
              setViewingPackage(null);
            }
          }}
          package={viewingPackage}
          onEdit={() => {
            setIsViewDialogOpen(false);
            handleEditPackage(viewingPackage);
          }}
          onDelete={handleDelete}
          getCategoryColor={getCategoryColor}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          getLevelColor={getLevelColor}
        />
      )}

      <EditPackageDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setEditingPackage(null);
          }
        }}
        package={editingPackage || undefined}
        onSave={handleSave}
        onDelete={editingPackage ? handleDelete : undefined}
      />
    </>
  );
}