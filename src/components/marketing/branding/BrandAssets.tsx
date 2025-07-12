'use client';

import { FC, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Label removed - unused import
import {
  FileText,
  Image as ImageIcon,
  Video,
  File,
  Upload,
  Download,
  Search,
  // Filter removed - unused import
  Grid,
  List,
  Trash2
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
// Tabs components removed - unused imports
import {
  Select,
  SelectContent,
  // SelectGroup removed - unused import
  SelectItem,
  // SelectLabel removed - unused import
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Badge removed - unused import

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  thumbnail?: string;
  size: string;
  dimensions?: string;
  lastModified: string;
}

interface BrandAssetsProps {
  assets: Asset[];
}

export const BrandAssets: FC<BrandAssetsProps> = ({ assets: initialAssets }) => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets || []);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const supabase = createClient();

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || asset.type === filter;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    // Only fetch from Supabase if no initial assets were provided
    if (initialAssets?.length === 0 || initialAssets === undefined) {
      fetchBrandAssets();
    }
  }, []);

  const fetchBrandAssets = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('type', 'digital')
        .contains('metadata', { asset_category: 'branding' });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data) {
        // Transform Supabase data to match Asset type
        const formattedAssets: Asset[] = data.map(asset => ({
          id: asset.id,
          name: asset.name,
          type: determineAssetType(asset.file_path, asset.metadata?.asset_type),
          url: asset.file_path,
          thumbnail: asset.metadata?.thumbnail || undefined,
          size: asset.metadata?.size || 'Unknown',
          dimensions: asset.metadata?.dimensions || undefined,
          lastModified: formatDate(asset.updated_at)
        }));
        
        setAssets(formattedAssets);
      }
    } catch (err) {
      console.error('Error fetching brand assets:', err);
      toast({
        title: 'Error',
        description: 'Failed to load brand assets. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to determine asset type based on file extension or metadata
  const determineAssetType = (filePath: string, metadataType?: string): 'image' | 'video' | 'document' => {
    if (metadataType) {
      if (['image', 'video', 'document'].includes(metadataType)) {
        return metadataType as 'image' | 'video' | 'document';
      }
    }
    
    // Fallback to extension detection
    const extension = filePath.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')) {
      return 'image';
    } else if (['mp4', 'webm', 'mov', 'avi'].includes(extension || '')) {
      return 'video';
    } else {
      return 'document';
    }
  };
  
  // Helper function to format dates
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)}sem`;
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)}mois`;
    return `Il y a ${Math.floor(diffDays / 365)}ans`;
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);
        
      if (error) throw new Error(error.message);
      
      setAssets(assets.filter(asset => asset.id !== id));
      toast({
        title: 'Succès',
        description: 'Ressource supprimée avec succès',
      });
    } catch (err) {
      console.error('Error deleting asset:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la ressource',
        variant: 'destructive'
      });
    }
  };
  
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    try {
      setIsUploading(true);
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `brand-assets/${fileName}`;
        
        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from('assets')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('assets')
          .getPublicUrl(filePath);
        
        const publicUrl = publicUrlData.publicUrl;
        
        // Determine asset type
        const assetType = determineAssetType(file.name);
        
        // Create asset record
        const { data, error } = await supabase
          .from('assets')
          .insert([
            {
              name: file.name,
              type: 'digital',
              description: `Brand asset: ${file.name}`,
              file_path: publicUrl,
              status: 'active',
              metadata: {
                asset_category: 'branding',
                asset_type: assetType,
                size: `${(file.size / 1024).toFixed(1)} KB`,
                format: fileExt,
                dimensions: assetType === 'image' ? 'Calculating...' : undefined
              },
              tags: ['branding']
            }
          ])
          .select();
          
        if (error) throw error;
        
        if (data && data[0]) {
          // Add new asset to state
          const newAsset: Asset = {
            id: data[0].id,
            name: data[0].name,
            type: assetType,
            url: publicUrl,
            size: `${(file.size / 1024).toFixed(1)} KB`,
            lastModified: 'À l\'instant'
          };
          
          setAssets(prev => [...prev, newAsset]);
        }
      }
      
      toast({
        title: 'Succès',
        description: `${files.length} fichier(s) téléchargé(s) avec succès`,
      });
    } catch (err) {
      console.error('Error uploading files:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de télécharger les fichiers',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-purple-500" />;
      case 'document':
        return <FileText className="h-5 w-5 text-orange-500" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <File className="h-5 w-5 text-green-500" />
                Ressources de Marque
              </CardTitle>
              <CardDescription>
                Gérez vos images, vidéos et documents de marque
              </CardDescription>
            </div>
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleUpload}
                disabled={isUploading}
              />
              <Button disabled={isUploading}>
                {isUploading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Téléchargement...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Ajouter des Fichiers
                  </>
                )}
              </Button>
            </div>
            </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={filter} onValueChange={(value: 'all' | 'image' | 'video' | 'document') => setFilter(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type de fichier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les fichiers</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Vidéos</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button
                  variant={view === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setView('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setView('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[500px]">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin mr-2">⏳</div>
                  <span>Chargement des ressources...</span>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64 text-center">
                  <File className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">Aucune ressource trouvée</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {search || filter !== 'all' ? 
                      'Essayez de modifier vos filtres de recherche' : 
                      'Commencez par ajouter des fichiers à votre bibliothèque'}
                  </p>
                </div>
              ) : view === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredAssets.map((asset) => (
                    <Card key={asset.id} className="group relative">
                      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDelete(asset.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="aspect-square relative overflow-hidden rounded-t-lg">
                        {asset.type === 'image' ? (
                          <div
                            className="w-full h-full bg-center bg-cover"
                            style={{ backgroundImage: `url(${asset.url})` }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                            {getIcon(asset.type)}
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getIcon(asset.type)}
                            <p className="text-sm font-medium truncate">{asset.name}</p>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{asset.size}</span>
                            {asset.dimensions && <span>{asset.dimensions}</span>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredAssets.map((asset) => (
                    <Card key={asset.id}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
                          {getIcon(asset.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{asset.name}</p>
                          <div className="flex gap-2 text-sm text-muted-foreground">
                            <span>{asset.size}</span>
                            {asset.dimensions && <span>• {asset.dimensions}</span>}
                            <span>• {asset.lastModified}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(asset.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {filteredAssets.length} élément{filteredAssets.length !== 1 ? 's' : ''}
              </p>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Tout Télécharger
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
