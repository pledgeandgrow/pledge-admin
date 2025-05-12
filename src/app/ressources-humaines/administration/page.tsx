'use client';

import React, { useState } from 'react';
import MegaMenu from '../../../components/layout/MegaMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserContractDisplay } from '@/components/ressources-humaines/administration/UserContractDisplay';
import { ContractCreator } from '@/components/ressources-humaines/administration/ContractCreator';
import { Contracts } from '@/components/ressources-humaines/administration/Contracts';

export default function Administration() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Administration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gérez les utilisateurs, créez des contrats et consultez les documents administratifs
          </p>
        </div>
        
        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-1">
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
            >
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger 
              value="contracts" 
              className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
            >
              Créateur de Contrats
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
            >
              Contrats
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UserContractDisplay />
          </TabsContent>
          
          <TabsContent value="contracts">
            <ContractCreator />
          </TabsContent>
          
          <TabsContent value="settings">
            <Contracts />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}