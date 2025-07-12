'use client';

import { useState, useMemo } from 'react';
import { Contact } from '@/types/contact';
import useRealtimeContacts from '@/hooks/useRealtimeContacts';
import { LeadTable } from './LeadTable';
import { AddLeadDialog } from './AddLeadDialog';
import { EditLeadDialog } from './EditLeadDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define the Lead interface expected by the components
interface Lead {
  id?: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  commentaires: string;
  status: "New" | "In Progress" | "Converted" | "Contacted" | "Qualified" | "Lost";
  service: string;
  source?: string;
  probability?: number;
  last_contacted_at?: string;
  next_follow_up?: string;
  estimated_value?: number;
  created_at?: string;
  updated_at?: string;
}

// Convert Contact to Lead format
const contactToLead = (contact: Contact): Lead => {
  // Convert status to the expected enum type or default to "New"
  const mapStatus = (status: string): Lead['status'] => {
    const validStatuses: Lead['status'][] = [
      "New", "In Progress", "Converted", "Contacted", "Qualified", "Lost"
    ];
    return validStatuses.includes(status as any) ? 
      (status as Lead['status']) : "New";
  };
  
  // Safely access metadata properties
  const metadata = contact.metadata || {};
  const getMetadataValue = <T,>(key: string, defaultValue: T): T => {
    if (typeof metadata === 'object' && metadata !== null) {
      return (metadata as Record<string, any>)[key] as T || defaultValue;
    }
    return defaultValue;
  };
  
  return {
    id: contact.id,
    name: `${contact.first_name} ${contact.last_name}`,
    position: contact.position || '',
    company: contact.company || '',
    email: contact.email || '',
    phone: contact.phone || '',
    commentaires: contact.notes || '',
    status: mapStatus(contact.status),
    service: getMetadataValue<string>('service', ''),
    source: getMetadataValue<string>('source', ''),
    probability: getMetadataValue<number | undefined>('probability', undefined),
    last_contacted_at: getMetadataValue<string | undefined>('last_contacted_at', undefined),
    next_follow_up: getMetadataValue<string | undefined>('next_follow_up', undefined),
    estimated_value: getMetadataValue<number | undefined>('estimated_value', undefined),
    created_at: contact.created_at,
    updated_at: contact.updated_at
  };
};

export function LeadList() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Use the existing useRealtimeContacts hook with lead type filter
  const { contacts, loading } = useRealtimeContacts({
    type: 'lead',
    autoFetch: true
  });
  
  // Convert contacts to leads format for the UI components
  const leads = useMemo(() => {
    return contacts.map(contact => contactToLead(contact));
  }, [contacts]);
  
  // Keep track of the selected lead for editing
  const selectedLead = useMemo(() => {
    return selectedContact ? contactToLead(selectedContact) : null;
  }, [selectedContact]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add Lead</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.new}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Converted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.converted}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
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
            onEdit={(lead) => {
              const contact = contacts.find(c => c.id === lead.id);
              if (contact) setSelectedContact(contact);
            }}
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
          onOpenChange={(open) => !open && setSelectedContact(null)}
        />
      )}
    </div>
  );
}
