'use client';

import { ContactLayout } from '@/components/contact/layout/ContactLayout';
import { ContactList } from '@/components/contact/ContactList';

export default function NetworkPage() {
  return (
    <ContactLayout>
      <ContactList 
        contactType="network" 
        title="Network" 
        description="Manage your professional network and track relationships" 
      />
    </ContactLayout>
  );
}
