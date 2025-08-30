'use client';

import { useEffect, useState, useCallback } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Document, CreateDocumentParams } from "@/types/documents";
import { QuoteMetadata, QuoteItem, CompanyDetails, ExtendedClient } from "./types";
import { v4 as uuidv4 } from "uuid";
import { Loader2, Plus, Trash2, Download, Save } from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";
import { formatCurrency } from "@/lib/utils/format";

// Using ExtendedClient from types.ts

// Generate a quote number
const generateQuoteNumber = () => {
  return `DEVIS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
};

// Function to create a new default client with company details
const createDefaultClient = (): ExtendedClient => {
  return {
    id: '',
    name: '',
    address: '',
    postal_code: '',
    city: '',
    country: '',
    email: '',
    phone: '',
    company_details: {
      is_company: false,
      vat_number: '',
      registration_number: ''
    }
  };
};

// Ensure all items have required fields with default values
const ensureRequiredFields = (items: Partial<QuoteItem>[]): QuoteItem[] => {
  return items.map(item => ({
    id: item.id || uuidv4(),
    description: item.description || '',
    quantity: item.quantity || 0,
    unit_price: item.unit_price || 0,
    amount: item.amount || 0
  }));
};

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
    vat_number?: string;
    registration_number?: string;
  };
}

interface Project {
  id: string;
  name: string;
}

interface DevisFormProps {
  onSubmit: (data: QuoteMetadata) => void;
  onCancel: () => void;
  clients: ClientContact[];
  projects: Project[];
  initialDocument?: Document;
  companyDetails: CompanyDetails;
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
  const [formData, setFormData] = useState<QuoteMetadata>(() => {
    // Default form data when no initialDocument is provided
    const defaultFormData: QuoteMetadata = {
      quote_number: generateQuoteNumber(),
      date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      quote_status: 'draft',
      client: createDefaultClient(),
      project_id: '',
      project_name: '',
      items: [],
      subtotal: 0,
      tax_rate: 20,
      tax_amount: 0,
      total: 0,
      notes: '',
      payment_terms: 'Payment due within 30 days',
      payment_method: 'Bank transfer',
      currency: 'EUR',
      language: 'fr',
      company_details: {
        name: companyDetails.name || '',
        address: companyDetails.address || '',
        postal_code: companyDetails.postal_code || '',
        city: companyDetails.city || '',
        country: companyDetails.country || '',
        vat_number: companyDetails.vat_number || '',
        registration_number: companyDetails.registration_number || '',
        phone: companyDetails.phone || '',
        email: '',
        website: '',
      }
    };
    
    // If no initialDocument is provided, return default form data
    if (!initialDocument) {
      return defaultFormData;
    }
    
    try {
      // Cast metadata to QuoteMetadata and ensure it's not undefined
      const metadata = initialDocument.metadata as unknown as QuoteMetadata | undefined;
      
      if (!metadata) {
        console.error("Invalid metadata in initial document");
        return defaultFormData;
      }
      
      // For debugging
      console.log('Initial document metadata:', metadata);
      
      // Parse JSON strings in metadata
      let parsedClient: ExtendedClient = createDefaultClient();
      let parsedItems: QuoteItem[] = [];
      let parsedCompanyDetails: CompanyDetails = {
        name: companyDetails.name || '',
        address: companyDetails.address || '',
        postal_code: companyDetails.postal_code || '',
        city: companyDetails.city || '',
        country: companyDetails.country || '',
        vat_number: companyDetails.vat_number || '',
        registration_number: companyDetails.registration_number || '',
        phone: companyDetails.phone || '',
        email: '',
        website: ''
      };
      
      try {
        // Handle client data which might be a string (JSON) or an object
        if (typeof metadata.client === 'string') {
          try {
            parsedClient = JSON.parse(metadata.client);
          } catch (parseError) {
            console.error("Error parsing client JSON:", parseError);
            parsedClient = createDefaultClient();
          }
        } else if (metadata.client) {
          parsedClient = metadata.client;
        }
        console.log('Parsed client:', parsedClient);
      } catch (e) {
        console.error("Error handling client data:", e);
        // Keep default client
      }
      
      try {
        // Handle items which might be a string (JSON) or an array
        if (typeof metadata.items === 'string') {
          try {
            parsedItems = JSON.parse(metadata.items);
          } catch (parseError) {
            console.error("Error parsing items JSON:", parseError);
            parsedItems = [];
          }
        } else if (Array.isArray(metadata.items)) {
          parsedItems = metadata.items;
        }
        
        // Ensure all items have required fields
        parsedItems = ensureRequiredFields(parsedItems);
      } catch (e) {
        console.error("Error handling items data:", e);
        // Keep default items (empty array)
      }
      
      try {
        // Handle company_details which might be a string (JSON) or an object
        if (typeof metadata.company_details === 'string') {
          try {
            parsedCompanyDetails = JSON.parse(metadata.company_details);
          } catch (parseError) {
            console.error("Error parsing company details JSON:", parseError);
            parsedCompanyDetails = {
              name: companyDetails.name || '',
              address: companyDetails.address || '',
              postal_code: companyDetails.postal_code || '',
              city: companyDetails.city || '',
              country: companyDetails.country || '',
              vat_number: companyDetails.vat_number || '',
              registration_number: companyDetails.registration_number || '',
              phone: companyDetails.phone || '',
              email: '',
              website: ''
            };
          }
        } else if (metadata.company_details) {
          parsedCompanyDetails = metadata.company_details;
        }
      } catch (e) {
        console.error("Error handling company details data:", e);
        parsedCompanyDetails = {
          name: companyDetails.name || '',
          address: companyDetails.address || '',
          postal_code: companyDetails.postal_code || '',
          city: companyDetails.city || '',
          country: companyDetails.country || '',
          vat_number: companyDetails.vat_number || '',
          registration_number: companyDetails.registration_number || '',
          phone: companyDetails.phone || '',
          email: '',
          website: ''
        };
      }
      
      // Update form data with parsed metadata
      setFormData({
        quote_number: metadata.quote_number || '',
        date: metadata.date || new Date().toISOString().split('T')[0],
        due_date: metadata.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quote_status: metadata.quote_status || 'draft',
        client: parsedClient,
        project_id: metadata.project_id || '',
        project_name: metadata.project_name || '',
        items: parsedItems,
        subtotal: metadata.subtotal || 0,
        tax_rate: metadata.tax_rate || 20,
        tax_amount: metadata.tax_amount || 0,
        total: metadata.total || 0,
        notes: metadata.notes || '',
        payment_terms: metadata.payment_terms || '',
        payment_method: metadata.payment_method || '',
        currency: metadata.currency || 'EUR',
        language: metadata.language || 'fr',
        company_details: parsedCompanyDetails
      });
    } catch (e) {
      console.error("Error initializing form data from initial document:", e);
      return defaultFormData;
    }
    
    // Ensure we always return a valid QuoteMetadata object
    return defaultFormData;
  });

  // Initialize form state with default values if no initial document
  const initializeFormFromDocument = useCallback(() => {
    if (!initialDocument) return;
    
    try {
      const metadata = initialDocument.metadata as unknown as QuoteMetadata;
      if (!metadata) return;
      
      // Parse client data
      let parsedClient: ExtendedClient = createDefaultClient();
      try {
        if (metadata.client) {
          parsedClient = metadata.client;
        }
      } catch (e) {
        console.error("Error handling client data:", e);
      }
      
      // Parse items data
      let parsedItems: QuoteItem[] = [];
      try {
        if (metadata.items && Array.isArray(metadata.items)) {
          parsedItems = ensureRequiredFields(metadata.items);
        }
      } catch (e) {
        console.error("Error handling items data:", e);
      }
      
      // Parse company details
      let parsedCompanyDetails: CompanyDetails = {
        name: companyDetails.name || '',
        address: companyDetails.address || '',
        postal_code: companyDetails.postal_code || '',
        city: companyDetails.city || '',
        country: companyDetails.country || '',
        vat_number: companyDetails.vat_number || '',
        registration_number: companyDetails.registration_number || '',
        phone: companyDetails.phone || '',
        email: '',
        website: ''
      };
      
      try {
        if (typeof metadata.company_details === 'string') {
          try {
            parsedCompanyDetails = JSON.parse(metadata.company_details);
          } catch {
            // If parsing fails, use the company details from props
            parsedCompanyDetails = {
              name: companyDetails.name || '',
              address: companyDetails.address || '',
              postal_code: companyDetails.postal_code || '',
              city: companyDetails.city || '',
              country: companyDetails.country || '',
              vat_number: companyDetails.vat_number || '',
              registration_number: companyDetails.registration_number || '',
              phone: companyDetails.phone || '',
              email: '',
              website: ''
            };
          }
        } else if (metadata.company_details) {
          parsedCompanyDetails = metadata.company_details;
        }
      } catch (e) {
        console.error("Error handling company details data:", e);
      }
      
      // Update form data with parsed metadata
      setFormData({
        quote_number: metadata.quote_number || '',
        date: metadata.date || new Date().toISOString().split('T')[0],
        due_date: metadata.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quote_status: metadata.quote_status || 'draft',
        client: parsedClient,
        project_id: metadata.project_id || '',
        project_name: metadata.project_name || '',
        items: parsedItems,
        subtotal: metadata.subtotal || 0,
        tax_rate: metadata.tax_rate || 20,
        tax_amount: metadata.tax_amount || 0,
        total: metadata.total || 0,
        notes: metadata.notes || '',
        payment_terms: metadata.payment_terms || '',
        payment_method: metadata.payment_method || '',
        currency: metadata.currency || 'EUR',
        language: metadata.language || 'fr',
        company_details: parsedCompanyDetails
      });
    } catch (e) {
      console.error("Error initializing form data from initial document:", e);
    }
  }, [initialDocument, companyDetails]);
  
  // Run initialization when component mounts
  useEffect(() => {
    initializeFormFromDocument();
  }, [initializeFormFromDocument]);

  // Initialize form state with default values if no initial document
  useEffect(() => {
    if (initialDocument) return;
    
    // Ensure company details has all required fields
    const defaultCompanyDetails: CompanyDetails = {
      name: companyDetails.name || '',
      address: companyDetails.address || '',
      postal_code: companyDetails.postal_code || '',
      city: companyDetails.city || '',
      country: companyDetails.country || '',
      vat_number: companyDetails.vat_number || '',
      registration_number: companyDetails.registration_number || '',
      phone: companyDetails.phone || '',
      email: companyDetails.email || '',
      website: companyDetails.website || '',
      logo_url: companyDetails.logo_url || ''
    };
    
    // Use the createDefaultClient helper function
    const defaultClient = createDefaultClient();

    // Default form data when creating a new quote
    setFormData({
      quote_number: generateQuoteNumber(),
      date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      quote_status: 'draft' as const,
      client: defaultClient,
      project_id: '',
      project_name: '',
      items: [] as QuoteItem[],
      subtotal: 0,
      tax_rate: 20,
      tax_amount: 0,
      total: 0,
      notes: '',
      payment_terms: 'Paiement à 30 jours',
      payment_method: 'Virement bancaire',
      currency: 'EUR',
      language: 'fr',
      company_details: defaultCompanyDetails
    });
  }, [initialDocument, companyDetails]);

  // State for new item being added
  const [newItem, setNewItem] = useState<QuoteItem>({
    id: '',
    description: '',
    quantity: 1,
    unit_price: 0,
    amount: 0
  });

  // Calculate totals whenever items change
  useEffect(() => {
    const subtotal = formData.items.reduce((total: number, item: QuoteItem) => total + item.amount, 0);
    const taxAmount = subtotal * (formData.tax_rate / 100);
    const total = subtotal + taxAmount;
    setFormData((prev: QuoteMetadata) => ({
      ...prev,
      subtotal,
      tax_amount: taxAmount,
      total
    }));
  }, [formData.items, formData.tax_rate]);

  // Handle project selection change is defined below

  // Handle client selection change
  const handleClientChange = useCallback((clientId: string) => {
    if (clientId === 'custom') {
      // Custom client selected, reset client fields but keep any entered data
      setFormData(prev => ({
        ...prev,
        client: {
          ...prev.client,
          id: ''
        }
      }));
      return;
    }
    
    // Find the selected client
    const selectedClient = clients.find(c => c.id === clientId);
    if (!selectedClient) return;
    
    console.log('Selected client:', selectedClient);
    
    // Extract client metadata
    const metadata = selectedClient.metadata || {};
    
    // Create client data from metadata
    const clientData: ExtendedClient = {
      id: selectedClient.id,
      name: metadata.is_company ? 
        (metadata.company_name || '') : 
        `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim() || '',
      address: metadata.address || '',
      postal_code: metadata.postal_code || '',
      city: metadata.city || '',
      country: metadata.country || '',
      email: metadata.email || '',
      phone: metadata.phone || '',
      company_details: {
        is_company: metadata.is_company || false,
        vat_number: metadata.vat_number || '',
        registration_number: metadata.registration_number || ''
      }
    };
    
    // Ensure all required fields are present
    if (!clientData.name) {
      clientData.name = metadata.company_name || `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim() || 'Client sans nom';
    }
    
    console.log('Mapped client data:', clientData);
    
    // Update form data with selected client
    setFormData(prev => ({
      ...prev,
      client: clientData
    }));
  }, [clients]);

  // Handle client field changes
  const handleClientFieldChange = useCallback((field: keyof ExtendedClient | 'is_company' | 'vat_number' | 'registration_number', value: string | boolean) => {
    setFormData(prev => {
      // Create a new client object with the updated field
      const updatedClient = { ...prev.client } as ExtendedClient;
      
      // Handle special fields that aren't directly on the client object
      if (field === 'is_company' || field === 'vat_number' || field === 'registration_number') {
        // Ensure company_details exists on the client
        updatedClient.company_details = updatedClient.company_details || {
          is_company: field === 'is_company' ? value as boolean : false,
          vat_number: '',
          registration_number: ''
        };
        
        // Update the specific field in company_details
        updatedClient.company_details = {
          ...updatedClient.company_details,
          [field]: value
        };
      } else {
        // Handle regular client fields
        // Cast to unknown first to avoid type error
        ((updatedClient as unknown) as Record<string, string | number | boolean>)[field] = value;
      }
      
      return {
        ...prev,
        client: updatedClient
      };
    });
  }, []);

  // Handle project selection
  const handleProjectChange = useCallback((projectId: string) => {
    // If custom project selected, reset project fields but keep any entered data
    if (projectId === 'custom') {
      setFormData(prev => ({
        ...prev,
        project_id: '',
        project_name: prev.project_name // Keep any entered project name
      }));
      return;
    }
    
    const selectedProject = projects.find(p => p.id === projectId);
    
    if (selectedProject) {
      setFormData(prev => ({
        ...prev,
        project_id: selectedProject.id,
        project_name: selectedProject.name
      }));
    } else {
      // Allow manual entry if project not found
      setFormData(prev => ({
        ...prev,
        project_id: '',
        project_name: '' // Reset project name for manual entry
      }));
    }
  }, [projects]);
  
  // Handle custom project name change
  const handleProjectNameChange = useCallback((value: string) => {
    setFormData(prev => ({
      ...prev,
      project_name: value
    }));
  }, []);
  
  // Company details are now handled directly in handleClientChange
  // No separate handler needed

  // Handle new item changes
  const handleNewItemChange = useCallback((field: keyof QuoteItem, value: string | number) => {
    setNewItem((prev: QuoteItem) => {
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
    const completeItem: QuoteItem = {
      id: uuidv4(),
      description: newItem.description || '',
      quantity: newItem.quantity || 0,
      unit_price: newItem.unit_price || 0,
      amount: newItem.amount || 0
    };

    setFormData((prev: QuoteMetadata) => ({
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
    setFormData((prev: QuoteMetadata) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  }, []);

  // Update item in the list
  const updateItem = useCallback((index: number, field: keyof QuoteItem, value: string | number) => {
    setFormData((prev: QuoteMetadata) => {
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
    
    if (!formData.client.name) {
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
      // Convert QuoteMetadata to a Supabase-compatible metadata record
      // Ensure client data is properly formatted before stringifying
      const clientData = {
        ...formData.client,
        // Ensure we have valid data for custom clients
        id: formData.client.id || null,
        name: formData.client.name || ''
      };
      
      // Stringify complex objects to ensure compatibility with Supabase
      const metadataRecord = {
        // Basic fields
        quote_number: formData.quote_number,
        date: formData.date,
        due_date: formData.due_date,
        quote_status: formData.quote_status,
        // Convert complex objects to JSON strings for storage
        client: JSON.stringify(clientData),
        items: JSON.stringify(formData.items),
        // Numeric fields
        subtotal: formData.subtotal,
        tax_rate: formData.tax_rate,
        tax_amount: formData.tax_amount,
        total: formData.total,
        // Text fields
        notes: formData.notes || '',
        payment_terms: formData.payment_terms || '',
        payment_method: formData.payment_method || '',
        currency: formData.currency,
        language: formData.language,
        // More complex objects and optional fields
        company_details: JSON.stringify(formData.company_details),
        project_id: formData.project_id || '',
        project_name: formData.project_name || ''
      };

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
        const documentData: CreateDocumentParams = {
          title: `Devis ${formData.quote_number}`,
          document_type_id: "quote", // Document type for quotes
          metadata: metadataRecord,
          status: "Active"
        };
        
        // Only add contact_id if it's a valid ID (not for custom clients)
        if (formData.client.id && formData.client.id !== 'custom') {
          documentData.contact_id = formData.client.id;
        }
        
        await createDocument(documentData);
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
      
      // Create client details array
      const clientDetails = [
        formData.client.name,
        formData.client.address,
        `${formData.client.postal_code} ${formData.client.city}`,
        formData.client.country,
        `Tél: ${formData.client.phone}`,
        `Email: ${formData.client.email}`,
      ];
      
      // Add company-specific details if client is a company
      if (formData.client.company_details?.is_company) {
        if (formData.client.company_details.vat_number) {
          clientDetails.push(`TVA: ${formData.client.company_details.vat_number}`);
        }
        if (formData.client.company_details.registration_number) {
          clientDetails.push(`SIRET: ${formData.client.company_details.registration_number}`);
        }
      }
      
      doc.text(clientDetails, margin.left, margin.top + 60);
      
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
            onChange={(e) => setFormData((prev: QuoteMetadata) => ({ ...prev, due_date: e.target.value }))}
          />
        </div>
      </div>

      {/* Status section */}
      <div>
        <Label htmlFor="quote_status">Statut</Label>
        <Select 
          value={formData.quote_status} 
          onValueChange={(value) => setFormData((prev: QuoteMetadata) => ({ ...prev, quote_status: value as QuoteMetadata['quote_status'] }))}
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Informations du client</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Client existant</span>
            <Select 
              value={formData.client.id || undefined} 
              onValueChange={handleClientChange}
            >
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Client personnalisé</SelectItem>
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.metadata?.is_company 
                        ? client.metadata.company_name || 'Entreprise sans nom'
                        : client.metadata 
                          ? `${client.metadata.first_name || ''} ${client.metadata.last_name || ''}`.trim() || 'Client sans nom'
                          : client.id}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-clients" disabled>Aucun client disponible</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Client type toggle */}
        <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded-md">
          <Switch 
            id="client_is_company" 
            checked={formData.client.company_details?.is_company} 
            onCheckedChange={(checked) => handleClientFieldChange('is_company', checked)}
          />
          <Label htmlFor="client_is_company" className="cursor-pointer">
            {formData.client.company_details?.is_company ? "Entreprise" : "Particulier"}
          </Label>
        </div>
        
        {/* Custom client notice */}
        {!formData.client.id && (
          <div className="p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
            <p>Client personnalisé : Les informations ne seront pas enregistrées dans la base de données clients.</p>
          </div>
        )}
        
        {/* Client details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md bg-muted/30">
          <div>
            <Label htmlFor="client_name" className="font-medium">
              {formData.client.company_details?.is_company ? "Nom de l'entreprise" : "Nom"} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="client_name"
              value={formData.client.name}
              onChange={(e) => handleClientFieldChange('name', e.target.value)}
              placeholder={formData.client.company_details?.is_company ? "Nom de l'entreprise" : "Nom du client"}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="client_email" className="font-medium">Email</Label>
            <Input
              id="client_email"
              value={formData.client.email}
              onChange={(e) => handleClientFieldChange('email', e.target.value)}
              placeholder="email@exemple.com"
              className="mt-1"
              type="email"
            />
          </div>
          <div>
            <Label htmlFor="client_phone" className="font-medium">Téléphone</Label>
            <Input
              id="client_phone"
              value={formData.client.phone}
              onChange={(e) => handleClientFieldChange('phone', e.target.value)}
              placeholder="+33 1 23 45 67 89"
              className="mt-1"
            />
          </div>
          
          {/* Company-specific fields */}
          {formData.client.company_details?.is_company && (
            <>
              <div>
                <Label htmlFor="client_vat_number" className="font-medium">Numéro de TVA</Label>
                <Input
                  id="client_vat_number"
                  value={formData.client.company_details?.vat_number || ''}
                  onChange={(e) => handleClientFieldChange('vat_number', e.target.value)}
                  placeholder="FR12345678901"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="client_registration_number" className="font-medium">SIRET</Label>
                <Input
                  id="client_registration_number"
                  value={formData.client.company_details?.registration_number || ''}
                  onChange={(e) => handleClientFieldChange('registration_number', e.target.value)}
                  placeholder="123 456 789 00012"
                  className="mt-1"
                />
              </div>
            </>
          )}
          
          <div className="md:col-span-2">
            <Label htmlFor="client_address" className="font-medium">Adresse</Label>
            <Input
              id="client_address"
              value={formData.client.address}
              onChange={(e) => handleClientFieldChange('address', e.target.value)}
              placeholder="Adresse complète"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="client_postal_code" className="font-medium">Code postal</Label>
            <Input
              id="client_postal_code"
              value={formData.client.postal_code}
              onChange={(e) => handleClientFieldChange('postal_code', e.target.value)}
              placeholder="75000"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="client_city" className="font-medium">Ville</Label>
            <Input
              id="client_city"
              value={formData.client.city}
              onChange={(e) => handleClientFieldChange('city', e.target.value)}
              placeholder="Paris"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="client_country" className="font-medium">Pays</Label>
            <Input
              id="client_country"
              value={formData.client.country}
              onChange={(e) => handleClientFieldChange('country', e.target.value)}
              placeholder="France"
              className="mt-1"
            />
          </div>
          {!formData.client.id && (
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground italic">Vous utilisez un client personnalisé. Ces informations ne seront pas enregistrées dans votre base de clients.</p>
            </div>
          )}
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
            onChange={(e) => handleProjectNameChange(e.target.value)}
            placeholder="Entrez le nom du projet"
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
            onChange={(e) => setFormData((prev: QuoteMetadata) => ({ ...prev, payment_terms: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="payment_method">Méthode de paiement</Label>
          <Input
            id="payment_method"
            value={formData.payment_method}
            onChange={(e) => setFormData((prev: QuoteMetadata) => ({ ...prev, payment_method: e.target.value }))}
          />
        </div>
      </div>

      {/* Project section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Informations du projet</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Projet existant</span>
            <Select 
              value={formData.project_id || undefined} 
              onValueChange={handleProjectChange}
            >
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Sélectionner un projet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Projet personnalisé</SelectItem>
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-projects" disabled>Aucun projet disponible</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Custom project notice */}
        {!formData.project_id && (
          <div className="p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
            <p>Projet personnalisé : Les informations ne seront pas liées à un projet existant.</p>
          </div>
        )}
        
        {/* Project name */}
        <div className="grid grid-cols-1 gap-4 p-4 border rounded-md bg-muted/30">
          <div>
            <Label htmlFor="project_name" className="font-medium">
              Nom du projet {!formData.project_id && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id="project_name"
              value={formData.project_name}
              onChange={(e) => handleProjectNameChange(e.target.value)}
              placeholder="Nom du projet"
              className="mt-1"
              disabled={!!formData.project_id}
            />
          </div>
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
              onChange={(e) => setFormData((prev: QuoteMetadata) => ({ ...prev, tax_rate: parseFloat(e.target.value) || 0 }))}
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
          onChange={(e) => setFormData((prev: QuoteMetadata) => ({ ...prev, notes: e.target.value }))}
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
