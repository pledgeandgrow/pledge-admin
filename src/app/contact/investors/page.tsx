'use client';

import { ContactList } from '@/components/contact/ContactList';

export default function InvestorsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <ContactList 
        contactType="investor" 
        title="Investors" 
        description="Manage investors and track investment relationships" 
      />
    </div>
  );
}
