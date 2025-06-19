'use client';

import { FC, useState } from 'react';
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

interface Asset {
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
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'document'>('all');

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || asset.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
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
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Ajouter des Fichiers
            </Button>
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
              {view === 'grid' ? (
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
