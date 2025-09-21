'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, User, Calendar, Globe } from 'lucide-react';
import { Data } from '@/types/data';

interface VpnAccessCardProps {
  vpnAccess: Data;
  getStatusColor: (status: string) => string;
  onView?: (vpnAccess: Data) => void;
}

export function VpnAccessCard({ vpnAccess, getStatusColor, onView }: VpnAccessCardProps) {
  const handleView = () => {
    if (onView) {
      onView(vpnAccess);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{vpnAccess.title}</CardTitle>
          <Badge variant="outline" className={getStatusColor(vpnAccess.metadata?.status as string || 'pending')}>
            {vpnAccess.metadata?.status || 'En attente'}
          </Badge>
        </div>
        <CardDescription className="mt-2 line-clamp-2">
          {vpnAccess.summary || vpnAccess.content}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {vpnAccess.metadata?.username && (
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Utilisateur:</span>
              <span className="ml-2 font-medium">{vpnAccess.metadata.username as string}</span>
            </div>
          )}
          
          {vpnAccess.metadata?.expiration_date && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Expiration:</span>
              <span className="ml-2 font-medium">{formatDate(vpnAccess.metadata.expiration_date as string)}</span>
            </div>
          )}
          
          {vpnAccess.metadata?.access_level && (
            <div className="flex items-center text-sm">
              <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Niveau d'accès:</span>
              <span className="ml-2 font-medium">{vpnAccess.metadata.access_level as string}</span>
            </div>
          )}
          
          {vpnAccess.metadata?.server && (
            <div className="flex items-center text-sm">
              <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Serveur:</span>
              <span className="ml-2 font-medium">{vpnAccess.metadata.server as string}</span>
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
