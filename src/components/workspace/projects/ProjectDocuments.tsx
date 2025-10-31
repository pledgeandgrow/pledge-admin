'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProject } from '@/hooks/useProject';
import { useDocuments } from '@/hooks/useDocuments';
import { Plus, Download, MoreVertical, FileText, File, Trash2, Share2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DocumentType {
  id: string;
  name: string;
  description?: string;
  file_url: string;
  file_type: string;
  file_size: number;
  document_type: string;
  status: string;
  version?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  project_id: string;
  metadata?: Record<string, any>;
}

interface ProjectDocumentsProps {
  projectId: string;
}

export function ProjectDocuments({ projectId }: ProjectDocumentsProps) {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [documentTypes, setDocumentTypes] = useState<{id: string, name: string}[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [file, setFile] = useState<File | null>(null);
  const [uploadFormData, setUploadFormData] = useState({
    name: '',
    description: '',
    document_type: '',
    status: 'draft',
    version: '1.0',
  });
  const [shareFormData, setShareFormData] = useState({
    email: '',
    permission: 'view',
  });
  
  const { fetchProjectDocuments } = useProject(projectId);
  const { 
    uploadDocument, 
    deleteDocument, 
    updateDocument, 
    fetchDocumentTypes,
    shareDocument
  } = useDocuments();

  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      try {
        const fetchedDocuments = await fetchProjectDocuments();
        setDocuments(fetchedDocuments);
        
        const types = await fetchDocumentTypes();
        setDocumentTypes(types);
      } catch (error) {
        console.error('Error loading documents:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project documents',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDocuments();
  }, [projectId, fetchProjectDocuments, fetchDocumentTypes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUploadFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShareInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShareFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setUploadFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShareSelectChange = (name: string, value: string) => {
    setShareFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Auto-fill name if empty
      if (!uploadFormData.name) {
        setUploadFormData(prev => ({
          ...prev,
          name: selectedFile.name.split('.')[0],
        }));
      }
    }
  };

  const resetUploadForm = () => {
    setUploadFormData({
      name: '',
      description: '',
      document_type: '',
      status: 'draft',
      version: '1.0',
    });
    setFile(null);
  };

  const resetShareForm = () => {
    setShareFormData({
      email: '',
      permission: 'view',
    });
    setSelectedDocument(null);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const newDocument = await uploadDocument({
        file,
        project_id: projectId,
        ...uploadFormData,
      });
      
      setDocuments(prev => [...prev, newDocument]);
      
      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });
      
      setIsUploadDialogOpen(false);
      resetUploadForm();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        variant: 'destructive',
      });
    }
  };

  const handleShareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDocument) {
      toast({
        title: 'Error',
        description: 'No document selected',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await shareDocument(selectedDocument.id, {
        email: shareFormData.email,
        permission: shareFormData.permission,
      });
      
      toast({
        title: 'Success',
        description: `Document shared with ${shareFormData.email}`,
      });
      
      setIsShareDialogOpen(false);
      resetShareForm();
    } catch (error) {
      console.error('Error sharing document:', error);
      toast({
        title: 'Error',
        description: 'Failed to share document',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      
      toast({
        title: 'Success',
        description: 'Document deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = (document: DocumentType) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = document.file_url;
    link.download = document.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = (document: DocumentType) => {
    setSelectedDocument(document);
    setIsShareDialogOpen(true);
  };

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
      return <File className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (doc.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || doc.document_type === selectedType;
    
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents du projet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documents du projet</CardTitle>
        <Button onClick={() => setIsUploadDialogOpen(true)} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Ajouter un document
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher des documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-64">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {documents.length === 0 
                ? "Aucun document n'a été ajouté à ce projet." 
                : "Aucun document ne correspond à votre recherche."}
            </div>
          ) : (
            <div className="border rounded-md">
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
                  {filteredDocuments.map((doc) => (
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
                            <DropdownMenuItem onClick={() => handleDownload(doc)}>
                              <Download className="h-4 w-4 mr-2" />
                              Télécharger
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare(doc)}>
                              <Share2 className="h-4 w-4 mr-2" />
                              Partager
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(doc.id)}>
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
            </div>
          )}
        </div>

        {/* Upload Document Dialog */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter un document</DialogTitle>
              <DialogDescription>
                Téléchargez un nouveau document pour ce projet.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUploadSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="file" className="text-right">
                    Fichier
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nom
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={uploadFormData.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    value={uploadFormData.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="document_type" className="text-right">
                    Type
                  </Label>
                  <Select 
                    value={uploadFormData.document_type} 
                    onValueChange={(value) => handleSelectChange('document_type', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Statut
                  </Label>
                  <Select 
                    value={uploadFormData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="review">En revue</SelectItem>
                      <SelectItem value="approved">Approuvé</SelectItem>
                      <SelectItem value="rejected">Rejeté</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="version" className="text-right">
                    Version
                  </Label>
                  <Input
                    id="version"
                    name="version"
                    value={uploadFormData.version}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setIsUploadDialogOpen(false);
                  resetUploadForm();
                }}>
                  Annuler
                </Button>
                <Button type="submit">
                  Télécharger
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Share Document Dialog */}
        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Partager le document</DialogTitle>
              <DialogDescription>
                {selectedDocument && `Partagez "${selectedDocument.name}" avec d'autres utilisateurs.`}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleShareSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={shareFormData.email}
                    onChange={handleShareInputChange}
                    className="col-span-3"
                    placeholder="utilisateur@example.com"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="permission" className="text-right">
                    Permission
                  </Label>
                  <Select 
                    value={shareFormData.permission} 
                    onValueChange={(value) => handleShareSelectChange('permission', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner une permission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">Lecture seule</SelectItem>
                      <SelectItem value="edit">Modification</SelectItem>
                      <SelectItem value="admin">Administration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setIsShareDialogOpen(false);
                  resetShareForm();
                }}>
                  Annuler
                </Button>
                <Button type="submit">
                  Partager
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
