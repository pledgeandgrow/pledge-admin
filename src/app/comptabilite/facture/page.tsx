"use client";

import React from 'react';
import { InvoiceList } from "@/components/comptabilite/facture/InvoiceList";

export default function InvoicePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Gestion des factures</h1>
          <p className="text-muted-foreground">
            Créez et gérez vos factures, suivez les paiements et analysez vos revenus
          </p>
        </div>
      </div>
      
      <InvoiceList />
    </div>
  );
}
