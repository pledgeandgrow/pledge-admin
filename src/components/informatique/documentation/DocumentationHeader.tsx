'use client';

import { BookOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface DocumentationHeaderProps {
  title: string;
  subtitle: string;
}

export function DocumentationHeader({ title, subtitle }: DocumentationHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 via-teal-500/20 to-cyan-500/20">
          <BookOpen className="h-8 w-8 text-green-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            {subtitle}
          </p>
        </div>
      </div>
      <Separator className="bg-gradient-to-r from-green-500/20 via-teal-500/20 to-cyan-500/20 h-0.5 rounded-full" />
    </>
  );
}
