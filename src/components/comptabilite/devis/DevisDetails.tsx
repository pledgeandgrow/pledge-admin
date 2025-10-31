'use client';

import { Document } from '@/types/documents';
import { QuoteMetadata } from './types';
import { formatCurrency } from '@/lib/utils';
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
      <CardHeader className="border-b pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{metadata.quote_number}</CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">
              {document.description || "Devis"}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={`flex items-center gap-1 font-medium ${statusDetails.color} ${statusDetails.borderColor} px-2 py-1`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {statusDetails.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Informations du client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm pt-0">
              <p className="font-medium">{typeof metadata.client === 'string' ? metadata.client : metadata.client?.name}</p>
              <p className="text-muted-foreground">{metadata.client?.address}</p>
              <p className="text-muted-foreground">
                {metadata.client?.postal_code} {metadata.client?.city}
              </p>
              <p className="text-muted-foreground">{metadata.client?.country}</p>
              {metadata.client?.vat_number && (
                <p className="text-muted-foreground">TVA: {metadata.client?.vat_number}</p>
              )}
              <p className="mt-2 text-muted-foreground">{metadata.client?.email}</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Détails du devis</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground font-medium">Date d&apos;émission:</div>
                <div>{new Date(metadata.date).toLocaleDateString()}</div>
                
                <div className="text-muted-foreground font-medium">Date d&apos;échéance:</div>
                <div>{new Date(metadata.due_date).toLocaleDateString()}</div>
                
                <div className="text-muted-foreground font-medium">Conditions de paiement:</div>
                <div>{metadata.payment_terms}</div>
                
                <div className="text-muted-foreground font-medium">Devise:</div>
                <div>{metadata.currency}</div>
                
                {metadata.project_name && (
                  <>
                    <div className="text-muted-foreground font-medium">Projet:</div>
                    <div>{metadata.project_name}</div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Articles</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                  <TableRow>
                    <TableHead className="w-[50%] font-medium">Description</TableHead>
                    <TableHead className="text-right font-medium">Quantité</TableHead>
                    <TableHead className="text-right font-medium">Prix unitaire</TableHead>
                    <TableHead className="text-right font-medium">Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metadata.items.map((item, index) => (
                    <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
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
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Card className="w-full md:w-1/3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="space-y-2 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Sous-total:</span>
                <span>{formatCurrency(metadata.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">TVA ({metadata.tax_rate}%):</span>
                <span>{formatCurrency(metadata.tax_amount)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2 mt-2 border-gray-200 dark:border-gray-700">
                <span>Total:</span>
                <span className="text-primary">{formatCurrency(metadata.total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {metadata.notes && (
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Notes</CardTitle>
              <CardDescription className="text-xs">N&#39;apparaît pas sur le devis</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{metadata.notes}</p>
            </CardContent>
          </Card>
        )}

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Informations de l&apos;entreprise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm pt-0">
            <p className="font-medium">{metadata.company_details.name}</p>
            <p className="text-muted-foreground">{metadata.company_details.address}</p>
            <p className="text-muted-foreground">
              {metadata.company_details.postal_code} {metadata.company_details.city}
            </p>
            <p className="text-muted-foreground">{metadata.company_details.country}</p>
            {metadata.company_details.vat_number && (
              <p className="text-muted-foreground">TVA: {metadata.company_details.vat_number}</p>
            )}
            {metadata.company_details.registration_number && (
              <p className="text-muted-foreground">SIRET: {metadata.company_details.registration_number}</p>
            )}
          </CardContent>
        </Card>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 justify-between border-t pt-6">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={handlePrint}
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          <Button 
            variant="outline" 
            onClick={handleCopyLink}
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copier le lien
          </Button>
          <Button 
            variant="outline"
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
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
              className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
            >
              <Send className="mr-2 h-4 w-4" />
              Envoyer
            </Button>
          )}
          
          {metadata.quote_status === "sent" && (
            <>
              <Button 
                variant="outline" 
                onClick={() => handleStatusChange("accepted")}
                disabled={loading}
                className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Marquer comme accepté
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleStatusChange("rejected")}
                disabled={loading}
                className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Marquer comme refusé
              </Button>
            </>
          )}

          <Button 
            variant="outline" 
            onClick={onEdit}
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <Button 
            variant="destructive" 
            onClick={onDelete}
            className="hover:bg-red-700 dark:hover:bg-red-900"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
        
        {onClose && (
          <Button onClick={onClose}>
            Fermer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default DevisDetails;
