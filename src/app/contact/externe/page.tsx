'use client';

import { ContactLayout } from '@/components/contact/layout/ContactLayout';
import { ContactList } from '@/components/contact/ContactList';

export default function ExternalPage() {
  return (
    <ContactLayout>
      <ContactList 
        contactType="external" 
        title="External Contacts" 
        description="Manage external contractors, agencies, and service providers" 
      />
    </ContactLayout>
  );
}