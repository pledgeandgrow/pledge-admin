'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Search, BarChart, TrendingUp, Globe, FileText, Settings, ArrowUp, ExternalLink, Plus } from 'lucide-react';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { KeywordAnalytics } from '@/components/marketing/seo-sem/KeywordAnalytics';
import { SEMCampaigns } from '@/components/marketing/seo-sem/SEMCampaigns';

export default function SEOSEMPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                SEO / SEM
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Optimisez votre présence sur les moteurs de recherche
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Nouvelle Campagne
            </Button>
          </div>

          {/* Analytics Overview */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Search className="h-5 w-5 text-blue-500" />
                  Visibilité SEO
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Score global
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">72/100</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">+5 pts</span> ce mois-ci
                </p>
                <div className="mt-4">
                  <Progress value={72} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Trafic Organique
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Visiteurs mensuels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">8,452</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">+12.4%</span> vs mois dernier
                </p>
                <div className="mt-4">
                  <Progress value={62} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <BarChart className="h-5 w-5 text-purple-500" />
                  Campagnes SEM
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Performance Google Ads
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">3.2%</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-amber-500">-0.3%</span> taux de conversion
                </p>
                <div className="mt-4">
                  <Progress value={45} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Globe className="h-5 w-5 text-indigo-500" />
                  Mots-clés
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Positions moyennes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">4.8</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">+2 positions</span> vs trimestre dernier
                </p>
                <div className="mt-4">
                  <Progress value={68} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="sem">Campagnes SEM</TabsTrigger>
              <TabsTrigger value="seo">Analyse SEO</TabsTrigger>
              <TabsTrigger value="content">Contenu</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="space-y-8">
                <Card className="border dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <FileText className="h-5 w-5 text-blue-500" />
                      Pages les mieux classées
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Top 5 des pages avec le meilleur classement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { url: '/services/developpement-web', position: 2, keyword: 'développement web paris' },
                        { url: '/blog/seo-2025-tendances', position: 3, keyword: 'tendances SEO 2025' },
                        { url: '/services/marketing-digital', position: 4, keyword: 'agence marketing digital' },
                        { url: '/etudes-de-cas/ecommerce', position: 5, keyword: 'optimisation ecommerce' },
                        { url: '/contact', position: 7, keyword: 'agence digitale contact' },
                      ].map((page, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b dark:border-gray-700 last:border-0">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400">
                                #{page.position}
                              </Badge>
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{page.url}</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Mot-clé: "{page.keyword}"
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Mots-clés en progression
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Mots-clés avec la plus forte amélioration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { keyword: 'marketing automation', change: 12, volume: 1200 },
                        { keyword: 'stratégie digitale 2025', change: 8, volume: 880 },
                        { keyword: 'optimisation conversion', change: 6, volume: 1500 },
                        { keyword: 'référencement local', change: 5, volume: 2200 },
                        { keyword: 'analytics business', change: 4, volume: 950 },
                      ].map((keyword, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b dark:border-gray-700 last:border-0">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{keyword.keyword}</span>
                              <Badge className="bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400">
                                <ArrowUp className="h-3 w-3 mr-1" />
                                {keyword.change}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Volume: {keyword.volume} recherches/mois
                            </p>
                          </div>
                          <Button variant="outline" size="sm" className="h-8">
                            Analyser
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="sem">
              <div className="space-y-8">
                <SEMCampaigns />
              </div>
            </TabsContent>
            
            <TabsContent value="seo">
              <div className="space-y-8">
                <KeywordAnalytics />
              </div>
            </TabsContent>
            
            <TabsContent value="content">
              <Card className="border dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Settings className="h-5 w-5 text-gray-500" />
                    Optimisations recommandées
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Actions à entreprendre pour améliorer votre SEO
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: 'Optimiser les balises meta descriptions', priority: 'Haute', impact: 'Moyen', effort: 'Faible' },
                      { title: 'Améliorer la vitesse de chargement des pages mobiles', priority: 'Haute', impact: 'Élevé', effort: 'Moyen' },
                      { title: 'Créer plus de contenu autour du mot-clé "marketing automation"', priority: 'Moyenne', impact: 'Élevé', effort: 'Élevé' },
                      { title: 'Corriger les liens cassés sur le blog', priority: 'Moyenne', impact: 'Faible', effort: 'Faible' },
                      { title: 'Optimiser les images (compression et alt tags)', priority: 'Basse', impact: 'Moyen', effort: 'Moyen' },
                    ].map((task, i) => (
                      <div key={i} className="flex items-start justify-between py-3 border-b dark:border-gray-700 last:border-0">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{task.title}</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className={
                              task.priority === 'Haute' 
                                ? 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400' 
                                : task.priority === 'Moyenne'
                                ? 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400'
                                : 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400'
                            }>
                              Priorité: {task.priority}
                            </Badge>
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400">
                              Impact: {task.impact}
                            </Badge>
                            <Badge variant="outline" className="bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-400">
                              Effort: {task.effort}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 whitespace-nowrap">
                          Commencer
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
