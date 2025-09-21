'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Document } from '@/types/documents';

interface DocumentViewerProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (document: Document) => void;
}

export function DocumentViewer({
  document,
  isOpen,
  onClose,
  onDownload,
}: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (document) {
      setIsLoading(true);
      // Reset zoom and page when document changes
      setZoomLevel(100);
      setCurrentPage(1);
      
      // Simulate loading time for document preview
      const timer = setTimeout(() => {
        setIsLoading(false);
        // For PDF files, we would determine total pages here
        // This is a placeholder - in a real implementation, you would use a PDF library
        setTotalPages(document.file_type.includes('pdf') ? 3 : 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [document]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      case 'review':
        return <Badge variant="secondary">En revue</Badge>;
      case 'approved':
      case 'active':
        return <Badge className="bg-green-500">Approuvé</Badge>;
      case 'rejected':
      case 'deleted':
        return <Badge variant="destructive">Rejeté</Badge>;
      case 'archived':
        return <Badge variant="outline" className="bg-gray-200">Archivé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderDocumentPreview = () => {
    if (!document) return null;

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[60vh]">
          <Skeleton className="h-full w-full" />
        </div>
      );
    }

    // Handle different file types
    if (document.file_type && document.file_type.includes('image')) {
      return (
        <div className="flex items-center justify-center h-[60vh] overflow-auto">
          <img 
            src={document.file_path || ''} 
            alt={document.title}
            style={{ maxWidth: `${zoomLevel}%` }}
            className="max-h-full object-contain"
          />
        </div>
      );
    } else if (document.file_type && document.file_type.includes('pdf')) {
      // In a real implementation, you would use a PDF viewer library
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] bg-gray-100 dark:bg-gray-800">
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ maxWidth: `${zoomLevel}%` }}
          >
            <div className="bg-white dark:bg-gray-700 shadow-lg p-8 w-full h-full max-w-2xl flex flex-col">
              <h2 className="text-xl font-bold mb-4">{document.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                {document.description || 'Aucune description disponible.'}
              </p>
              <div className="flex-grow flex items-center justify-center text-gray-400">
                <p>Aperçu PDF - Page {currentPage} sur {totalPages}</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // For other file types, show a placeholder
      return (
        <div className="flex items-center justify-center h-[60vh] bg-gray-100 dark:bg-gray-800">
          <div className="text-center p-8">
            <p className="text-xl mb-4">Aperçu non disponible</p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Ce type de fichier ({document.file_type || 'inconnu'}) ne peut pas être prévisualisé.
            </p>
            <Button onClick={() => document && onDownload(document)}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger pour visualiser
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <DialogTitle className="text-xl">{document?.title}</DialogTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {document && format(new Date(document.created_at), 'dd MMMM yyyy', { locale: fr })}
              </span>
              {document && getStatusBadge(document.status)}
              {document?.version && (
                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                  v{document.version}
                </span>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        {renderDocumentPreview()}
        
        <DialogFooter className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={zoomLevel <= 50}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm">{zoomLevel}%</span>
            <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={zoomLevel >= 200}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          {document?.file_type && document.file_type.includes('pdf') && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handlePreviousPage}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} / {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <Button onClick={() => document && onDownload(document)}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DocumentViewer;
