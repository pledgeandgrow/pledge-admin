'use client';

import { useState } from 'react';
import { Data } from '@/types/data';
import { AutomationCard } from './AutomationCard';
import { AutomationForm } from './AutomationForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bot, Plus } from 'lucide-react';

interface AutomationListProps {
  automations: Data[];
  isLoading: boolean;
  error: Error | null;
}

export function AutomationList({ automations, isLoading, error }: AutomationListProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAutomation, setSelectedAutomation] = useState<Data | undefined>(undefined);
  const [formOpen, setFormOpen] = useState(false);

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      'ci-cd': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'scripts': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'workflow': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'devops': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      'testing': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'monitoring': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400'
    };
    return colors[tag.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const categories = [
    { value: 'ci-cd', label: 'CI/CD' },
    { value: 'scripts', label: 'Scripts' },
    { value: 'workflow', label: 'Workflow' },
    { value: 'devops', label: 'DevOps' },
    { value: 'monitoring', label: 'Monitoring' }
  ];

  const filteredAutomations = activeTab === 'all'
    ? automations
    : automations.filter(item => {
        const tags = item.tags || [];
        return tags.includes(activeTab);
      });

  const handleViewAutomation = (automation: Data) => {
    setSelectedAutomation(automation);
    setFormOpen(true);
  };
  
  const handleAddAutomation = () => {
    setSelectedAutomation(undefined);
    setFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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

  if (automations.length === 0) {
    return (
      <div className="text-center py-12">
        <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-medium">Aucune solution d'automatisation disponible</h3>
        <p className="text-muted-foreground mt-2">Les solutions seront ajoutées prochainement.</p>
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
          onClick={handleAddAutomation}
          className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white hover:opacity-90 ml-4"
        >
          <Plus className="mr-2 h-4 w-4" /> Nouvelle automatisation
        </Button>
      </div>
      
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAutomations.map((automation) => (
            <AutomationCard 
              key={automation.id} 
              automation={automation} 
              getTagColor={getTagColor}
              onView={handleViewAutomation}
            />
          ))}
        </div>
      </div>
      
      <AutomationForm 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        initialData={selectedAutomation} 
      />
    </>
  );
}
