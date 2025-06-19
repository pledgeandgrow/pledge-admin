import React, { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart, TrendingUp, TrendingDown, DollarSign, Users, Target, Share2 } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: JSX.Element;
}

const MetricCard: FC<MetricCardProps> = ({ title, value, change, trend, icon }) => {
  return (
    <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</p>
          </div>
          <div className={`p-2 rounded-full ${
            trend === 'up' 
              ? 'bg-green-100 dark:bg-green-900/30' 
              : trend === 'down' 
              ? 'bg-red-100 dark:bg-red-900/30' 
              : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            {icon}
          </div>
        </div>
        <div className="mt-2 flex items-center">
          <span className={`text-sm font-medium ${
            trend === 'up' 
              ? 'text-green-500 dark:text-green-400' 
              : trend === 'down' 
              ? 'text-red-500 dark:text-red-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {trend === 'up' ? <TrendingUp className="inline h-3 w-3 mr-1" /> : trend === 'down' ? <TrendingDown className="inline h-3 w-3 mr-1" /> : null}
            {change}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs mois précédent</span>
        </div>
      </CardContent>
    </Card>
  );
};

const StatistiquesStrategie: FC = () => {
  return (
    <Card className="border dark:border-gray-700 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-gray-900 dark:text-white">Statistiques & Stratégie</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Analysez vos performances et optimisez votre stratégie publicitaire
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
              Exporter
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
              Générer un rapport
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-gray-800 rounded-lg p-1">
            <TabsTrigger value="overview" className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white">
              Vue d&apos;ensemble
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white">
              Performance
            </TabsTrigger>
            <TabsTrigger value="audience" className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white">
              Audience
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricCard 
                title="Dépenses totales" 
                value="12 450 €" 
                change="+15.3%" 
                trend="up" 
                icon={<DollarSign className="h-5 w-5 text-green-500 dark:text-green-400" />} 
              />
              <MetricCard 
                title="Impressions" 
                value="1.2M" 
                change="+22.8%" 
                trend="up" 
                icon={<Users className="h-5 w-5 text-blue-500 dark:text-blue-400" />} 
              />
              <MetricCard 
                title="Taux de conversion" 
                value="3.8%" 
                change="-0.5%" 
                trend="down" 
                icon={<Target className="h-5 w-5 text-red-500 dark:text-red-400" />} 
              />
              <MetricCard 
                title="Coût par acquisition" 
                value="28.50 €" 
                change="+2.1%" 
                trend="up" 
                icon={<Share2 className="h-5 w-5 text-amber-500 dark:text-amber-400" />} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-base text-gray-900 dark:text-white">Performance par plateforme</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-center items-center h-64">
                    <div className="text-center space-y-4">
                      <BarChart className="h-32 w-32 text-blue-500 mx-auto" />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-gray-700 dark:text-gray-300">Google Ads (42%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                          <span className="text-gray-700 dark:text-gray-300">Facebook (28%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                          <span className="text-gray-700 dark:text-gray-300">Instagram (18%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          <span className="text-gray-700 dark:text-gray-300">LinkedIn (12%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-base text-gray-900 dark:text-white">Tendances des conversions</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-center items-center h-64">
                    <div className="text-center space-y-4">
                      <LineChart className="h-32 w-32 text-green-500 mx-auto" />
                      <div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">+18% de croissance</div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">sur les 3 derniers mois</p>
                      </div>
                      <div className="flex justify-center gap-8">
                        <div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">450</div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Conversions totales</p>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">27.60 €</div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Coût moyen</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <Card className="border dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-base text-gray-900 dark:text-white">Recommandations stratégiques</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-800">
                          <TrendingUp className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Optimisation du budget</h4>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            Réallouez 20% du budget Facebook vers Google Ads pour améliorer le ROI global de 15%.
                          </p>
                          <Button variant="link" className="p-0 h-auto mt-2 text-blue-500 dark:text-blue-400">
                            Appliquer cette recommandation
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg dark:border-gray-700 bg-green-50 dark:bg-green-900/20">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-green-100 dark:bg-green-800">
                          <Target className="h-5 w-5 text-green-500 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Ciblage d&apos;audience</h4>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            Le segment 25-34 ans montre un taux de conversion 30% plus élevé. Concentrez vos efforts sur ce groupe.
                          </p>
                          <Button variant="link" className="p-0 h-auto mt-2 text-green-500 dark:text-green-400">
                            Voir l&apos;analyse complète
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg dark:border-gray-700 bg-purple-50 dark:bg-purple-900/20">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-800">
                          <PieChart className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Diversification des canaux</h4>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            Testez une campagne sur TikTok pour atteindre un public plus jeune et augmenter la notoriété de marque.
                          </p>
                          <Button variant="link" className="p-0 h-auto mt-2 text-purple-500 dark:text-purple-400">
                            Explorer cette opportunité
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="flex items-center justify-center h-64 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="text-center">
                <BarChart className="h-16 w-16 text-gray-400 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Données de performance détaillées</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Graphiques et analyses détaillées des performances publicitaires
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audience">
            <div className="flex items-center justify-center h-64 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Données d&apos;audience détaillées</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Analyse démographique et comportementale de votre audience
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatistiquesStrategie;
