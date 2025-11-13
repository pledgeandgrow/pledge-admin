'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, X } from 'lucide-react';

interface ClientFilters {
  status?: 'active' | 'inactive' | 'pending' | 'all';
  minSpent?: number;
  maxSpent?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

interface ClientFiltersProps {
  onFilterChange: (filters: ClientFilters) => void;
  initialFilters?: ClientFilters;
}

export function ClientFilters({ onFilterChange, initialFilters }: ClientFiltersProps) {
  const [filters, setFilters] = useState<ClientFilters>(initialFilters || {});
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    const emptyFilters: ClientFilters = { status: 'all' };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const updateFilter = <K extends keyof ClientFilters>(
    key: K,
    value: ClientFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by name, email, or company..."
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => updateFilter('status', value as ClientFilters['status'])}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minSpent">Min Spent ($)</Label>
              <Input
                id="minSpent"
                type="number"
                placeholder="0"
                value={filters.minSpent || ''}
                onChange={(e) => updateFilter('minSpent', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxSpent">Max Spent ($)</Label>
              <Input
                id="maxSpent"
                type="number"
                placeholder="10000"
                value={filters.maxSpent || ''}
                onChange={(e) => updateFilter('maxSpent', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => updateFilter('dateFrom', e.target.value)}
              />
              <Input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => updateFilter('dateTo', e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleApplyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button onClick={handleReset} variant="outline">
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
