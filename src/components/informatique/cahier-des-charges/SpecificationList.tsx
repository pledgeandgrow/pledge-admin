"use client";

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Eye, Edit, Trash2, Search, FilterX } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Document } from '@/types/documents';
import { SpecificationType, documentToSpecification, SpecificationMetadata } from './types';

interface SpecificationListProps {
  documents: Document[];
  isLoading: boolean;
  onView: (document: Document) => void;
  onEdit: (document: Document) => void;
  onDelete: (id: string) => void;
}

export function SpecificationList({ 
  documents, 
  isLoading, 
  onView, 
  onEdit, 
  onDelete 
}: SpecificationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredDocs, setFilteredDocs] = useState<Document[]>([]);

  // Filter documents based on search query and status filter
  useEffect(() => {
    let filtered = [...documents];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => {
        const metadata = doc.metadata as unknown as SpecificationMetadata | undefined;
        return (
          doc.title.toLowerCase().includes(query) || 
          (metadata?.content && metadata.content.toLowerCase().includes(query))
        );
      });
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => {
        const metadata = doc.metadata as unknown as SpecificationMetadata | undefined;
        return metadata?.status?.toLowerCase() === statusFilter.toLowerCase();
      });
    }
    
    setFilteredDocs(filtered);
  }, [documents, searchQuery, statusFilter]);

  // Format date to local string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get badge variant based on status
  const getBadgeVariant = (status: string | undefined) => {
    if (!status) return "secondary" as const;
    
    switch (status.toLowerCase()) {
      case 'draft':
        return 'secondary' as const;
      case 'review':
        return 'default' as const; // Changed from 'warning' to match Badge variants
      case 'approved':
        return 'default' as const; // Changed from 'success' to match Badge variants
      case 'archived':
        return 'outline' as const;
      default:
        return 'secondary' as const;
    }
  };

  // Get status label
  const getStatusLabel = (status: string | undefined): string => {
    if (!status) return 'Brouillon';
    
    switch (status.toLowerCase()) {
      case 'draft':
        return 'Brouillon';
      case 'review':
        return 'En révision';
      case 'approved':
        return 'Approuvé';
      case 'archived':
        return 'Archivé';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and filter controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un cahier des charges..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7 w-7 p-0"
              onClick={() => setSearchQuery("")}
            >
              <FilterX className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="review">En révision</SelectItem>
            <SelectItem value="approved">Approuvé</SelectItem>
            <SelectItem value="archived">Archivé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Specifications table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Titre</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Dernière mise à jour</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`loading-${i}`}>
                  <TableCell><div className="h-6 w-[250px] bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-6 w-[100px] bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-6 w-[100px] bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-6 w-[100px] bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell className="text-right"><div className="h-9 w-[120px] bg-muted animate-pulse rounded ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredDocs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {searchQuery || statusFilter !== 'all' 
                    ? "Aucun cahier des charges ne correspond à votre recherche."
                    : "Aucun cahier des charges disponible. Créez-en un nouveau !"}
                </TableCell>
              </TableRow>
            ) : (
              filteredDocs.map((doc) => {
                const metadata = doc.metadata as unknown as SpecificationMetadata | undefined;
                return (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(metadata?.status)}>
                        {getStatusLabel(metadata?.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(doc.created_at)}</TableCell>
                    <TableCell>{formatDate(doc.updated_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(doc)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(doc)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(doc.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
