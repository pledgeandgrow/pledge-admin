'use client';

import { CommercialLayout } from '@/components/commercial/layout/CommercialLayout';
import { PackageList } from '@/components/commercial/package/PackageList';
import { Separator } from '@/components/ui/separator';

export default function PackagesPage() {
  return (
    <CommercialLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Packages & Solutions
            </span>
          </h1>
          <p className="text-muted-foreground">
            Découvrez nos packages de services IT sur mesure pour votre entreprise
          </p>
        </div>
        
        <Separator className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20" />
        
        <PackageList />
      </div>
    </CommercialLayout>
  );
}
