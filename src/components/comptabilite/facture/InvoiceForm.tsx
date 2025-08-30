import { useEffect, useState, useCallback } from "react";
import { Invoice, InvoiceMetadata, InvoiceItem, CompanyDetails } from "./types";
import { Document } from "@/types/documents";
import useDocuments from "@/hooks/useDocuments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils/format";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';
// loadLogoForPDF import removed as it's unused

interface InvoiceFormProps {
  onSubmit: (data: Partial<InvoiceMetadata>) => void;
  onCancel: () => void;
  clients: Invoice["client"][];
  projects: { id: string; name: string }[];
  initialDocument?: Document;
  companyDetails: CompanyDetails;
}

export function InvoiceForm({
  onSubmit,
  onCancel,
  clients,
  projects,
  initialDocument,
  companyDetails,
}: InvoiceFormProps) {
  const { createDocument, updateDocument, loading } = useDocuments();
  
  // Extract metadata from initialDocument if available
  const initialMetadata = initialDocument?.metadata as InvoiceMetadata | undefined;
  
  const [formData, setFormData] = useState<InvoiceMetadata>(
    initialMetadata || {
      invoice_number: "",
      date: new Date().toISOString(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      invoice_status: "draft",
      client: {
        id: "",
        name: "",
        email: "",
        address: "",
        postal_code: "",
        city: "",
        country: "",
        vat_number: undefined,
      },
      items: [],
      subtotal: 0,
      tax_rate: 20,
      tax_amount: 0,
      total: 0,
      notes: "",
      payment_terms: "30 jours",
      payment_method: "Virement bancaire",
      currency: "EUR",
      language: "fr",
      company_details: companyDetails,
    }
  );

  // Define a type that matches InvoiceItem without the id field
  type NewInvoiceItem = Omit<InvoiceItem, 'id'>;
  
  const [newItem, setNewItem] = useState<NewInvoiceItem>({
    description: "",
    quantity: 1,
    unit_price: 0,
    tax_rate: formData.tax_rate || 20,
    total: 0,
  });

  useEffect(() => {
    const items = formData.items || [];
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * (formData.tax_rate || 0)) / 100;
    const total = subtotal + taxAmount;

    setFormData((prev: InvoiceMetadata) => ({
      ...prev,
      subtotal,
      tax_amount: taxAmount,
      total,
    }));
  }, [formData.items, formData.tax_rate]);

  const handleAddItem = useCallback(() => {
    if (!newItem.description || newItem.quantity <= 0 || newItem.unit_price <= 0) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires pour l'article",
        variant: "destructive"
      });
      return;
    }
    
    const itemTotal = newItem.quantity * newItem.unit_price;
    // Generate a UUID for the new item
    const item: InvoiceItem = { 
      ...newItem, 
      total: itemTotal,
      id: uuidv4()
    };
    
    setFormData((prev: InvoiceMetadata) => ({
      ...prev,
      items: [...(prev.items || []), item],
    }));
    
    setNewItem({ 
      description: "", 
      quantity: 1, 
      unit_price: 0, 
      tax_rate: formData.tax_rate || 20,
      total: 0 
    });
  }, [newItem, formData.tax_rate, setFormData]);

  const handleRemoveItem = useCallback((index: number) => {
    setFormData((prev: InvoiceMetadata) => ({
      ...prev,
      items: prev.items?.filter((_, i) => i !== index) || [],
    }));
  }, [setFormData]);

  const handleClientChange = useCallback((clientName: string) => {
    const selectedClient = clients.find((c) => c.name === clientName);
    setFormData((prev) => ({
      ...prev,
      client: selectedClient || {
        id: "",
        name: clientName,
        email: "",
        address: "",
        postal_code: "",
        city: "",
        country: "",
        vat_number: ""
      }
    }));
  }, [clients, setFormData]);

  const handleProjectChange = useCallback((projectName: string) => {
    const selectedProject = projects.find(p => p.name === projectName);
    setFormData((prev) => ({
      ...prev,
      project_id: selectedProject?.id,
      project_name: projectName,
    }));
  }, [projects, setFormData]);

  const validateForm = useCallback((): boolean => {
    // Required fields validation
    if (!formData.invoice_number) {
      toast({
        title: "Champ requis",
        description: "Le numéro de facture est obligatoire",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.client?.name) {
      toast({
        title: "Champ requis",
        description: "Veuillez sélectionner un client",
        variant: "destructive"
      });
      return false;
    }
    
    if (formData.items.length === 0) {
      toast({
        title: "Articles requis",
        description: "Veuillez ajouter au moins un article à la facture",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  }, [formData.invoice_number, formData.client?.name, formData.items.length]); // toast is stable and doesn't need to be in the dependency array

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Ensure items are properly serialized
      const serializedItems = formData.items.map(item => ({
        ...item,
        id: item.id || uuidv4() // Ensure each item has an ID
      }));
      
      // Ensure client data is properly structured
      const clientData = formData.client ? {
        id: formData.client.id || '',
        name: formData.client.name || '',
        email: formData.client.email || '',
        address: formData.client.address || '',
        postal_code: formData.client.postal_code || '',
        city: formData.client.city || '',
        country: formData.client.country || '',
        vat_number: formData.client.vat_number || ''
      } : null;
      
      // Ensure company details are properly structured
      const companyData = {
        name: formData.company_details?.name || '',
        address: formData.company_details?.address || '',
        postal_code: formData.company_details?.postal_code || '',
        city: formData.company_details?.city || '',
        country: formData.company_details?.country || '',
        vat_number: formData.company_details?.vat_number || '',
        registration_number: formData.company_details?.registration_number || '',
        phone: formData.company_details?.phone || '',
        email: formData.company_details?.email || '',
        website: formData.company_details?.website || '',
        bank_account: formData.company_details?.bank_account || ''
      };
      
      // Convert formData to a Supabase-compatible metadata record
      // Serialize complex objects to strings for Supabase compatibility
      const metadataRecord = {
        invoice_number: formData.invoice_number,
        date: formData.date,
        due_date: formData.due_date,
        invoice_status: formData.invoice_status,
        client: clientData,
        items: JSON.stringify(serializedItems),
        subtotal: formData.subtotal,
        tax_rate: formData.tax_rate,
        tax_amount: formData.tax_amount,
        total: formData.total,
        notes: formData.notes || '',
        payment_terms: formData.payment_terms || '',
        payment_method: formData.payment_method || '',
        paid_at: formData.paid_at || '',
        currency: formData.currency,
        language: formData.language,
        company_details: JSON.stringify(companyData),
        project_id: formData.project_id || '',
        project_name: formData.project_name || ''
      } as Record<string, string | number | boolean | string[] | Record<string, unknown> | null>;
      
      console.log('Creating document with metadata:', metadataRecord);
      
      if (initialDocument) {
        await updateDocument({
          id: initialDocument.id,
          metadata: metadataRecord,
          title: initialDocument.title || `Facture ${formData.invoice_number}`,
          document_type_id: initialDocument.document_type_id,
          status: initialDocument.status || 'Active'
        });
        toast({ title: "Facture mise à jour", description: "La facture a été mise à jour avec succès" });
      } else {
        await createDocument({
          title: `Facture ${formData.invoice_number}`,
          document_type_id: "invoice",
          metadata: metadataRecord,
          status: "Active"
        });
        toast({ title: "Facture créée", description: "La facture a été créée avec succès" });
      }
      
      onSubmit(formData);
    } catch (error) {
      console.error("Error saving document:", error);
      toast({ 
        title: "Erreur", 
        description: "Une erreur est survenue lors de l'enregistrement de la facture", 
        variant: "destructive" 
      });
    }
  }, [formData, onSubmit, initialDocument, createDocument, updateDocument, validateForm]);

  const exportToPDF = useCallback(async () => {
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const margin = { top: 20, left: 15, right: 15 };

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(`FACTURE N°${formData.invoice_number || "N/A"}`, margin.left, margin.top);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Date: ${new Date(formData.date || "").toLocaleDateString()}`, margin.left, margin.top + 10);
      doc.text(`Échéance: ${new Date(formData.due_date || "").toLocaleDateString()}`, margin.left, margin.top + 15);

      const company = formData.company_details;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Émetteur:", margin.left, margin.top + 25);
      doc.setFont("helvetica", "normal");
      doc.text([
        `Nom: ${company?.name || ""}`,
        `Adresse: ${company?.address || ""}, ${company?.postal_code || ""} ${company?.city || ""}`,
        `Pays: ${company?.country || ""}`,
        `Email: ${company?.email || ""}`
      ], margin.left, margin.top + 30);

      const client = formData.client;
      doc.setFont("helvetica", "bold");
      doc.text("Client:", 105, margin.top + 25);
      doc.setFont("helvetica", "normal");
      doc.text([
        `Nom: ${client?.name || ""}`,
        `Adresse: ${client?.address || ""}, ${client?.postal_code || ""} ${client?.city || ""}`,
        `Pays: ${client?.country || ""}`,
        `Email: ${client?.email || ""}`
      ], 105, margin.top + 30);

      if (formData.project_name) {
        doc.setFont("helvetica", "bold");
        doc.text("Projet:", margin.left, margin.top + 55);
        doc.setFont("helvetica", "normal");
        doc.text(formData.project_name, margin.left, margin.top + 60);
      }

      const tableY = margin.top + 70;
      autoTable(doc, {
        startY: tableY,
        head: [["Description", "Quantité", "Prix unitaire", "Total"]],
        body: formData.items?.map(item => [
          item.description,
          item.quantity.toString(),
          formatCurrency(item.unit_price),
          formatCurrency(item.total)
        ]) || [],
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        bodyStyles: { fontSize: 10 },
        margin: { left: margin.left, right: margin.right }
      });

      // Get the final Y position from the last table
      // jsPDF with autotable plugin adds this property at runtime
      const totalsY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text(`Sous-total: ${formatCurrency(formData.subtotal || 0)}`, margin.left, totalsY);
      doc.text(`TVA (${formData.tax_rate}%): ${formatCurrency(formData.tax_amount || 0)}`, margin.left, totalsY + 5);
      doc.text(`Total: ${formatCurrency(formData.total || 0)}`, margin.left, totalsY + 10);

      const finalY = totalsY + 20;
      doc.setFont("helvetica", "bold");
      doc.text("Conditions de paiement:", margin.left, finalY);
      doc.setFont("helvetica", "normal");
      doc.text(`${formData.payment_method} - ${formData.payment_terms}`, margin.left, finalY + 5);

      if (formData.notes) {
        doc.setFont("helvetica", "bold");
        doc.text("Notes:", margin.left, finalY + 15);
        doc.setFont("helvetica", "normal");
        doc.text(formData.notes, margin.left, finalY + 20, { maxWidth: 180 });
      }

      doc.save(`Facture_${formData.invoice_number || "N/A"}.pdf`);
      toast({ title: "PDF exporté avec succès" });

    } catch (error) {
      console.error("Erreur lors de l'export PDF", error);
      toast({ title: "Erreur", description: "Impossible d'exporter la facture", variant: "destructive" });
    }
  }, [formData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="invoice_number">Numéro de facture</Label>
            <Input
              id="invoice_number"
              value={formData.invoice_number}
              onChange={(e) => setFormData((prev: InvoiceMetadata) => ({ ...prev, invoice_number: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="date">Date d&apos;émission</Label>
            <Input
              type="date"
              id="date"
              value={formData.date ? new Date(formData.date).toISOString().split("T")[0] : ""}
              onChange={(e) => setFormData((prev: InvoiceMetadata) => ({ ...prev, date: new Date(e.target.value).toISOString() }))}
            />
          </div>
          <div>
            <Label htmlFor="due_date">Date d&apos;échéance</Label>
            <Input
              type="date"
              id="due_date"
              value={formData.due_date ? new Date(formData.due_date).toISOString().split("T")[0] : ""}
              onChange={(e) => setFormData((prev: InvoiceMetadata) => ({ ...prev, due_date: new Date(e.target.value).toISOString() }))}
            />
          </div>
          <div>
            <Label htmlFor="invoice_status">Statut</Label>
            <Select
              value={formData.invoice_status}
              onValueChange={(value: "draft" | "sent" | "paid" | "cancelled" | "overdue") => setFormData((prev: InvoiceMetadata) => ({ ...prev, invoice_status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="sent">Envoyée</SelectItem>
                <SelectItem value="paid">Payée</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="client">Client</Label>
            <Select
              value={formData.client?.name}
              onValueChange={handleClientChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clients.filter(c => c.name && c.name.trim() !== "").map((client) => (
                  <SelectItem key={client.name} value={client.name}>{client.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="project">Projet</Label>
            <Select
              value={formData.project_name}
              onValueChange={handleProjectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un projet" />
              </SelectTrigger>
              <SelectContent>
                {projects.filter(p => p.name && p.name.trim() !== "").map((project) => (
                  <SelectItem key={project.id} value={project.name}>{project.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="payment_terms">Conditions de paiement</Label>
            <Input
              id="payment_terms"
              value={formData.payment_terms}
              onChange={(e) => setFormData((prev: InvoiceMetadata) => ({ ...prev, payment_terms: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="payment_method">Mode de paiement</Label>
            <Input
              id="payment_method"
              value={formData.payment_method}
              onChange={(e) => setFormData((prev: InvoiceMetadata) => ({ ...prev, payment_method: e.target.value }))}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="item_description">Description</Label>
            <Input
              id="item_description"
              value={newItem.description}
              onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="item_quantity">Quantité</Label>
            <Input
              id="item_quantity"
              type="number"
              min="1"
              value={newItem.quantity}
              onChange={(e) => setNewItem((prev) => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
            />
          </div>
          <div>
            <Label htmlFor="item_price">Prix unitaire</Label>
            <Input
              id="item_price"
              type="number"
              min="0"
              step="0.01"
              value={newItem.unit_price}
              onChange={(e) => setNewItem((prev) => ({ ...prev, unit_price: parseFloat(e.target.value) || 0 }))}
            />
          </div>
        </div>
        <Button type="button" onClick={handleAddItem}>Ajouter l&apos;article</Button>
        <div className="border rounded-lg p-4">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Description</th>
                <th className="text-right">Quantité</th>
                <th className="text-right">Prix unitaire</th>
                <th className="text-right">Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {formData.items?.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">{formatCurrency(item.unit_price)}</td>
                  <td className="text-right">{formatCurrency(item.total)}</td>
                  <td className="text-right">
                    <Button type="button" variant="ghost" onClick={() => handleRemoveItem(index)}>
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Sous-total:</span>
            <span>{formatCurrency(formData.subtotal || 0)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>TVA:</span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.tax_rate}
                onChange={(e) => setFormData((prev: InvoiceMetadata) => ({ ...prev, tax_rate: parseFloat(e.target.value) || 0 }))}
                className="w-20"
              />
              <span>%</span>
              <span className="ml-4">{formatCurrency(formData.tax_amount || 0)}</span>
            </div>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>{formatCurrency(formData.total || 0)}</span>
          </div>
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData((prev: InvoiceMetadata) => ({ ...prev, notes: e.target.value }))}
          />
        </div>
        <div className="flex justify-between pt-6">
          <div className="space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
            <Button type="button" variant="outline" onClick={exportToPDF}>Exporter en PDF</Button>
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <span className="mr-2 h-4 w-4 animate-spin">⏳</span>}
            {initialDocument ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </div>
    </form>
  );
}
