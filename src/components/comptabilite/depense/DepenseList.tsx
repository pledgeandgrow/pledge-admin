import React, { useState, useEffect } from "react";
import { Data } from "@/types/data";
import { DepenseCard } from "./DepenseCard";
import { DepenseFilters } from "./DepenseFilters";
import { calculateDepenseStats, DepenseStatsType } from "./DepenseStats";
import { DepenseStats } from "./DepenseStats";
import { DepenseDetails } from "./DepenseDetails";
import { useData } from "@/hooks/useData";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// UI components are used in other parts of the component tree
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../ui/sheet";
import { DepenseForm } from "./DepenseForm";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function DepenseList(): React.ReactElement {
  // State for filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [sortBy, setSortBy] = useState("metadata.date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // State for dialogs and sheets
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [selectedDepense, setSelectedDepense] = useState<Data | null>(null);
  
  // Get data from useData hook
  const { data: allDepenses, loading, error, createData, updateData, deleteData } = useData('depense' as const);
  
  // Toast for notifications
  const { toast } = useToast();
  
  // Filtered depenses
  const [filteredDepenses, setFilteredDepenses] = useState<Data[]>([]);
  const [stats, setStats] = useState<DepenseStatsType>({
    total_count: 0,
    total_amount: 0,
    approved_count: 0,
    approved_amount: 0,
    pending_count: 0,
    pending_amount: 0,
    refused_count: 0,
    reimbursed_count: 0,
    reimbursed_amount: 0,
  });
  
  // Categories for filtering
  const categories = [
    "Fournitures",
    "Services",
    "Déplacements",
    "Repas",
    "Hébergement",
    "Équipement",
    "Marketing",
    "Formation",
    "Abonnements",
    "Autres",
  ];

  // Filter and sort depenses
  useEffect(() => {
    if (!allDepenses) return;
    
    let filtered = [...allDepenses];
    
    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (depense) =>
          (depense.title?.toLowerCase().includes(searchLower)) ||
          (depense.metadata?.description as string)?.toLowerCase().includes(searchLower) ||
          (depense.metadata?.beneficiaire as string)?.toLowerCase().includes(searchLower) ||
          (depense.metadata?.categorie as string)?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter(
        (depense) => (depense.metadata?.statut as string) === status
      );
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter(
        (depense) => (depense.metadata?.categorie as string) === category
      );
    }

    // Filter by date range
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter((depense) => {
        const depenseDate = new Date(depense.metadata?.date as string);
        
        if (dateRange.from && dateRange.to) {
          return depenseDate >= dateRange.from && depenseDate <= dateRange.to;
        } else if (dateRange.from) {
          return depenseDate >= dateRange.from;
        } else if (dateRange.to) {
          return depenseDate <= dateRange.to;
        }
        
        return true;
      });
    }

    // Sort depenses
    filtered.sort((a, b) => {
      let valueA: string | number | Date | undefined;
      let valueB: string | number | Date | undefined;

      // Handle nested metadata properties
      if (sortBy.startsWith("metadata.")) {
        const metadataKey = sortBy.replace("metadata.", "");
        valueA = a.metadata?.[metadataKey] as string | number | Date | undefined;
        valueB = b.metadata?.[metadataKey] as string | number | Date | undefined;
      } else {
        valueA = a[sortBy as keyof Data] as string | number | Date | undefined;
        valueB = b[sortBy as keyof Data] as string | number | Date | undefined;
      }
      
      // Handle date comparison
      if (sortBy === "metadata.date" || sortBy === "created_at" || sortBy === "updated_at") {
        valueA = valueA ? new Date(valueA).getTime() : 0;
        valueB = valueB ? new Date(valueB).getTime() : 0;
      }
      
      // Handle number comparison
      // Convert to numbers if dealing with montant
      if (sortBy === "metadata.montant") {
        valueA = valueA ? parseFloat(String(valueA)) : 0;
        valueB = valueB ? parseFloat(String(valueB)) : 0;
      }
      
      // Handle undefined values
      const safeValueA = valueA ?? "";
      const safeValueB = valueB ?? "";
      
      if (sortOrder === "asc") {
        return safeValueA > safeValueB ? 1 : -1;
      } else {
        return safeValueA < safeValueB ? 1 : -1;
      }
    });
    
    setFilteredDepenses(filtered);
    
    // Calculate stats
    const newStats = calculateDepenseStats(filtered);
    setStats(newStats);
  }, [allDepenses, search, status, category, dateRange, sortBy, sortOrder]);

  // Handle create depense
  const handleCreateDepense = async (depenseData: Data) => {
    try {
      // Set the title based on description and date
      const expenseDate = new Date(depenseData.metadata?.date as string);
      const formattedDate = format(expenseDate, 'dd/MM/yyyy');
      depenseData.title = `Dépense: ${depenseData.metadata?.description} - ${formattedDate}`;
      
      await createData(depenseData);
      setIsCreateDialogOpen(false);
      toast({
        title: "Dépense créée",
        description: "La dépense a été créée avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la création de la dépense:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la dépense.",
        variant: "destructive",
      });
    }
  };

  // Handle edit depense
  const handleEditDepense = async (depenseData: Data) => {
    try {
      // Set the title based on description and date
      const expenseDate = new Date(depenseData.metadata?.date as string);
      const formattedDate = format(expenseDate, 'dd/MM/yyyy');
      depenseData.title = `Dépense: ${depenseData.metadata?.description} - ${formattedDate}`;
      
      await updateData(depenseData.id!, depenseData);
      setIsEditDialogOpen(false);
      setSelectedDepense(null);
      toast({
        title: "Dépense modifiée",
        description: "La dépense a été modifiée avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la modification de la dépense:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification de la dépense.",
        variant: "destructive",
      });
    }
  };

  // Handle delete depense
  const handleDeleteDepense = async (id: string) => {
    try {
      await deleteData(id);
      toast({
        title: "Dépense supprimée",
        description: "La dépense a été supprimée avec succès.",
      });
    } catch (error) {
      console.error("Error deleting depense:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la dépense.",
        variant: "destructive",
      });
    }
  };

  // Handle click on depense card
  const handleDepenseClick = (depense: Data) => {
    setSelectedDepense(depense);
    setIsDetailsSheetOpen(true);
  };

  // Handle edit from details
  const handleEditFromDetails = () => {
    setIsDetailsSheetOpen(false);
    setIsEditDialogOpen(true);
  };

  // Handle delete from details
  const handleDeleteFromDetails = () => {
    if (selectedDepense?.id) {
      handleDeleteDepense(selectedDepense.id);
      setIsDetailsSheetOpen(false);
      setSelectedDepense(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement des dépenses...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center p-8 text-red-500">
        Erreur lors du chargement des dépenses: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dépenses</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle dépense
        </Button>
      </div>

      <DepenseFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        category={category}
        setCategory={setCategory}
        dateRange={dateRange}
        setDateRange={setDateRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        categories={categories}
      />

      <DepenseStats stats={stats} />

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grille</TabsTrigger>
          <TabsTrigger value="list">Liste</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          {filteredDepenses.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Aucune dépense trouvée
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDepenses.map((depense) => (
                <DepenseCard
                  key={depense.id}
                  depense={depense}
                  onClick={() => handleDepenseClick(depense)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {filteredDepenses.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Aucune dépense trouvée
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDepenses.map((depense) => (
                <div
                  key={depense.id}
                  className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => handleDepenseClick(depense)}
                >
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {depense.metadata?.description as string || depense.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {depense.metadata?.beneficiaire as string} - {depense.metadata?.categorie as string}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(depense.metadata?.montant as number || 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(depense.metadata?.date as string),
                        "dd MMM yyyy",
                        { locale: fr }
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Depense Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle dépense</DialogTitle>
          </DialogHeader>
          <DepenseForm
            onSubmit={(data: Data) => handleCreateDepense(data)}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Depense Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la dépense</DialogTitle>
          </DialogHeader>
          {selectedDepense && (
            <DepenseForm
              depense={selectedDepense}
              onSubmit={(data: Data) => handleEditDepense(data)}
              onCancel={() => {
                setIsEditDialogOpen(false);
                // If coming from details view, go back to it
                if (isDetailsSheetOpen) {
                  setIsDetailsSheetOpen(true);
                } else {
                  setSelectedDepense(null);
                }
              }}
              onDelete={() => {
                if (selectedDepense?.id) {
                  handleDeleteDepense(selectedDepense.id);
                  setIsEditDialogOpen(false);
                  setIsDetailsSheetOpen(false);
                  setSelectedDepense(null);
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Depense Details Sheet */}
      <Sheet open={isDetailsSheetOpen} onOpenChange={setIsDetailsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Détails de la dépense</SheetTitle>
          </SheetHeader>
          {selectedDepense && (
            <DepenseDetails
              depense={selectedDepense}
              onEdit={handleEditFromDetails}
              onDelete={() => handleDeleteFromDetails()}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
