'use client';

import { ContactList } from '@/components/contact/ContactList';
import { Separator } from '@/components/ui/separator';
import { Network } from 'lucide-react';

export default function NetworkPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20">
          <Network className="h-8 w-8 text-blue-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Network
            </span>
          </h1>
          <p className="text-muted-foreground dark:text-gray-400 mt-1">
            Manage your professional network and track relationships
          </p>
        </div>
      </div>
      
      <Separator className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 h-0.5 rounded-full" />
      
      <ContactList 
        contactType="network" 
        title="Network" 
        description="Manage your professional network and track relationships" 
      />
    </div>
  );
}
