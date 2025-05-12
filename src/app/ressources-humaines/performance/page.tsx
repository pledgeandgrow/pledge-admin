'use client';

import React, { useState } from 'react';
import MegaMenu from '../../../components/layout/MegaMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PerformanceDashboard } from '@/components/ressources-humaines/performance/PerformanceDashboard';
import { EmployeeEvaluations } from '@/components/ressources-humaines/performance/EmployeeEvaluations';
import { PerformanceGoals } from '@/components/ressources-humaines/performance/PerformanceGoals';

export default function Performance() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">Gestion de la Performance</h1>
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList>
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
            <TabsTrigger value="goals">Objectifs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <PerformanceDashboard />
          </TabsContent>
          
          <TabsContent value="evaluations">
            <EmployeeEvaluations />
          </TabsContent>
          
          <TabsContent value="goals">
            <PerformanceGoals />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
