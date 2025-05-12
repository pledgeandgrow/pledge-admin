'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { MapPin, Target, Users, Building, Plus, Filter, Download, Map } from 'lucide-react';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { RegionalAnalytics } from '@/components/marketing/geomarketing/RegionalAnalytics';
import { GeoTargeting } from '@/components/marketing/geomarketing/GeoTargeting';

export default function GeomarketingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Géomarketing
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Analysez et ciblez vos marchés par zone géographique
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Nouvelle Campagne Locale
            </Button>
          </div>

          {/* Analytics Overview */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <MapPin className="h-5 w-5 text-green-500" />
                  Zones Actives
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Régions ciblées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">12</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">+3</span> ce trimestre
                </p>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Couverture nationale</span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">68%</span>
                  </div>
                  <Progress value={68} className="h-1.5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Target className="h-5 w-5 text-blue-500" />
                  Campagnes Locales
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Campagnes géociblées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">8</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">+2</span> ce mois-ci
                </p>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Performance moyenne</span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">74%</span>
                  </div>
                  <Progress value={74} className="h-1.5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Users className="h-5 w-5 text-purple-500" />
                  Audience Locale
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Clients géolocalisés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">24.5K</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">+12%</span> vs dernier trimestre
                </p>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Taux d'engagement</span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">4.8%</span>
                  </div>
                  <Progress value={48} className="h-1.5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Building className="h-5 w-5 text-amber-500" />
                  Points de Vente
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Magasins connectés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">32</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">+5</span> ce trimestre
                </p>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Trafic généré</span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">+18%</span>
                  </div>
                  <Progress value={18} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="map" className="mb-8">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="map">Carte</TabsTrigger>
              <TabsTrigger value="regions">Régions</TabsTrigger>
              <TabsTrigger value="campaigns">Campagnes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="map">
              <div className="space-y-8">
                <Card className="border dark:border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-gray-900 dark:text-white">Carte des Performances</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">
                          Visualisez vos performances marketing par région
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-9 gap-1">
                          <Filter className="h-4 w-4" />
                          <span>Filtres</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 gap-1">
                          <Download className="h-4 w-4" />
                          <span>Exporter</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden relative">
                      {/* Placeholder for map - in a real app, use a map library */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Map className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                        <span className="absolute text-sm text-gray-500 dark:text-gray-400">Carte interactive de la France</span>
                      </div>
                      
                      {/* Sample map markers */}
                      <div className="absolute top-1/4 left-1/3">
                        <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="absolute top-1/3 left-1/2">
                        <div className="h-6 w-6 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="absolute top-1/2 left-1/4">
                        <div className="h-5 w-5 bg-purple-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="absolute bottom-1/4 right-1/3">
                        <div className="h-4 w-4 bg-amber-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Top Région</h4>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">Île-de-France</p>
                        <p className="text-xs text-green-600 dark:text-green-400">+28% de conversions</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Croissance</h4>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">Auvergne-Rhône-Alpes</p>
                        <p className="text-xs text-green-600 dark:text-green-400">+42% vs dernier trimestre</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Opportunité</h4>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">Bretagne</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400">Potentiel inexploité</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">À Surveiller</h4>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">Occitanie</p>
                        <p className="text-xs text-red-600 dark:text-red-400">-5% de trafic</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="regions">
              <div className="space-y-8">
                <RegionalAnalytics />
              </div>
            </TabsContent>
            
            <TabsContent value="campaigns">
              <div className="space-y-8">
                <GeoTargeting />
                
                <Card className="border dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">Campagnes Locales</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Performances par zone géographique
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Paris - Offre Spéciale', region: 'Île-de-France', status: 'Actif', performance: 82, budget: '€2,500' },
                        { name: 'Lyon - Nouveaux Services', region: 'Auvergne-Rhône-Alpes', status: 'Actif', performance: 76, budget: '€1,800' },
                        { name: 'Marseille - Été 2025', region: 'Provence-Alpes-Côte d\'Azur', status: 'Planifiée', performance: 0, budget: '€2,200' },
                        { name: 'Bordeaux - Événement Local', region: 'Nouvelle-Aquitaine', status: 'Actif', performance: 68, budget: '€1,500' },
                        { name: 'Lille - Promotion Automne', region: 'Hauts-de-France', status: 'Terminée', performance: 92, budget: '€1,200' },
                      ].map((campaign, i) => (
                        <div key={i} className="p-4 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{campaign.name}</h3>
                                <Badge className={
                                  campaign.status === 'Actif' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                    : campaign.status === 'Planifiée'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }>
                                  {campaign.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <MapPin className="h-3.5 w-3.5 text-gray-500" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">{campaign.region}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">Budget: {campaign.budget}</span>
                            </div>
                          </div>
                          
                          {campaign.status !== 'Planifiée' && (
                            <div className="mt-4">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Performance</span>
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{campaign.performance}%</span>
                              </div>
                              <Progress value={campaign.performance} className="h-1.5" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">Analyse Démographique</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Répartition de l'audience par région
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        { region: 'Île-de-France', percentage: 28, growth: '+12%', age: '25-34', income: 'Élevé' },
                        { region: 'Auvergne-Rhône-Alpes', percentage: 18, growth: '+8%', age: '35-44', income: 'Moyen-Élevé' },
                        { region: 'Provence-Alpes-Côte d\'Azur', percentage: 14, growth: '+5%', age: '25-44', income: 'Moyen-Élevé' },
                        { region: 'Nouvelle-Aquitaine', percentage: 12, growth: '+15%', age: '35-54', income: 'Moyen' },
                        { region: 'Hauts-de-France', percentage: 10, growth: '+3%', age: '25-34', income: 'Moyen' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-900 dark:text-white">{item.region}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Âge: {item.age}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Revenu: {item.income}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-base font-medium text-gray-900 dark:text-white">{item.percentage}%</div>
                            <div className="text-sm text-green-600 dark:text-green-400">{item.growth}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Opportunités de croissance</h4>
                      <div className="space-y-2">
                        {[
                          { region: 'Bretagne', potential: 'Élevé', gap: '22%', recommendation: 'Campagne locale ciblée' },
                          { region: 'Grand Est', potential: 'Moyen', gap: '15%', recommendation: 'Partenariats locaux' },
                          { region: 'Occitanie', potential: 'Élevé', gap: '18%', recommendation: 'Événements régionaux' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-2">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.region}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{item.recommendation}</p>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                                Gap: {item.gap}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
