'use client';

import React from 'react';
import { ContactList } from '@/components/contact';
import { Separator } from '@/components/ui/separator';
import { UserCog } from 'lucide-react';

export default function BoardMembersPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20">
          <UserCog className="h-8 w-8 text-cyan-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Board Members
            </span>
          </h1>
          <p className="text-muted-foreground dark:text-gray-400 mt-1">
            Manage board members and their roles
          </p>
        </div>
      </div>
      
      <Separator className="bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 h-0.5 rounded-full" />
      
      <ContactList 
        contactType="board-member" 
        title="Board Members" 
        description="Manage board members and their roles" 
      />
    </div>
  );
}
