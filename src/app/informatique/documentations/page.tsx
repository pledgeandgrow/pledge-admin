'use client';

import { useState } from 'react';
import { useData } from '@/hooks/useData';
import { DocumentationHeader } from '@/components/informatique/documentation/DocumentationHeader';
import { DocumentationList } from '@/components/informatique/documentation/DocumentationList';

export default function DocumentationsPage() {
  // Using the actual 'documentation' type from DataType
  const { data: documents = [], loading, error } = useData('documentation');

  return (
    <div className="container mx-auto py-8 space-y-8">
      <DocumentationHeader 
        title="Documentations" 
        subtitle="Guides, manuels et procédures pour vos systèmes informatiques" 
      />
      
      <DocumentationList 
        documents={documents} 
        isLoading={loading} 
        error={error} 
      />
    </div>
  );
}
