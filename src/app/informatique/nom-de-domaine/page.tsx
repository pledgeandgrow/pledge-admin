'use client';

import { useState } from 'react';
import { useData } from '@/hooks/useData';
import { DomainNameHeader } from '@/components/informatique/nom-de-domaine/DomainNameHeader';
import { DomainNameList } from '@/components/informatique/nom-de-domaine/DomainNameList';
import { DomainNameForm } from '@/components/informatique/nom-de-domaine/DomainNameForm';
import { Data } from '@/types/data';

export default function DomainPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Data | undefined>(undefined);
  // Using 'documentation' type as a placeholder since 'domain-name' is not in DataType
  const { data: domains = [], loading, error } = useData('documentation');

  const handleAddDomain = () => {
    setSelectedDomain(undefined);
    setFormOpen(true);
  };

  const handleViewDomain = (domain: Data) => {
    setSelectedDomain(domain);
    setFormOpen(true);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <DomainNameHeader 
        title="Noms de Domaine" 
        subtitle="Gérez vos noms de domaine et leurs paramètres" 
      />
      
      <DomainNameList 
        domains={domains} 
        isLoading={loading} 
        error={error}
        onAddDomain={handleAddDomain}
        onViewDomain={handleViewDomain}
      />

      <DomainNameForm 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        initialData={selectedDomain} 
      />
    </div>
  );
}
