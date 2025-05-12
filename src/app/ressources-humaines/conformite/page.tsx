'use client';

import React, { useState } from 'react';
import MegaMenu from '../../../components/layout/MegaMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComplianceDashboard } from '@/components/ressources-humaines/conformite/ComplianceDashboard';
import { CompliancePolicies } from '@/components/ressources-humaines/conformite/CompliancePolicies';
import { ComplianceAudits } from '@/components/ressources-humaines/conformite/ComplianceAudits';

export default function Conformite() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Conformité
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Suivez les indicateurs de conformité, gérez les politiques et consultez les audits
          </p>
        </div>
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-1">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
            >
              Tableau de bord
            </TabsTrigger>
            <TabsTrigger 
              value="policies" 
              className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
            >
              Politiques
            </TabsTrigger>
            <TabsTrigger 
              value="audits" 
              className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
            >
              Audits
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <ComplianceDashboard />
          </TabsContent>
          
          <TabsContent value="policies">
            <CompliancePolicies />
          </TabsContent>
          
          <TabsContent value="audits">
            <ComplianceAudits />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
