'use client';

import { useState } from 'react';
import { Data } from '@/types/data';
import { DomainNameCard } from './DomainNameCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Plus, Loader2 } from 'lucide-react';

interface DomainNameListProps {
  domains: Data[];
  isLoading: boolean;
  error: Error | null;
  onAddDomain: () => void;
  onViewDomain: (domain: Data) => void;
}

export function DomainNameList({ 
  domains, 
  isLoading, 
  error, 
  onAddDomain,
  onViewDomain
}: DomainNameListProps) {
  const [activeTab, setActiveTab] = useState('all');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'expiring': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'expired': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'transferred': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'locked': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const categories = [
    { value: 'active', label: 'Actifs' },
    { value: 'expiring', label: 'Expirant bientôt' },
    { value: 'expired', label: 'Expirés' },
    { value: 'transferred', label: 'Transférés' }
  ];

  const filteredDomains = activeTab === 'all'
    ? domains
    : domains.filter(item => {
        const status = item.metadata?.status as string || 'active';
        return status.toLowerCase() === activeTab.toLowerCase();
      });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des noms de domaine...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg">
        <p>Une erreur est survenue lors du chargement des données.</p>
      </div>
    );
  }

  if (domains.length === 0) {
    return (
      <div className="text-center py-12">
        <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-medium">Aucun nom de domaine disponible</h3>
        <p className="text-muted-foreground mt-2">Ajoutez votre premier nom de domaine</p>
        <Button 
          onClick={onAddDomain}
          className="bg-gradient-to-r from-cyan-500 via-teal-500 to-green-500 text-white hover:opacity-90 mt-4"
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter un nom de domaine
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.value} value={category.value}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        <Button 
          onClick={onAddDomain}
          className="bg-gradient-to-r from-cyan-500 via-teal-500 to-green-500 text-white hover:opacity-90 ml-4"
        >
          <Plus className="mr-2 h-4 w-4" /> Nouveau domaine
        </Button>
      </div>
      
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDomains.map((domain) => (
            <DomainNameCard 
              key={domain.id} 
              domain={domain} 
              getStatusColor={getStatusColor}
              onView={onViewDomain}
            />
          ))}
        </div>
      </div>
    </>
  );
}
