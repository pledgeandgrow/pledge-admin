'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// Tabs components removed - unused imports
import { 
  BarChart, 
  // PieChart removed - unused import
  LineChart, 
  TrendingUp, 
  // Users removed - unused import
  Award, 
  Download,
  Calendar
} from 'lucide-react';

export function PerformanceMetrics() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Métriques de Performance</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Analysez les performances de votre programme ambassadeur</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <Calendar className="h-4 w-4" />
            <span>Derniers 30 jours</span>
          </Button>
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-white">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Conversions par Canal
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Répartition des conversions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="aspect-square relative flex items-center justify-center">
              {/* Placeholder for chart - in a real app, use a chart library */}
              <div className="w-32 h-32 rounded-full border-8 border-blue-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-purple-500"></div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-green-500"></div>
                <div className="absolute top-1/4 left-0 w-full h-1/4 bg-amber-500"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">245</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-xs text-gray-600 dark:text-gray-300">Instagram (42%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600 dark:text-gray-300">LinkedIn (28%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-600 dark:text-gray-300">Email (18%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs text-gray-600 dark:text-gray-300">Autres (12%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-white">
              <BarChart className="h-5 w-5 text-blue-500" />
              Performance par Catégorie
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Comparaison des types d&apos;ambassadeurs
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Influenceurs</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">86%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '86%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Experts Métier</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">72%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Partenaires</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">64%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Clients Fidèles</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">48%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '48%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-white">
              <LineChart className="h-5 w-5 text-indigo-500" />
              Évolution Mensuelle
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Tendance sur 6 mois
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[180px] relative">
              {/* Placeholder for line chart - in a real app, use a chart library */}
              <div className="absolute bottom-0 left-0 w-full h-px bg-gray-200 dark:bg-gray-700"></div>
              <div className="absolute top-0 left-0 h-full w-px bg-gray-200 dark:bg-gray-700"></div>
              
              <svg className="w-full h-full" viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M0,180 L50,150 L100,160 L150,120 L200,90 L250,70 L300,40" 
                  stroke="#6366f1" 
                  strokeWidth="2" 
                  fill="none"
                />
                <path 
                  d="M0,180 L50,150 L100,160 L150,120 L200,90 L250,70 L300,40 L300,180 L0,180" 
                  fill="url(#gradient)" 
                  fillOpacity="0.2"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500 dark:text-gray-400 px-2">
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Déc</span>
                <span>Jan</span>
                <span>Fév</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">1,245</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">Moyenne</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">207.5</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">Croissance</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">+32%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 dark:text-white">Top Ambassadeurs</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Les ambassadeurs les plus performants ce mois-ci
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Rang</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Ambassadeur</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Catégorie</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Conversions</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Engagement</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Portée</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Récompense</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rank: 1, name: 'Sophie Martin', category: 'Influenceur', conversions: 42, engagement: '4.8%', reach: '8.5K', reward: '€420' },
                  { rank: 2, name: 'Emma Bernard', category: 'Expert Métier', conversions: 36, engagement: '5.1%', reach: '7.2K', reward: '€360' },
                  { rank: 3, name: 'Lucas Moreau', category: 'Partenaire', conversions: 28, engagement: '3.9%', reach: '4.6K', reward: '€280' },
                  { rank: 4, name: 'Thomas Dubois', category: 'Client Fidèle', conversions: 18, engagement: '3.2%', reach: '2.8K', reward: '€180' },
                  { rank: 5, name: 'Julie Leroy', category: 'Influenceur', conversions: 16, engagement: '4.2%', reach: '3.1K', reward: '€160' },
                ].map((ambassador, i) => (
                  <tr key={i} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <Badge className={
                        ambassador.rank === 1 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : ambassador.rank === 2
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          : ambassador.rank === 3
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                          : 'bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-300 border'
                      }>
                        {ambassador.rank === 1 && <Award className="h-3.5 w-3.5 mr-1" />}
                        #{ambassador.rank}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900 dark:text-white">{ambassador.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                        {ambassador.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900 dark:text-white">{ambassador.conversions}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700 dark:text-gray-300">{ambassador.engagement}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700 dark:text-gray-300">{ambassador.reach}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-green-600 dark:text-green-400">{ambassador.reward}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
