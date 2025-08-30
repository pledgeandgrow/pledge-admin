'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  Users, 
  Mail, 
  Phone, 
  Briefcase, 
  Instagram, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Edit, 
  Trash2,
  TrendingUp,
  Share2
} from 'lucide-react';
import { NetworkContact } from '@/types/contact';
import { Campaign } from '@/types/data';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { createClient } from '@/lib/supabase';
import { PerformanceMetrics, formatMetricValue, calculateTrend, formatTrend } from './PerformanceMetrics';
import { useRealtimeContacts } from '@/hooks/useRealtimeContacts';
import { useRouter } from 'next/navigation';

// Extended NetworkContact interface with additional metadata for ambassadeurs
export interface AmbassadeurContact extends NetworkContact {
  metadata: {
    connection_strength?: number;
    category?: string;
    avatar?: string;
    socialMedia?: {
      instagram?: string;
      twitter?: string;
      facebook?: string;
      linkedin?: string;
      followers?: number;
    };
    performance?: {
      conversions?: number;
      engagement?: string;
      reach?: number;
      leads?: number;
      roi?: number;
      ctr?: number;
      cost?: number;
      impressions?: number;
    };
  };
}

// Using PerformanceMetrics interface imported from './PerformanceMetrics'

interface AmbassadeurProfileProps {
  ambassadeurId: string;
}

export function AmbassadeurProfile({ ambassadeurId }: AmbassadeurProfileProps): React.ReactElement {
  // Return early with loading or error states, ensuring the function always returns a ReactElement
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState<boolean>(false);
  const [campaignsLoaded, setCampaignsLoaded] = useState<boolean>(false);
  const supabase = createClient();
  const router = useRouter();
  
  // Use the realtime contacts hook to get the specific ambassador
  const {
    contacts,
    loading,
    error
  } = useRealtimeContacts({
    type: 'network',
    autoFetch: true
  });
  
  // Filter contacts to find the specific ambassador
  useEffect(() => {
    if (contacts && contacts.length > 0) {
      const foundAmbassador = contacts.find(contact => contact.id === ambassadeurId);
      if (foundAmbassador) {
        setAmbassadeur(foundAmbassador as AmbassadeurContact);
      }
    }
  }, [contacts, ambassadeurId]);
  
  // Get the ambassador from contacts
  const [ambassadeur, setAmbassadeur] = useState<AmbassadeurContact | null>(null);
  
  // This effect is now handled above
  
  // Handle edit and delete actions
  const handleEdit = useCallback(() => {
    if (ambassadeur) {
      router.push(`/marketing/ambassadeur/edit/${ambassadeur.id}`);
    }
  }, [ambassadeur, router]);
  
  const handleDelete = useCallback(() => {
    // Delete action would be implemented here
    if (ambassadeur) {
      // For now, just navigate back to the list
      router.push('/marketing/ambassadeur');
    }
  }, [ambassadeur, router]);

  // Format date helper function
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Non définie";
    try {
      return format(parseISO(dateString), "d MMMM yyyy", { locale: fr });
    } catch {
      return "Format de date invalide";
    }
  };

  // Helper function to get status badge color
  const getStatusBadgeColor = (status: string | undefined): string => {
    if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'paused':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Helper function to get category badge color
  const getCategoryBadgeColor = (category: string | undefined): string => {
    if (!category) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    
    switch (category.toLowerCase()) {
      case 'influenceur':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'client fidèle':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'expert métier':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'partenaire':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Helper function to render connection strength
  const renderConnectionStrength = (strength: number | undefined): React.ReactElement => {
    const maxStrength = 5;
    const strengthValue = strength || 0;
    
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: maxStrength }).map((_, index) => (
          <div 
            key={index}
            className={`h-2 w-8 rounded ${
              index < strengthValue 
                ? 'bg-blue-500' 
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {strengthValue}/5
        </span>
      </div>
    );
  };

  // Generate metrics from contact metadata
  const generateMetricsFromContactData = useCallback(() => {
    if (!ambassadeur?.metadata?.performance) {
      setPerformanceMetrics([]);
      return;
    }
    
    // Create a single performance metric from contact metadata
    const currentMonth = new Date().toISOString().substring(0, 7); // Format: YYYY-MM
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const metrics: PerformanceMetrics = {
      period: currentMonth,
      conversions: ambassadeur.metadata?.performance?.conversions || 0,
      engagement_rate: parseFloat(ambassadeur.metadata?.performance?.engagement?.replace('%', '') || '0'),
      reach: ambassadeur.metadata?.performance?.reach || 0,
      leads: ambassadeur.metadata?.performance?.leads || 0,
      cost: ambassadeur.metadata?.performance?.cost || 0, // Use cost from metadata or default to 0
      source: 'contact',
      date_range: {
        start: firstDayOfMonth.toISOString().split('T')[0],
        end: lastDayOfMonth.toISOString().split('T')[0]
      }
    };
    
    setPerformanceMetrics([metrics]);
  }, [ambassadeur?.metadata?.performance]);  // Removed unnecessary setPerformanceMetrics dependency

  // Generate metrics from campaign data
  const generateMetricsFromCampaigns = useCallback((campaignData: Campaign[]): PerformanceMetrics[] => {
    if (!campaignData || campaignData.length === 0) {
      return [];
    }
    
    // Group campaigns by month
    const metricsByMonth = new Map<string, PerformanceMetrics>();
    
    campaignData.forEach(campaign => {
      if (!campaign.kpis) return;
      
      // Extract month from campaign start date or use current month
      const campaignMonth = campaign.start_date 
        ? campaign.start_date.substring(0, 7) // Format: YYYY-MM
        : new Date().toISOString().substring(0, 7);
      
      // Get or create metrics for this month
      let monthMetrics = metricsByMonth.get(campaignMonth) || {
        period: campaignMonth,
        conversions: 0,
        engagement_rate: 0,
        reach: 0,
        leads: 0,
        cost: 0,
        source: 'campaign',
        date_range: {
          start: campaign.start_date || '',
          end: campaign.end_date || ''
        }
      };
      
      // Add campaign metrics to month total
      monthMetrics.conversions += campaign.kpis.conversions || 0;
      // Use engagement instead of engagement_rate which doesn't exist in the kpis type
      monthMetrics.engagement_rate += campaign.kpis.engagement || 0;
      monthMetrics.reach += campaign.kpis.reach || 0;
      monthMetrics.leads += campaign.kpis.leads || 0;
      monthMetrics.cost += campaign.kpis.cost || 0;
      
      // Update the map
      metricsByMonth.set(campaignMonth, monthMetrics);
    });
    
    // Convert map to array and sort by period
    return Array.from(metricsByMonth.values())
      .sort((a, b) => a.period.localeCompare(b.period));
  }, []);

  // Fetch performance metrics from campaigns and contact metadata
  const fetchCampaignData = useCallback(async () => {
    if (!ambassadeur?.id) return;
    
    setIsLoadingMetrics(true);
    try {
      // Fetch campaigns where this ambassador is involved
      const { data: campaignData, error } = await supabase
        .from('campaigns')
        .select('*')
        .contains('ambassadeurs', [ambassadeur.id]);
        
      if (error) {
        console.error('Error fetching campaign data:', error);
        // Fall back to contact metadata only
        generateMetricsFromContactData();
        setIsLoadingMetrics(false);
        return;
      }
      
      if (campaignData && campaignData.length > 0) {
        setCampaignsLoaded(true);
        const metricsFromCampaigns = generateMetricsFromCampaigns(campaignData);
        setPerformanceMetrics(metricsFromCampaigns);
      } else {
        // No campaigns found, use contact metadata
        generateMetricsFromContactData();
      }
    } catch (err) {
      console.error('Failed to fetch campaign data:', err);
      generateMetricsFromContactData();
    } finally {
      setIsLoadingMetrics(false);
    }
  }, [ambassadeur, generateMetricsFromContactData, generateMetricsFromCampaigns, supabase]);
  
  // Initial fetch on component mount
  useEffect(() => {
    if (ambassadeur && ambassadeur.id) {
      fetchCampaignData();
    }
  }, [ambassadeur, fetchCampaignData]);
  
  // ... rest of the code remains the same ...

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-500">Chargement des données...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <h3 className="text-red-800 dark:text-red-300 font-medium">Erreur</h3>
            <p className="text-red-700 dark:text-red-200">
              {error instanceof Error ? error.message : 'Une erreur est survenue lors du chargement des données'}
            </p>
            <Button onClick={() => window.location.reload()} className="mt-2" variant="outline">
              Réessayer
            </Button>
          </div>
          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informations de contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            </div>
          </div>
          <Separator />

        {/* Social Media */}
        {ambassadeur && ambassadeur.metadata && ambassadeur.metadata.socialMedia && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Réseaux sociaux</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ambassadeur.metadata.socialMedia.instagram && (
                <div className="flex items-center gap-2">
                  <Instagram className="h-5 w-5 text-pink-500" />
                  <a href={ambassadeur.metadata.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                    Instagram
                  </a>
                </div>
              )}
              {ambassadeur.metadata.socialMedia.twitter && (
                <div className="flex items-center gap-2">
                  <Twitter className="h-5 w-5 text-blue-400" />
                  <a href={ambassadeur.metadata.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                    Twitter
                  </a>
                </div>
              )}
              {ambassadeur.metadata.socialMedia.facebook && (
                <div className="flex items-center gap-2">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <a href={ambassadeur.metadata.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                    Facebook
                  </a>
                </div>
              )}
              {ambassadeur.metadata.socialMedia.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="h-5 w-5 text-blue-700" />
                  <a href={ambassadeur.metadata.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                    LinkedIn
                  </a>
                </div>
              )}
            </div>
            {ambassadeur?.metadata?.socialMedia?.followers !== undefined && (
              <div className="mt-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white font-medium">
                  {ambassadeur.metadata.socialMedia.followers.toLocaleString()} followers
                </span>
              </div>
            )}
            </div>
          )}

          <Separator />

          {/* Performance Metrics */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                Métriques de performance
              </h3>
              {campaignsLoaded && (
                <Button variant="outline" size="sm" onClick={() => fetchCampaignData()} className="text-xs">
                  Rafraîchir les données
                </Button>
              )}
            </div>

            {isLoadingMetrics ? (
              <div className="h-40 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : campaignsLoaded && performanceMetrics.length > 0 ? (
              // Render metrics from Supabase
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border border-gray-100 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Conversions (Dernier mois)</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                      {formatMetricValue(performanceMetrics[0].conversions, 'number')}
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                      {performanceMetrics.length > 1 ? (
                        performanceMetrics[0].conversions >= performanceMetrics[1].conversions ? (
                          <span className="text-green-500 flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            {formatTrend(calculateTrend(performanceMetrics[0].conversions, performanceMetrics[1].conversions))}
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
                            {formatTrend(calculateTrend(performanceMetrics[0].conversions, performanceMetrics[1].conversions))}
                          </span>
                        )
                      ) : null}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border border-gray-100 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Taux d&apos;engagement</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                      {formatMetricValue(performanceMetrics[0].engagement_rate, 'percentage')}
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                      {performanceMetrics.length > 1 ? (
                        performanceMetrics[0].engagement_rate >= performanceMetrics[1].engagement_rate ? (
                          <span className="text-green-500 flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            {formatTrend(calculateTrend(performanceMetrics[0].engagement_rate, performanceMetrics[1].engagement_rate))}
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
                            {formatTrend(calculateTrend(performanceMetrics[0].engagement_rate, performanceMetrics[1].engagement_rate))}
                          </span>
                        )
                      ) : null}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border border-gray-100 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Portée</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                      {formatMetricValue(performanceMetrics[0].reach, 'number')}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Évolution des conversions</h4>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border border-gray-100 dark:border-gray-700 h-60 flex items-end justify-between gap-2">
                    {performanceMetrics.slice().reverse().map((metric, index) => {
                      const maxConversion = Math.max(...performanceMetrics.map(m => m.conversions));
                      const height = maxConversion > 0 ? (metric.conversions / maxConversion) * 100 : 0;
                      
                      return (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div 
                            className="w-full bg-blue-500 rounded-t-sm" 
                            style={{ height: `${Math.max(height, 5)}%` }}
                          ></div>
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate w-full text-center">
                            {metric.period}
                          </div>
                          <div className="text-xs font-medium text-gray-900 dark:text-white">
                            {formatMetricValue(metric.conversions, 'number')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              // Fallback to metadata performance
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border border-gray-100 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Conversions</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                      {formatMetricValue(ambassadeur?.metadata?.performance?.conversions || 0, 'number')}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border border-gray-100 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Taux d&apos;engagement</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                      {ambassadeur?.metadata?.performance?.engagement || formatMetricValue(0, 'percentage')}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border border-gray-100 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Portée</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                      {formatMetricValue(ambassadeur?.metadata?.performance?.reach || 0, 'number')}
                    </div>
                  </div>
                </div>

                {!campaignsLoaded && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-sm">
                    <p className="font-medium">Aucune campagne trouvée</p>
                    <p className="mt-1">Les métriques de performance avancées seront disponibles une fois que cet ambassadeur sera associé à des campagnes.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Connection Strength */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              Force de la relation
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border border-gray-100 dark:border-gray-700">
              {ambassadeur && renderConnectionStrength(ambassadeur.metadata?.connection_strength)}
            </div>
          </div>
        </CardContent>
      </Card>
    );
}
