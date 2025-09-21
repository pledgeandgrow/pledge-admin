'use client';

import { FormationList } from '@/components/commercial/formation/FormationList';
import { Separator } from '@/components/ui/separator';
import { GraduationCapIcon } from 'lucide-react';

export default function FormationPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-teal-500/20">
          <GraduationCapIcon className="h-8 w-8 text-blue-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
              Formations
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez et organisez vos offres de formation professionnelle
          </p>
        </div>
      </div>
      
      <Separator className="bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 h-0.5 rounded-full" />
      
      <FormationList />
    </div>
  );
}
