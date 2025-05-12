'use client';

import { CommercialLayout } from '@/components/commercial/layout/CommercialLayout';
import { AutresOffresList } from '@/components/commercial/autres-offres/AutresOffresList';

export default function AutresOffresPage() {
  return (
    <CommercialLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Autres Offres</h1>
        <AutresOffresList />
      </div>
    </CommercialLayout>
  );
}
