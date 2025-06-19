'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, CheckCircle, Clock, Calendar } from 'lucide-react';

interface RecruitmentStep {
  etape: string;
  description: string;
  statut: 'En cours' | 'À venir' | 'À planifier';
  candidatsTraites: number;
  candidatsSelectionnes: number;
}

interface RecruitmentProcessProps {
  processusRecrutement: RecruitmentStep[];
}

const RecruitmentProcess: React.FC<RecruitmentProcessProps> = ({ processusRecrutement }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'À venir':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'À planifier':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'En cours':
        return <Clock className="h-5 w-5 text-green-500" />;
      case 'À venir':
        return <Calendar className="h-5 w-5 text-yellow-500" />;
      case 'À planifier':
        return <Clock className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const calculateProgressPercentage = (treated: number, selected: number) => {
    if (treated === 0) return 0;
    return Math.round((selected / treated) * 100);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Processus de Recrutement</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Suivez l&apos;avancement des différentes étapes du processus de recrutement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processusRecrutement.map((etape, index) => (
              <Card 
                key={index} 
                className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                      {getStatusIcon(etape.statut)}
                      {etape.etape}
                    </CardTitle>
                    <Badge className={`${getStatusColor(etape.statut)} font-normal`}>
                      {etape.statut}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{etape.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Candidats traités:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{etape.candidatsTraites}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Candidats sélectionnés:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{etape.candidatsSelectionnes}</span>
                    </div>
                  </div>
                  
                  {etape.candidatsTraites > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Taux de sélection:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {calculateProgressPercentage(etape.candidatsTraites, etape.candidatsSelectionnes)}%
                        </span>
                      </div>
                      <Progress 
                        value={calculateProgressPercentage(etape.candidatsTraites, etape.candidatsSelectionnes)} 
                        className="h-2"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Statistiques Globales</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Vue d&apos;ensemble du processus de recrutement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-blue-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Candidats Totaux</h3>
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {processusRecrutement.reduce((acc, curr) => acc + curr.candidatsTraites, 0)}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Candidats Sélectionnés</h3>
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {processusRecrutement.reduce((acc, curr) => acc + curr.candidatsSelectionnes, 0)}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-yellow-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Étapes En Cours</h3>
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {processusRecrutement.filter(etape => etape.statut === 'En cours').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruitmentProcess;
