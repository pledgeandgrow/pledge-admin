'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Users, Calendar, Lightbulb, TrendingUp } from 'lucide-react';

export function CultureDashboard() {
  // Sample data for the culture dashboard
  const cultureData = {
    engagementScore: 8.2,
    activeInitiatives: 6,
    upcomingEvents: 4,
    employeeParticipation: 85,
    coreValues: [
      { name: 'Innovation', score: 8.5 },
      { name: 'Collaboration', score: 8.7 },
      { name: 'Excellence', score: 8.3 },
      { name: 'Intégrité', score: 9.0 },
      { name: 'Diversité', score: 8.6 }
    ],
    recentFeedback: [
      { id: 1, employee: 'Sophie Martin', message: 'Les sessions de brainstorming hebdomadaires ont vraiment amélioré notre créativité collective.', date: '2025-02-20', sentiment: 'positive' },
      { id: 2, employee: 'Thomas Dubois', message: 'J\'apprécie vraiment la flexibilité des horaires de travail, cela m\'aide à maintenir un bon équilibre vie professionnelle/vie privée.', date: '2025-02-18', sentiment: 'positive' },
      { id: 3, employee: 'Emma Leroy', message: 'Les activités de team building du mois dernier ont considérablement renforcé notre cohésion d\'équipe.', date: '2025-02-15', sentiment: 'positive' },
      { id: 4, employee: 'Lucas Petit', message: 'Je pense que nous pourrions améliorer la communication entre les départements.', date: '2025-02-10', sentiment: 'neutral' }
    ],
    engagementTrends: [
      { period: 'Q1 2025', score: 8.2 },
      { period: 'Q4 2024', score: 7.9 },
      { period: 'Q3 2024', score: 7.7 },
      { period: 'Q2 2024', score: 7.5 }
    ]
  };

  // Format score
  const formatScore = (score: number) => {
    return score.toFixed(1);
  };

  // Get score color class
  const getScoreColorClass = (score: number) => {
    if (score >= 8.5) return 'text-green-500 dark:text-green-400';
    if (score >= 7.5) return 'text-blue-500 dark:text-blue-400';
    if (score >= 6.5) return 'text-amber-500 dark:text-amber-400';
    return 'text-red-500 dark:text-red-400';
  };

  // Get sentiment badge class
  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400';
      case 'neutral':
        return 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400';
      case 'negative':
        return 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400';
      default:
        return 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-lg">
              <Heart className="h-5 w-5 text-red-500" />
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatScore(cultureData.engagementScore)}/10
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Score d&apos;engagement</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-lg">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Initiatives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{cultureData.activeInitiatives}</div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Initiatives actives</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-lg">
              <Calendar className="h-5 w-5 text-blue-500" />
              Événements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {cultureData.upcomingEvents}
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Événements à venir</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-lg">
              <Users className="h-5 w-5 text-purple-500" />
              Participation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {cultureData.employeeParticipation}%
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Taux de participation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Valeurs fondamentales
            </CardTitle>
            <CardDescription>Évaluation des valeurs de l&apos;entreprise</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {cultureData.coreValues.map((value, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{value.name}</span>
                    <span className={`text-sm font-semibold ${getScoreColorClass(value.score)}`}>
                      {formatScore(value.score)}/10
                    </span>
                  </div>
                  <Progress value={(value.score / 10) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Tendances d&apos;engagement
            </CardTitle>
            <CardDescription>Évolution du score d&apos;engagement sur les derniers trimestres</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cultureData.engagementTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <TrendingUp className={`h-5 w-5 ${
                      index > 0 && trend.score > cultureData.engagementTrends[index - 1].score
                        ? 'text-green-500'
                        : index > 0 && trend.score < cultureData.engagementTrends[index - 1].score
                        ? 'text-red-500'
                        : 'text-gray-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{trend.period}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Score d&apos;engagement</p>
                    </div>
                  </div>
                  <span className={`text-lg font-bold ${getScoreColorClass(trend.score)}`}>
                    {formatScore(trend.score)}/10
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Retours récents des employés
          </CardTitle>
          <CardDescription>Derniers commentaires et suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cultureData.recentFeedback.map((feedback) => (
              <div key={feedback.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                <div className="flex justify-between mb-2">
                  <div className="font-medium text-gray-900 dark:text-white">{feedback.employee}</div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSentimentBadge(feedback.sentiment)}>
                      {feedback.sentiment === 'positive' && 'Positif'}
                      {feedback.sentiment === 'neutral' && 'Neutre'}
                      {feedback.sentiment === 'negative' && 'Négatif'}
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(feedback.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{feedback.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
