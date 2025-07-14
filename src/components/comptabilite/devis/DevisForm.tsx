'use client';

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Document } from "@/types/documents";
import { Loader2, Plus, Trash2, Download, Save } from "lucide-react";
// Import types from types.ts file
import { QuoteMetadata as QuoteMetadataType, QuoteItem as QuoteItemType, CompanyDetails as CompanyDetailsType } from "./types";
import { v4 as uuidv4 } from "uuid";

// Ensure all items have required fields with default values
const ensureRequiredFields = (items: Partial<QuoteItemType>[]): QuoteItemType[] => {
  return items.map(item => ({
    id: item.id || uuidv4(),
    description: item.description || '',
    quantity: item.quantity || 0,
    unit_price: item.unit_price || 0,
    amount: item.amount || 0
  }));
};
import { useToast } from "@/components/ui/use-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import useDocuments from "@/hooks/useDocuments";
import { formatCurrency } from "@/lib/utils/format";

// Client and Project types (simplified versions if not imported)
interface ClientContact {
  id: string;
  metadata?: {
    first_name?: string;
    last_name?: string;
    company_name?: string;
    is_company?: boolean;
    email?: string;
    phone?: string;
    address?: string;
    postal_code?: string;
    city?: string;
    country?: string;
  };
}

interface Project {
  id: string;
  name: string;
}

interface DevisFormProps {
  onSubmit: (data: QuoteMetadataType) => void;
  onCancel: () => void;
  clients: ClientContact[];
  projects: Project[];
  initialDocument?: Document;
  companyDetails: CompanyDetailsType;
  isLoading?: boolean;
  isSubmitting?: boolean;
}

export function DevisForm({
  onSubmit,
  onCancel,
  clients,
  projects,
  initialDocument,
  companyDetails,
}: DevisFormProps) {
  const { toast } = useToast();
  
  // Initialize form state from initialDocument or with default values
  const [formData, setFormData] = useState<QuoteMetadataType>(() => {
    if (initialDocument?.metadata) {
      // Convert Document metadata to QuoteMetadataType
      const metadata = initialDocument.metadata as Partial<QuoteMetadataType>;
      return {
        quote_number: metadata.quote_number || '',
        date: metadata.date || new Date().toISOString().split('T')[0],
        due_date: metadata.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quote_status: metadata.quote_status || 'draft',
        client: metadata.client || {
          id: '',
          name: '',
          address: '',
          postal_code: '',
          city: '',
          country: '',
          email: '',
          phone: ''
        },
        project_id: metadata.project_id || '',
        project_name: metadata.project_name || '',
        items: ensureRequiredFields(metadata.items || []),
        subtotal: metadata.subtotal || 0,
        tax_rate: metadata.tax_rate || 20,
        tax_amount: metadata.tax_amount || 0,
        total: metadata.total || 0,
        notes: metadata.notes || '',
        payment_terms: metadata.payment_terms || '',
        payment_method: metadata.payment_method || '',
        currency: metadata.currency || 'EUR',
        language: metadata.language || 'fr',
        company_details: metadata.company_details || companyDetails
      };
    } else {
      // Default values for new quote
      return {
        quote_number: `DEVIS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quote_status: 'draft' as const,
        client: {
          id: '',
          name: '',
          address: '',
          postal_code: '',
          city: '',
          country: '',
          email: '',
          phone: ''
        },
        project_id: '',
        project_name: '',
        items: [] as QuoteItemType[],
        subtotal: 0,
        tax_rate: 20,
        tax_amount: 0,
        total: 0,
        notes: '',
        payment_terms: 'Paiement à 30 jours',
        payment_method: 'Virement bancaire',
        currency: 'EUR',
        language: 'fr',
        company_details: companyDetails
      };
    }
  });

  // State for new item being added
  const [newItem, setNewItem] = useState<QuoteItemType>({
    id: '',
    description: '',
    quantity: 1,
    unit_price: 0,
    amount: 0
  });

  // Calculate totals whenever items change
  useEffect(() => {
    const subtotal = formData.items.reduce((total: number, item: QuoteItemType) => total + item.amount, 0);
    const taxAmount = subtotal * (formData.tax_rate / 100);
    const total = subtotal + taxAmount;
    setFormData((prev: QuoteMetadataType) => ({
      ...prev,
      subtotal,
      tax_amount: taxAmount,
      total
    }));
  }, [formData.items, formData.tax_rate]);

  // Handle client selection
  const handleClientChange = useCallback((clientId: string) => {
    const selectedClient = clients.find(c => c.id === clientId);
    
    if (selectedClient) {
      // Extract client details from metadata
      const clientName = selectedClient.metadata?.is_company 
        ? selectedClient.metadata.company_name || ''
        : `${selectedClient.metadata?.first_name || ''} ${selectedClient.metadata?.last_name || ''}`.trim();
      
      setFormData((prev: QuoteMetadataType) => ({
        ...prev,
        client: {
          id: selectedClient.id,
          name: clientName || '',
          address: selectedClient.metadata?.address || '',
          postal_code: selectedClient.metadata?.postal_code || '',
          city: selectedClient.metadata?.city || '',
          country: selectedClient.metadata?.country || '',
          email: selectedClient.metadata?.email || '',
          phone: selectedClient.metadata?.phone || ''
        }
      }));
    } else {
      // Reset client if not found
      setFormData((prev: QuoteMetadataType) => ({
        ...prev,
        client: {
          id: '',
          name: '',
          address: '',
          postal_code: '',
          city: '',
          country: '',
          email: '',
          phone: ''
        }
      }));
    }
  }, [clients]);

  // Handle project selection
  const handleProjectChange = useCallback((projectId: string) => {
    const selectedProject = projects.find(p => p.id === projectId);
    
    if (selectedProject) {
      setFormData((prev: QuoteMetadataType) => ({
        ...prev,
        project_id: selectedProject.id,
        project_name: selectedProject.name
      }));
    } else {
      // Allow manual entry if project not found
      setFormData((prev: QuoteMetadataType) => ({
        ...prev,
        project_id: '',
        project_name: projectId // Use the input as project name
      }));
    }
  }, [projects]);

  // Handle new item changes
  const handleNewItemChange = useCallback((field: keyof QuoteItemType, value: string | number) => {
    setNewItem((prev: QuoteItemType) => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate amount when quantity or unit_price changes
      if (field === 'quantity' || field === 'unit_price') {
        const quantity = field === 'quantity' ? Number(value) : prev.quantity;
        const unitPrice = field === 'unit_price' ? Number(value) : prev.unit_price;
        updated.amount = quantity * unitPrice;
      }
      
      return updated;
    });
  }, []);

  // Add new item to quote
  const addItem = useCallback(() => {
    if (!newItem.description) {
      toast({
        title: "Champ requis",
        description: "La description de l'article est obligatoire",
        variant: "destructive"
      });
      return;
    }

    // Create a complete item with all required fields
    const completeItem: QuoteItemType = {
      id: uuidv4(),
      description: newItem.description || '',
      quantity: newItem.quantity || 0,
      unit_price: newItem.unit_price || 0,
      amount: newItem.amount || 0
    };

    setFormData((prev: QuoteMetadataType) => ({
      ...prev,
      items: [...prev.items, completeItem]
    }));
      
    // Reset new item form after adding
    setNewItem({
      id: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      amount: 0
    });
  }, [newItem, toast]);

  // Remove item from the list
  const removeItem = useCallback((index: number) => {
    setFormData((prev: QuoteMetadataType) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  }, []);

  // Update item in the list
  const updateItem = useCallback((index: number, field: keyof QuoteItemType, value: string | number) => {
    setFormData((prev: QuoteMetadataType) => {
      const updatedItems = [...prev.items];
      const item = { ...updatedItems[index], [field]: value };
      
      // Auto-calculate amount when quantity or unit_price changes
      if (field === 'quantity' || field === 'unit_price') {
        const quantity = field === 'quantity' ? Number(value) : updatedItems[index].quantity;
        const unitPrice = field === 'unit_price' ? Number(value) : updatedItems[index].unit_price;
        item.amount = quantity * unitPrice;
      }
      
      updatedItems[index] = item;
      return { ...prev, items: updatedItems };
    });
  }, []);

  // Get document operations from useDocuments hook
  const { createDocument, updateDocument, loading: documentLoading } = useDocuments();

  // Validate form before submission
  const validateForm = useCallback(() => {
    // Check required fields
    if (!formData.quote_number) {
      toast({
        title: "Numéro de devis requis",
        description: "Veuillez saisir un numéro de devis",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.date) {
      toast({
        title: "Date d'émission requise",
        description: "Veuillez sélectionner une date d'émission",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.due_date) {
      toast({
        title: "Date d'échéance requise",
        description: "Veuillez sélectionner une date d'échéance",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.client.id || !formData.client.name) {
      toast({
        title: "Client requis",
        description: "Veuillez sélectionner ou saisir un client",
        variant: "destructive"
      });
      return false;
    }
    
    if (formData.items.length === 0) {
      toast({
        title: "Articles requis",
        description: "Veuillez ajouter au moins un article au devis",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  }, [formData, toast]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Convert QuoteMetadataType to a Supabase-compatible metadata record
      // Use type assertion to ensure compatibility with Supabase metadata format
      const metadataRecord = {
        // Convert complex objects to strings for storage
        quote_number: formData.quote_number,
        date: formData.date,
        due_date: formData.due_date,
        quote_status: formData.quote_status,
        client: formData.client,
        items: JSON.stringify(formData.items),
        subtotal: formData.subtotal,
        tax_rate: formData.tax_rate,
        tax_amount: formData.tax_amount,
        total: formData.total,
        notes: formData.notes || '',
        payment_terms: formData.payment_terms || '',
        payment_method: formData.payment_method || '',
        currency: formData.currency,
        language: formData.language,
        company_details: JSON.stringify(formData.company_details),
        project_id: formData.project_id || '',
        project_name: formData.project_name || ''
      } as Record<string, string | number | boolean | string[] | Record<string, unknown>>;

      if (initialDocument) {
        // Update existing document
        await updateDocument({
          id: initialDocument.id,
          metadata: metadataRecord,
          // Use the correct field names from Document interface
          title: initialDocument.title || `Devis ${formData.quote_number}`,
          document_type_id: initialDocument.document_type_id,
          status: initialDocument.status || 'Active'
        });
        toast({
          title: "Devis mis à jour",
          description: "Le devis a été mis à jour avec succès",
          variant: "default"
        });
      } else {
        // Create new document
        await createDocument({
          title: `Devis ${formData.quote_number}`,
          document_type_id: "quote", // Document type for quotes
          metadata: metadataRecord,
          status: "Active"
        });
        toast({
          title: "Devis créé",
          description: "Le devis a été créé avec succès",
          variant: "default"
        });
      }
      
      // Call the onSubmit callback with the form data
      onSubmit(formData);
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du devis",
        variant: "destructive"
      });
    }
  }, [formData, initialDocument, createDocument, updateDocument, validateForm, onSubmit, toast]);


  // Export to PDF
  const exportToPDF = useCallback(async () => {
    try {
      // Initialize PDF with A4 format
      const doc = new jsPDF({
        format: 'a4',
        unit: 'mm'
      });
      
      // Document margins
      const margin = {
        top: 20,
        left: 20,
        right: 20
      };
      
      // Add quote header on the left
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(`DEVIS N°${formData.quote_number}`, margin.left, margin.top + 10);
      
      // Add quote details
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text([
        `Date d'émission: ${new Date(formData.date).toLocaleDateString("fr-FR")}`,
        `Échéance: ${new Date(formData.due_date).toLocaleDateString("fr-FR")}`,
      ], margin.left, margin.top + 20);
      
      // Add company details on the right
      // Use the companyDetails prop with fallbacks for missing values
      doc.setFont("helvetica", "bold");
      doc.text(companyDetails.name || "[Nom de l'entreprise]", 120, margin.top + 10);
      doc.setFont("helvetica", "normal");
      doc.text([
        companyDetails.address || "[Adresse]",
        `${companyDetails.postal_code || ""} ${companyDetails.city || "[Ville]"}`,
        companyDetails.country || "[Pays]",
        `Tél: ${companyDetails.phone || ''}`,
        `Email: ${companyDetails.email || ''}`,
        companyDetails.website || '',
      ], 120, margin.top + 20);
      
      // Add client details
      doc.setFont("helvetica", "bold");
      doc.text("CLIENT", margin.left, margin.top + 50);
      doc.setFont("helvetica", "normal");
      doc.text([
        formData.client.name,
        formData.client.address,
        `${formData.client.postal_code} ${formData.client.city}`,
        formData.client.country,
        `Tél: ${formData.client.phone}`,
        `Email: ${formData.client.email}`,
      ], margin.left, margin.top + 60);
      
      // Add project details if available
      if (formData.project_name) {
        doc.setFont("helvetica", "bold");
        doc.text("PROJET", 120, margin.top + 50);
        doc.setFont("helvetica", "normal");
        doc.text([
          formData.project_name,
        ], 120, margin.top + 60);
      }
      
      // Add items table
      const tableColumn = ["Description", "Quantité", "Prix unitaire", "Montant"];
      const tableRows = formData.items.map(item => [
        item.description,
        item.quantity.toString(),
        formatCurrency(item.unit_price),
        formatCurrency(item.amount)
      ]);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: margin.top + 80,
        margin: { left: margin.left },
        styles: { fontSize: 9 },
        headStyles: { fillColor: [60, 60, 60] }
      });
      
      // Add totals
      // Use proper type assertion for jsPDF with autoTable plugin
      const docWithAutoTable = doc as unknown as { lastAutoTable: { finalY: number } };
      const finalY = docWithAutoTable.lastAutoTable.finalY + 10;
      
      doc.setFont("helvetica", "normal");
      doc.text("Sous-total:", 120, finalY);
      doc.text(formatCurrency(formData.subtotal), 170, finalY, { align: "right" });
      
      doc.text(`TVA (${formData.tax_rate}%):`, 120, finalY + 7);
      doc.text(formatCurrency(formData.tax_amount), 170, finalY + 7, { align: "right" });
      
      doc.setFont("helvetica", "bold");
      doc.text("Total:", 120, finalY + 14);
      doc.text(formatCurrency(formData.total), 170, finalY + 14, { align: "right" });
      
      // Add payment details
      doc.setFont("helvetica", "bold");
      doc.text("CONDITIONS DE PAIEMENT", margin.left, finalY + 30);
      doc.setFont("helvetica", "normal");
      doc.text([
        `Méthode de paiement: ${formData.payment_method}`,
        `Conditions: ${formData.payment_terms}`,
      ], margin.left, finalY + 37);
      
      // Add notes if available
      if (formData.notes) {
        doc.setFont("helvetica", "bold");
        doc.text("NOTES", margin.left, finalY + 55);
        doc.setFont("helvetica", "normal");
        doc.text(formData.notes, margin.left, finalY + 62);
      }
      
      // Save the PDF
      doc.save(`devis-${formData.quote_number}.pdf`);
      
      toast({
        title: "PDF généré avec succès",
        description: "Le devis a été exporté en PDF",
        variant: "default"
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Erreur lors de la génération du PDF",
        description: "Une erreur est survenue lors de la génération du PDF",
        variant: "destructive"
      });
    }
  }, [formData, companyDetails, toast]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header section with quote number and dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="quote_number">Numéro de devis</Label>
          <Input
            id="quote_number"
            value={formData.quote_number}
            onChange={(e) => setFormData(prev => ({ ...prev, quote_number: e.target.value }))}
            placeholder="DEVIS-2023-001"
          />
        </div>
        <div>
          <Label htmlFor="date">Date d&apos;émission</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="due_date">Date d&apos;échéance</Label>
          <Input
            id="due_date"
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData((prev: QuoteMetadataType) => ({ ...prev, due_date: e.target.value }))}
          />
        </div>
      </div>

      {/* Status section */}
      <div>
        <Label htmlFor="quote_status">Statut</Label>
        <Select 
          value={formData.quote_status} 
          onValueChange={(value) => setFormData((prev: QuoteMetadataType) => ({ ...prev, quote_status: value as QuoteMetadataType['quote_status'] }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="sent">Envoyé</SelectItem>
            <SelectItem value="accepted">Accepté</SelectItem>
            <SelectItem value="rejected">Refusé</SelectItem>
            <SelectItem value="expired">Expiré</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Client section */}
      <div>
        <Label htmlFor="client">Client</Label>
        <Select 
          value={formData.client.id || undefined} 
          onValueChange={handleClientChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.metadata?.is_company 
                  ? client.metadata.company_name 
                  : `${client.metadata?.first_name || ''} ${client.metadata?.last_name || ''}`.trim()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Client details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="client_name">Nom</Label>
            <Input
              id="client_name"
              value={formData.client.name}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                client: { ...prev.client, name: e.target.value } 
              }))}
            />
          </div>
          <div>
            <Label htmlFor="client_email">Email</Label>
            <Input
              id="client_email"
              value={formData.client.email}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                client: { ...prev.client, email: e.target.value } 
              }))}
            />
          </div>
          <div>
            <Label htmlFor="client_phone">Téléphone</Label>
            <Input
              id="client_phone"
              value={formData.client.phone}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                client: { ...prev.client, phone: e.target.value } 
              }))}
            />
          </div>
          <div>
            <Label htmlFor="client_address">Adresse</Label>
            <Input
              id="client_address"
              value={formData.client.address}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                client: { ...prev.client, address: e.target.value } 
              }))}
            />
          </div>
          <div>
            <Label htmlFor="client_postal_code">Code postal</Label>
            <Input
              id="client_postal_code"
              value={formData.client.postal_code}
              onChange={(e) => setFormData((prev: QuoteMetadataType) => ({ 
                ...prev, 
                client: { ...prev.client, postal_code: e.target.value } 
              }))}
            />
          </div>
          <div>
            <Label htmlFor="client_city">Ville</Label>
            <Input
              id="client_city"
              value={formData.client.city}
              onChange={(e) => setFormData((prev: QuoteMetadataType) => ({ 
                ...prev, 
                client: { ...prev.client, city: e.target.value } 
              }))}
            />
          </div>
          <div>
            <Label htmlFor="client_country">Pays</Label>
            <Input
              id="client_country"
              value={formData.client.country}
              onChange={(e) => setFormData((prev: QuoteMetadataType) => ({ 
                ...prev, 
                client: { ...prev.client, country: e.target.value } 
              }))}
            />
          </div>
        </div>
      </div>

      {/* Project section */}
      <div>
        <Label htmlFor="project">Projet</Label>
        <Select 
          value={formData.project_id || undefined} 
          onValueChange={handleProjectChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un projet" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="mt-4">
          <Label htmlFor="project_name">Nom du projet</Label>
          <Input
            id="project_name"
            value={formData.project_name || ''}
            onChange={(e) => setFormData((prev: QuoteMetadataType) => ({ ...prev, project_name: e.target.value }))}
          />
        </div>
      </div>

      {/* Payment terms section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="payment_terms">Conditions de paiement</Label>
          <Input
            id="payment_terms"
            value={formData.payment_terms}
            onChange={(e) => setFormData((prev: QuoteMetadataType) => ({ ...prev, payment_terms: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="payment_method">Méthode de paiement</Label>
          <Input
            id="payment_method"
            value={formData.payment_method}
            onChange={(e) => setFormData((prev: QuoteMetadataType) => ({ ...prev, payment_method: e.target.value }))}
          />
        </div>
      </div>

      {/* Items section */}
      <div>
        <h3 className="text-lg font-medium mb-4">Articles</h3>
        
        {/* Existing items */}
        <div className="space-y-4 mb-6">
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-5">
                <Input
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  placeholder="Description"
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                  placeholder="Quantité"
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  value={item.unit_price}
                  onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                  placeholder="Prix unitaire"
                />
              </div>
              <div className="col-span-2">
                <Input
                  readOnly
                  value={formatCurrency(item.amount)}
                />
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* New item form */}
        <div className="grid grid-cols-12 gap-2 items-center mb-4">
          <div className="col-span-5">
            <Input
              value={newItem.description}
              onChange={(e) => handleNewItemChange('description', e.target.value)}
              placeholder="Description"
            />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              value={newItem.quantity}
              onChange={(e) => handleNewItemChange('quantity', parseFloat(e.target.value) || 0)}
              placeholder="Quantité"
            />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              value={newItem.unit_price}
              onChange={(e) => handleNewItemChange('unit_price', parseFloat(e.target.value) || 0)}
              placeholder="Prix unitaire"
            />
          </div>
          <div className="col-span-2">
            <Input
              readOnly
              value={formatCurrency(newItem.amount)}
            />
          </div>
          <div className="col-span-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={addItem}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Totals section */}
      <div className="flex flex-col items-end space-y-2">
        <div className="flex justify-between w-full md:w-1/3">
          <span>Sous-total:</span>
          <span>{formatCurrency(formData.subtotal)}</span>
        </div>
        <div className="flex justify-between w-full md:w-1/3">
          <div className="flex items-center gap-2">
            <span>TVA:</span>
            <Input
              type="number"
              className="w-16"
              value={formData.tax_rate}
              onChange={(e) => setFormData((prev: QuoteMetadataType) => ({ ...prev, tax_rate: parseFloat(e.target.value) || 0 }))}
            />
            <span>%</span>
          </div>
          <span>{formatCurrency(formData.tax_amount)}</span>
        </div>
        <div className="flex justify-between w-full md:w-1/3 font-bold">
          <span>Total:</span>
          <span>{formatCurrency(formData.total)}</span>
        </div>
      </div>

      {/* Notes section */}
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData((prev: QuoteMetadataType) => ({ ...prev, notes: e.target.value }))}
          placeholder="Notes additionnelles pour le client"
          rows={4}
        />
      </div>

      {/* Action buttons */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={exportToPDF}>
            <Download className="mr-2 h-4 w-4" />
            Exporter en PDF
          </Button>
          <Button type="submit" disabled={documentLoading}>
            {documentLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
