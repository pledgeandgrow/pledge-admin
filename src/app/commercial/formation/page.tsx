'use client';

import { CommercialLayout } from '@/components/commercial/layout/CommercialLayout';
import { FormationList } from '@/components/commercial/formation/FormationList';

export default function FormationPage() {
  return (
    <CommercialLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Gestion des Formations</h1>
        <FormationList />
      </div>
    </CommercialLayout>
  );
}
