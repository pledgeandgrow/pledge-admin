'use client';

import React from 'react';
import MegaMenu from '../../../components/layout/MegaMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormationCatalogue } from '@/components/ressources-humaines/formation/FormationCatalogue';
import { FormationStatistics } from '@/components/ressources-humaines/formation/FormationStatistics';
import { EmployeeTrainingProgress } from '@/components/ressources-humaines/formation/EmployeeTrainingProgress';

export default function Formation() {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Formation</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez les formations, suivez les progrès des employés et consultez les statistiques
            </p>
          </div>

          <Tabs defaultValue="catalogue" className="space-y-4">
            <TabsList className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-1">
              <TabsTrigger 
                value="catalogue" 
                className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
              >
                Catalogue de formations
              </TabsTrigger>
              <TabsTrigger 
                value="progress" 
                className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
              >
                Suivi des employés
              </TabsTrigger>
              <TabsTrigger 
                value="statistics" 
                className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
              >
                Statistiques
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="catalogue" className="space-y-4 mt-6">
              <FormationCatalogue />
            </TabsContent>
            
            <TabsContent value="progress" className="space-y-4 mt-6">
              <EmployeeTrainingProgress />
            </TabsContent>
            
            <TabsContent value="statistics" className="space-y-4 mt-6">
              <FormationStatistics />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
