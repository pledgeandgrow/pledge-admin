"use client";

import React from 'react';
import { SpecificationList } from '@/components/informatique/cahier-des-charges/SpecificationList';

export default function CahierDesChargesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Cahiers des charges</h1>
          <p className="text-muted-foreground">
            Gérez les spécifications techniques et fonctionnelles des projets informatiques.
          </p>
        </div>
      </div>
      
      <SpecificationList />
    </div>
  );
}
