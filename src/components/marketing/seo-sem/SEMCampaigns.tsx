'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Calendar, BarChart, DollarSign, Target, MoreVertical, ExternalLink, PieChart } from 'lucide-react';

const campaigns = [
  {
    id: 1,
    name: 'Services Web - Search',
    status: 'Actif',
    platform: 'Google Ads',
    budget: '€1,200/mois',
    spent: 850,
    cpc: '€1.85',
    impressions: 28500,
    clicks: 460,
    ctr: '1.61%',
    conversions: 28,
    convRate: '6.09%',
    costPerConv: '€30.36'
  },
  {
    id: 2,
    name: 'Remarketing - Display',
    status: 'Actif',
    platform: 'Google Ads',
    budget: '€800/mois',
    spent: 620,
    cpc: '€0.75',
    impressions: 45200,
    clicks: 825,
    ctr: '1.83%',
    conversions: 15,
    convRate: '1.82%',
    costPerConv: '€41.33'
  },
  {
    id: 3,
    name: 'Brand Protection',
    status: 'Actif',
    platform: 'Google Ads',
    budget: '€500/mois',
    spent: 320,
    cpc: '€0.45',
    impressions: 18600,
    clicks: 712,
    ctr: '3.83%',
    conversions: 42,
    convRate: '5.90%',
    costPerConv: '€7.62'
  },
  {
    id: 4,
    name: 'Nouveaux Services - Search',
    status: 'En pause',
    platform: 'Google Ads',
    budget: '€1,500/mois',
    spent: 0,
    cpc: '€0.00',
    impressions: 0,
    clicks: 0,
    ctr: '0.00%',
    conversions: 0,
    convRate: '0.00%',
    costPerConv: '€0.00'
  },
  {
    id: 5,
    name: 'LinkedIn Ads - B2B',
    status: 'Actif',
    platform: 'LinkedIn',
    budget: '€1,800/mois',
    spent: 1250,
    cpc: '€4.25',
    impressions: 12500,
    clicks: 294,
    ctr: '2.35%',
    conversions: 18,
    convRate: '6.12%',
    costPerConv: '€69.44'
  }
];

export function SEMCampaigns() {
  const [expandedCampaign, setExpandedCampaign] = useState<number | null>(null);
  
  const toggleExpand = (id: number) => {
    setExpandedCampaign(expandedCampaign === id ? null : id);
  };

  return (
    <Card className="border dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-900 dark:text-white">Campagnes SEM</CardTitle>
          <Button variant="outline" className="h-8 gap-1">
            <Calendar className="h-4 w-4" />
            <span>Ce mois</span>
          </Button>
        </div>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Gérez vos campagnes publicitaires sur les moteurs de recherche
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {campaigns.map((campaign) => (
            <div 
              key={campaign.id} 
              className="border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden transition-all"
            >
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750"
                onClick={() => toggleExpand(campaign.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{campaign.name}</h3>
                      <Badge className={
                        campaign.status === 'Actif' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                      }>
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        {campaign.platform}
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Budget: {campaign.budget}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Dépensé</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">€{campaign.spent}</div>
                    </div>
                    <div className="hidden md:block">
                      <div className="text-xs text-gray-500 dark:text-gray-400">CPC Moyen</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{campaign.cpc}</div>
                    </div>
                    <div className="hidden md:block">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Conversions</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{campaign.conversions}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Modifier</DropdownMenuItem>
                          <DropdownMenuItem>Dupliquer</DropdownMenuItem>
                          <DropdownMenuItem>Voir les annonces</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {campaign.status === 'Actif' ? (
                            <DropdownMenuItem className="text-amber-600 dark:text-amber-400">Mettre en pause</DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-green-600 dark:text-green-400">Activer</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
                
                {campaign.status === 'Actif' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Budget utilisé: €{campaign.spent} / {campaign.budget.split('/')[0]}
                      </span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {Math.round((campaign.spent / parseInt(campaign.budget.split('/')[0].substring(1))) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.round((campaign.spent / parseInt(campaign.budget.split('/')[0].substring(1))) * 100)} 
                      className="h-1.5" 
                    />
                  </div>
                )}
              </div>
              
              {expandedCampaign === campaign.id && (
                <div className="px-4 pb-4 pt-2 bg-gray-50 dark:bg-gray-750 border-t dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                        <Target className="h-4 w-4 text-blue-500" />
                        Performance
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Impressions</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{campaign.impressions.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Clics</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{campaign.clicks.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">CTR</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{campaign.ctr}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">CPC Moyen</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{campaign.cpc}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                        <BarChart className="h-4 w-4 text-green-500" />
                        Conversions
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Conversions</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{campaign.conversions}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Taux de conv.</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{campaign.convRate}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Coût par conv.</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{campaign.costPerConv}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">ROI estimé</div>
                          <div className="text-sm font-medium text-green-600 dark:text-green-400">+124%</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-purple-500" />
                        Budget
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Budget</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{campaign.budget}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Dépensé</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">€{campaign.spent}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Reste</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            €{parseInt(campaign.budget.split('/')[0].substring(1)) - campaign.spent}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Projection</div>
                          <div className="text-sm font-medium text-amber-600 dark:text-amber-400">+12%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4 pt-4 border-t dark:border-gray-700">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <PieChart className="h-4 w-4 mr-1" />
                        Rapport détaillé
                      </Button>
                      <Button size="sm">
                        Modifier la campagne
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
