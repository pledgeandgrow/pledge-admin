'use client';

import React from 'react';
import { ContactList } from '@/components/contact';
import { ContactLayout } from '@/components/contact/layout/ContactLayout';

export default function MembersPage() {
  return (
    <ContactLayout>
      <div className="p-6 space-y-6">
        <ContactList 
          contactType="member" 
          title="Members" 
          description="Manage organization members and their information."
        />
      </div>
    </ContactLayout>
  );
}
