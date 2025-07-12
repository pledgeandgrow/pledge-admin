'use client';

import { ContactLayout } from '@/components/contact/layout/ContactLayout';
import { ContactList } from '@/components/contact/ContactList';

export default function PartnersPage() {
  return (
    <ContactLayout>
      <ContactList 
        contactType="partner" 
        title="Partners" 
        description="Manage partnerships and track mutual benefits" 
      />
    </ContactLayout>
  );
}
