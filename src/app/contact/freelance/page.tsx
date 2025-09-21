'use client';

import React from 'react';
import { ContactList } from '@/components/contact';

export default function FreelancersPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <ContactList 
        contactType="freelance" 
        title="Freelancers" 
        description="Manage freelancers and their assignments" 
      />
    </div>
  );
}