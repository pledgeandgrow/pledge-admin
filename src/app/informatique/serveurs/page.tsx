"use client";

import { useState, useEffect } from "react";
import { Server } from "@/components/informatique/serveurs/types";
import { ServerCard } from "@/components/informatique/serveurs/ServerCard";
import { ServerDetailsDialog } from "@/components/informatique/serveurs/ServerDetailsDialog";
import { ServerStats } from "@/components/informatique/serveurs/ServerStats";
import { ServerFilters } from "@/components/informatique/serveurs/ServerFilters";
import { ServerForm } from "@/components/informatique/serveurs/ServerForm";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

export default function ServersPage() {
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isAddingServer, setIsAddingServer] = useState(false);
  const { toast } = useToast();

  // Using useEffect with empty dependency array and moving fetchServers inside
  // to avoid the React Hook dependency warning
  useEffect(() => {
    const fetchServersData = async () => {
      try {
        const response = await fetch("/api/serveurs");
        if (!response.ok) throw new Error("Failed to fetch servers");
        const data = await response.json();
        setServers(data);
      } catch (error) {
        console.error('Error fetching servers:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les serveurs",
          variant: "destructive",
        });
      }
    };
    
    fetchServersData();
  }, [toast]);

  const fetchServers = async () => {
    try {
      const response = await fetch("/api/serveurs");
      if (!response.ok) throw new Error("Failed to fetch servers");
      const data = await response.json();
      setServers(data);
    } catch (error) {
      console.error('Error fetching servers:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les serveurs",
        variant: "destructive",
      });
    }
  };

  const handleAddServer = async (serverData: Partial<Server>) => {
    try {
      const response = await fetch("/api/serveurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serverData),
      });

      if (!response.ok) throw new Error("Failed to create server");

      await fetchServers();
      setIsAddingServer(false);
      toast({
        title: "Succès",
        description: "Serveur ajouté avec succès",
      });
    } catch (error) {
      console.error('Error adding server:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le serveur",
        variant: "destructive",
      });
    }
  };

  const serverTypes = Array.from(new Set(servers.map(server => server.type)));

  const filteredServers = servers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(search.toLowerCase()) ||
      server.description?.toLowerCase().includes(search.toLowerCase()) ||
      server.ip_address.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || server.status === statusFilter;
    const matchesType = typeFilter === "all" || server.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="ml-64 p-8 bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Gestion des Serveurs</h1>
            <Dialog open={isAddingServer} onOpenChange={setIsAddingServer}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Nouveau serveur
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau serveur</DialogTitle>
                </DialogHeader>
                <ServerForm
                  onSubmit={handleAddServer}
                  onCancel={() => setIsAddingServer(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          <ServerStats servers={servers} />

          <ServerFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            serverTypes={serverTypes}
          />
        </div>

        <ScrollArea className="h-[calc(100vh-340px)] rounded-lg border bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
            {filteredServers.map(server => (
              <ServerCard
                key={server.id}
                server={server}
                onClick={() => setSelectedServer(server)}
              />
            ))}
          </div>
        </ScrollArea>

        <ServerDetailsDialog
          server={selectedServer}
          onOpenChange={(open) => !open && setSelectedServer(null)}
        />
      </div>
    </div>
  );
}
