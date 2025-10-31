'use client';

import { ContactList } from '@/components/contact/ContactList';
import { Separator } from '@/components/ui/separator';
import { Building2 } from 'lucide-react';

export default function ExternalPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-yellow-500/20">
          <Building2 className="h-8 w-8 text-orange-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
              External Contacts
            </span>
          </h1>
          <p className="text-muted-foreground dark:text-gray-400 mt-1">
            Manage external contractors, agencies, and service providers
          </p>
        </div>
      </div>
      
      <Separator className="bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-yellow-500/20 h-0.5 rounded-full" />
      
      <ContactList 
        contactType="external" 
        title="External Contacts" 
        description="Manage external contractors, agencies, and service providers" 
      />
    </div>
  );
}