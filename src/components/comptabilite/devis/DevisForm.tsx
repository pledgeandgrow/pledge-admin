'use client';

import { useEffect, useState, useCallback } from "react";
import { Invoice, InvoiceItem } from "./types";

// Extended Invoice interface to include additional properties needed in this component
interface ExtendedInvoice extends Omit<Invoice, 'clientName' | 'clientAddress' | 'clientEmail' | 'clientPhone' | 'status'> {
  paymentTerms?: string;
  paymentMethod?: string;
  projectName?: string;
  companyDetails?: {
    name?: string;
    address?: string;
    email?: string;
    phone?: string;
    website?: string;
    registration_number?: string;
    vat_number?: string;
    activity_code?: string;
    country?: string;
    postal_code?: string;
    city?: string;
    contact_name?: string;
    bank_account?: string;
  };
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone: string;
  currency?: string;
  language?: string;
  status: "draft" | "sent" | "paid" | "cancelled" | "overdue";
  logo?: string;
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils/format";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "@/components/ui/use-toast";
import { loadLogoForPDF } from "./utils";

interface InvoiceFormProps {
  onSubmit: (data: ExtendedInvoice) => void;
  onCancel: () => void;
  clients: { id: string; name: string; address: string; email: string; phone: string }[];
  projects: { id: string; name: string }[];
  initialData?: ExtendedInvoice;
  companyDetails: {
    name: string;
    address: string;
    postal_code: string;
    city: string;
    country: string;
    vat_number?: string;
    registration_number?: string;
    phone?: string;
    email?: string;
    website?: string;
    bank_account?: string;
  };
}

export function InvoiceForm({
  onSubmit,
  onCancel,
  clients,
  projects,
  initialData,
  companyDetails,
}: InvoiceFormProps) {
  const [formData, setFormData] = useState<Partial<ExtendedInvoice>>(
    initialData || {
      number: "",
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "draft" as const,
      clientName: "",
      clientAddress: "",
      clientEmail: "",
      clientPhone: "",
      items: [],
      subtotal: 0,
      taxRate: 20,
      taxAmount: 0,
      total: 0,
      notes: "",
      paymentTerms: "30 jours",
      paymentMethod: "Virement bancaire",
      currency: "EUR",
      language: "fr",
      companyDetails: companyDetails,
    }
  );

  const [newItem, setNewItem] = useState<InvoiceItem>({
    description: "",
    quantity: 1,
    unitPrice: 0,
    amount: 0,
  });

  const calculateTotals = useCallback(() => {
    if (!formData.items || formData.items.length === 0) {
      return;
    }

    const subtotal = formData.items.reduce((acc, item) => acc + item.amount, 0);
    const taxAmount = (subtotal * (formData.taxRate || 0)) / 100;
    const total = subtotal + taxAmount;

    setFormData((prev) => ({
      ...prev,
      subtotal,
      taxAmount,
      total,
    }));
  }, [formData.items, formData.taxRate]);

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  const handleAddItem = () => {
    if (!newItem.description || newItem.quantity <= 0 || newItem.unitPrice <= 0) {
      return;
    }

    const item: InvoiceItem = {
      description: newItem.description,
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice,
      amount: newItem.quantity * newItem.unitPrice,
    };

    setFormData((prev) => ({
      ...prev,
      items: [...(prev.items || []), item],
    }));

    setNewItem({
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items?.filter((_, i) => i !== index),
    }));
  };

  const handleClientChange = (clientName: string) => {
    const selectedClient = clients.find((c) => c.name === clientName);
    if (selectedClient) {
      setFormData((prev) => ({
        ...prev,
        clientName: selectedClient.name,
        clientAddress: selectedClient.address || '',
        clientEmail: selectedClient.email || '',
        clientPhone: selectedClient.phone || '',
      }));
    } else {
      // Allow manual entry if client not found
      setFormData((prev) => ({
        ...prev,
        clientName: clientName,
        clientAddress: "",
        clientEmail: "",
        clientPhone: "",
      }));
    }
  };

  const handleProjectChange = (projectName: string) => {
    const selectedProject = projects.find((p) => p.name === projectName);
    if (selectedProject) {
      setFormData((prev) => ({
        ...prev,
        project_id: selectedProject.id,
        projectName: selectedProject.name,
      }));
    } else {
      // Allow manual entry if project not found
      setFormData((prev) => ({
        ...prev,
        project_id: undefined,
        projectName: projectName,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as ExtendedInvoice);
  };

  const exportToPDF = async () => {
    try {
      // Initialize PDF with A4 format
      const doc = new jsPDF({
        format: 'a4',
        unit: 'mm'
      });
      
      const company = formData.companyDetails || {};
      // Use client information from the form data directly in the PDF generation
      
      // Document margins
      const margin = {
        top: 20,
        left: 20,
        right: 20
      };
      
      // Add invoice header on the left
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(`FACTURE N°${formData.number}`, margin.left, margin.top + 10);
      
      // Add invoice details
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text([
        `Date d'émission: ${new Date(formData.date || "").toLocaleDateString("fr-FR")}`,
        `Échéance: ${new Date(formData.dueDate || "").toLocaleDateString("fr-FR")}`,
      ], margin.left, margin.top + 20);
      
      // Add logo on the right
      try {
        const logoData = await loadLogoForPDF();
        // Type assertion to ensure logoData is treated as a string
        doc.addImage(logoData as string, 'PNG', doc.internal.pageSize.width - margin.right - 35, margin.top, 35, 30); 
      } catch (error) {
        console.error('Error loading logo:', error);
      }
      
      // Start company details section lower
      const detailsStartY = margin.top + 45;
      
      // Company details section
      doc.setFont("helvetica", "bold");
      doc.text("Émetteur", margin.left, detailsStartY);
      
      doc.setFont("helvetica", "normal");
      const companyDetails = [
        `${company?.name || ''}`,
        `${company?.contact_name || ''}`,
        `${company?.address || ''}`,
        `${company?.postal_code || ''} ${company?.city || ''}`,
        `${company?.country || ''}`,
        `N° d'entreprise : ${company?.registration_number || ''}`,
        `Code d'activité : ${company?.activity_code || ''}`,
        `Numéro de TVA : ${company?.vat_number || ''}`,
        `Numéro de téléphone : ${company?.phone || ''}`,
        `Adresse email : ${company?.email || ''}`,
        `Site internet : ${company?.website || "https://www.pledgeandgrow.com/"}`,
      ];
      doc.text(companyDetails, margin.left, detailsStartY + 5);
      
      // Client details - positioned at right side, same level as company details
      const middleX = doc.internal.pageSize.width / 2;
      doc.setFont("helvetica", "bold");
      doc.text("Destinataire", middleX + margin.left, detailsStartY);
      
      doc.setFont("helvetica", "normal");
      const clientDetails = [
        formData.clientName,
        formData.clientAddress,
        formData.clientEmail,
        formData.clientPhone,
      ].filter(Boolean).join('\n');
      doc.text(clientDetails, middleX + margin.left, detailsStartY + 5);
      
      // Project details if available - positioned below company details
      if (formData.projectName) {
        doc.setFont("helvetica", "bold");
        doc.text("PROJET", margin.left, detailsStartY + 60);
        doc.setFont("helvetica", "normal");
        doc.text(formData.projectName, margin.left, detailsStartY + 65);
      }
      
      // Add some spacing before the items table
      const tableStartY = detailsStartY + 80;
      
      // Add table header
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("DÉTAILS DE LA PRESTATION", margin.left, tableStartY - 10);
      
      // Reset font for table
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      autoTable(doc, {
        startY: tableStartY,
        head: [["Description", "Quantité", "Prix unitaire HT", "Total HT"]],
        body: formData.items?.map(item => [
          item.description,
          item.quantity.toString(),
          formatCurrency(item.unitPrice),
          formatCurrency(item.amount),
        ]) || [],
        headStyles: {
          fillColor: [44, 62, 80], // Dark blue background
          textColor: [255, 255, 255], // White text
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'left',
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [0, 0, 0],
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 20, halign: 'right' },
          2: { cellWidth: 30, halign: 'right' },
          3: { cellWidth: 30, halign: 'right' },
        },
        margin: { left: margin.left, right: margin.right },
        tableWidth: 'auto',
      });
      
      // Totals section - positioned below table
      // Get the final Y position from the last table
      // jsPDF with autotable plugin adds this property at runtime
      const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
      
      // Add totals on the right
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const totalsX = doc.internal.pageSize.width - margin.right - 30;
      doc.text([
        "Total HT",
        `TVA (${formData.taxRate}%)`,
        "Total TTC",
      ], totalsX, finalY + 5);
      
      // Add amounts aligned to the right
      doc.text([
        formatCurrency(formData.subtotal || 0),
        formatCurrency(formData.taxAmount || 0),
        formatCurrency(formData.total || 0),
      ], doc.internal.pageSize.width - margin.right, finalY + 5, { align: "right" });
      
      // Payment information - positioned at bottom
      const paymentY = finalY + 30;
      
      // Payment terms on the left
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("CONDITIONS DE PAIEMENT", margin.left, paymentY);
      doc.setFont("helvetica", "normal");
      doc.text([
        `Mode de paiement: ${formData.paymentMethod}`,
        `Conditions: ${formData.paymentTerms}`,
      ], margin.left, paymentY + 5);
      
      // Bank details on the right
      doc.setFont("helvetica", "bold");
      doc.text("COORDONNÉES BANCAIRES", doc.internal.pageSize.width - margin.right, paymentY, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.text(["Informations de paiement:", 
        `Mode de paiement: ${formData.paymentMethod || "Virement bancaire"}`,
        `IBAN: ${company?.bank_account || "FR76 1234 5678 9012 3456 7890 123"}`,
      ], doc.internal.pageSize.width - margin.right, paymentY + 5, { align: "right" });
      
      // Add logo if available
      if (formData.logo && typeof formData.logo === 'string') {
        doc.addImage(formData.logo, 'JPEG', margin.left, margin.top, 40, 20);
      }
      
      // Notes section if available
      if (formData.notes) {
        doc.setFont("helvetica", "bold");
        doc.text("NOTES", margin.left, paymentY + 35);
        doc.setFont("helvetica", "normal");
        doc.text(formData.notes, margin.left, paymentY + 40);
      }
      
      // Footer with page number
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(
        `Page 1/1`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
      
      // Save PDF
      doc.save(`facture_${formData.number}.pdf`);
      
      toast({
        title: "Succès",
        description: "Facture exportée en PDF",
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter la facture en PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="number">Numéro de facture</Label>
            <Input
              id="number"
              value={formData.number}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  number: e.target.value,
                }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="date">Date d&apos;émission</Label>
            <Input
              type="date"
              id="date"
              value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  date: new Date(e.target.value).toISOString(),
                }))
              }
            />
          </div>

          <div>
            <Label htmlFor="dueDate">Date d&apos;échéance</Label>
            <Input
              type="date"
              id="dueDate"
              value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dueDate: new Date(e.target.value).toISOString(),
                }))
              }
            />
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "draft" | "sent" | "paid" | "overdue" | "cancelled") =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
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
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="emetteur">Émetteur</Label>
            <Select
              value={formData.clientName || ''}
              onValueChange={handleClientChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un émetteur" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.name} value={client.name}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="project">Client</Label>
            <Select
              value={formData.projectName}
              onValueChange={handleProjectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.name}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="paymentTerms">Conditions de paiement</Label>
            <Input
              id="paymentTerms"
              value={formData.paymentTerms}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  paymentTerms: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <Label htmlFor="paymentMethod">Mode de paiement</Label>
            <Input
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  paymentMethod: e.target.value,
                }))
              }
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
              onChange={(e) =>
                setNewItem((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="item_quantity">Quantité</Label>
            <Input
              id="item_quantity"
              type="number"
              min="1"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem((prev) => ({
                  ...prev,
                  quantity: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="item_price">Prix unitaire</Label>
            <Input
              id="item_price"
              type="number"
              min="0"
              step="0.01"
              value={newItem.unitPrice}
              onChange={(e) =>
                setNewItem((prev) => ({
                  ...prev,
                  unitPrice: parseFloat(e.target.value) || 0,
                }))
              }
            />
          </div>
        </div>
        <Button type="button" onClick={handleAddItem}>
          Ajouter l&apos;article
        </Button>

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
                  <td className="text-right">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="text-right">{formatCurrency(item.amount)}</td>
                  <td className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleRemoveItem(index)}
                    >
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
                value={formData.taxRate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    taxRate: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-20"
              />
              <span>%</span>
              <span className="ml-4">
                {formatCurrency(formData.taxAmount || 0)}
              </span>
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
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
          />
        </div>

        <div className="flex justify-between pt-6">
          <div className="space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="button" variant="outline" onClick={exportToPDF}>
              Exporter en PDF
            </Button>
          </div>
          <Button type="submit">
            {initialData ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </div>
    </form>
  );
}
