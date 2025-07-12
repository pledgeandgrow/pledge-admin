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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ViewPackageDialog } from './ViewPackageDialog';
import { EditPackageDialog } from './EditPackageDialog';
import { useToast } from '@/components/ui/use-toast';
import { productService } from '@/services/productService';
import { Product, ProductStatus } from '@/types/products';

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

export default function PackageTable() {
  const [packages, setPackages] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<Product | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await productService.getPackages();
        setPackages(data);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les packages",
          variant: "destructive"
        });
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPackages();
  }, [toast]);

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

  const handleViewPackage = (pkg: Product) => {
    setSelectedPackage(pkg);
    setViewDialogOpen(true);
  };

  const handleEditPackage = (pkg: Product) => {
    setSelectedPackage(pkg);
    setEditDialogOpen(true);
  };

  const handleAddPackage = () => {
    setSelectedPackage(null);
    setEditDialogOpen(true);
  };

  const handleSave = async (productData: Partial<Product>) => {
    try {
      if (selectedPackage && selectedPackage.id) {
        // Update existing package
        await productService.updateProduct(selectedPackage.id, productData);
        
        // Update local state
        setPackages(prev =>
          prev.map(p => (p.id === selectedPackage.id ? { ...p, ...productData } : p))
        );
        
        toast({
          title: 'Package mis à jour',
          description: 'Le package a été modifié avec succès.',
        });
      } else {
        // Add new package
        // Ensure type is set to 'package'
        const newProductData = {
          ...productData,
          type: 'package'
        } as Product;
        
        const newProduct = await productService.createProduct(newProductData);
        
        if (newProduct) {
          setPackages(prev => [...prev, newProduct]);
          
          toast({
            title: 'Package créé',
            description: 'Le nouveau package a été ajouté avec succès.',
          });
        }
      }
    } catch (error) {
      console.error('Error saving package:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde du package.',
        variant: 'destructive'
      });
    }
    
    setEditDialogOpen(false);
    setSelectedPackage(null);
  };

  const handleDelete = async () => {
    if (selectedPackage && selectedPackage.id) {
      try {
        await productService.deleteProduct(selectedPackage.id);
        
        setPackages(prev => prev.filter(p => p.id !== selectedPackage.id));
        
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
      
      setViewDialogOpen(false);
      setSelectedPackage(null);
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
        <h2 className="text-2xl font-bold">Packages</h2>
        <Button onClick={handleAddPackage}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau package
        </Button>
      </div>
      
      {packages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun package trouvé</p>
          <Button className="mt-4" onClick={handleAddPackage}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un package
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell>{(pkg.price || 0).toLocaleString('fr-FR')} €</TableCell>
                  <TableCell>{pkg.metadata?.duration || 'Non spécifié'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getLevelColor(pkg.metadata?.level || 'Standard')}>
                      {pkg.metadata?.level || 'Standard'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getCategoryColor(pkg.metadata?.category || 'Development')}>
                      {pkg.metadata?.category || 'Development'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(pkg.status)}>
                      {getStatusText(pkg.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => handleViewPackage(pkg)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Voir les détails</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => handleEditPackage(pkg)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Modifier</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {selectedPackage && (
        <>
          <ViewPackageDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            package={selectedPackage}
            onEdit={() => {
              setViewDialogOpen(false);
              setEditDialogOpen(true);
            }}
            onDelete={handleDelete}
            getCategoryColor={getCategoryColor}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            getLevelColor={getLevelColor}
          />
          
          <EditPackageDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            package={selectedPackage}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        </>
      )}
      
      {!selectedPackage && (
        <EditPackageDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSave}
        />
      )}
    </>
  );
}
