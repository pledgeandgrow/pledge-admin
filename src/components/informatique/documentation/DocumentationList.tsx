'use client';

import { useState } from 'react';
import { Data } from '@/types/data';
import { DocumentationCard } from './DocumentationCard';
import { DocumentationFilters } from './DocumentationFilters';
import { DocumentationForm } from './DocumentationForm';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

interface DocumentationListProps {
  documents: Data[];
  isLoading: boolean;
  error: Error | null;
}

export function DocumentationList({ documents, isLoading, error }: DocumentationListProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<Data | undefined>(undefined);
  const [formOpen, setFormOpen] = useState(false);

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      'guide': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'manuel': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'procedure': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'reference': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      'technique': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'formation': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400'
    };
    return colors[tag.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const categories = [
    { value: 'guide', label: 'Guides' },
    { value: 'manuel', label: 'Manuels' },
    { value: 'procedure', label: 'Procédures' },
    { value: 'reference', label: 'Références' },
    { value: 'technique', label: 'Techniques' }
  ];

  const filteredDocuments = activeTab === 'all'
    ? documents
    : documents.filter(doc => {
        const tags = doc.tags || [];
        return tags.includes(activeTab);
      });

  const handleViewDocument = (document: Data) => {
    setSelectedDocument(document);
    setFormOpen(true);
  };
  
  const handleAddDocument = () => {
    setSelectedDocument(undefined);
    setFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
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

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-medium">Aucune documentation disponible</h3>
        <p className="text-muted-foreground mt-2">Les documentations seront ajoutées prochainement.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <DocumentationFilters 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            categories={categories} 
          />
        </div>
        
        <Button 
          onClick={handleAddDocument}
          className="bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 text-white hover:opacity-90 ml-4"
        >
          <Plus className="mr-2 h-4 w-4" /> Nouvelle documentation
        </Button>
      </div>
      
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <DocumentationCard 
              key={doc.id} 
              document={doc} 
              getTagColor={getTagColor}
              onView={handleViewDocument}
            />
          ))}
        </div>
      </div>
      
      <DocumentationForm 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        initialData={selectedDocument} 
      />
    </>
  );
}
