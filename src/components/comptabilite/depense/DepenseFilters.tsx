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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowUpDown, Calendar as CalendarIcon, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";

interface DepenseFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  dateRange: { from?: Date; to?: Date };
  setDateRange: (value: { from?: Date; to?: Date }) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
  categories: string[];
}

export function DepenseFilters({
  search,
  setSearch,
  status,
  setStatus,
  category,
  setCategory,
  dateRange,
  setDateRange,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  categories,
}: DepenseFiltersProps) {
  const [date, setDate] = useState<Date>();

  // Helper function to format date
  const formatDate = (date?: Date) => {
    return date ? format(date, "PPP", { locale: fr }) : "";
  };

  // Clear date range
  const clearDateRange = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <Label htmlFor="search">Rechercher</Label>
          <Input
            id="search"
            placeholder="Rechercher une dépense..."
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
              <SelectItem value="en_attente">En attente</SelectItem>
              <SelectItem value="approuve">Approuvé</SelectItem>
              <SelectItem value="refuse">Refusé</SelectItem>
              <SelectItem value="rembourse">Remboursé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="category">Catégorie</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className="w-[180px]">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Période</Label>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !dateRange.from && !dateRange.to && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from && dateRange.to ? (
                    <>
                      {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                    </>
                  ) : (
                    <span>Sélectionnez une période</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to,
                  }}
                  onSelect={(range) => 
                    setDateRange({ 
                      from: range?.from, 
                      to: range?.to 
                    })
                  }
                  locale={fr}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {(dateRange.from || dateRange.to) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearDateRange}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
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
                Date
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortBy === "montant" ? "bg-accent" : ""}
                onClick={() => setSortBy("montant")}
              >
                Montant
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortBy === "beneficiaire" ? "bg-accent" : ""}
                onClick={() => setSortBy("beneficiaire")}
              >
                Bénéficiaire
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortBy === "categorie" ? "bg-accent" : ""}
                onClick={() => setSortBy("categorie")}
              >
                Catégorie
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
    </div>
  );
}
