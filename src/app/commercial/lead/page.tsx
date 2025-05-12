'use client';

import { LeadList } from '@/components/commercial/lead/LeadList';
import { CommercialLayout } from '@/components/commercial/layout/CommercialLayout';
import { Separator } from '@/components/ui/separator';

export default function LeadPage() {
  return (
    <CommercialLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Gestion des Leads
          </h1>
          <p className="text-muted-foreground">
            Gérez et suivez vos prospects commerciaux de manière efficace
          </p>
        </div>
        <Separator className="my-6" />
        <LeadList />
      </div>
    </CommercialLayout>
  );
}
