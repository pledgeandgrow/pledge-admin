'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Award, Clock, BookOpen, GraduationCap } from 'lucide-react';

export function FormationStatistics() {
  // Sample data for the statistics
  const statisticsData = {
    totalFormations: 28,
    totalHeuresFormation: 580,
    employesFormes: 145,
    tauxSatisfaction: 92,
    budgetUtilise: 75,
    categoriesPopulaires: [
      { nom: 'Technique', pourcentage: 35 },
      { nom: 'Management', pourcentage: 25 },
      { nom: 'Soft Skills', pourcentage: 20 },
      { nom: 'Sécurité', pourcentage: 15 },
      { nom: 'Réglementaire', pourcentage: 5 }
    ],
    formationsParDepartement: [
      { departement: 'Technologie', nombre: 48 },
      { departement: 'Marketing', nombre: 32 },
      { departement: 'Commercial', nombre: 24 },
      { departement: 'Ressources Humaines', nombre: 22 },
      { departement: 'Finance', nombre: 19 }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-lg">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Formations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{statisticsData.totalFormations}</div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Formations disponibles</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">En ligne</span>
                <Badge className="bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">En présentiel</span>
                <Badge className="bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400">16</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-lg">
              <Clock className="h-5 w-5 text-purple-500" />
              Heures de formation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{statisticsData.totalHeuresFormation}</div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Heures dispensées</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Moyenne par employé</span>
                <Badge className="bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400">
                  {Math.round(statisticsData.totalHeuresFormation / statisticsData.employesFormes * 10) / 10}h
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-lg">
              <Users className="h-5 w-5 text-green-500" />
              Employés formés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{statisticsData.employesFormes}</div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Participants aux formations</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Taux de participation</span>
                <Badge className="bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400">85%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-lg">
              <Award className="h-5 w-5 text-amber-500" />
              Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{statisticsData.tauxSatisfaction}%</div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Taux de satisfaction moyen</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Recommandation</span>
                <Badge className="bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400">88%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">Catégories de formations</CardTitle>
            <CardDescription>Répartition des formations par catégorie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statisticsData.categoriesPopulaires.map((categorie, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">{categorie.nom}</span>
                    <span className="text-gray-600 dark:text-gray-300">{categorie.pourcentage}%</span>
                  </div>
                  <Progress 
                    value={categorie.pourcentage} 
                    className="h-2"
                    style={{
                      '--progress-foreground': categorie.nom === 'Technique' ? 'var(--blue-500)' :
                      categorie.nom === 'Management' ? 'var(--purple-500)' :
                      categorie.nom === 'Soft Skills' ? 'var(--green-500)' :
                      categorie.nom === 'Sécurité' ? 'var(--red-500)' :
                      'var(--gray-500)'
                    } as React.CSSProperties}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">Budget formation</CardTitle>
            <CardDescription>Utilisation du budget annuel de formation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="relative h-40 w-40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{statisticsData.budgetUtilise}%</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Utilisé</div>
                  </div>
                </div>
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={`${statisticsData.budgetUtilise * 2.51} 251`}
                    strokeDashoffset="0"
                    className="text-blue-500 dark:text-blue-400"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Budget total</span>
                <Badge className="bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400">120 000 €</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Budget utilisé</span>
                <Badge className="bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400">90 000 €</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Budget restant</span>
                <Badge className="bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400">30 000 €</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg">Formations par département</CardTitle>
          <CardDescription>Nombre de formations suivies par département</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {statisticsData.formationsParDepartement.map((dept, index) => (
              <Card key={index} className="bg-gray-50 dark:bg-gray-900 border dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{dept.nombre}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{dept.departement}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
