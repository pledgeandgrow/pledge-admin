'use client';

import { useState, useEffect } from 'react';
import { Lead } from '@/types/commercial';
import { useLeadStore } from '@/stores/commercial/leadStore';
import { LeadTable } from './LeadTable';
import { AddLeadDialog } from './AddLeadDialog';
import { EditLeadDialog } from './EditLeadDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


export function LeadList() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { leads, fetchLeads } = useLeadStore();

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const getStatusColor = (status: Lead['status']) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      'In Progress': 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
      'Contacted': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
      'Qualified': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
      'Converted': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
      'Lost': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    inProgress: leads.filter(l => l.status === 'In Progress').length,
    converted: leads.filter(l => l.status === 'Converted').length
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">Nouveaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.new}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-amber-200 dark:border-amber-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400">En Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-emerald-200 dark:border-emerald-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Convertis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.converted}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Table */}
      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Liste des Leads</CardTitle>
          <Button 
            onClick={() => setIsAddModalOpen(true)} 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Ajouter un Lead
          </Button>
        </CardHeader>
        <CardContent>
          <LeadTable
            leads={leads}
            onEdit={setSelectedLead}
            getStatusColor={getStatusColor}
          />
        </CardContent>
      </Card>

      <AddLeadDialog
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      {selectedLead && (
        <EditLeadDialog
          lead={selectedLead}
          open={!!selectedLead}
          onOpenChange={(open) => !open && setSelectedLead(null)}
        />
      )}
    </div>
  );
}
