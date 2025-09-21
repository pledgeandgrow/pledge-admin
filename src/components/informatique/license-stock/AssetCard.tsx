'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Tag, DollarSign, MapPin } from 'lucide-react';
import { Asset, AssetStatus } from '@/types/assets';

interface AssetCardProps {
  asset: Asset;
  onView?: (asset: Asset) => void;
}

export function AssetCard({ asset, onView }: AssetCardProps) {
  const handleView = () => {
    if (onView) {
      onView(asset);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusColor = (status: AssetStatus) => {
    const colors: Record<AssetStatus, string> = {
      'active': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'expired': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'archived': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const getTypeIcon = () => {
    if (asset.type === 'digital') {
      return <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    }
    return <Tag className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
  };

  const isExpiringSoon = () => {
    if (!asset.expiration_date) return false;
    
    const today = new Date();
    const expiration = new Date(asset.expiration_date);
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 30 && diffDays > 0;
  };

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{asset.name}</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              {getTypeIcon()}
            </div>
            <Badge variant="outline" className={getStatusColor(asset.status)}>
              {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
            </Badge>
          </div>
        </div>
        <CardDescription className="mt-2 line-clamp-2">
          {asset.description || 'Aucune description disponible'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {asset.acquisition_date && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Acquisition:</span>
              <span className="ml-2 font-medium">{formatDate(asset.acquisition_date)}</span>
            </div>
          )}
          
          {asset.expiration_date && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Expiration:</span>
              <span className={`ml-2 font-medium ${isExpiringSoon() ? 'text-orange-500' : ''}`}>
                {formatDate(asset.expiration_date)}
                {isExpiringSoon() && ' (Expire bientôt)'}
              </span>
            </div>
          )}
          
          {asset.value !== undefined && (
            <div className="flex items-center text-sm">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Valeur:</span>
              <span className="ml-2 font-medium">
                {asset.value.toLocaleString('fr-FR')} {asset.currency || '€'}
              </span>
            </div>
          )}
          
          {asset.location && (
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Emplacement:</span>
              <span className="ml-2 font-medium">{asset.location}</span>
            </div>
          )}
          
          {asset.tags && asset.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {asset.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" onClick={handleView}>
          Voir les détails
        </Button>
      </CardFooter>
    </Card>
  );
}
