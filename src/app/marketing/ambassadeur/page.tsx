'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Users, Award, TrendingUp, MessageSquare, Plus } from 'lucide-react';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { AmbassadeurList } from '@/components/marketing/ambassadeur/AmbassadeurList';
import { CampagnesList } from '@/components/marketing/ambassadeur/CampagnesList';
import { PerformanceMetrics } from '@/components/marketing/ambassadeur/PerformanceMetrics';

export default function AmbassadeurPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Programme Ambassadeur
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez vos ambassadeurs et leurs campagnes
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Nouvel Ambassadeur
            </Button>
          </div>

          {/* Analytics Overview */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Users className="h-5 w-5 text-purple-500" />
                  Ambassadeurs
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Total actifs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">48</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">+12</span> ce trimestre
                </p>
                <div className="mt-4">
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Award className="h-5 w-5 text-amber-500" />
                  Campagnes
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Campagnes actives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">7</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">+2</span> ce mois
                </p>
                <div className="mt-4">
                  <Progress value={65} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Conversions
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Total ce mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">245</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">+18%</span> vs mois dernier
                </p>
                <div className="mt-4">
                  <Progress value={82} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  Engagement
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Taux moyen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">4.8%</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-amber-500">-0.2%</span> vs objectif
                </p>
                <div className="mt-4">
                  <Progress value={48} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="ambassadeurs" className="mb-8">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="ambassadeurs">Ambassadeurs</TabsTrigger>
              <TabsTrigger value="campagnes">Campagnes</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ambassadeurs">
              <div className="space-y-8">
                <AmbassadeurList />
              </div>
            </TabsContent>
            
            <TabsContent value="campagnes">
              <div className="space-y-8">
                <CampagnesList />
              </div>
            </TabsContent>
            
            <TabsContent value="performance">
              <div className="space-y-8">
                <PerformanceMetrics />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
