'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';

interface DocumentTypeOption {
  id: string;
  name: string;
}

interface DocumentFilterProps {
  documentTypes: DocumentTypeOption[];
  onFilterChange: (filters: DocumentFilterOptions) => void;
  initialFilters?: Partial<DocumentFilterOptions>;
}

export interface DocumentFilterOptions {
  search: string;
  type: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export function DocumentFilter({
  documentTypes,
  onFilterChange,
  initialFilters = {},
}: DocumentFilterProps) {
  const [filters, setFilters] = useState<DocumentFilterOptions>({
    search: initialFilters.search || '',
    type: initialFilters.type || 'all',
    status: initialFilters.status || 'all',
    sortBy: initialFilters.sortBy || 'created_at',
    sortOrder: initialFilters.sortOrder || 'desc',
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Apply filters when they change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSortOrderToggle = () => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      status: 'all',
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters = 
    filters.search !== '' || 
    filters.type !== 'all' || 
    filters.status !== 'all' || 
    filters.sortBy !== 'created_at' || 
    filters.sortOrder !== 'desc';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            name="search"
            placeholder="Rechercher des documents..."
            value={filters.search}
            onChange={handleInputChange}
            className="pl-9 w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={showAdvancedFilters ? "secondary" : "outline"}
            size="sm"
            className="whitespace-nowrap"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
            {hasActiveFilters && !showAdvancedFilters && (
              <span className="ml-1 h-2 w-2 rounded-full bg-blue-500"></span>
            )}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <X className="h-4 w-4 mr-1" />
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {showAdvancedFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <div>
            <label className="text-sm font-medium mb-1 block">Type de document</label>
            <Select 
              value={filters.type} 
              onValueChange={(value) => handleSelectChange('type', value)}
            >
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

          <div>
            <label className="text-sm font-medium mb-1 block">Statut</label>
            <Select 
              value={filters.status} 
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="review">En revue</SelectItem>
                <SelectItem value="approved">Approuvé</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Trier par</label>
            <Select 
              value={filters.sortBy} 
              onValueChange={(value) => handleSelectChange('sortBy', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Date de création</SelectItem>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="file_size">Taille</SelectItem>
                <SelectItem value="document_type">Type</SelectItem>
                <SelectItem value="status">Statut</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Ordre</label>
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={handleSortOrderToggle}
            >
              {filters.sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
              <span className="text-xs">
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentFilter;
