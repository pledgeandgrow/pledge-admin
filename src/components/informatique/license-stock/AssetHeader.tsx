'use client';

import { Key } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface AssetHeaderProps {
  title: string;
  subtitle: string;
}

export function AssetHeader({ title, subtitle }: AssetHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20">
          <Key className="h-8 w-8 text-amber-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            {subtitle}
          </p>
        </div>
      </div>
      <Separator className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 h-0.5 rounded-full" />
    </>
  );
}
