'use client';

import { Document } from '@/types/documents';
import { QuoteMetadata } from './types';
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
  Download,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  AlertTriangle,
  Copy,
  Printer,
} from 'lucide-react';
import { useState } from 'react';
import useDocuments from '@/hooks/useDocuments';
import { toast } from '@/components/ui/use-toast';

interface DevisDetailsProps {
  document: Document;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
}

export function DevisDetails({
  document,
  onEdit,
  onDelete,
  onClose,
}: DevisDetailsProps) {
  const [loading, setLoading] = useState(false);
  const { updateDocument } = useDocuments();
  
  // Extract quote metadata from document
  const metadata = document.metadata as unknown as QuoteMetadata;
  
  // Ensure metadata exists
  if (!metadata) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Erreur</CardTitle>
          <CardDescription>
            Les métadonnées du devis sont manquantes ou corrompues.
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
      case "accepted":
        return {
          label: "Accepté",
          icon: CheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-500/5",
          borderColor: "border-green-500/20",
        };
      case "rejected":
        return {
          label: "Refusé",
          icon: XCircle,
          color: "text-red-500",
          bgColor: "bg-red-500/5",
          borderColor: "border-red-500/20",
        };
      case "sent":
        return {
          label: "Envoyé",
          icon: Clock,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/5",
          borderColor: "border-yellow-500/20",
        };
      case "draft":
        return {
          label: "Brouillon",
          icon: FileText,
          color: "text-blue-500",
          bgColor: "bg-blue-500/5",
          borderColor: "border-blue-500/20",
        };
      case "expired":
        return {
          label: "Expiré",
          icon: AlertTriangle,
          color: "text-gray-500",
          bgColor: "bg-gray-500/5",
          borderColor: "border-gray-500/20",
        };
      default:
        return {
          label: status || "Nouveau",
          icon: FileText,
          color: "text-gray-500",
          bgColor: "bg-gray-500/5",
          borderColor: "border-gray-500/20",
        };
    }
  };

  const statusDetails = getStatusDetails(metadata.quote_status || "draft");
  const StatusIcon = statusDetails.icon;

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      // Convert the existing metadata to the expected Record type
      const currentMetadata = document.metadata as Record<string, string | number | boolean | string[] | Record<string, unknown>>;
      
      // Create a new metadata object with the updated status
      const updatedMetadata: Record<string, string | number | boolean | string[] | Record<string, unknown>> = {
        ...currentMetadata,
        quote_status: newStatus
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
        description: `Le devis est maintenant ${getStatusDetails(newStatus).label.toLowerCase()}.`,
      });
    } catch (error) {
      console.error("Error updating devis status:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du devis.",
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
    const link = `${window.location.origin}/devis/${document.id}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Lien copié",
      description: "Le lien du devis a été copié dans le presse-papier.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{metadata.quote_number}</CardTitle>
            <CardDescription className="mt-1">
              {document.description || "Devis"}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={`flex items-center gap-1 font-medium ${statusDetails.color} ${statusDetails.borderColor}`}
          >
            <StatusIcon className="h-3 w-3" />
            {statusDetails.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Informations du client</h3>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{metadata.client?.name}</p>
              <p>{metadata.client?.address}</p>
              <p>
                {metadata.client?.postal_code} {metadata.client?.city}
              </p>
              <p>{metadata.client?.country}</p>
              {metadata.client?.vat_number && (
                <p>TVA: {metadata.client?.vat_number}</p>
              )}
              <p className="mt-2">{metadata.client?.email}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Détails du devis</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Date d&apos;émission:</div>
              <div>{new Date(metadata.date).toLocaleDateString()}</div>
              
              <div>Date d&apos;échéance:</div>
              <div>{new Date(metadata.due_date).toLocaleDateString()}</div>
              
              <div>Conditions de paiement:</div>
              <div>{metadata.payment_terms}</div>
              
              <div>Devise:</div>
              <div>{metadata.currency}</div>
              
              {metadata.project_name && (
                <>
                  <div>Projet:</div>
                  <div>{metadata.project_name}</div>
                </>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Articles</h3>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Description</TableHead>
                  <TableHead className="text-right">Quantité</TableHead>
                  <TableHead className="text-right">Prix unitaire</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metadata.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.unit_price)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-full md:w-1/3 space-y-2">
            <div className="flex justify-between">
              <span>Sous-total:</span>
              <span>{formatCurrency(metadata.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>TVA ({metadata.tax_rate}%):</span>
              <span>{formatCurrency(metadata.tax_amount)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>{formatCurrency(metadata.total)}</span>
            </div>
          </div>
        </div>

        {metadata.notes && (
          <div>
            <h3 className="font-semibold mb-2">Notes</h3>
            <span className="text-sm text-muted-foreground">N&#39;apparaît pas sur le devis</span>
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-2">Informations de l&apos;entreprise</h3>
          <div className="text-sm space-y-1">
            <p className="font-medium">{metadata.company_details.name}</p>
            <p>{metadata.company_details.address}</p>
            <p>
              {metadata.company_details.postal_code} {metadata.company_details.city}
            </p>
            <p>{metadata.company_details.country}</p>
            {metadata.company_details.vat_number && (
              <p>TVA: {metadata.company_details.vat_number}</p>
            )}
            {metadata.company_details.registration_number && (
              <p>SIRET: {metadata.company_details.registration_number}</p>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 justify-between border-t pt-6">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          <Button variant="outline" onClick={handleCopyLink}>
            <Copy className="mr-2 h-4 w-4" />
            Copier le lien
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Télécharger PDF
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {metadata.quote_status === "draft" && (
            <Button 
              variant="outline" 
              onClick={() => handleStatusChange("sent")}
              disabled={loading}
            >
              <Send className="mr-2 h-4 w-4" />
              Envoyer
            </Button>
          )}
          
          {metadata.quote_status === "sent" && (
            <>
              <Button 
                variant="outline" 
                className="text-green-600" 
                onClick={() => handleStatusChange("accepted")}
                disabled={loading}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Accepter
              </Button>
              <Button 
                variant="outline" 
                className="text-red-600"
                onClick={() => handleStatusChange("rejected")}
                disabled={loading}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Refuser
              </Button>
            </>
          )}
          
          {onEdit && (
            <Button variant="outline" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          )}
          
          {onDelete && (
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          )}
          
          {onClose && (
            <Button onClick={onClose}>
              Fermer
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default DevisDetails;
