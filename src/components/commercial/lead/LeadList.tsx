'use client';

import { useState } from 'react';
import { useLeads, type Lead } from '@/hooks/useLeads';
import { AddLeadDialog } from './AddLeadDialog';
import { EditLeadDialog } from './EditLeadDialog';
import { ViewLeadModal } from './ViewLeadModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Target, DollarSign, Plus, Eye, Edit } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// UI Lead interface for display
interface UILead {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  commentaires: string;
  status: string;
  source?: string;
  probability?: number;
  last_contacted_at?: string;
  next_follow_up?: string;
  estimated_value?: number;
  created_at: string;
  updated_at: string;
}

// Convert Lead to UI format
const leadToUI = (lead: Lead): UILead => {
  return {
    id: lead.id,
    name: `${lead.first_name} ${lead.last_name}`,
    position: lead.position || '',
    company: lead.company || '',
    email: lead.email || '',
    phone: lead.phone || '',
    commentaires: lead.notes || '',
    status: lead.status,
    source: lead.lead_source || lead.source,
    probability: lead.probability,
    last_contacted_at: lead.last_contacted_at,
    next_follow_up: lead.next_follow_up,
    estimated_value: lead.estimated_value,
    created_at: lead.created_at,
    updated_at: lead.updated_at
  };
};

export function LeadList() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Use the useLeads hook
  const { leads, isLoading, error, getLeadStatistics, createLead, updateLead } = useLeads({
    initialFilters: {
      orderBy: 'updated_at',
      orderDirection: 'desc'
    }
  });
  
  // Convert leads to UI format
  const uiLeads = leads.map(leadToUI);
  
  // Filter leads based on search
  const filteredLeads = uiLeads.filter(lead => {
    if (!searchQuery) {return true;}
    const query = searchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(query) ||
      lead.company.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      (lead.phone && lead.phone.includes(query))
    );
  });

  // Get statistics
  const stats = getLeadStatistics();
  
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'new': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      'contacted': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
      'qualified': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
      'in_progress': 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
      'converted': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
      'lost': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error loading leads: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">High Probability</CardTitle>
              <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.highProbability}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">≥70% probability</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Avg Probability</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{Math.round(stats.averageProbability)}%</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">Est. Value</CardTitle>
              <DollarSign className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
              ${(stats.totalEstimatedValue / 1000).toFixed(1)}k
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          />
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">All Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Spinner className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center p-12 text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No leads found matching your search' : 'No leads yet. Add your first lead!'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Company</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Email</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Probability</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Value</th>
                    <th className="text-right p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="p-3 text-sm text-gray-900 dark:text-gray-100">{lead.name}</td>
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{lead.company}</td>
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{lead.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                        {lead.probability ? `${lead.probability}%` : '-'}
                      </td>
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                        {lead.estimated_value ? `$${lead.estimated_value.toLocaleString()}` : '-'}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const fullLead = leads.find(l => l.id === lead.id);
                              if (fullLead) {setViewingLead(fullLead);}
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const fullLead = leads.find(l => l.id === lead.id);
                              if (fullLead) {setSelectedLead(fullLead);}
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ViewLeadModal
        lead={viewingLead ? leadToUI(viewingLead) : null}
        open={!!viewingLead}
        onOpenChange={(open) => !open && setViewingLead(null)}
        onEdit={() => {
          if (viewingLead) {
            setSelectedLead(viewingLead);
            setViewingLead(null);
          }
        }}
        getStatusColor={getStatusColor}
      />

      <AddLeadDialog
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onCreateLead={createLead}
      />

      {selectedLead && (
        <EditLeadDialog
          lead={leadToUI(selectedLead)}
          open={!!selectedLead}
          onOpenChange={(open) => !open && setSelectedLead(null)}
          onUpdateLead={updateLead}
        />
      )}
    </div>
  );
}
