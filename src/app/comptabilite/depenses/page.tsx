"use client";

import { DepenseList } from "@/components/comptabilite/depense/DepenseList";
import { Separator } from "@/components/ui/separator";

export default function DepensesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion des dépenses</h1>
        <p className="text-muted-foreground">
          Gérez vos dépenses, suivez les remboursements et analysez vos coûts
        </p>
      </div>
      <Separator />
      <DepenseList />
    </div>
  );
}
