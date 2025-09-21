'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Data } from '@/types/data';

interface DomainNameCardProps {
  domain: Data;
  getStatusColor: (status: string) => string;
  onView?: (domain: Data) => void;
}

export function DomainNameCard({ domain, getStatusColor, onView }: DomainNameCardProps) {
  const handleView = () => {
    if (onView) {
      onView(domain);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getDaysUntilExpiration = (expirationDate?: string) => {
    if (!expirationDate) return null;
    
    const today = new Date();
    const expiration = new Date(expirationDate);
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysUntilExpiration = getDaysUntilExpiration(domain.metadata?.expiration_date as string);
  const isExpiringSoon = daysUntilExpiration !== null && daysUntilExpiration <= 30;

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{domain.title}</CardTitle>
          <Badge variant="outline" className={getStatusColor(domain.metadata?.status as string || 'active')}>
            {domain.metadata?.status || 'Actif'}
          </Badge>
        </div>
        <CardDescription className="mt-2 line-clamp-2">
          {domain.summary || domain.content}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {domain.metadata?.registrar && (
            <div className="flex items-center text-sm">
              <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Registrar:</span>
              <span className="ml-2 font-medium">{domain.metadata.registrar as string}</span>
            </div>
          )}
          
          {domain.metadata?.expiration_date && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Expiration:</span>
              <span className={`ml-2 font-medium ${isExpiringSoon ? 'text-orange-500' : ''}`}>
                {formatDate(domain.metadata.expiration_date as string)}
                {isExpiringSoon && ` (${daysUntilExpiration} jours)`}
              </span>
            </div>
          )}
          
          {domain.metadata?.auto_renew !== undefined && (
            <div className="flex items-center text-sm">
              {domain.metadata.auto_renew ? (
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2 text-orange-500" />
              )}
              <span className="text-muted-foreground">Renouvellement auto:</span>
              <span className={`ml-2 font-medium ${domain.metadata.auto_renew ? 'text-green-500' : 'text-orange-500'}`}>
                {domain.metadata.auto_renew ? 'Activé' : 'Désactivé'}
              </span>
            </div>
          )}
          
          {domain.metadata?.nameservers && Array.isArray(domain.metadata.nameservers) && (
            <div className="flex items-start text-sm">
              <Globe className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
              <div>
                <span className="text-muted-foreground">Serveurs DNS:</span>
                <div className="ml-2 mt-1 space-y-1">
                  {(domain.metadata.nameservers as string[]).map((ns, index) => (
                    <div key={index} className="text-xs font-mono">{ns}</div>
                  ))}
                </div>
              </div>
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
