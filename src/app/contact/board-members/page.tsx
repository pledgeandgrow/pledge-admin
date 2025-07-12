'use client';

import React from 'react';
import { ContactLayout } from '@/components/contact/layout/ContactLayout';
import { ContactList } from '@/components/contact';

export default function BoardMembersPage() {
  return (
    <ContactLayout>
      <ContactList 
        contactType="board-member" 
        title="Board Members" 
        description="Manage board members and their roles" 
      />
    </ContactLayout>
  );
}
