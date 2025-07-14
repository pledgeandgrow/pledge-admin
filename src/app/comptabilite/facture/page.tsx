// app/comptabilite/facture/page.tsx

"use client";

import { InvoiceList } from "@/components/comptabilite/facture/InvoiceList";
import { Separator } from "@/components/ui/separator";

export default function InvoicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion des factures</h1>
        <p className="text-muted-foreground">
          Créez et gérez vos factures, suivez les paiements et analysez vos revenus
        </p>
      </div>
      <Separator />
      <InvoiceList />
    </div>
  );
}
