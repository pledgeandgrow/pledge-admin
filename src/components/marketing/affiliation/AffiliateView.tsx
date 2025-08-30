'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Globe, 
  Calendar, 
  Edit, 
  ArrowLeft,
  Tag,
  Clock
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NetworkContact } from '@/types/contact';
import useContacts from '@/hooks/useContacts';

// Define AffiliateProgram interface based on usage in the component
interface AffiliateProgram {
  id: string;
  name: string;
  commission_rate: number;
  conversions: number;
  earnings: number;
  status: string;
  start_date: string;
  end_date: string | null;
}

// Extended NetworkContact interface with additional metadata for affiliates
export interface AffiliateContact extends NetworkContact {
  metadata: {
    connection_strength?: number;
    referral_code?: string;
    balance?: number;
    total_earnings?: number;
    total_clicks?: number;
    total_conversions?: number;
    conversion_rate?: number;
    programs?: string[];
    payment_info?: {
      method: string;
      details: Record<string, unknown>;
    };
    last_payment_date?: string;
    avatar?: string;
    website?: string;
    performance?: {
      clicks?: number;
      conversions?: number;
      earnings?: number;
      pending_earnings?: number;
      average_order_value?: number;
      time_periods?: {
        daily?: Record<string, number>;
        weekly?: Record<string, number>;
        monthly?: Record<string, number>;
      };
    };
  };
}

interface AffiliateViewProps {
  affiliateId: string;
}

export function AffiliateView({ affiliateId }: AffiliateViewProps): React.ReactElement {
  const router = useRouter();
  // Removed unused state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use the useContacts hook to fetch and manage affiliate data
  const { 
    contacts: affiliateContacts, 
    loading: contactsLoading, 
    error: contactsError, 
    fetchContacts 
  } = useContacts({
    type: 'network',
    initialFilters: { 
      tags: ['affiliate'],
    },
    autoFetch: false
  });
  
  const [affiliate, setAffiliate] = useState<AffiliateContact | null>(null);
  const [programs, setPrograms] = useState<AffiliateProgram[]>([]);

  useEffect(() => {
    const fetchAffiliateData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch the specific affiliate by ID
        await fetchContacts({
          search: '',
          tags: ['affiliate']
        });
        
        // Fetch programs associated with this affiliate
        // This would typically come from a separate table or service
        // For now, we'll mock this data
        const mockPrograms = [
          {
            id: 'prog-1',
            name: 'Programme de parrainage standard',
            commission_rate: 10,
            status: 'active',
            start_date: '2025-01-01',
            end_date: null,
            earnings: 450.75,
            conversions: 15
          },
          {
            id: 'prog-2',
            name: 'Programme VIP',
            commission_rate: 15,
            status: 'active',
            start_date: '2025-03-15',
            end_date: null,
            earnings: 275.50,
            conversions: 8
          }
        ];
        
        setPrograms(mockPrograms);
      } catch (err) {
        console.error('Error in fetchAffiliateData:', err);
        setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (affiliateId) {
      fetchAffiliateData();
    }
  }, [affiliateId, fetchContacts]);

  // Set affiliate when contacts are loaded
  useEffect(() => {
    if (!contactsLoading && affiliateContacts.length > 0) {
      const foundAffiliate = affiliateContacts.find(contact => contact.id === affiliateId);
      if (foundAffiliate) {
        // Ensure metadata is initialized if null
        const affiliateWithMetadata = {
          ...foundAffiliate,
          metadata: foundAffiliate.metadata || {}
        } as AffiliateContact;
        
        setAffiliate(affiliateWithMetadata);
      } else {
        setError('Affilié non trouvé');
      }
    }
  }, [affiliateId, affiliateContacts, contactsLoading]);

  // Handle loading and error states
  if (loading || contactsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Chargement des données de l&apos;affilié...</p>
        </div>
      </div>
    );
  }

  if (error || contactsError) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 font-medium">Erreur: {error || contactsError?.message}</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Affilié non trouvé</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  // Helper function to format currency
  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return '0,00 €';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Extract affiliate data
  const {
    first_name,
    last_name,
    email,
    company,
    position,
    created_at,
    metadata
  } = affiliate;

  // Extract performance metrics
  const referralCode = metadata?.referral_code || 'CODE-INCONNU';
  const balance = metadata?.balance || 0;
  const totalEarnings = metadata?.total_earnings || 0;
  const totalClicks = metadata?.total_clicks || 0;
  const totalConversions = metadata?.total_conversions || 0;
  const conversionRate = metadata?.conversion_rate || 0;
  const lastPaymentDate = metadata?.last_payment_date;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profil d&apos;Affilié</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Détails et performances de l&apos;affilié
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Button>
          <Button onClick={() => router.push(`/marketing/affiliation/affiliates/${affiliateId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={metadata?.avatar || ''} />
                <AvatarFallback className="text-xl">
                  {first_name?.[0]}{last_name?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold">{first_name} {last_name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{position} {company ? `chez ${company}` : ''}</p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span>{email || 'Non renseigné'}</span>
              </div>
              
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-gray-500" />
                <span>{metadata?.website || 'Non renseigné'}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>Inscrit le {created_at ? format(parseISO(created_at), 'dd MMMM yyyy', { locale: fr }) : 'Non renseigné'}</span>
              </div>
              
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2 text-gray-500" />
                <span>Code: <strong>{referralCode}</strong></span>
              </div>
              
              {lastPaymentDate && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Dernier paiement: {format(parseISO(lastPaymentDate), 'dd MMMM yyyy', { locale: fr })}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Statistiques et métriques de performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="text-sm text-gray-500 dark:text-gray-400">Solde actuel</div>
                <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="text-sm text-gray-500 dark:text-gray-400">Gains totaux</div>
                <div className="text-2xl font-bold">{formatCurrency(totalEarnings)}</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="text-sm text-gray-500 dark:text-gray-400">Clics</div>
                <div className="text-2xl font-bold">{totalClicks}</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="text-sm text-gray-500 dark:text-gray-400">Conversions</div>
                <div className="text-2xl font-bold">{totalConversions}</div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">Taux de conversion</div>
                <div className="text-sm font-medium">{(conversionRate * 100).toFixed(2)}%</div>
              </div>
              <Progress value={conversionRate * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="programs" className="w-full">
        <TabsList>
          <TabsTrigger value="programs">Programmes</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="links">Liens d&apos;affiliation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="programs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Programmes d&apos;affiliation</CardTitle>
              <CardDescription>
                {programs.length} programme{programs.length !== 1 ? 's' : ''} actif{programs.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {programs.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>Aucun programme associé à cet affilié</p>
                  <Button variant="outline" className="mt-4" onClick={() => router.push(`/marketing/affiliation/programs/new?affiliate=${affiliateId}`)}>
                    Ajouter un programme
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {programs.map((program) => (
                    <div 
                      key={program.id} 
                      className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-100 dark:border-gray-700"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{program.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Commission: {program.commission_rate}% • {program.conversions} conversions • {formatCurrency(program.earnings)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {program.status === 'active' && 'Actif'}
                          {program.status === 'paused' && 'En pause'}
                          {program.status === 'ended' && 'Terminé'}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/marketing/affiliation/programs/${program.id}`)}>
                          Voir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des transactions</CardTitle>
              <CardDescription>Commissions et paiements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>Fonctionnalité à venir</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="links" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Liens d&apos;affiliation</CardTitle>
              <CardDescription>Liens et codes de suivi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>Fonctionnalité à venir</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
