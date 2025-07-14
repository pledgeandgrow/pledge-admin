import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, Filter } from "lucide-react";

interface DevisFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
}

export function DevisFilters({
  search,
  setSearch,
  status,
  setStatus,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: DevisFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1">
        <Label htmlFor="search">Rechercher</Label>
        <Input
          id="search"
          placeholder="Rechercher un devis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="status">Statut</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id="status" className="w-[180px]">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="sent">Envoyé</SelectItem>
            <SelectItem value="accepted">Accepté</SelectItem>
            <SelectItem value="rejected">Refusé</SelectItem>
            <SelectItem value="expired">Expiré</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Trier
            <ArrowUpDown
              className={`h-4 w-4 ${
                sortOrder === "asc" ? "rotate-0" : "rotate-180"
              } transition-transform`}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Trier par</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className={sortBy === "date" ? "bg-accent" : ""}
              onClick={() => setSortBy("date")}
            >
              Date d&apos;émission
            </DropdownMenuItem>
            <DropdownMenuItem
              className={sortBy === "due_date" ? "bg-accent" : ""}
              onClick={() => setSortBy("due_date")}
            >
              Date d&apos;échéance
            </DropdownMenuItem>
            <DropdownMenuItem
              className={sortBy === "devis_number" ? "bg-accent" : ""}
              onClick={() => setSortBy("devis_number")}
            >
              Numéro de devis
            </DropdownMenuItem>
            <DropdownMenuItem
              className={sortBy === "client.name" ? "bg-accent" : ""}
              onClick={() => setSortBy("client.name")}
            >
              Client
            </DropdownMenuItem>
            <DropdownMenuItem
              className={sortBy === "total" ? "bg-accent" : ""}
              onClick={() => setSortBy("total")}
            >
              Montant total
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className={sortOrder === "asc" ? "bg-accent" : ""}
              onClick={() => setSortOrder("asc")}
            >
              Croissant
            </DropdownMenuItem>
            <DropdownMenuItem
              className={sortOrder === "desc" ? "bg-accent" : ""}
              onClick={() => setSortOrder("desc")}
            >
              Décroissant
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
