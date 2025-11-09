'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, File, Download, Share2, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Document as DocumentModel } from '@/types/documents';

interface DocumentCardProps {
  document: DocumentModel;
  onDownload: (document: DocumentModel) => void;
  onShare: (document: DocumentModel) => void;
  onDelete: (documentId: string) => void;
  onEdit: (document: DocumentModel) => void;
  onView: (document: DocumentModel) => void;
}

export function DocumentCard({
  document,
  onDownload,
  onShare,
  onDelete,
  onEdit,
  onView,
}: DocumentCardProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) {return '0 Bytes';}
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))  } ${  sizes[i]}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      case 'review':
        return <Badge variant="secondary">En revue</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="h-10 w-10 text-red-500" />;
    } else if (fileType.includes('image')) {
      return <FileText className="h-10 w-10 text-blue-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="h-10 w-10 text-blue-700" />;
    } else if (fileType.includes('excel') || fileType.includes('sheet')) {
      return <FileText className="h-10 w-10 text-green-700" />;
    } else {
      return <File className="h-10 w-10 text-gray-500" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold truncate">{document.title}</CardTitle>
          {getStatusBadge(document.status)}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-col items-center justify-center py-4">
          <div 
            className="mb-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => onView(document)}
          >
            {getFileIcon(document.file_type || 'unknown')}
          </div>
          {document.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center line-clamp-2">
              {document.description}
            </p>
          )}
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 space-y-1 w-full">
            <div className="flex justify-between">
              <span>Taille:</span>
              <span className="font-medium">{formatFileSize(document.file_size || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span className="font-medium">
                {format(new Date(document.created_at), 'dd/MM/yyyy', { locale: fr })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Version:</span>
              <span className="font-medium">{document.version || '1.0'}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between gap-2">
        <Button variant="outline" size="sm" onClick={() => onDownload(document)}>
          <Download className="h-4 w-4 mr-1" />
          <span className="sr-only sm:not-sr-only sm:inline-block">Télécharger</span>
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(document)}>
          <Edit2 className="h-4 w-4 mr-1" />
          <span className="sr-only sm:not-sr-only sm:inline-block">Modifier</span>
        </Button>
        <Button variant="outline" size="sm" onClick={() => onShare(document)}>
          <Share2 className="h-4 w-4 mr-1" />
          <span className="sr-only sm:not-sr-only sm:inline-block">Partager</span>
        </Button>
        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => onDelete(document.id)}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Supprimer</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default DocumentCard;
