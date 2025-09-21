'use client';

import { PrestationList } from '@/components/commercial/prestation/PrestationList';
import { Separator } from '@/components/ui/separator';

export default function PrestationsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Services & Prestations
          </span>
        </h1>
        <p className="text-muted-foreground">
          Découvrez nos services IT professionnels sur mesure pour votre entreprise
        </p>
      </div>
      <Separator className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20" />
      <PrestationList />
    </div>
  );
}
