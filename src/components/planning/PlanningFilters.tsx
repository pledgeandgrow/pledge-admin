'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FilterOptions {
  status?: string;
  assignee?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface PlanningFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

export function PlanningFilters({ onFilterChange, initialFilters }: PlanningFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters || {});

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    const emptyFilters: FilterOptions = {};
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="font-semibold">Filters</h3>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Input
          id="status"
          value={filters.status || ''}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          placeholder="Filter by status"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignee">Assignee</Label>
        <Input
          id="assignee"
          value={filters.assignee || ''}
          onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
          placeholder="Filter by assignee"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleApplyFilters} size="sm">
          Apply Filters
        </Button>
        <Button onClick={handleReset} variant="outline" size="sm">
          Reset
        </Button>
      </div>
    </div>
  );
}
