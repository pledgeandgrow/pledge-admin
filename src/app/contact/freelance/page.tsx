'use client';

import React from 'react';
import { ContactList } from '@/components/contact';
import { Separator } from '@/components/ui/separator';
import { Briefcase } from 'lucide-react';

export default function FreelancersPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500/20 via-pink-500/20 to-red-500/20">
          <Briefcase className="h-8 w-8 text-rose-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Freelancers
            </span>
          </h1>
          <p className="text-muted-foreground dark:text-gray-400 mt-1">
            Manage freelancers and their assignments
          </p>
        </div>
      </div>
      
      <Separator className="bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-red-500/20 h-0.5 rounded-full" />
      
      <ContactList 
        contactType="freelance" 
        title="Freelancers" 
        description="Manage freelancers and their assignments" 
      />
    </div>
  );
}