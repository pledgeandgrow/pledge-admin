'use client';

import { ContactList } from '@/components/contact/ContactList';
import { Separator } from '@/components/ui/separator';
import { TrendingUp } from 'lucide-react';

export default function InvestorsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-lime-500/20">
          <TrendingUp className="h-8 w-8 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 bg-clip-text text-transparent">
              Investors
            </span>
          </h1>
          <p className="text-muted-foreground dark:text-gray-400 mt-1">
            Manage investors and track investment relationships
          </p>
        </div>
      </div>
      
      <Separator className="bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-lime-500/20 h-0.5 rounded-full" />
      
      <ContactList 
        contactType="investor" 
        title="Investors" 
        description="Manage investors and track investment relationships" 
      />
    </div>
  );
}
