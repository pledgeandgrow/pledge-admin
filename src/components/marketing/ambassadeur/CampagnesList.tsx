'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Tabs components removed - not used
// Dialog components removed - not used
// Calendar removed - not used
// Popover components removed - not used
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Campaign, CampaignObjective, CampaignStatus, CampaignType } from '@/types/data';
import useCampaigns from '@/hooks/useCampaigns';
import { CampagneForm } from '@/components/marketing/ambassadeur/CampagneForm';

export function CampagnesList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<CampaignType | ''>('');
  const [objectiveFilter, setObjectiveFilter] = useState<CampaignObjective | ''>('');
  const [dateFilter, setDateFilter] = useState<'active' | 'upcoming' | 'past' | ''>('');

  const { 
    campaigns, 
    loading, 
    fetchCampaigns, 
    createCampaign, 
    updateCampaign 
    // deleteCampaign removed - not used
  } = useCampaigns({
    status: statusFilter as CampaignStatus || undefined,
    type: typeFilter as CampaignType || undefined,
    objective: objectiveFilter as CampaignObjective || undefined,
    search: searchTerm || undefined,
  });

  useEffect(() => {
    fetchCampaigns();
  }, [statusFilter, typeFilter, objectiveFilter, searchTerm, fetchCampaigns]);

  const handleCreateCampaign = async (campaign: Campaign) => {
    await createCampaign(campaign);
    setIsFormOpen(false);
  };

  const handleUpdateCampaign = async (campaign: Campaign) => {
    if (campaign.id) {
      await updateCampaign(campaign.id, campaign);
      setIsFormOpen(false);
      setEditCampaign(null);
    }
  };

  const handleEditClick = (campaign: Campaign) => {
    setEditCampaign(campaign);
    setIsFormOpen(true);
  };

  const getStatusColor = (status: CampaignStatus) => {
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

  const getObjectiveIcon = (objective: CampaignObjective) => {
    switch (objective) {
      case 'awareness':
        return '👁️';
      case 'consideration':
        return '🤔';
      case 'conversion':
        return '💰';
      case 'acquisition':
        return '🔄';
      case 'loyalty':
        return '❤️';
      case 'advocacy':
        return '📣';
      default:
        return '📊';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd MMM yyyy', { locale: fr });
    } catch {
      return 'Date invalide';
    }
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(budget);
  };

  const calculateBudgetUsage = (campaign: Campaign) => {
    if (!campaign.budget || campaign.budget === 0) return 0;
    return Math.round(((campaign.spent || 0) / campaign.budget) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Campagnes</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {campaigns.length} campagne{campaigns.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditCampaign(null);
            setIsFormOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Nouvelle Campagne
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Rechercher..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as CampaignStatus | '')}>
          <SelectTrigger>
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les statuts</SelectItem>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="planned">Planifiée</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">En pause</SelectItem>
            <SelectItem value="completed">Terminée</SelectItem>
            <SelectItem value="cancelled">Annulée</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as CampaignType | '')}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les types</SelectItem>
            <SelectItem value="ambassador">Ambassadeur</SelectItem>
            <SelectItem value="referral">Parrainage</SelectItem>
            <SelectItem value="influencer">Influenceur</SelectItem>
            <SelectItem value="social">Réseaux sociaux</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="content">Contenu</SelectItem>
            <SelectItem value="event">Événement</SelectItem>
            <SelectItem value="other">Autre</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={objectiveFilter} onValueChange={(value) => setObjectiveFilter(value as CampaignObjective | '')}>
          <SelectTrigger>
            <SelectValue placeholder="Objectif" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les objectifs</SelectItem>
            <SelectItem value="awareness">Notoriété</SelectItem>
            <SelectItem value="consideration">Considération</SelectItem>
            <SelectItem value="conversion">Conversion</SelectItem>
            <SelectItem value="acquisition">Acquisition</SelectItem>
            <SelectItem value="loyalty">Fidélisation</SelectItem>
            <SelectItem value="advocacy">Recommandation</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as 'active' | 'upcoming' | 'past' | '')}>
          <SelectTrigger>
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les périodes</SelectItem>
            <SelectItem value="active">En cours</SelectItem>
            <SelectItem value="upcoming">À venir</SelectItem>
            <SelectItem value="past">Passées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaign List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-md border border-gray-100 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Aucune campagne trouvée</p>
          <Button 
            onClick={() => {
              setEditCampaign(null);
              setIsFormOpen(true);
            }}
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" /> Créer une campagne
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge className={cn("font-normal", getStatusColor(campaign.status))}>
                    {campaign.status === 'draft' && 'Brouillon'}
                    {campaign.status === 'planned' && 'Planifiée'}
                    {campaign.status === 'active' && 'Active'}
                    {campaign.status === 'paused' && 'En pause'}
                    {campaign.status === 'completed' && 'Terminée'}
                    {campaign.status === 'cancelled' && 'Annulée'}
                  </Badge>
                  <Badge variant="outline" className="font-normal">
                    {campaign.campaign_type === 'ambassador' && 'Ambassadeur'}
                    {campaign.campaign_type === 'referral' && 'Parrainage'}
                    {campaign.campaign_type === 'influencer' && 'Influenceur'}
                    {campaign.campaign_type === 'social' && 'Réseaux sociaux'}
                    {campaign.campaign_type === 'email' && 'Email'}
                    {campaign.campaign_type === 'content' && 'Contenu'}
                    {campaign.campaign_type === 'event' && 'Événement'}
                    {campaign.campaign_type === 'other' && 'Autre'}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
                  {campaign.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-gray-500 dark:text-gray-400">
                  {campaign.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Objectif:</span>
                    <span className="font-medium text-gray-900 dark:text-white flex items-center">
                      <span className="mr-1">{getObjectiveIcon(campaign.objective)}</span>
                      {campaign.objective === 'awareness' && 'Notoriété'}
                      {campaign.objective === 'consideration' && 'Considération'}
                      {campaign.objective === 'conversion' && 'Conversion'}
                      {campaign.objective === 'acquisition' && 'Acquisition'}
                      {campaign.objective === 'loyalty' && 'Fidélisation'}
                      {campaign.objective === 'advocacy' && 'Recommandation'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Période:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {campaign.start_date && formatDate(campaign.start_date)} - {campaign.end_date && formatDate(campaign.end_date)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Budget:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatBudget(campaign.budget || 0)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Dépensé:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatBudget(campaign.spent || 0)} ({calculateBudgetUsage(campaign)}%)
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Ambassadeurs:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {campaign.ambassadeurs?.length || 0}
                    </span>
                  </div>
                  
                  {campaign.kpis && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md text-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Conversions</div>
                        <div className="font-medium text-gray-900 dark:text-white">{campaign.kpis.conversions}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md text-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Engagement</div>
                        <div className="font-medium text-gray-900 dark:text-white">{campaign.kpis.engagement}%</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md text-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Portée</div>
                        <div className="font-medium text-gray-900 dark:text-white">{(campaign.kpis.reach || 0).toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleEditClick(campaign)}
                >
                  Gérer la campagne
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Campaign Form Dialog */}
      <CampagneForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditCampaign(null);
        }}
        onSubmit={editCampaign ? handleUpdateCampaign : handleCreateCampaign}
        initialData={editCampaign || undefined}
        isEdit={!!editCampaign}
      />
    </div>
  );
}

export default CampagnesList;
