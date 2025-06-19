'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Award, Clock, Target, BarChart } from 'lucide-react';

export function PerformanceDashboard() {
  // Sample data for the performance dashboard
  const performanceData = {
    averagePerformanceScore: 7.8,
    employeesEvaluated: 65,
    topPerformers: 12,
    improvementNeeded: 8,
    upcomingReviews: 15,
    departmentPerformance: [
      { department: 'Technologie', score: 8.2, employees: 20 },
      { department: 'Marketing', score: 7.9, employees: 12 },
      { department: 'Commercial', score: 8.0, employees: 15 },
      { department: 'Ressources Humaines', score: 7.6, employees: 8 },
      { department: 'Finance', score: 7.4, employees: 7 }
    ],
    performanceTrends: [
      { period: 'Q1 2025', score: 7.8 },
      { period: 'Q4 2024', score: 7.6 },
      { period: 'Q3 2024', score: 7.5 },
      { period: 'Q2 2024', score: 7.3 }
    ],
    keyObjectives: [
      { name: 'Amélioration de la productivité', progress: 75 },
      { name: 'Réduction des coûts opérationnels', progress: 60 },
      { name: 'Satisfaction client', progress: 85 },
      { name: 'Innovation produit', progress: 70 }
    ]
  };

  // Format score
  const formatScore = (score: number) => {
    return score.toFixed(1);
  };

  // Get score color class
  const getScoreColorClass = (score: number) => {
    if (score >= 8.0) return 'text-green-500 dark:text-green-400';
    if (score >= 7.0) return 'text-blue-500 dark:text-blue-400';
    if (score >= 6.0) return 'text-amber-500 dark:text-amber-400';
    return 'text-red-500 dark:text-red-400';
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-lg">
              <BarChart className="h-5 w-5 text-blue-500" />
              Performance Moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatScore(performanceData.averagePerformanceScore)}/10
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Score global</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-lg">
              <Users className="h-5 w-5 text-purple-500" />
              Employés Évalués
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{performanceData.employeesEvaluated}</div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Sur 70 employés</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-lg">
              <Award className="h-5 w-5 text-green-500" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {performanceData.topPerformers}
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Employés à haute performance</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-lg">
              <Clock className="h-5 w-5 text-orange-500" />
              Évaluations à venir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {performanceData.upcomingReviews}
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Dans les 30 prochains jours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Performance par département
            </CardTitle>
            <CardDescription>Score moyen de performance par département</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {performanceData.departmentPerformance.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{dept.department}</span>
                      <Badge className="ml-2 bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400">
                        {dept.employees} employés
                      </Badge>
                    </div>
                    <span className={`text-sm font-semibold ${getScoreColorClass(dept.score)}`}>
                      {formatScore(dept.score)}/10
                    </span>
                  </div>
                  <Progress value={(dept.score / 10) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Tendances de performance
            </CardTitle>
            <CardDescription>Évolution du score moyen sur les derniers trimestres</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.performanceTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <TrendingUp className={`h-5 w-5 ${
                      index > 0 && trend.score > performanceData.performanceTrends[index - 1].score
                        ? 'text-green-500'
                        : index > 0 && trend.score < performanceData.performanceTrends[index - 1].score
                        ? 'text-red-500'
                        : 'text-gray-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{trend.period}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Score moyen</p>
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
            Objectifs clés de performance
          </CardTitle>
          <CardDescription>Progression vers les objectifs d&apos;entreprise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {performanceData.keyObjectives.map((objective, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{objective.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{objective.progress}%</span>
                </div>
                <Progress value={objective.progress} className="h-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {objective.progress < 50 
                    ? 'Nécessite attention' 
                    : objective.progress < 75 
                    ? 'En bonne voie' 
                    : 'Excellente progression'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
