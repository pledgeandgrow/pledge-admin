'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Clock, FileText, Info, Shield, TrendingUp } from 'lucide-react';

export function ComplianceDashboard() {
  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conformité Globale</CardTitle>
            <Shield className="h-4 w-4 text-blue-600 dark:text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <div className="mt-2">
              <Progress value={87} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              +2.5% depuis le dernier trimestre
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Politiques Actives</CardTitle>
            <FileText className="h-4 w-4 text-green-600 dark:text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-2">
              3 nouvelles politiques ce mois-ci
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audits en Cours</CardTitle>
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-2">
              Prochain audit prévu le 15/03/2025
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-2">
              Nécessitant une attention immédiate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Status */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Statut de Conformité par Département</CardTitle>
            <CardDescription>
              Vue d'ensemble de la conformité par département
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-medium">Ressources Humaines</span>
                  </div>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-medium">Finance</span>
                  </div>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-medium">IT</span>
                  </div>
                  <span className="text-sm font-medium">88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-medium">Marketing</span>
                  </div>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-medium">Opérations</span>
                  </div>
                  <span className="text-sm font-medium">84%</span>
                </div>
                <Progress value={84} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Alertes Récentes</CardTitle>
            <CardDescription>
              Problèmes de conformité nécessitant une attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-lg border p-3">
                <AlertCircle className="mt-1 h-5 w-5 text-red-600 dark:text-red-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Formation RGPD expirée
                  </p>
                  <p className="text-sm text-muted-foreground">
                    12 employés n'ont pas complété la formation obligatoire RGPD
                  </p>
                  <div className="flex items-center pt-2">
                    <Badge variant="outline" className="text-red-600 dark:text-red-500 border-red-600 dark:border-red-500">
                      Haute priorité
                    </Badge>
                    <Button variant="link" size="sm" className="ml-auto h-8 px-2">
                      Voir les détails
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4 rounded-lg border p-3">
                <Info className="mt-1 h-5 w-5 text-amber-600 dark:text-amber-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Politique de sécurité à mettre à jour
                  </p>
                  <p className="text-sm text-muted-foreground">
                    La politique de sécurité IT doit être mise à jour d'ici le 15/03/2025
                  </p>
                  <div className="flex items-center pt-2">
                    <Badge variant="outline" className="text-amber-600 dark:text-amber-500 border-amber-600 dark:border-amber-500">
                      Moyenne priorité
                    </Badge>
                    <Button variant="link" size="sm" className="ml-auto h-8 px-2">
                      Voir les détails
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4 rounded-lg border p-3">
                <CheckCircle className="mt-1 h-5 w-5 text-green-600 dark:text-green-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Audit interne complété
                  </p>
                  <p className="text-sm text-muted-foreground">
                    L'audit interne du département Finance a été complété avec succès
                  </p>
                  <div className="flex items-center pt-2">
                    <Badge variant="outline" className="text-green-600 dark:text-green-500 border-green-600 dark:border-green-500">
                      Résolu
                    </Badge>
                    <Button variant="link" size="sm" className="ml-auto h-8 px-2">
                      Voir le rapport
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Trends */}
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tendances de Conformité</CardTitle>
            <CardDescription>
              Évolution de la conformité au cours des 12 derniers mois
            </CardDescription>
          </div>
          <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">Graphique de tendances (représentation visuelle)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
