'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Edit, 
  ArrowLeft,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AmbassadeurProfile, AmbassadeurContact } from './AmbassadeurProfile';
import { Campaign } from '@/types/data';
import { useRouter } from 'next/navigation';
import { useRealtimeContacts } from '@/hooks/useRealtimeContacts';
import { Contact } from '@/types/contact';
import { useCampaigns } from '@/hooks/useCampaigns';

export function AmbassadorView(): React.ReactElement {
  const router = useRouter();
  
  // Use the realtime contacts hook to get network contacts that are ambassadeurs
  const {
    contacts,
    loading,
    error,
  } = useRealtimeContacts({
    type: 'network',
    initialFilters: { tags: ['ambassadeur'] },
    autoFetch: true
  });

  // Use the campaigns hook to get all campaigns
  const { campaigns } = useCampaigns();

  // State for selected ambassador and their campaigns
  const [selectedAmbassadorId, setSelectedAmbassadorId] = useState<string | null>(null);
  const [ambassador, setAmbassador] = useState<AmbassadeurContact | null>(null);
  const [ambassadorCampaigns, setAmbassadorCampaigns] = useState<Campaign[]>([]);

  // Select first ambassador when contacts load
  useEffect(() => {
    if (contacts && contacts.length > 0 && !selectedAmbassadorId) {
      setSelectedAmbassadorId(contacts[0].id);
    }
  }, [contacts, selectedAmbassadorId]);

  // Update selected ambassador when ID changes
  useEffect(() => {
    if (selectedAmbassadorId && contacts) {
      const selectedContact = contacts.find(contact => contact.id === selectedAmbassadorId);
      if (selectedContact) {
        setAmbassador(selectedContact as AmbassadeurContact);
      }
    }
  }, [selectedAmbassadorId, contacts]);

  // Filter campaigns for the selected ambassador
  useEffect(() => {
    if (ambassador && campaigns) {
      const filteredCampaigns = campaigns.filter(campaign => 
        campaign.ambassadeurs?.includes(ambassador.id)
      );
      setAmbassadorCampaigns(filteredCampaigns);
    } else {
      setAmbassadorCampaigns([]);
    }
  }, [ambassador, campaigns]);

  // Handle selecting an ambassador from dropdown
  const handleSelectAmbassador = useCallback((id: string) => {
    setSelectedAmbassadorId(id);
  }, []);

  // Navigation handlers
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleEdit = useCallback(() => {
    if (ambassador) {
      router.push(`/marketing/ambassadeur/edit/${ambassador.id}`);
    }
  }, [ambassador, router]);

  // Removed unused handleDelete function

  // Helper function for status badge colors
  const getStatusColor = useCallback((status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
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
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <h3 className="text-red-800 dark:text-red-300 font-medium">Erreur</h3>
        <p className="text-red-700 dark:text-red-200">
          {error instanceof Error ? error.message : 'Une erreur est survenue lors du chargement des données'}
        </p>
        <Button onClick={() => window.location.reload()} className="mt-2" variant="outline">
          Réessayer
        </Button>
      </div>
    );
  }

  if (!ambassador) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>Aucun ambassadeur trouvé</p>
        <Button className="mt-4" variant="outline" onClick={() => router.push('/marketing/ambassadeur/new')}>
          Créer un ambassadeur
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button and actions */}
      <div className="flex items-center justify-between">
        <Button onClick={handleBack} variant="outline" className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        <Button onClick={handleEdit} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 gap-1">
          <Edit className="h-4 w-4" /> Modifier
        </Button>
      </div>
      
      {/* Ambassador selection dropdown if we have multiple ambassadors */}
      {contacts && contacts.length > 1 && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Ambassadeur:</span>
          <select 
            className="border border-gray-300 rounded-md p-1 text-sm"
            value={selectedAmbassadorId || ''}
            onChange={(e) => handleSelectAmbassador(e.target.value)}
          >
            {contacts.map((contact: Contact) => (
              <option key={contact.id} value={contact.id}>
                {`${contact.first_name} ${contact.last_name}`}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Ambassador header card */}
      <Card className="border dark:border-gray-700">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                {`${ambassador.first_name} ${ambassador.last_name}`}
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400 mt-1">
                {ambassador.position || 'Ambassadeur'} {ambassador.company ? `chez ${ambassador.company}` : ''}
              </CardDescription>
            </div>
            <Badge className={`${getStatusColor(ambassador.status)} px-3 py-1`}>
              {ambassador.status === 'active' ? 'Actif' : 
               ambassador.status === 'inactive' ? 'Inactif' : 
               ambassador.status === 'pending' ? 'En attente' : 
               ambassador.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Tabs defaultValue="profile">
                <TabsList className="mb-4 bg-gray-100 dark:bg-gray-800">
                  <TabsTrigger value="profile">Profil</TabsTrigger>
                  <TabsTrigger value="campaigns">Campagnes ({ambassadorCampaigns.length})</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="space-y-4">
                  {ambassador && (
                    <AmbassadeurProfile ambassadeurId={ambassador.id} />
                  )}
                </TabsContent>
                
                <TabsContent value="campaigns" className="space-y-4">
                  {ambassadorCampaigns.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Aucune campagne associée à cet ambassadeur</p>
                      <Button className="mt-4" variant="outline">
                        Assigner une campagne
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {ambassadorCampaigns.map((campaign: Campaign) => (
                        <Card key={campaign.id} className="overflow-hidden border-gray-200 dark:border-gray-700">
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium text-gray-900 dark:text-white">{campaign.name}</h3>
                              <Badge className={campaign.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'}>
                                {campaign.status === 'active' ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{campaign.description}</p>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center text-gray-500 dark:text-gray-400">
                                <span>Début: {format(parseISO(campaign.start_date), 'dd MMM yyyy', { locale: fr })}</span>
                                <span className="mx-2">•</span>
                                <span>Fin: {campaign.end_date ? format(parseISO(campaign.end_date), 'dd MMM yyyy', { locale: fr }) : 'En cours'}</span>
                              </div>
                              <div className="flex items-center">
                                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-600 dark:text-green-400 font-medium">
                                  {campaign.kpis?.conversions || 0} conversions
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="performance" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Statistiques de performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Conversions</div>
                          <div className="text-2xl font-bold mt-1">
                            {ambassador.metadata?.performance?.conversions || 0}
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Taux d&apos;engagement</div>
                          <div className="text-2xl font-bold mt-1">
                            {ambassador.metadata?.performance?.engagement || '0%'}
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Portée</div>
                          <div className="text-2xl font-bold mt-1">
                            {ambassador.metadata?.performance?.reach?.toLocaleString() || 0}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-medium mb-3">Évolution des performances</h4>
                        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-center">
                            <BarChart3 className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                              Les données de performance détaillées seront disponibles prochainement
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AmbassadorView;
