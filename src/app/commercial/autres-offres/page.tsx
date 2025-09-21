'use client';

import { AutresOffresList } from '@/components/commercial/autres-offres/AutresOffresList';
import { Separator } from '@/components/ui/separator';
import { SparklesIcon } from 'lucide-react';

export default function AutresOffresPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-pink-500/20">
          <SparklesIcon className="h-8 w-8 text-amber-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Autres Offres
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Découvrez nos offres spéciales et services complémentaires
          </p>
        </div>
      </div>
      
      <Separator className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-pink-500/20 h-0.5 rounded-full" />
      
      <AutresOffresList />
    </div>
  );
}
