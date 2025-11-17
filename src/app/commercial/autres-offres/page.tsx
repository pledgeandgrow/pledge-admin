'use client';

import { AutresOffresList } from '@/components/commercial/autres-offres/AutresOffresList';
import { Separator } from '@/components/ui/separator';
import { SparklesIcon } from 'lucide-react';

export default function AutresOffresPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-gray-800">
            <SparklesIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Autres Offres
            </h1>
            <p className="text-gray-400 mt-1">
              Découvrez nos offres spéciales et services complémentaires
            </p>
          </div>
        </div>
        
        <Separator className="bg-gray-800 h-0.5 rounded-full" />
        
        <AutresOffresList />
      </div>
    </div>
  );
}
