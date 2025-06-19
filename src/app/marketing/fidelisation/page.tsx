'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Users, Star, Trophy, Heart, TrendingUp, Plus, Gift, Award } from 'lucide-react';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { LoyaltyProgram } from '@/components/marketing/fidelisation/LoyaltyProgram';
import { CustomerReviews } from '@/components/marketing/fidelisation/CustomerReviews';

export default function FidelisationPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Fidélisation
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez vos programmes de fidélité et l&apos;expérience client
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Nouvelle Campagne
            </Button>
          </div>

          {/* Analytics Overview */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Users className="h-5 w-5 text-blue-500" />
                  Clients Fidèles
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Base active
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">1,234</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">+45</span> ce mois-ci
                </p>
                <div className="mt-4">
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Note Moyenne
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Satisfaction client
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">4.8/5</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">+0.2</span> vs mois dernier
                </p>
                <div className="mt-4">
                  <Progress value={96} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Trophy className="h-5 w-5 text-purple-500" />
                  Points Distribués
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Programme de fidélité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">45,670</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">+12.8%</span> ce mois
                </p>
                <div className="mt-4">
                  <Progress value={82} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Heart className="h-5 w-5 text-pink-500" />
                  Taux de Rétention
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Fidélité client
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">78.3%</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">+3.2%</span> vs trimestre précédent
                </p>
                <div className="mt-4">
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
              <TabsTrigger value="program">Programme de Fidélité</TabsTrigger>
              <TabsTrigger value="reviews">Avis Clients</TabsTrigger>
              <TabsTrigger value="campaigns">Campagnes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="space-y-8">
                <Card className="border dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <Award className="h-5 w-5 text-blue-500" />
                      Niveaux de Fidélité
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Répartition des clients par niveau
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Bronze', count: 678, percentage: 55, color: 'bg-amber-700' },
                        { name: 'Argent', count: 342, percentage: 28, color: 'bg-slate-400' },
                        { name: 'Or', count: 156, percentage: 13, color: 'bg-yellow-500' },
                        { name: 'Platine', count: 58, percentage: 4, color: 'bg-blue-400' },
                      ].map((tier) => (
                        <div key={tier.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`h-3 w-3 rounded-full ${tier.color}`}></div>
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{tier.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-500 dark:text-gray-400">{tier.count} clients</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{tier.percentage}%</span>
                            </div>
                          </div>
                          <Progress value={tier.percentage} className={`h-2 ${tier.color}`} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <Gift className="h-5 w-5 text-purple-500" />
                        Récompenses Populaires
                      </CardTitle>
                      <CardDescription className="text-gray-500 dark:text-gray-400">
                        Top 5 des récompenses les plus demandées
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { name: 'Remise 10%', claimed: 234, points: 1000 },
                          { name: 'Consultation Gratuite', claimed: 156, points: 2500 },
                          { name: 'Formation Premium', claimed: 45, points: 5000 },
                          { name: 'Remise 25%', claimed: 27, points: 3500 },
                          { name: 'Accès VIP Événement', claimed: 8, points: 10000 },
                        ].map((reward, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b dark:border-gray-700 last:border-0">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{reward.name}</div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {reward.points} points requis
                              </p>
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {reward.claimed} réclamés
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        Évolution de l&apos;Engagement
                      </CardTitle>
                      <CardDescription className="text-gray-500 dark:text-gray-400">
                        Activité des clients fidèles
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { month: 'Janvier', engagement: 65, growth: '+2.3%' },
                          { month: 'Février', engagement: 68, growth: '+4.6%' },
                          { month: 'Mars', engagement: 72, growth: '+5.9%' },
                          { month: 'Avril', engagement: 75, growth: '+4.2%' },
                          { month: 'Mai', engagement: 78, growth: '+4.0%' },
                        ].map((data, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b dark:border-gray-700 last:border-0">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{data.month}</div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Progress value={data.engagement} className="h-2 w-24" />
                              <span className="text-sm text-green-500">{data.growth}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="program">
              <LoyaltyProgram />
            </TabsContent>
            
            <TabsContent value="reviews">
              <CustomerReviews />
            </TabsContent>
            
            <TabsContent value="campaigns">
              <Card className="border dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Campagnes de Fidélisation</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Gérez vos campagnes de fidélisation et d&apos;engagement client
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    Fonctionnalité à venir prochainement...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
