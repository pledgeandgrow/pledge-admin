'use client';

import { useEffect, useState } from "react";
import { Invoice } from "./types";
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
  onSubmit: (data: Partial<Invoice>) => void;
  onCancel: () => void;
  clients: Invoice["client"][];
  projects: { id: string; name: string }[];
  initialData?: Invoice;
  companyDetails: any;
}

export function InvoiceForm({
  onSubmit,
  onCancel,
  clients,
  projects,
  initialData,
  companyDetails,
}: InvoiceFormProps) {
  const [formData, setFormData] = useState<Partial<Invoice>>(
    initialData || {
      invoice_number: "",
      date: new Date().toISOString(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "draft",
      client: { name: "", address: "", email: "", country: "", registration_number: "", activity_code: "", vat_number: "", phone: "" },
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

  const [newItem, setNewItem] = useState({
    description: "",
    quantity: 1,
    unit_price: 0,
    total: 0,
  });

  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.tax_rate]);

  const calculateTotals = () => {
    const items = formData.items || [];
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * (formData.tax_rate || 0)) / 100;
    const total = subtotal + taxAmount;

    setFormData((prev) => ({
      ...prev,
      subtotal,
      tax_amount: taxAmount,
      total,
    }));
  };

  const handleAddItem = () => {
    if (!newItem.description || newItem.quantity <= 0 || newItem.unit_price <= 0) {
      return;
    }

    const itemTotal = newItem.quantity * newItem.unit_price;
    const item = { ...newItem, total: itemTotal };

    setFormData((prev) => ({
      ...prev,
      items: [...(prev.items || []), item],
    }));

    setNewItem({
      description: "",
      quantity: 1,
      unit_price: 0,
      total: 0,
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
      setFormData((prev) => ({ ...prev, client: selectedClient }));
    } else {
      // Allow manual entry if client not found
      setFormData((prev) => ({
        ...prev,
        client: { name: clientName, address: "", email: "", country: "", registration_number: "", activity_code: "", vat_number: "", phone: "" },
      }));
    }
  };

  const handleProjectChange = (projectName: string) => {
    const selectedProject = projects.find((p) => p.name === projectName);
    if (selectedProject) {
      setFormData((prev) => ({
        ...prev,
        project_id: selectedProject.id,
        project_name: selectedProject.name,
      }));
    } else {
      // Allow manual entry if project not found
      setFormData((prev) => ({
        ...prev,
        project_id: undefined,
        project_name: projectName,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const exportToPDF = async () => {
    try {
      // Initialize PDF with A4 format
      const doc = new jsPDF({
        format: 'a4',
        unit: 'mm'
      });
      
      const company = formData.company_details;
      const client = formData.client;
      
      // Document margins
      const margin = {
        top: 20,
        left: 20,
        right: 20
      };
      
      // Add invoice header on the left
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(`FACTURE N°${formData.invoice_number}`, margin.left, margin.top + 10);
      
      // Add invoice details
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text([
        `Date d'émission: ${new Date(formData.date || "").toLocaleDateString("fr-FR")}`,
        `Échéance: ${new Date(formData.due_date || "").toLocaleDateString("fr-FR")}`,
      ], margin.left, margin.top + 20);
      
      // Add logo on the right
      try {
        const logoData = await loadLogoForPDF();
        doc.addImage(logoData, 'PNG', doc.internal.pageSize.width - margin.right - 35, margin.top, 35, 30); 
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
        `Société : ${company.name}`,
        `Votre contact : ${company.contact_name || "Mehdi Berel"}`,
        `Adresse : ${company.address}`,
        `${company.postal_code} ${company.city}`,
        `Pays : ${company.country}`,
        `Numéro d'entreprise : ${company.registration_number}`,
        `Code d'activité : ${company.activity_code || "6201Z"}`,
        `Numéro de TVA : ${company.vat_number}`,
        `Numéro de téléphone : ${company.phone}`,
        `Adresse email : ${company.email}`,
        `Site internet : ${company.website || "https://www.pledgeandgrow.com/"}`
      ];
      doc.text(companyDetails, margin.left, detailsStartY + 5);
      
      // Client details - positioned at right side, same level as company details
      const middleX = doc.internal.pageSize.width / 2;
      doc.setFont("helvetica", "bold");
      doc.text("Destinataire", middleX + margin.left, detailsStartY);
      
      doc.setFont("helvetica", "normal");
      const clientDetails = [
        `Société : ${client.name || ""}`,
        `Adresse : ${client.address || ""}`,
        `Pays : ${client.country || ""}`,
        `Numéro d'entreprise : ${client.registration_number || ""}`,
        `Code d'activité : ${client.activity_code || ""}`,
        `Numéro de TVA : ${client.vat_number || ""}`,
        `Numéro de téléphone : ${client.phone || ""}`
      ];
      doc.text(clientDetails, middleX + margin.left, detailsStartY + 5);
      
      // Project details if available - positioned below company details
      if (formData.project_name) {
        doc.setFont("helvetica", "bold");
        doc.text("PROJET", margin.left, detailsStartY + 60);
        doc.setFont("helvetica", "normal");
        doc.text(formData.project_name, margin.left, detailsStartY + 65);
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
          formatCurrency(item.unit_price),
          formatCurrency(item.total),
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
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      
      // Add totals on the right
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const totalsX = doc.internal.pageSize.width - margin.right - 30;
      doc.text([
        "Total HT",
        `TVA (${formData.tax_rate}%)`,
        "Total TTC",
      ], totalsX, finalY + 5);
      
      // Add amounts aligned to the right
      doc.text([
        formatCurrency(formData.subtotal || 0),
        formatCurrency(formData.tax_amount || 0),
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
        `Mode de paiement: ${formData.payment_method}`,
        `Conditions: ${formData.payment_terms}`,
      ], margin.left, paymentY + 5);
      
      // Bank details on the right
      doc.setFont("helvetica", "bold");
      doc.text("COORDONNÉES BANCAIRES", doc.internal.pageSize.width - margin.right, paymentY, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.text([
        `IBAN: ${company.bank_account || "FR76 1234 5678 9012 3456 7890 123"}`,
      ], doc.internal.pageSize.width - margin.right, paymentY + 5, { align: "right" });
      
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
      doc.save(`facture_${formData.invoice_number}.pdf`);
      
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
            <Label htmlFor="invoice_number">Numéro de facture</Label>
            <Input
              id="invoice_number"
              value={formData.invoice_number}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  invoice_number: e.target.value,
                }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="date">Date d'émission</Label>
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
            <Label htmlFor="due_date">Date d'échéance</Label>
            <Input
              type="date"
              id="due_date"
              value={formData.due_date ? new Date(formData.due_date).toISOString().split('T')[0] : ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  due_date: new Date(e.target.value).toISOString(),
                }))
              }
            />
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
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
              value={formData.client?.name}
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
              value={formData.project_name}
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
            <Label htmlFor="payment_terms">Conditions de paiement</Label>
            <Input
              id="payment_terms"
              value={formData.payment_terms}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  payment_terms: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <Label htmlFor="payment_method">Mode de paiement</Label>
            <Input
              id="payment_method"
              value={formData.payment_method}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  payment_method: e.target.value,
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
              value={newItem.unit_price}
              onChange={(e) =>
                setNewItem((prev) => ({
                  ...prev,
                  unit_price: parseFloat(e.target.value) || 0,
                }))
              }
            />
          </div>
        </div>
        <Button type="button" onClick={handleAddItem}>
          Ajouter l'article
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
                    {formatCurrency(item.unit_price)}
                  </td>
                  <td className="text-right">{formatCurrency(item.total)}</td>
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
                value={formData.tax_rate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tax_rate: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-20"
              />
              <span>%</span>
              <span className="ml-4">
                {formatCurrency(formData.tax_amount || 0)}
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
