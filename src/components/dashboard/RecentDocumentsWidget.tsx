import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDocuments } from '@/hooks/useDocuments';
import { DocumentDetails } from '@/types/documents';
import { FileIcon, FileTextIcon, FilePresentationIcon, FileSpreadsheetIcon } from 'lucide-react';

interface RecentDocumentsWidgetProps {
  limit?: number;
  filter?: {
    documentType?: string;
    status?: 'Draft' | 'Active' | 'Archived' | 'Deleted';
  };
}

const RecentDocumentsWidget: React.FC<RecentDocumentsWidgetProps> = ({
  limit = 5,
  filter
}) => {
  const { documentDetails, loading, error, fetchDocumentDetails } = useDocuments();
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentDetails[]>([]);

  useEffect(() => {
    fetchDocumentDetails();
  }, [fetchDocumentDetails]);

  useEffect(() => {
    if (documentDetails.length > 0) {
      let filtered = [...documentDetails];
      
      // Apply filters if provided
      if (filter) {
        if (filter.documentType) {
          filtered = filtered.filter(doc => doc.document_type_name === filter.documentType);
        }
        
        if (filter.status) {
          filtered = filtered.filter(doc => doc.status === filter.status);
        }
      }
      
      // Sort by updated_at date (most recent first)
      filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      
      // Limit the number of documents
      setFilteredDocuments(filtered.slice(0, limit));
    }
  }, [documentDetails, filter, limit]);

  const getDocumentIcon = (fileType: string | null, documentType: string) => {
    if (!fileType) {
      switch (documentType.toLowerCase()) {
        case 'facture':
        case 'devis':
          return <FileSpreadsheetIcon className="h-5 w-5 text-blue-500" />;
        case 'contrat':
        case 'cahier_des_charges':
          return <FileTextIcon className="h-5 w-5 text-green-500" />;
        case 'presentation':
          return <FilePresentationIcon className="h-5 w-5 text-yellow-500" />;
        default:
          return <FileIcon className="h-5 w-5 text-gray-500" />;
      }
    }
    
    if (fileType.includes('pdf')) {
      return <FileTextIcon className="h-5 w-5 text-red-500" />;
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return <FileSpreadsheetIcon className="h-5 w-5 text-green-500" />;
    } else if (fileType.includes('presentation') || fileType.includes('powerpoint')) {
      return <FilePresentationIcon className="h-5 w-5 text-orange-500" />;
    } else {
      return <FileIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-yellow-500';
      case 'Active': return 'bg-green-500';
      case 'Archived': return 'bg-gray-500';
      case 'Deleted': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Documents Récents</span>
          <Badge variant="outline" className="ml-2">{filteredDocuments.length}</Badge>
        </CardTitle>
        <CardDescription>
          {filter?.documentType 
            ? `Documents de type ${filter.documentType}` 
            : 'Tous les documents récents'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="h-12 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-12 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-12 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
        ) : error ? (
          <div className="text-red-500">Erreur lors du chargement des documents</div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            Aucun document trouvé
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="flex items-start p-3 border rounded-md hover:bg-gray-50 transition-colors">
                <div className="mr-3">
                  {getDocumentIcon(doc.file_name, doc.document_type_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="font-medium truncate">{doc.title}</div>
                    <Badge className={`${getStatusColor(doc.status)} text-white ml-2 shrink-0`}>
                      {doc.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-500 mt-1">
                    {doc.document_type_name}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                    <span>Modifié le {formatDate(doc.updated_at)}</span>
                    
                    {doc.project_name && (
                      <span className="flex items-center">
                        <span className="mx-1">•</span>
                        Projet: {doc.project_name}
                      </span>
                    )}
                    
                    {doc.contact_name && (
                      <span className="flex items-center">
                        <span className="mx-1">•</span>
                        Contact: {doc.contact_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <a href="/documents" className="text-sm text-blue-600 hover:underline">
          Voir tous les documents
        </a>
      </CardFooter>
    </Card>
  );
};

export default RecentDocumentsWidget;
