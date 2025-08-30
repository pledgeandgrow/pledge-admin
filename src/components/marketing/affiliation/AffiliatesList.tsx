'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Copy, Check, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { AffiliateContact } from './AffiliateView';
import useContacts from '@/hooks/useContacts';

interface AffiliatesListProps {
  initialAffiliates?: AffiliateContact[];
}

export const AffiliatesList: React.FC<AffiliatesListProps> = () => {
  const router = useRouter();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Use the useContacts hook to fetch affiliate data
  const { contacts, loading, error } = useContacts({
    type: 'network',
    initialFilters: { 
      tags: ['affiliate'],
    },
    autoFetch: true
  });

  // Convert contacts to AffiliateContact type and filter based on search query
  const affiliates = useMemo(() => {
    return contacts.map(contact => ({
      ...contact,
      metadata: contact.metadata || {}
    })) as AffiliateContact[];
  }, [contacts]);
  
  // Filter affiliates based on search query
  const filteredAffiliates = useMemo(() => {
    if (!searchQuery.trim()) return affiliates;
    
    return affiliates.filter((affiliate) => {
      const fullName = `${affiliate.first_name} ${affiliate.last_name}`.toLowerCase();
      const email = affiliate.email?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();
      
      return fullName.includes(query) || email.includes(query);
    });
  }, [affiliates, searchQuery]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Nos Affiliés
          </h2>
          <p className="text-muted-foreground">
            Gérez vos affiliés et leurs performances
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          onClick={() => router.push('/marketing/affiliation/affiliates/new')}
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter un affilié
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Affiliés</CardTitle>
          <CardDescription>
            Gérez vos affiliés et leurs codes de parrainage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher un affilié..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Chargement des affiliés...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Une erreur est survenue lors du chargement des affiliés.
            </div>
          ) : filteredAffiliates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun affilié trouvé.
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Parrainages</TableHead>
                    <TableHead>Gains</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière activité</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAffiliates.map((affiliate: AffiliateContact) => {
                    const referralCode = affiliate.metadata?.referral_code || `REF-${affiliate.id.substring(0, 6)}`;
                    const conversions = affiliate.metadata?.total_conversions || 0;
                    const earnings = affiliate.metadata?.total_earnings || 0;
                    const lastActive = affiliate.updated_at || affiliate.created_at;
                    
                    return (
                      <TableRow key={affiliate.id}>
                        <TableCell className="font-medium">
                          {affiliate.first_name} {affiliate.last_name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                              {referralCode}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(referralCode)}
                            >
                              {copiedCode === referralCode ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{conversions}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(earnings)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={affiliate.status === 'active' ? 'default' : 'secondary'}
                            className={
                              affiliate.status === 'active' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                            }
                          >
                            {affiliate.status === 'active' ? 'Actif' : 'Inactif'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {lastActive ? format(parseISO(lastActive), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => router.push(`/marketing/affiliation/affiliates/${affiliate.id}`)}
                          >
                            Voir
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliatesList;
