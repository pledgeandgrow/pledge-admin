/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, FileText, Loader2, Trash2, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

interface PdfUploaderProps {
  /**
   * The ID of the document to attach the PDF to
   * @deprecated Use documentId instead
   */
  expenseId?: string;
  
  /**
   * The ID of the document to attach the PDF to
   */
  documentId?: string;
  
  /**
   * The type of document (e.g., 'expense', 'invoice', 'quote')
   */
  documentType?: 'expense' | 'invoice' | 'quote' | string;
  
  /**
   * Callback function called when a PDF is successfully uploaded or deleted
   */
  onUploadSuccess?: (fileUrl: string) => void;
  
  /**
   * URL of an existing PDF file
   */
  existingPdfUrl?: string;
  
  /**
   * Name of an existing PDF file
   */
  existingPdfName?: string;
  
  /**
   * Custom API endpoint for PDF operations (if not provided, uses default based on documentType)
   */
  apiEndpoint?: string;
  
  /**
   * Label for the file input
   */
  label?: string;
}

export default function PdfUploader({
  expenseId,
  documentId,
  documentType = 'expense',
  apiEndpoint,
  label = "Document PDF",
  existingPdfUrl,
  existingPdfName,
  onUploadSuccess,
}: PdfUploaderProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(existingPdfUrl || null);
  const [pdfName, setPdfName] = useState<string | null>(existingPdfName || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle backward compatibility
  const effectiveDocumentId = documentId || expenseId;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if file is PDF
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        setFile(null);
        return;
      }
      
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  // Get the API endpoint based on document type or custom endpoint
  const getApiEndpoint = () => {
    if (apiEndpoint) {
      return apiEndpoint;
    }
    
    // Use the new generic API endpoint for all document types
    return '/api/documents/pdf';
  };

  const uploadPdf = async () => {
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Le fichier est trop volumineux. Taille maximale: 5MB");
      return;
    }
    
    // Check file type
    if (file.type !== "application/pdf") {
      setError("Seuls les fichiers PDF sont acceptés");
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      
      // Use the effective document ID (either documentId or expenseId)
      if (effectiveDocumentId) {
        formData.append("documentId", effectiveDocumentId);
      } else {
        throw new Error("ID du document manquant");
      }
      
      formData.append("documentType", documentType);
      formData.append("file", file);
      
      const response = await fetch(getApiEndpoint(), {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Échec du téléversement du PDF");
      }
      
      setPdfUrl(data.file.url);
      setPdfName(data.file.name);
      toast({
        title: "Succès",
        description: "PDF téléversé avec succès",
      });
      
      if (onUploadSuccess) {
        onUploadSuccess(data.file.url);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue lors du téléversement";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: "Échec du téléversement du PDF",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadPdf = async () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
      return;
    }
    
    try {
      // Use the effective document ID (either documentId or expenseId)
      if (!effectiveDocumentId) {
        throw new Error("ID du document manquant");
      }
      
      const response = await fetch(`${getApiEndpoint()}?documentId=${effectiveDocumentId}&documentType=${documentType}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Échec du téléchargement du PDF');
      }
      
      window.open(data.file.url, '_blank');
    } catch (_: unknown) {
      toast({
        title: "Erreur",
        description: "Échec du téléchargement du PDF",
        variant: "destructive",
      });
    }
  };

  const deletePdf = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce PDF ?')) {
      return;
    }
    
    try {
      // Use the effective document ID (either documentId or expenseId)
      if (!effectiveDocumentId) {
        throw new Error("ID du document manquant");
      }
      
      const response = await fetch(`${getApiEndpoint()}?documentId=${effectiveDocumentId}&documentType=${documentType}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Échec de la suppression du PDF');
      }
      
      setPdfUrl(null);
      setPdfName(null);
      toast({
        title: "Succès",
        description: "PDF supprimé avec succès",
      });
      
      if (onUploadSuccess) {
        onUploadSuccess('');
      }
    } catch (_: unknown) {
      toast({
        title: "Erreur",
        description: "Échec de la suppression du PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pdf-upload">{label}</Label>
        <div className="flex items-center gap-2">
          <Input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={isUploading}
            className="flex-1"
          />
          {file && (
            <Button 
              onClick={uploadPdf} 
              disabled={isUploading}
              className="whitespace-nowrap"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Téléversement...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Téléverser
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {(pdfUrl || pdfName) && (
        <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/30">
          <FileText className="h-5 w-5 text-blue-500" />
          <span className="flex-1 text-sm font-medium truncate">
            {pdfName || 'Document PDF'}
          </span>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={downloadPdf}
            >
              Voir
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={deletePdf}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
