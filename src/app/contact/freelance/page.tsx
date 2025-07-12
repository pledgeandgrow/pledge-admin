'use client';

import React from 'react';
import { ContactLayout } from '@/components/contact/layout/ContactLayout';
import { ContactList } from '@/components/contact';

export default function FreelancersPage() {
  return (
    <ContactLayout>
      <ContactList 
        contactType="freelance" 
        title="Freelancers" 
        description="Manage freelancers and their assignments" 
      />
    </ContactLayout>
  );
}