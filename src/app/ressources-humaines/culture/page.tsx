'use client';

import React, { useState } from 'react';
import MegaMenu from '../../../components/layout/MegaMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CultureDashboard } from '@/components/ressources-humaines/culture/CultureDashboard';
import { CultureInitiatives } from '@/components/ressources-humaines/culture/CultureInitiatives';
import { CultureEvents } from '@/components/ressources-humaines/culture/CultureEvents';

export default function Culture() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">
          Culture d&apos;Entreprise & Croissance
        </h1>
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList>
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
            <TabsTrigger value="events">Événements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <CultureDashboard />
          </TabsContent>
          
          <TabsContent value="initiatives">
            <CultureInitiatives />
          </TabsContent>
          
          <TabsContent value="events">
            <CultureEvents />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
