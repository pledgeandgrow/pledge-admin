'use client';

import { Document } from '@/types/documents';
import { InvoiceMetadata } from './types';
import { formatCurrency } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Edit,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  FileText,
  AlertTriangle,
  Copy,
  Printer,
  CreditCard,
} from 'lucide-react';
import { useState } from 'react';
import useDocuments from '@/hooks/useDocuments';
import { toast } from '@/components/ui/use-toast';

interface InvoiceDetailsProps {
  document: Document;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
}

export function InvoiceDetails({
  document,
  onEdit,
  onDelete,
  onClose,
}: InvoiceDetailsProps) {
  const [loading, setLoading] = useState(false);
  const { updateDocument } = useDocuments();
  
  // Extract invoice metadata from document
  const metadata = document.metadata as unknown as InvoiceMetadata;
  
  // Ensure metadata exists
  if (!metadata) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Erreur</CardTitle>
          <CardDescription>
            Les métadonnées de la facture sont manquantes ou corrompues.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={onClose}>Fermer</Button>
        </CardFooter>
      </Card>
    );
  }

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "paid":
        return {
          label: "Payée",
          icon: CheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-500/5",
          borderColor: "border-green-500/20",
        };
      case "cancelled":
        return {
          label: "Annulée",
          icon: XCircle,
          color: "text-red-500",
          bgColor: "bg-red-500/5",
          borderColor: "border-red-500/20",
        };
      case "sent":
        return {
          label: "Envoyée",
          icon: Send,
          color: "text-blue-500",
          bgColor: "bg-blue-500/5",
          borderColor: "border-blue-500/20",
        };
      case "overdue":
        return {
          label: "En retard",
          icon: AlertTriangle,
          color: "text-orange-500",
          bgColor: "bg-orange-500/5",
          borderColor: "border-orange-500/20",
        };
      case "draft":
      default:
        return {
          label: "Brouillon",
          icon: FileText,
          color: "text-gray-500",
          bgColor: "bg-gray-500/5",
          borderColor: "border-gray-500/20",
        };
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const statusDetails = getStatusDetails(metadata.invoice_status || "draft");
  const StatusIcon = statusDetails.icon;

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      // Convert the existing metadata to the expected Record type
      const currentMetadata = document.metadata as Record<string, string | number | boolean | string[] | Record<string, unknown> | null>;
      
      // Create a new metadata object with the updated status
      const updatedMetadata: Record<string, string | number | boolean | string[] | Record<string, unknown> | null> = {
        ...currentMetadata,
        invoice_status: newStatus
      };
      
      // Create a new document object with the updated metadata
      const documentToUpdate = {
        id: document.id,
        metadata: updatedMetadata
      };
      
      // Update the document
      await updateDocument(documentToUpdate);
      
      toast({
        title: "Statut mis à jour",
        description: `La facture est maintenant ${getStatusDetails(newStatus).label.toLowerCase()}.`,
      });
    } catch (error) {
      console.error("Error updating invoice status:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la facture.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    // This would be replaced with actual link generation logic
    const link = `${window.location.origin}/facture/${document.id}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Lien copié",
      description: "Le lien de la facture a été copié dans le presse-papier.",
    });
  };

  return (
    <Card className="w-full print:shadow-none">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 print:pb-0">
        <div>
          <CardTitle className="text-2xl">
            Facture #{metadata.invoice_number}
          </CardTitle>
          <CardDescription>
            Créée le {formatDate(metadata.date)}
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2 print:hidden">
          <Badge 
            className={`${statusDetails.bgColor} ${statusDetails.borderColor} border`}
            variant="outline"
          >
            <StatusIcon className={`mr-1 h-3 w-3 ${statusDetails.color}`} />
            {statusDetails.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Émetteur</h3>
            <div className="text-sm">
              <p className="font-medium">{metadata.company_details?.name}</p>
              <p>{metadata.company_details?.address}</p>
              <p>{metadata.company_details?.postal_code} {metadata.company_details?.city}</p>
              <p>{metadata.company_details?.country}</p>
              {metadata.company_details?.vat_number && (
                <p className="mt-1">TVA: {metadata.company_details?.vat_number}</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Client</h3>
            <div className="text-sm">
              <p className="font-medium">{metadata.client?.name}</p>
              <p>{metadata.client?.address}</p>
              <p>{metadata.client?.postal_code} {metadata.client?.city}</p>
              <p>{metadata.client?.country}</p>
              {metadata.client?.vat_number && (
                <p className="mt-1">TVA: {metadata.client?.vat_number}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Date d&apos;émission:</span>
            <span>{formatDate(metadata.date)}</span>
          </div>
          <div className="flex justify-between">
            <span>Date d&apos;échéance:</span>
            <span>{formatDate(metadata.due_date)}</span>
          </div>
          {metadata.project_name && (
            <div className="flex justify-between">
              <span>Projet:</span>
              <span>{metadata.project_name}</span>
            </div>
          )}
          {metadata.payment_terms && (
            <div className="flex justify-between">
              <span>Conditions de paiement:</span>
              <span>{metadata.payment_terms}</span>
            </div>
          )}
          {metadata.payment_method && (
            <div className="flex justify-between">
              <span>Mode de paiement:</span>
              <span>{metadata.payment_method}</span>
            </div>
          )}
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Quantité</TableHead>
                <TableHead className="text-right">Prix unitaire</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metadata.items?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Sous-total:</span>
            <span>{formatCurrency(metadata.subtotal || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>TVA ({metadata.tax_rate}%):</span>
            <span>{formatCurrency(metadata.tax_amount || 0)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>{formatCurrency(metadata.total || 0)}</span>
          </div>
        </div>

        {metadata.notes && (
          <div>
            <h3 className="font-semibold mb-2">Notes</h3>
            <p className="text-sm whitespace-pre-wrap">{metadata.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 print:hidden">
        <div className="flex flex-wrap gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={handlePrint}
          >
            <Printer className="mr-1 h-4 w-4" />
            Imprimer
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={handleCopyLink}
          >
            <Copy className="mr-1 h-4 w-4" />
            Copier le lien
          </Button>
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={onEdit}
            >
              <Edit className="mr-1 h-4 w-4" />
              Modifier
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center text-red-500 hover:text-red-600"
              onClick={onDelete}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Supprimer
            </Button>
          )}
        </div>
        
        <div className="w-full border-t pt-4">
          <h3 className="font-semibold mb-2">Changer le statut</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={metadata.invoice_status === "draft" ? "default" : "outline"} 
              size="sm" 
              disabled={loading || metadata.invoice_status === "draft"}
              onClick={() => handleStatusChange("draft")}
            >
              <FileText className="mr-1 h-4 w-4" />
              Brouillon
            </Button>
            <Button 
              variant={metadata.invoice_status === "sent" ? "default" : "outline"} 
              size="sm" 
              disabled={loading || metadata.invoice_status === "sent"}
              onClick={() => handleStatusChange("sent")}
            >
              <Send className="mr-1 h-4 w-4" />
              Envoyée
            </Button>
            <Button 
              variant={metadata.invoice_status === "paid" ? "default" : "outline"} 
              size="sm" 
              disabled={loading || metadata.invoice_status === "paid"}
              onClick={() => handleStatusChange("paid")}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CreditCard className="mr-1 h-4 w-4" />
              Payée
            </Button>
            <Button 
              variant={metadata.invoice_status === "overdue" ? "default" : "outline"} 
              size="sm" 
              disabled={loading || metadata.invoice_status === "overdue"}
              onClick={() => handleStatusChange("overdue")}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <AlertTriangle className="mr-1 h-4 w-4" />
              En retard
            </Button>
            <Button 
              variant={metadata.invoice_status === "cancelled" ? "default" : "outline"} 
              size="sm" 
              disabled={loading || metadata.invoice_status === "cancelled"}
              onClick={() => handleStatusChange("cancelled")}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <XCircle className="mr-1 h-4 w-4" />
              Annulée
            </Button>
          </div>
        </div>
        
        {onClose && (
          <div className="w-full flex justify-end">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
            >
              Fermer
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
