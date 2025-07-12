// app/comptabilite/facture/page.tsx

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DateRange } from "react-day-picker";
import { Plus as PlusIcon } from "lucide-react";

import {
  Invoice,
} from "@/components/comptabilite/facture/types";
import { InvoiceCard } from "@/components/comptabilite/facture/InvoiceCard";
import { InvoiceStats as InvoiceStatsComponent } from "@/components/comptabilite/facture/InvoiceStats";
import { InvoiceFilters } from "@/components/comptabilite/facture/InvoiceFilters";
import { InvoiceForm } from "@/components/comptabilite/facture/InvoiceForm";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

import { createClient } from "@/lib/supabase";

const supabase = createClient();

type StoredFile = { name: string; updated_at: string; url: string };

// Removed unused fmt function

const COMPANY_DETAILS = {
  name: "",
  address: "",
  postal_code: "",
  city: "",
  country: "",
  vat_number: "",
  registration_number: "",
  phone: "",
  email: "",
  website: "",
  bank_account: "",
};

export default function InvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Invoice["client"][]>([]);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [, setFiles] = useState<StoredFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const loadInvoices = useCallback(async () => {
    try {
      const r = await fetch("/api/comptabilite/facture");
      if (!r.ok) throw new Error();
      const data = await r.json();
      setInvoices(data);
      setClients(
        Array.from(new Set(data.map((i: { client: object }) => JSON.stringify(i.client)))).map((c) => JSON.parse(c as string))
      );
      setProjects(
        Array.from(
          new Set(
            data
              .filter((i: { project_id?: string }) => i.project_id)
              .map((i: { project_id: string; project_name: string }) => JSON.stringify({ id: i.project_id, name: i.project_name }))
          )
        ).map((p) => JSON.parse(p as string))
      );
    } catch {
      toast({ title: "Erreur", description: "Chargement factures échoué", variant: "destructive" });
    }
  }, [toast]);

  async function handleCreateInvoice(payload: Partial<Invoice>) {
    try {
      const r = await fetch("/api/comptabilite/facture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error();
      await loadInvoices();
      setIsFormOpen(false);
      toast({ title: "Créée", description: "Facture ajoutée ✅" });
    } catch {
      toast({ title: "Erreur", description: "Création échouée", variant: "destructive" });
    }
  }

  async function handleUpdateInvoice(payload: Partial<Invoice>) {
    try {
      const r = await fetch(`/api/comptabilite/facture?id=${payload.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error();
      await loadInvoices();
      setIsFormOpen(false);
      setSelectedInvoice(null);
      toast({ title: "Modifiée", description: "Facture mise à jour ✅" });
    } catch {
      toast({ title: "Erreur", description: "Mise à jour échouée", variant: "destructive" });
    }
  }

  const loadStorageFiles = useCallback(async () => {
    const { data, error } = await supabase
      .storage
      .from("factures")
      .list("", { limit: 1000, sortBy: { column: "updated_at", order: "desc" } });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    setFiles(
      data
        .filter(o => !o.name.endsWith("/"))
        .map(o => {
          const { data: { publicUrl } } = supabase.storage.from("factures").getPublicUrl(o.name);
          return { name: o.name, updated_at: o.updated_at, url: publicUrl };
        })
    );
  }, [toast]);

  useEffect(() => {
    loadInvoices();
    loadStorageFiles();
  }, [loadInvoices, loadStorageFiles]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const filename = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("factures").upload(filename, file, { contentType: file.type });
    if (error) {
      toast({ title: "Erreur upload", description: error.message, variant: "destructive" });
    } else {
      const { data: { publicUrl } } = supabase.storage.from("factures").getPublicUrl(filename);
      setFiles(prev => [{ name: filename, updated_at: new Date().toISOString(), url: publicUrl }, ...prev]);
      toast({ title: "Téléversé", description: "Fichier ajouté ✅" });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Function to delete a file - commented out until needed to avoid lint errors
  /* 
  const handleDeleteFile = async (file: StoredFile) => {
    if (!confirm(`Supprimer « ${file.name} » ?`)) return;
    const { error } = await supabase.storage.from("factures").remove([file.name]);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setFiles(prev => prev.filter(f => f.name !== file.name));
      toast({ title: "Supprimé", description: "Fichier supprimé ✅" });
    }
  }
  */

  const filteredInvoices = invoices.filter(i => {
    const q = search.toLowerCase();
    return (
      i.invoice_number.toLowerCase().includes(q) &&
      (statusFilter === "all" || i.status === statusFilter) &&
      (clientFilter === "all" || i.client.name === clientFilter) &&
      (projectFilter === "all" || i.project_name === projectFilter) &&
      (!dateRange?.from ||
        (new Date(i.date) >= dateRange.from &&
          (!dateRange.to || new Date(i.date) <= dateRange.to)))
    );
  });

  return (
    <div className="ml-64 p-8 bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Factures</h1>
          <div className="flex gap-2">
            <input ref={fileInputRef} type="file" hidden onChange={onUpload} />
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
              <PlusIcon className="mr-2 h-4 w-4" /> Téléverser fichier
            </Button>
            <Button onClick={() => { setSelectedInvoice(null); setIsFormOpen(true); }}>
              <PlusIcon className="mr-2 h-4 w-4" /> Nouvelle facture
            </Button>
          </div>
        </div>

        <InvoiceStatsComponent stats={{
          total_count: invoices.length,
          draft_count: invoices.filter(i => i.status === "draft").length,
          sent_count: invoices.filter(i => i.status === "sent").length,
          paid_count: invoices.filter(i => i.status === "paid").length,
          overdue_count: invoices.filter(i => i.status === "overdue").length,
          total_amount: invoices.reduce((s, i) => s + i.total, 0),
          paid_amount: invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.total, 0),
          overdue_amount: invoices.filter(i => i.status === "overdue").reduce((s, i) => s + i.total, 0),
          currency: "EUR",
        }} />

        <InvoiceFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          clientFilter={clientFilter}
          onClientFilterChange={setClientFilter}
          projectFilter={projectFilter}
          onProjectFilterChange={setProjectFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          clients={clients.map(c => c.name)}
          projects={projects.map(p => p.name)}
          activeFilters={
            Number(Boolean(search)) +
            Number(statusFilter !== "all") +
            Number(clientFilter !== "all") +
            Number(projectFilter !== "all") +
            Number(Boolean(dateRange?.from))
          }
          onClearFilters={() => {
            setSearch("");
            setStatusFilter("all");
            setClientFilter("all");
            setProjectFilter("all");
            setDateRange(undefined);
          }}
        />

        <ScrollArea className="h-[calc(100vh-340px)] rounded-lg border bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
            {filteredInvoices.map(inv => (
              <InvoiceCard
                key={inv.id}
                invoice={inv}
                onClick={() => { setSelectedInvoice(inv); setIsFormOpen(true); }}
              />
            ))}
          </div>
        </ScrollArea>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto bg-blue-50 text-gray-900 rounded-lg shadow-xl">
            <DialogHeader className="flex items-center justify-between p-4 border-b border-blue-200">
              <DialogTitle className="text-2xl font-semibold">
                {selectedInvoice ? "Modifier la facture" : "Créer une nouvelle facture"}
              </DialogTitle>
            </DialogHeader>
            <div id="invoice-preview" className="p-6 bg-white rounded-b-lg space-y-4">
              <InvoiceForm
                onSubmit={selectedInvoice ? handleUpdateInvoice : handleCreateInvoice}
                onCancel={() => { setIsFormOpen(false); setSelectedInvoice(null); }}
                clients={clients}
                projects={projects}
                initialData={selectedInvoice || undefined}
                companyDetails={COMPANY_DETAILS}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
