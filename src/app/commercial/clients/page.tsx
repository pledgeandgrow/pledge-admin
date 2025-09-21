'use client';

import { ClientList } from '@/components/commercial/client/ClientList';
import { Separator } from '@/components/ui/separator';

export default function ClientsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Gestion des Clients
        </h1>
        <p className="text-muted-foreground">
          Gérez votre portefeuille clients et suivez leurs activités
        </p>
      </div>
      <Separator className="my-6" />
      <ClientList />
    </div>
  );
}
