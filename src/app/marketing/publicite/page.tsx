'use client';

import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, TrendingUp, DollarSign, Plus } from 'lucide-react';
import MegaMenu from '@/components/layout/MegaMenu';
import PlatformesPublicitaires from '@/components/marketing/advertising/PlatformesPublicitaires';
import CampagnesPublicitaires from '@/components/marketing/advertising/CampagnesPublicitaires';
import StatistiquesStrategie from '@/components/marketing/advertising/StatistiquesStrategie';

interface PageProps {}

const Page: FC<PageProps> = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Publicité</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez vos campagnes publicitaires et optimisez leur performance
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Nouvelle Campagne
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Target className="h-5 w-5 text-blue-500" />
                  Impressions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">125,430</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">+12% vs mois dernier</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Taux de Conversion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">3.2%</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">+0.5% vs mois dernier</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <DollarSign className="h-5 w-5 text-purple-500" />
                  Dépenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">12,450 €</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">+8% vs mois dernier</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="campagnes" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-gray-800 rounded-lg p-1">
              <TabsTrigger value="campagnes" className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white">
                Campagnes Publicitaires
              </TabsTrigger>
              <TabsTrigger value="plateformes" className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white">
                Plateformes Publicitaires
              </TabsTrigger>
              <TabsTrigger value="statistiques" className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white">
                Statistiques & Stratégie
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="campagnes">
              <CampagnesPublicitaires />
            </TabsContent>
            
            <TabsContent value="plateformes">
              <PlatformesPublicitaires />
            </TabsContent>
            
            <TabsContent value="statistiques">
              <StatistiquesStrategie />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Page;
