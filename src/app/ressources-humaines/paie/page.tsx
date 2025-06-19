'use client';

import React from 'react';
import MegaMenu from '../../../components/layout/MegaMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PayrollDashboard } from '@/components/ressources-humaines/paie/PayrollDashboard';
import { EmployeeSalaries } from '@/components/ressources-humaines/paie/EmployeeSalaries';
import { PayrollReports } from '@/components/ressources-humaines/paie/PayrollReports';

export default function Paie() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">Gestion de la Paie</h1>
        
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-1">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="salaries">Salaires</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <PayrollDashboard />
          </TabsContent>

          <TabsContent value="salaries">
            <EmployeeSalaries />
          </TabsContent>

          <TabsContent value="reports">
            <PayrollReports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
