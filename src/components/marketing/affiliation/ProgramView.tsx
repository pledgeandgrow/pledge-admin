'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Calendar, 
  Edit, 
  ArrowLeft,
  Clock,
  Percent
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
// Supabase client will be used in future implementations
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { AffiliateContact } from './AffiliateView';
import useContacts from '@/hooks/useContacts';

// Program types
type ProgramStatus = 'active' | 'draft' | 'paused' | 'ended';
type CommissionType = 'percentage' | 'fixed' | 'tiered' | 'recurring';

interface Program {
  id: string;
  name: string;
  description?: string;
  status: ProgramStatus;
  start_date: string;
  end_date?: string;
  commission: {
    type: CommissionType;
    value: number; // Percentage or fixed amount
    tiers?: {
      threshold: number;
      value: number;
    }[];
    cookie_days: number; // Tracking cookie duration in days
  };
  products?: string[]; // Array of product IDs
  terms_conditions?: string;
  requirements?: string;
  total_affiliates?: number;
  total_sales?: number;
  total_commissions_paid?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  metadata?: Record<string, unknown>;
}

interface ProgramViewProps {
  programId: string;
}

export function ProgramView({ programId }: ProgramViewProps): React.ReactElement {
  // Supabase client will be used in future implementations
  const router = useRouter();
  const [program, setProgram] = useState<Program | null>(null);
  const [affiliates, setAffiliates] = useState<AffiliateContact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Use the useContacts hook to fetch affiliate data
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

  useEffect(() => {
    const fetchProgramData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // For now, we'll mock the program data
        // In a real implementation, this would come from a Supabase table
        const mockProgram: Program = {
          id: programId,
          name: programId === 'prog-1' ? 'Programme de parrainage standard' : 'Programme VIP',
          description: 'Programme d\'affiliation pour les produits et services de notre entreprise.',
          status: 'active',
          start_date: '2025-01-01',
          commission: {
            type: 'percentage',
            value: programId === 'prog-1' ? 10 : 15,
            cookie_days: 30
          },
          total_affiliates: programId === 'prog-1' ? 24 : 8,
          total_sales: programId === 'prog-1' ? 4500 : 1800,
          total_commissions_paid: programId === 'prog-1' ? 450 : 270,
          created_at: '2024-12-15',
          terms_conditions: 'Les commissions sont versées 30 jours après la validation de la vente.',
          requirements: 'Avoir un site web ou une présence sur les réseaux sociaux avec au moins 1000 abonnés.'
        };
        
        setProgram(mockProgram);
        
        // Fetch affiliates associated with this program
        await fetchContacts({
          search: '',
          tags: ['affiliate']
        });
        
      } catch (err) {
        console.error('Error in fetchProgramData:', err);
        setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (programId) {
      fetchProgramData();
    }
  }, [programId, fetchContacts]);

  // Filter affiliates for this program when contacts are loaded
  useEffect(() => {
    if (!contactsLoading && affiliateContacts.length > 0 && program) {
      // In a real implementation, we would filter contacts based on program association
      // For now, we'll just take the first few contacts as a mock
      const mockProgramAffiliates = affiliateContacts.slice(0, program.id === 'prog-1' ? 3 : 1);
      
      // Ensure metadata is initialized for each affiliate
      const affiliatesWithMetadata = mockProgramAffiliates.map(contact => ({
        ...contact,
        metadata: contact.metadata || {}
      })) as AffiliateContact[];
      
      setAffiliates(affiliatesWithMetadata);
    }
  }, [program, affiliateContacts, contactsLoading]);

  // Handle loading and error states
  if (loading || contactsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Chargement des données du programme...</p>
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

  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Programme non trouvé</p>
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

  // Helper function to get status color
  const getStatusColor = (status: ProgramStatus): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      case 'paused':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'ended':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  // Extract program data
  const {
    name,
    description,
    status,
    start_date,
    end_date,
    commission,
    terms_conditions,
    requirements,
    total_affiliates,
    total_sales,
    total_commissions_paid,
    created_at
  } = program;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-muted-foreground">Détails du programme d&apos;affiliation</p>
          <p className="text-gray-500 dark:text-gray-400">
            Détails et performances du programme
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour &agrave; la liste
          </Button>
          <Button onClick={() => router.push(`/marketing/affiliation/programs/${programId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>{name}</CardTitle>
              <Badge className={getStatusColor(status)}>
                {status === 'active' && 'Actif'}
                {status === 'draft' && 'Brouillon'}
                {status === 'paused' && 'En pause'}
                {status === 'ended' && 'Terminé'}
              </Badge>
            </div>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>
                  Début: {start_date ? format(parseISO(start_date), 'dd MMMM yyyy', { locale: fr }) : 'Non défini'}
                  {end_date && ` • Fin: ${format(parseISO(end_date), 'dd MMMM yyyy', { locale: fr })}`}
                </span>
              </div>
              
              <div className="flex items-center">
                <Percent className="h-4 w-4 mr-2 text-gray-500" />
                <span>
                  Commission: {commission.type === 'percentage' ? `${commission.value}%` : formatCurrency(commission.value)}
                  {commission.cookie_days && ` • Cookie: ${commission.cookie_days} jours`}
                </span>
              </div>
              
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-gray-500" />
                <span>{total_affiliates || 0} affiliés</span>
              </div>
              
              {created_at && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Créé le {format(parseISO(created_at), 'dd MMMM yyyy', { locale: fr })}</span>
                </div>
              )}
            </div>
            
            <Separator />
            
            {requirements && (
              <>
                <div>
                  <h3 className="text-sm font-medium mb-2">Conditions requises</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{requirements}</p>
                </div>
                <Separator />
              </>
            )}
            
            {terms_conditions && (
              <div>
                <h3 className="text-sm font-medium mb-2">Termes et conditions</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{terms_conditions}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Statistiques et métriques de performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="text-sm text-gray-500 dark:text-gray-400">Ventes totales</div>
                <div className="text-2xl font-bold">{formatCurrency(total_sales)}</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="text-sm text-gray-500 dark:text-gray-400">Commissions versées</div>
                <div className="text-2xl font-bold">{formatCurrency(total_commissions_paid)}</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="text-sm text-gray-500 dark:text-gray-400">Taux de commission</div>
                <div className="text-2xl font-bold">
                  {commission.type === 'percentage' ? `${commission.value}%` : formatCurrency(commission.value)}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">Progression des objectifs</div>
                <div className="text-sm font-medium">75%</div>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="affiliates" className="w-full">
        <TabsList>
          <TabsTrigger value="affiliates">Affiliés</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="affiliates" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Affiliés associés</CardTitle>
              <CardDescription>
                {affiliates.length} affilié{affiliates.length !== 1 ? 's' : ''} dans ce programme
              </CardDescription>
            </CardHeader>
            <CardContent>
              {affiliates.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>Aucun affilié associé à ce programme</p>
                  <Button variant="outline" className="mt-4" onClick={() => router.push(`/marketing/affiliation/affiliates/new?program=${programId}`)}>
                    Ajouter un affilié
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {affiliates.map((affiliate) => (
                    <div 
                      key={affiliate.id} 
                      className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex items-center">
                        <div className="mr-4">
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            {affiliate.first_name?.[0]}{affiliate.last_name?.[0]}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {affiliate.first_name} {affiliate.last_name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {affiliate.email} • {affiliate.metadata?.total_conversions || 0} conversions
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/marketing/affiliation/affiliates/${affiliate.id}`)}>
                        Voir
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Produits associés</CardTitle>
              <CardDescription>Produits inclus dans ce programme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>Fonctionnalité à venir</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="commissions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des commissions</CardTitle>
              <CardDescription>Commissions générées par ce programme</CardDescription>
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
