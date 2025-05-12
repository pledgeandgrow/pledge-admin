'use client';

import { CommercialLayout } from '@/components/commercial/layout/CommercialLayout';
import { WaitlistList } from '@/components/commercial/waitlist/WaitlistList';

export default function WaitlistPage() {
  return (
    <CommercialLayout>
      <div className="p-8">
        <WaitlistList />
      </div>
    </CommercialLayout>
  );
}
