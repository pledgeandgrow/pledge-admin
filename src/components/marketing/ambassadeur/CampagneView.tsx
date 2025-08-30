'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3,
  Users,
  Calendar, 
  Edit, 
  ArrowLeft,
  DollarSign,
  Tag,
  Megaphone,
  User
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { createClient } from '@/lib/supabase';
import { Campaign } from '@/types/data';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { AmbassadeurContact } from './AmbassadeurProfile';
import { formatMetricValue, calculateTrend, formatTrend } from './PerformanceMetrics';

interface CampagneViewProps {
  campaignId: string;
}

export function CampagneView({ campaignId }: CampagneViewProps): React.ReactElement {
  const supabase = createClient();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [ambassadors, setAmbassadors] = useState<AmbassadeurContact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaignData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch campaign data
        const { data: campaignData, error: campaignError } = await supabase
          .from('campaigns')
          .select('*')
          .eq('id', campaignId)
          .single();

        if (campaignError) {
          throw new Error(`Error fetching campaign: ${campaignError.message}`);
        }

        if (!campaignData) {
          throw new Error('Campaign not found');
        }

        setCampaign(campaignData as Campaign);

        // Fetch ambassadors associated with this campaign
        if (campaignData.ambassadeurs && campaignData.ambassadeurs.length > 0) {
          const { data: ambassadorData, error: ambassadorError } = await supabase
            .from('contacts')
            .select('*')
            .in('id', campaignData.ambassadeurs)
            .eq('type', 'network')
            .contains('tags', ['ambassadeur']);

          if (ambassadorError) {
            console.error('Error fetching ambassadors:', ambassadorError);
          } else {
            setAmbassadors(ambassadorData as AmbassadeurContact[] || []);
          }
        }
      } catch (err) {
        console.error('Error in fetchCampaignData:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchCampaignData();
    }
  }, [campaignId, supabase]);

  const handleEdit = () => {
    // Navigate to edit page or open edit modal
    console.log('Edit campaign:', campaignId);
  };

  const handleBack = () => {
    router.back();
  };

  // Calculate campaign progress
  const calculateProgress = () => {
    if (!campaign || !campaign.start_date || !campaign.end_date) return 0;
    
    const startDate = new Date(campaign.start_date).getTime();
    const endDate = new Date(campaign.end_date).getTime();
    const currentDate = new Date().getTime();
    
    if (currentDate <= startDate) return 0;
    if (currentDate >= endDate) return 100;
    
    const totalDuration = endDate - startDate;
    const elapsedDuration = currentDate - startDate;
    return Math.round((elapsedDuration / totalDuration) * 100);
  };

  // Format budget as currency
  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-100 dark:border-red-800 text-red-800 dark:text-red-300">
        <p className="font-medium">Erreur</p>
        <p className="mt-1">{error || "Impossible de charger la campagne"}</p>
        <Button variant="outline" className="mt-4" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        </div>
      </div>

      {/* Campaign Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{campaign.name}</CardTitle>
              <CardDescription className="mt-2">
                {campaign.description || "Aucune description"}
              </CardDescription>
            </div>
            <Badge className={getStatusColor(campaign.status)}>
              {campaign.status === 'draft' && 'Brouillon'}
              {campaign.status === 'planned' && 'Planifiée'}
              {campaign.status === 'active' && 'Active'}
              {campaign.status === 'paused' && 'En pause'}
              {campaign.status === 'completed' && 'Terminée'}
              {campaign.status === 'cancelled' && 'Annulée'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Période
              </div>
              <div>
                {campaign.start_date && format(parseISO(campaign.start_date), 'dd MMM yyyy', { locale: fr })} - 
                {campaign.end_date && format(parseISO(campaign.end_date), 'dd MMM yyyy', { locale: fr })}
              </div>
              {campaign.status === 'active' && (
                <div className="mt-2">
                  <Progress value={progress} className="h-2" />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {progress}% complété
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Type & Objectif
              </div>
              <div>
                <Badge variant="outline" className="mr-2">
                  {campaign.campaign_type === 'ambassador' && 'Ambassadeur'}
                  {campaign.campaign_type === 'referral' && 'Parrainage'}
                  {campaign.campaign_type === 'influencer' && 'Influenceur'}
                  {campaign.campaign_type === 'social' && 'Réseaux sociaux'}
                  {campaign.campaign_type === 'email' && 'Email'}
                  {campaign.campaign_type === 'content' && 'Contenu'}
                  {campaign.campaign_type === 'event' && 'Événement'}
                  {campaign.campaign_type === 'other' && 'Autre'}
                </Badge>
                <Badge variant="outline">
                  {campaign.objective === 'awareness' && 'Notoriété'}
                  {campaign.objective === 'consideration' && 'Considération'}
                  {campaign.objective === 'conversion' && 'Conversion'}
                  {campaign.objective === 'loyalty' && 'Fidélisation'}
                  {(campaign.objective as string) === 'other' && 'Autre'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Budget
              </div>
              <div>
                {campaign.budget ? formatBudget(campaign.budget) : 'Non défini'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for additional information */}
      <Tabs defaultValue="metrics" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Métriques
          </TabsTrigger>
          <TabsTrigger value="ambassadors">
            <Users className="h-4 w-4 mr-2" />
            Ambassadeurs
          </TabsTrigger>
          <TabsTrigger value="details">
            <Megaphone className="h-4 w-4 mr-2" />
            Détails
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Métriques de performance</CardTitle>
              <CardDescription>
                Indicateurs clés de performance pour cette campagne
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {campaign.kpis && Object.entries(campaign.kpis).map(([key, value]) => {
                  const trend = calculateTrend(value as number, (value as number) * 0.8); // Simulated previous value for trend
                  return (
                    <Card key={key} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {key === 'impressions' && 'Impressions'}
                          {key === 'clicks' && 'Clics'}
                          {key === 'conversions' && 'Conversions'}
                          {key === 'reach' && 'Portée'}
                          {key === 'engagement' && 'Engagement'}
                          {key === 'ctr' && 'Taux de clic'}
                          {key === 'cost' && 'Coût'}
                          {key === 'roi' && 'ROI'}
                          {key === 'leads' && 'Leads'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-baseline justify-between">
                          <div className="text-2xl font-bold">
                            {formatMetricValue(key, typeof value === 'string' ? parseFloat(value) || 0 : value)}
                          </div>
                          <div className={`flex items-center text-xs ${trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {formatTrend(trend)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {(!campaign.kpis || Object.keys(campaign.kpis).length === 0) && (
                  <div className="col-span-4 text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>Aucune métrique disponible pour cette campagne</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ambassadors" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Ambassadeurs</CardTitle>
              <CardDescription>
                {ambassadors.length} ambassadeur{ambassadors.length !== 1 ? 's' : ''} associé{ambassadors.length !== 1 ? 's' : ''} à cette campagne
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ambassadors.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>Aucun ambassadeur associé à cette campagne</p>
                  <Button variant="outline" className="mt-4">
                    Ajouter un ambassadeur
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {ambassadors.map((ambassador) => (
                    <div 
                      key={ambassador.id} 
                      className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                            {ambassador.metadata?.avatar ? (
                              <Image 
                                src={ambassador.metadata.avatar as string} 
                                alt={`${ambassador.first_name} ${ambassador.last_name}`} 
                                className="h-full w-full object-cover"
                                width={40}
                                height={40}
                              />
                            ) : (
                              <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {ambassador.first_name} {ambassador.last_name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {ambassador.metadata?.category || 'Ambassadeur'}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => router.push(`/marketing/ambassadeur/${ambassador.id}`)}
                      >
                        Voir
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Détails de la campagne</CardTitle>
              <CardDescription>Informations complémentaires</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {campaign.metadata?.channels && Array.isArray(campaign.metadata.channels) && campaign.metadata.channels.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Canaux</h4>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(campaign.metadata?.channels) ? campaign.metadata.channels : []).map((channel: unknown, index: number) => (
                        <Badge key={index} variant="outline">
                          {typeof channel === 'string' ? channel : String(channel)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {campaign.metadata?.tags && Array.isArray(campaign.metadata.tags) && campaign.metadata.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(campaign.metadata?.tags) ? campaign.metadata.tags : []).map((tag: unknown, index: number) => (
                        <Badge key={index} variant="secondary">
                          {typeof tag === 'string' ? tag : String(tag)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {campaign.metadata?.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {typeof campaign.metadata.notes === 'string' ? campaign.metadata.notes : String(campaign.metadata.notes || '')}
                    </p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Informations système</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Créé le:</span>{' '}
                      {campaign.created_at && format(parseISO(campaign.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Dernière modification:</span>{' '}
                      {campaign.updated_at && format(parseISO(campaign.updated_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to get status color
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'planned':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'draft':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    case 'paused':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    case 'completed':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
};

export default CampagneView;
