'use client';

import { useState, useEffect } from "react";
import { DomainName, DomainStats } from "@/components/informatique/nom-de-domaine/types";
import { DomainCard } from "@/components/informatique/nom-de-domaine/DomainCard";
import { DomainStats as DomainStatsComponent } from "@/components/informatique/nom-de-domaine/DomainStats";
import { DomainFilters } from "@/components/informatique/nom-de-domaine/DomainFilters";
import { DomainForm } from "@/components/informatique/nom-de-domaine/DomainForm";
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

export default function DomainPage() {
  const [domains, setDomains] = useState<DomainName[]>([]);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<DomainName | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [registrarFilter, setRegistrarFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [isEditingDomain, setIsEditingDomain] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDomains();
    fetchProjects();
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await fetch("/api/nom-de-domaine");
      if (!response.ok) throw new Error("Failed to fetch domains");
      const data = await response.json();
      setDomains(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les noms de domaine",
        variant: "destructive",
      });
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/client-projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les projets",
        variant: "destructive",
      });
    }
  };

  const handleCreateDomain = async (domainData: Partial<DomainName>) => {
    try {
      const response = await fetch("/api/nom-de-domaine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(domainData),
      });

      if (!response.ok) throw new Error("Failed to create domain");

      await fetchDomains();
      setIsAddingDomain(false);
      toast({
        title: "Succès",
        description: "Nom de domaine créé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le nom de domaine",
        variant: "destructive",
      });
    }
  };

  const handleUpdateDomain = async (domainData: Partial<DomainName>) => {
    try {
      const response = await fetch(`/api/nom-de-domaine?id=${domainData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(domainData),
      });

      if (!response.ok) throw new Error("Failed to update domain");

      await fetchDomains();
      setIsEditingDomain(false);
      setSelectedDomain(null);
      toast({
        title: "Succès",
        description: "Nom de domaine mis à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le nom de domaine",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setRegistrarFilter("all");
    setProjectFilter("all");
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (search) count++;
    if (statusFilter !== "all") count++;
    if (registrarFilter !== "all") count++;
    if (projectFilter !== "all") count++;
    return count;
  };

  const filteredDomains = domains.filter((domain) => {
    const matchesSearch = domain.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || domain.status === statusFilter;
    const matchesRegistrar =
      registrarFilter === "all" || domain.registrar === registrarFilter;
    const matchesProject =
      projectFilter === "all" || domain.project_name === projectFilter;

    return matchesSearch && matchesStatus && matchesRegistrar && matchesProject;
  });

  const stats: DomainStats = {
    total: domains.length,
    active: domains.filter((d) => d.status === "active").length,
    expiring_soon: domains.filter((d) => d.status === "expiring_soon").length,
    expired: domains.filter((d) => d.status === "expired").length,
    with_ssl: domains.filter((d) => d.services.ssl).length,
    with_email: domains.filter((d) => d.services.email).length,
  };

  const uniqueRegistrars = Array.from(
    new Set(domains.map((d) => d.registrar))
  ).filter(Boolean);

  return (
    <div className="ml-64 p-8 bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Noms de domaine</h1>
            <Dialog open={isAddingDomain} onOpenChange={setIsAddingDomain}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Nouveau domaine
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau nom de domaine</DialogTitle>
                </DialogHeader>
                <DomainForm
                  onSubmit={handleCreateDomain}
                  onCancel={() => setIsAddingDomain(false)}
                  projects={projects}
                />
              </DialogContent>
            </Dialog>
          </div>

          <DomainStatsComponent stats={stats} />

          <DomainFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            registrarFilter={registrarFilter}
            onRegistrarFilter={setRegistrarFilter}
            projectFilter={projectFilter}
            onProjectFilterChange={setProjectFilter}
            registrars={uniqueRegistrars}
            projects={projects.map((p) => p.name)}
            activeFilters={getActiveFiltersCount()}
            onClearFilters={clearFilters}
          />
        </div>

        <ScrollArea className="h-[calc(100vh-340px)] rounded-lg border bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
            {filteredDomains.map((domain) => (
              <DomainCard
                key={domain.id}
                domain={domain}
                onClick={() => setSelectedDomain(domain)}
              />
            ))}
          </div>
        </ScrollArea>

        <Dialog open={isEditingDomain} onOpenChange={setIsEditingDomain}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Modifier le nom de domaine</DialogTitle>
            </DialogHeader>
            <DomainForm
              onSubmit={handleUpdateDomain}
              onCancel={() => setIsEditingDomain(false)}
              projects={projects}
              initialData={selectedDomain || undefined}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
