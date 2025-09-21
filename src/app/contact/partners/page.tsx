'use client';

import { ContactList } from '@/components/contact/ContactList';
import { Separator } from '@/components/ui/separator';
import { Handshake } from 'lucide-react';

export default function PartnersPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20">
          <Handshake className="h-8 w-8 text-green-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Partners
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage partnerships and track mutual benefits
          </p>
        </div>
      </div>
      
      <Separator className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 h-0.5 rounded-full" />
      
      <ContactList 
        contactType="partner" 
        title="Partners" 
        description="Manage partnerships and track mutual benefits" 
      />
    </div>
  );
}
