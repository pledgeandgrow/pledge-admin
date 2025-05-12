import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DomainFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  registrarFilter: string;
  onRegistrarFilter: (value: string) => void;
  projectFilter: string;
  onProjectFilterChange: (value: string) => void;
  registrars: string[];
  projects: string[];
  activeFilters: number;
  onClearFilters: () => void;
}

export function DomainFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  registrarFilter,
  onRegistrarFilter,
  projectFilter,
  onProjectFilterChange,
  registrars,
  projects,
  activeFilters,
  onClearFilters,
}: DomainFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Rechercher un nom de domaine..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="expired">Expiré</SelectItem>
              <SelectItem value="expiring_soon">Expiration proche</SelectItem>
              <SelectItem value="transferred">Transféré</SelectItem>
            </SelectContent>
          </Select>

          <Select value={registrarFilter} onValueChange={onRegistrarFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Registrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les registrars</SelectItem>
              {registrars.map((registrar) => (
                <SelectItem key={registrar} value={registrar}>
                  {registrar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={projectFilter} onValueChange={onProjectFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Projet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les projets</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project} value={project}>
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeFilters > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="rounded-sm">
            {activeFilters} filtres actifs
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 px-2 text-xs"
            onClick={onClearFilters}
          >
            <X className="h-4 w-4 mr-1" />
            Effacer les filtres
          </Button>
        </div>
      )}
    </div>
  );
}
