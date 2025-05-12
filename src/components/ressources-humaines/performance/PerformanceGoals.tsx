'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, CheckCircle, Clock } from 'lucide-react';

export function PerformanceGoals() {
  // Sample data for performance goals
  const goals = [
    {
      id: 1,
      title: 'Amélioration de la productivité',
      description: 'Augmenter la productivité globale de l\'équipe de 15% d\'ici la fin du trimestre',
      progress: 75,
      dueDate: '2025-03-31',
      status: 'in_progress',
      category: 'Équipe'
    },
    {
      id: 2,
      title: 'Réduction des coûts opérationnels',
      description: 'Réduire les coûts opérationnels de 10% par rapport au trimestre précédent',
      progress: 60,
      dueDate: '2025-03-31',
      status: 'in_progress',
      category: 'Finance'
    },
    {
      id: 3,
      title: 'Satisfaction client',
      description: 'Atteindre un score de satisfaction client de 90% ou plus',
      progress: 85,
      dueDate: '2025-03-31',
      status: 'in_progress',
      category: 'Client'
    },
    {
      id: 4,
      title: 'Formation des employés',
      description: 'Compléter la formation sur les nouvelles technologies pour toute l\'équipe',
      progress: 100,
      dueDate: '2025-02-15',
      status: 'completed',
      category: 'Formation'
    },
    {
      id: 5,
      title: 'Innovation produit',
      description: 'Développer et lancer au moins 2 nouvelles fonctionnalités produit',
      progress: 70,
      dueDate: '2025-03-31',
      status: 'in_progress',
      category: 'Produit'
    }
  ];

  // Get status badge class and text
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          class: 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400',
          text: 'Complété'
        };
      case 'in_progress':
        return {
          class: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400',
          text: 'En cours'
        };
      case 'not_started':
        return {
          class: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400',
          text: 'Non commencé'
        };
      default:
        return {
          class: 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-400',
          text: status
        };
    }
  };

  // Get category badge class
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Équipe':
        return 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400';
      case 'Finance':
        return 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400';
      case 'Client':
        return 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400';
      case 'Formation':
        return 'bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 dark:text-orange-400';
      case 'Produit':
        return 'bg-pink-500/10 text-pink-500 dark:bg-pink-500/20 dark:text-pink-400';
      default:
        return 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Objectifs de performance
          </CardTitle>
          <CardDescription>
            Suivez les objectifs et les indicateurs de performance clés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-6">
            <div className="flex gap-2">
              <Badge className="bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400">
                En cours: {goals.filter(g => g.status === 'in_progress').length}
              </Badge>
              <Badge className="bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400">
                Complétés: {goals.filter(g => g.status === 'completed').length}
              </Badge>
            </div>
            <Button>
              <Target className="h-4 w-4 mr-2" />
              Nouvel objectif
            </Button>
          </div>

          <div className="space-y-6">
            {goals.map((goal) => (
              <Card key={goal.id} className="bg-gray-50 dark:bg-gray-800/50 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                        <Badge className={getCategoryBadge(goal.category)}>
                          {goal.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{goal.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusBadge(goal.status).class}>
                        {getStatusBadge(goal.status).text}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>Échéance: {new Date(goal.dueDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progression</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  
                  {goal.status === 'completed' && (
                    <div className="mt-4 flex items-center gap-2 text-green-500 dark:text-green-400">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Objectif atteint</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
