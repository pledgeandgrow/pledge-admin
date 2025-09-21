'use client';

import { LifeBuoy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface TicketHeaderProps {
  title: string;
  subtitle: string;
}

export function TicketHeader({ title, subtitle }: TicketHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-purple-500/20">
          <LifeBuoy className="h-8 w-8 text-indigo-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            {subtitle}
          </p>
        </div>
      </div>
      <Separator className="bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-purple-500/20 h-0.5 rounded-full" />
    </>
  );
}
