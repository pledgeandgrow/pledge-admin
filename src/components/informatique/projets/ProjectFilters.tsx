import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Calendar as CalendarIcon, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Define DateRange type to match what the Calendar component expects
type DateRange = { from: Date | undefined; to?: Date | undefined };

interface ProjectFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  priority: string;
  setPriority: (value: string) => void;
  dateRange: DateRange;
  setDateRange: (value: DateRange | undefined) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
}

export function ProjectFilters({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  dateRange,
  setDateRange,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: ProjectFiltersProps): React.ReactElement {
  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 flex-1">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un projet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="active">En cours</SelectItem>
          <SelectItem value="completed">Terminé</SelectItem>
          <SelectItem value="onHold">En pause</SelectItem>
        </SelectContent>
      </Select>

      <Select value={priority} onValueChange={setPriority}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Priorité" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les priorités</SelectItem>
          <SelectItem value="high">Haute</SelectItem>
          <SelectItem value="medium">Moyenne</SelectItem>
          <SelectItem value="low">Basse</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[240px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "P", { locale: fr })} -{" "}
                  {format(dateRange.to, "P", { locale: fr })}
                </>
              ) : (
                format(dateRange.from, "P", { locale: fr })
              )
            ) : (
              "Sélectionner des dates"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            required={false}
          />
          <div className="flex justify-end gap-2 p-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDateRange(undefined)}
            >
              Réinitialiser
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex gap-2">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="project_type">Type</SelectItem>
            <SelectItem value="start_date">Date de début</SelectItem>
            <SelectItem value="end_date">Date de fin</SelectItem>
            <SelectItem value="status">Statut</SelectItem>
            <SelectItem value="priority">Priorité</SelectItem>
            <SelectItem value="progress">Progression</SelectItem>
            <SelectItem value="name">Nom</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSortOrder}
          title={sortOrder === "asc" ? "Ordre croissant" : "Ordre décroissant"}
        >
          <ArrowUpDown
            className={cn(
              "h-4 w-4",
              sortOrder === "desc" ? "rotate-180" : ""
            )}
          />
        </Button>
      </div>
    </div>
  );
}
