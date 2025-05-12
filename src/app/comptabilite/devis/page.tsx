import { Metadata } from "next";
import DevisForm from "@/components/comptabilite/devis/DevisForm";

export const metadata: Metadata = {
  title: "Devis | Pledge & Grow",
  description: "Créer et gérer vos devis",
};

export default function DevisPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Devis</h1>
        <p className="text-muted-foreground">
          Créer et gérer vos devis
        </p>
      </div>
      <DevisForm />
    </div>
  );
}
