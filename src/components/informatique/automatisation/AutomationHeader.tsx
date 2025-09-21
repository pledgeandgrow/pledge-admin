'use client';

import { Bot } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface AutomationHeaderProps {
  title: string;
  subtitle: string;
}

export function AutomationHeader({ title, subtitle }: AutomationHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20">
          <Bot className="h-8 w-8 text-blue-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            {subtitle}
          </p>
        </div>
      </div>
      <Separator className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 h-0.5 rounded-full" />
    </>
  );
}
