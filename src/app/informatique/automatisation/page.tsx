'use client';

import { useData } from '@/hooks/useData';
import { AutomationHeader } from '@/components/informatique/automatisation/AutomationHeader';
import { AutomationList } from '@/components/informatique/automatisation/AutomationList';

export default function AutomatisationPage() {
  // Using 'documentation' type as a placeholder since 'automation' is not in DataType
  const { data: automations = [], loading, error } = useData('documentation');

  return (
    <div className="container mx-auto py-10 space-y-8">
      <AutomationHeader 
        title="Solutions d'Automatisation" 
        subtitle="Découvrez nos outils et solutions pour automatiser vos processus" 
      />
      
      <AutomationList 
        automations={automations} 
        isLoading={loading} 
        error={error} 
      />
    </div>
  );
}
