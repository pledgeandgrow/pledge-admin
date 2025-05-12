'use client';

import { FC } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Mail, Users, BarChart, Send, Plus } from 'lucide-react';

interface PageProps {}

const Page: FC<PageProps> = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Email Marketing</h2>
              <p className="text-muted-foreground">
                Gérez vos campagnes d&apos;emailing et suivez leurs performances
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Rechercher une campagne..."
                className="w-64"
              />
              <Button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Nouvelle Campagne
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Mail className="h-5 w-5 text-blue-500" />
                  Emails Envoyés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">125,430</div>
                <p className="text-sm text-green-600 dark:text-green-400">+12% vs mois dernier</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Users className="h-5 w-5 text-indigo-500" />
                  Taux d&apos;Ouverture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">24.8%</div>
                <p className="text-sm text-green-600 dark:text-green-400">+3.2% vs mois dernier</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <BarChart className="h-5 w-5 text-purple-500" />
                  Taux de Conversion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">3.2%</div>
                <p className="text-sm text-green-600 dark:text-green-400">+0.5% vs mois dernier</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Campagnes Récentes</CardTitle>
                <CardDescription>
                  Performance des dernières campagnes email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: 'Newsletter Février',
                      status: 'En cours',
                      sent: '12,450',
                      openRate: '28%',
                      performance: '+15%'
                    },
                    {
                      name: 'Promotion Printemps',
                      status: 'Planifiée',
                      sent: '0',
                      openRate: '-',
                      performance: '-'
                    },
                    {
                      name: 'Enquête Satisfaction',
                      status: 'Terminée',
                      sent: '8,320',
                      openRate: '32%',
                      performance: '+18%'
                    }
                  ].map((campaign) => (
                    <div key={campaign.name} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900 dark:text-white">{campaign.name}</p>
                        <Badge 
                          variant="outline" 
                          className={
                            campaign.status === 'En cours'
                              ? 'text-green-600 border-green-600/20 bg-green-600/10'
                              : campaign.status === 'Planifiée'
                              ? 'text-blue-600 border-blue-600/20 bg-blue-600/10'
                              : 'text-gray-600 border-gray-600/20 bg-gray-600/10'
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">{campaign.sent} envois</p>
                        <p className="text-sm text-muted-foreground">
                          Taux: {campaign.openRate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Segments d&apos;Audience</CardTitle>
                <CardDescription>
                  Répartition des listes de diffusion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: 'Clients Actifs',
                      subscribers: '5,234',
                      engagement: '32%',
                      trend: 'up'
                    },
                    {
                      name: 'Prospects',
                      subscribers: '3,890',
                      engagement: '18%',
                      trend: 'up'
                    },
                    {
                      name: 'Newsletter',
                      subscribers: '12,456',
                      engagement: '24%',
                      trend: 'down'
                    },
                    {
                      name: 'VIP',
                      subscribers: '890',
                      engagement: '45%',
                      trend: 'up'
                    }
                  ].map((segment) => (
                    <div key={segment.name} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900 dark:text-white">{segment.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {segment.subscribers} abonnés
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">Eng: {segment.engagement}</p>
                        <p className={`text-sm ${
                          segment.trend === 'up'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {segment.trend === 'up' ? '↑' : '↓'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
