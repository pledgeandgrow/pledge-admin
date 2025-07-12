'use client';

import { ContactLayout } from '@/components/contact/layout/ContactLayout';
import { ContactList } from '@/components/contact/ContactList';

export default function InvestorsPage() {
  return (
    <ContactLayout>
      <ContactList 
        contactType="investor" 
        title="Investors" 
        description="Manage investors and track investment relationships" 
      />
    </ContactLayout>
  );
}
