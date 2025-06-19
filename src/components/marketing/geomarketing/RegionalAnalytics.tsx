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
import { 
  MapPin, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  MoreVertical, 
  Download, 
  BarChart, 
  PieChart 
} from 'lucide-react';

const regions = [
  {
    id: 1,
    name: 'Île-de-France',
    population: '12.2M',
    marketShare: 28,
    growth: '+12%',
    revenue: '€1.8M',
    stores: 14,
    customers: '245K',
    conversionRate: '4.2%',
    averageOrder: '€78',
    topProducts: ['Service Premium', 'Abonnement Pro', 'Consultation']
  },
  {
    id: 2,
    name: 'Auvergne-Rhône-Alpes',
    population: '8.1M',
    marketShare: 18,
    growth: '+8%',
    revenue: '€920K',
    stores: 8,
    customers: '132K',
    conversionRate: '3.8%',
    averageOrder: '€72',
    topProducts: ['Abonnement Standard', 'Service Premium', 'Formation']
  },
  {
    id: 3,
    name: 'Provence-Alpes-Côte d\'Azur',
    population: '5.1M',
    marketShare: 14,
    growth: '+5%',
    revenue: '€680K',
    stores: 6,
    customers: '98K',
    conversionRate: '3.5%',
    averageOrder: '€68',
    topProducts: ['Service Standard', 'Consultation', 'Abonnement Pro']
  },
  {
    id: 4,
    name: 'Nouvelle-Aquitaine',
    population: '6.0M',
    marketShare: 12,
    growth: '+15%',
    revenue: '€540K',
    stores: 5,
    customers: '76K',
    conversionRate: '3.2%',
    averageOrder: '€65',
    topProducts: ['Abonnement Standard', 'Formation', 'Support Premium']
  },
  {
    id: 5,
    name: 'Hauts-de-France',
    population: '6.0M',
    marketShare: 10,
    growth: '+3%',
    revenue: '€420K',
    stores: 4,
    customers: '62K',
    conversionRate: '2.9%',
    averageOrder: '€62',
    topProducts: ['Service Standard', 'Support Standard', 'Abonnement Basic']
  },
  {
    id: 6,
    name: 'Grand Est',
    population: '5.5M',
    marketShare: 8,
    growth: '+6%',
    revenue: '€380K',
    stores: 3,
    customers: '54K',
    conversionRate: '2.8%',
    averageOrder: '€64',
    topProducts: ['Abonnement Standard', 'Service Standard', 'Support Standard']
  }
];

export function RegionalAnalytics() {
  const [expandedRegion, setExpandedRegion] = useState<number | null>(null);
  
  const toggleExpand = (id: number) => {
    setExpandedRegion(expandedRegion === id ? null : id);
  };

  return (
    <Card className="border dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-900 dark:text-white">Analyse Régionale</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Download className="h-4 w-4" />
              <span>Exporter</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">Filtrer</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtres</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Toutes les régions</DropdownMenuItem>
                <DropdownMenuItem>Top 5 régions</DropdownMenuItem>
                <DropdownMenuItem>Croissance &gt; 10%</DropdownMenuItem>
                <DropdownMenuItem>Conversion &gt; 3.5%</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Performance détaillée par région
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {regions.map((region) => (
            <div 
              key={region.id} 
              className="border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden transition-all"
            >
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750"
                onClick={() => toggleExpand(region.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{region.name}</h3>
                      {region.growth.startsWith('+') && parseInt(region.growth) > 10 && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Forte croissance
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Population: {region.population}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Part de marché: {region.marketShare}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Croissance</div>
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">{region.growth}</div>
                    </div>
                    <div className="hidden md:block">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Revenus</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{region.revenue}</div>
                    </div>
                    <div className="hidden md:block">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Magasins</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{region.stores}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <BarChart className="h-4 w-4" />
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
                          <DropdownMenuItem>Voir détails</DropdownMenuItem>
                          <DropdownMenuItem>Créer une campagne</DropdownMenuItem>
                          <DropdownMenuItem>Exporter les données</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Comparer avec une autre région</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Part de marché
                    </span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {region.marketShare}%
                    </span>
                  </div>
                  <Progress 
                    value={region.marketShare} 
                    className="h-1.5" 
                  />
                </div>
              </div>
              
              {expandedRegion === region.id && (
                <div className="px-4 pb-4 pt-2 bg-gray-50 dark:bg-gray-750 border-t dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                        <Users className="h-4 w-4 text-blue-500" />
                        Démographie
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Population</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{region.population}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Clients</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{region.customers}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Pénétration</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {Math.round((parseInt(region.customers.replace(/[^0-9]/g, '')) / parseInt(region.population.replace(/[^0-9]/g, ''))) * 100)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Magasins</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{region.stores}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                        <ShoppingBag className="h-4 w-4 text-green-500" />
                        Performance Commerciale
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Revenus</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{region.revenue}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Croissance</div>
                          <div className="text-sm font-medium text-green-600 dark:text-green-400">{region.growth}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Taux de conv.</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{region.conversionRate}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Panier moyen</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{region.averageOrder}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                        <PieChart className="h-4 w-4 text-purple-500" />
                        Top Produits
                      </h4>
                      <div className="space-y-2">
                        {region.topProducts.map((product, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{product}</span>
                            <Badge className={
                              i === 0 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : i === 1
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                            }>
                              #{i+1}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4 pt-4 border-t dark:border-gray-700">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <BarChart className="h-4 w-4 mr-1" />
                        Rapport détaillé
                      </Button>
                      <Button size="sm">
                        Créer une campagne
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
