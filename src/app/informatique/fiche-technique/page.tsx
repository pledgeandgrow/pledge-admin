'use client';

import { useState, useEffect } from 'react';
import { TechnicalSheet } from '@/components/informatique/fiche-technique/TechnicalSheet';
import { AddEntityDialog } from '@/components/informatique/fiche-technique/AddEntityDialog';
import { Separator } from '@/components/ui/separator';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle } from 'lucide-react';

interface TechInfo {
  name: string;
  value: string;
  version?: string;
  description?: string;
  icon?: React.ReactNode;
}

interface TechInfoFormData {
  name: string;
  value: string;
  version?: string;
  description?: string;
}

interface TechStack {
  category: string;
  status: 'production' | 'development' | 'testing';
  lastUpdate: string;
  frameworks: TechInfo[];
  languages: TechInfo[];
  databases: TechInfo[];
  tools: TechInfo[];
  deployment: TechInfo[];
  infrastructure: TechInfo[];
}

const initialTechStack: TechStack = {
  category: 'Development Stack',
  status: 'production',
  lastUpdate: new Date().toISOString().split('T')[0],
  frameworks: [],
  languages: [],
  databases: [],
  tools: [],
  deployment: [],
  infrastructure: []
};

const STORAGE_KEY = 'technical-sheet-data';

export default function FicheTechniquePage() {
  const [techStack, setTechStack] = useState<TechStack>(initialTechStack);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEntityType, setSelectedEntityType] = useState('');
  const { toast } = useToast();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setTechStack(parsedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(techStack));
  }, [techStack]);

  const entityTypes = [
    { label: 'Framework', value: 'framework', description: 'Add a new framework or library' },
    { label: 'Language', value: 'language', description: 'Add a new programming language' },
    { label: 'Database', value: 'database', description: 'Add a new database system' },
    { label: 'Tool', value: 'tool', description: 'Add a new development tool' },
    { label: 'Infrastructure', value: 'infrastructure', description: 'Add new infrastructure component' },
  ];

  const handleAddEntity = (type: string) => {
    setSelectedEntityType(type);
    setIsAddModalOpen(true);
  };

  const handleSubmitEntity = (data: TechInfoFormData) => {
    const newEntity: TechInfo = {
      name: data.name,
      value: data.value,
      version: data.version,
      description: data.description,
    };

    setTechStack(prev => {
      const newStack = { ...prev };
      switch (selectedEntityType) {
        case 'framework':
          newStack.frameworks = [...prev.frameworks, newEntity];
          break;
        case 'language':
          newStack.languages = [...prev.languages, newEntity];
          break;
        case 'database':
          newStack.databases = [...prev.databases, newEntity];
          break;
        case 'tool':
          newStack.tools = [...prev.tools, newEntity];
          break;
        case 'infrastructure':
          newStack.infrastructure = [...prev.infrastructure, newEntity];
          break;
      }
      newStack.lastUpdate = new Date().toISOString().split('T')[0];
      return newStack;
    });

    toast({
      title: `${data.name} added successfully`,
      description: `New ${selectedEntityType} has been added to your technical specifications.`,
      variant: 'default',
    });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <MegaMenu />
      <main className="flex-1 ml-64 min-h-screen overflow-auto">
        <div className="max-w-7xl mx-auto py-4">
          <div className="p-6 space-y-6">
            {/* Header section with Add Entity button */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Fiche Technique
                </h1>
                <p className="text-muted-foreground">
                  Explorez nos outils de développement, frameworks, et technologies utilisés
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Entity
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {entityTypes.map((type) => (
                    <DropdownMenuItem 
                      key={type.value}
                      onClick={() => handleAddEntity(type.value)}
                      className="flex flex-col items-start"
                    >
                      <span className="font-medium">{type.label}</span>
                      <span className="text-xs text-muted-foreground">{type.description}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Separator className="my-6" />

            {/* Technical Sheet */}
            <TechnicalSheet data={techStack} />
          </div>
        </div>
      </main>

      {/* Add Entity Dialog */}
      <AddEntityDialog
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleSubmitEntity}
        type={selectedEntityType}
      />
    </div>
  );
}
