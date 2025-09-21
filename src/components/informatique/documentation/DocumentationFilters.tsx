'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DocumentationFiltersProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  categories: Array<{
    value: string;
    label: string;
  }>;
}

export function DocumentationFilters({ activeTab, onTabChange, categories }: DocumentationFiltersProps) {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="all">Tous</TabsTrigger>
        {categories.map((category) => (
          <TabsTrigger key={category.value} value={category.value}>
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
