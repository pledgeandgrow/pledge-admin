"use client";

import React from 'react';
import { DevisList } from "@/components/comptabilite/devis/DevisList";

export default function DevisPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Gestion des devis</h1>
          <p className="text-muted-foreground">
            Créez et gérez vos devis, suivez les acceptations et convertissez-les en factures
          </p>
        </div>
      </div>
      
      <DevisList />
    </div>
  );
}
