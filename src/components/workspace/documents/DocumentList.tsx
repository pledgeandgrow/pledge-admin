'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, MoreVertical, FileText, File, Trash2, Share2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DocumentType } from '@/types/documents';

interface DocumentListProps {
  documents: DocumentType[];
  documentTypes: { id: string; name: string }[];
  onDownload: (document: DocumentType) => void;
  onShare: (document: DocumentType) => void;
  onDelete: (documentId: string) => void;
  onEdit: (document: DocumentType) => void;
}

export function DocumentList({
  documents,
  documentTypes,
  onDownload,
  onShare,
  onDelete,
  onEdit,
}: DocumentListProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentTypeLabel = (typeId: string) => {
    const type = documentTypes.find(t => t.id === typeId);
    return type ? type.name : typeId;
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
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (fileType.includes('image')) {
      return <FileText className="h-4 w-4 text-blue-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="h-4 w-4 text-blue-700" />;
    } else if (fileType.includes('excel') || fileType.includes('sheet')) {
      return <FileText className="h-4 w-4 text-green-700" />;
    } else {
      return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="border rounded-md">
      {documents.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Aucun document disponible.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Taille</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getFileIcon(doc.file_type)}
                    <div>
                      <div className="font-medium">{doc.name}</div>
                      {doc.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                          {doc.description}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getDocumentTypeLabel(doc.document_type)}</TableCell>
                <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                <TableCell>{getStatusBadge(doc.status)}</TableCell>
                <TableCell>
                  {format(new Date(doc.created_at), 'dd/MM/yyyy', { locale: fr })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onDownload(doc)}>
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onShare(doc)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Partager
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(doc)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(doc.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default DocumentList;
