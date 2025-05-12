'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Search, TrendingUp, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

const keywords = [
  {
    keyword: 'marketing automation',
    position: 3,
    change: 2,
    volume: 1200,
    difficulty: 68,
    cpc: '€1.85',
    intent: 'Commercial'
  },
  {
    keyword: 'stratégie digitale 2025',
    position: 1,
    change: 0,
    volume: 880,
    difficulty: 42,
    cpc: '€1.25',
    intent: 'Informationnel'
  },
  {
    keyword: 'optimisation conversion',
    position: 5,
    change: 3,
    volume: 1500,
    difficulty: 55,
    cpc: '€2.10',
    intent: 'Commercial'
  },
  {
    keyword: 'référencement local',
    position: 8,
    change: -2,
    volume: 2200,
    difficulty: 62,
    cpc: '€1.65',
    intent: 'Commercial'
  },
  {
    keyword: 'analytics business',
    position: 4,
    change: 1,
    volume: 950,
    difficulty: 51,
    cpc: '€1.45',
    intent: 'Informationnel'
  },
  {
    keyword: 'agence marketing paris',
    position: 12,
    change: -3,
    volume: 1800,
    difficulty: 75,
    cpc: '€2.85',
    intent: 'Transactionnel'
  },
  {
    keyword: 'content marketing b2b',
    position: 6,
    change: 4,
    volume: 720,
    difficulty: 48,
    cpc: '€1.35',
    intent: 'Commercial'
  }
];

export function KeywordAnalytics() {
  return (
    <Card className="border dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-900 dark:text-white">Analyse des Mots-Clés</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un mot-clé..."
              className="pl-8 bg-white dark:bg-gray-800"
            />
          </div>
        </div>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Suivez vos positions et analysez les opportunités
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Mot-clé</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Position</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Évolution</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Volume</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Difficulté</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">CPC</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Intention</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((keyword, i) => (
                <tr key={i} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900 dark:text-white">{keyword.keyword}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge className={
                      keyword.position <= 3 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : keyword.position <= 10
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                    }>
                      #{keyword.position}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {keyword.change > 0 ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        {keyword.change}
                      </Badge>
                    ) : keyword.change < 0 ? (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                        <ArrowDown className="h-3 w-3 mr-1" />
                        {Math.abs(keyword.change)}
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        0
                      </Badge>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-gray-700 dark:text-gray-300">{keyword.volume.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={keyword.difficulty} 
                        className="h-2 w-16" 
                        style={{
                          background: 'linear-gradient(to right, #22c55e, #eab308, #ef4444)',
                        }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{keyword.difficulty}/100</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-gray-700 dark:text-gray-300">{keyword.cpc}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="outline" className={
                      keyword.intent === 'Transactionnel' 
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                        : keyword.intent === 'Commercial'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    }>
                      {keyword.intent}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
