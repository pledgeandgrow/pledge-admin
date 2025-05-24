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
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { X } from "lucide-react";

interface InvoiceFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  clientFilter: string;
  onClientFilterChange: (value: string) => void;
  projectFilter: string;
  onProjectFilterChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  clients: string[];
  projects: string[];
  activeFilters: number;
  onClearFilters: () => void;
}

export function InvoiceFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  clientFilter,
  onClientFilterChange,
  projectFilter,
  onProjectFilterChange,
  dateRange,
  onDateRangeChange,
  clients,
  projects,
  activeFilters,
  onClearFilters,
}: InvoiceFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Rechercher une facture..."
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
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="sent">Envoyée</SelectItem>
              <SelectItem value="paid">Payée</SelectItem>
              <SelectItem value="overdue">En retard</SelectItem>
              <SelectItem value="cancelled">Annulée</SelectItem>
            </SelectContent>
          </Select>

          <Select value={clientFilter} onValueChange={onClientFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les clients</SelectItem>
              {clients
                .filter((client) => client.trim() !== "")
                .map((client) => (
                  <SelectItem key={client} value={client}>
                    {client}
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
              {projects
                .filter((project) => project.trim() !== "")
                .map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <DatePickerWithRange
            date={dateRange}
            onDateChange={onDateRangeChange}
          />
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
