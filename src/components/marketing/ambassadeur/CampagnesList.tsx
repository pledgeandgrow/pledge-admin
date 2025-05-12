'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Calendar, Users, BarChart, Gift, MoreVertical, ExternalLink } from 'lucide-react';

const campagnes = [
  {
    id: 1,
    name: 'Lancement Produit X',
    status: 'En cours',
    startDate: '15 Fév 2025',
    endDate: '15 Mai 2025',
    ambassadeurs: 12,
    objectif: 'Augmenter la notoriété',
    budget: '€5,000',
    progress: 45,
    kpis: {
      impressions: '125K',
      engagement: '4.2%',
      conversions: 86
    }
  },
  {
    id: 2,
    name: 'Programme de Parrainage',
    status: 'En cours',
    startDate: '01 Jan 2025',
    endDate: '31 Déc 2025',
    ambassadeurs: 48,
    objectif: 'Acquisition clients',
    budget: '€12,000',
    progress: 32,
    kpis: {
      impressions: '210K',
      engagement: '3.8%',
      conversions: 124
    }
  },
  {
    id: 3,
    name: 'Témoignages Clients',
    status: 'Planifiée',
    startDate: '01 Mar 2025',
    endDate: '30 Avr 2025',
    ambassadeurs: 8,
    objectif: 'Social proof',
    budget: '€3,000',
    progress: 0,
    kpis: {
      impressions: '0',
      engagement: '0%',
      conversions: 0
    }
  },
  {
    id: 4,
    name: 'Promotion Été 2024',
    status: 'Terminée',
    startDate: '01 Juin 2024',
    endDate: '31 Août 2024',
    ambassadeurs: 15,
    objectif: 'Ventes saisonnières',
    budget: '€8,000',
    progress: 100,
    kpis: {
      impressions: '350K',
      engagement: '5.1%',
      conversions: 215
    }
  },
  {
    id: 5,
    name: 'Webinaires Experts',
    status: 'En cours',
    startDate: '01 Fév 2025',
    endDate: '30 Juin 2025',
    ambassadeurs: 5,
    objectif: 'Éducation marché',
    budget: '€4,500',
    progress: 28,
    kpis: {
      impressions: '45K',
      engagement: '6.2%',
      conversions: 32
    }
  }
];

export function CampagnesList() {
  return (
    <Card className="border dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-900 dark:text-white">Campagnes Ambassadeurs</CardTitle>
          <Button variant="outline" className="h-8 gap-1">
            <Calendar className="h-4 w-4" />
            <span>Calendrier</span>
          </Button>
        </div>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Gérez vos campagnes et suivez leurs performances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {campagnes.map((campagne) => (
            <div 
              key={campagne.id} 
              className="p-4 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-4 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{campagne.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={
                          campagne.status === 'En cours' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : campagne.status === 'Planifiée'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }>
                          {campagne.status}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {campagne.startDate} - {campagne.endDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        <ExternalLink className="h-4 w-4" />
                        <span className="hidden sm:inline">Détails</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Modifier</DropdownMenuItem>
                          <DropdownMenuItem>Ajouter des ambassadeurs</DropdownMenuItem>
                          <DropdownMenuItem>Exporter les résultats</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {campagne.status === 'En cours' ? (
                            <DropdownMenuItem className="text-amber-600 dark:text-amber-400">Mettre en pause</DropdownMenuItem>
                          ) : campagne.status === 'Planifiée' ? (
                            <DropdownMenuItem className="text-green-600 dark:text-green-400">Démarrer</DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Objectif</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{campagne.objectif}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Budget</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{campagne.budget}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{campagne.ambassadeurs} ambassadeurs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Gift className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Récompenses personnalisées</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Progression</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{campagne.progress}%</span>
                    </div>
                    <Progress value={campagne.progress} className="h-2" />
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-750 p-3 rounded-lg min-w-[200px]">
                  <div className="flex items-center gap-1 mb-2">
                    <BarChart className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">KPIs</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Impressions</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{campagne.kpis.impressions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Engagement</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{campagne.kpis.engagement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Conversions</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{campagne.kpis.conversions}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
