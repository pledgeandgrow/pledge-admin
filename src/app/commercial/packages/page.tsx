'use client';

import { PackageList } from '@/components/commercial/package/PackageList';
import { Separator } from '@/components/ui/separator';
import { Package2Icon } from 'lucide-react';

export default function PackagesPage() {
  return (
    <div className="container mx-auto py-12 space-y-12">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20">
          <Package2Icon className="h-8 w-8 text-indigo-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Packages & Solutions
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Découvrez nos packages de services IT sur mesure pour votre entreprise
          </p>
        </div>
      </div>
      
      <Separator className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 h-0.5 rounded-full" />
      
      <PackageList />
    </div>
  );
}
