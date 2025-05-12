'use client';

import { useState, useEffect } from 'react';
import { Client } from '@/types/commercial';
import { ClientTable } from './ClientTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockClients: Client[] = [
  {
    name: 'Jean Dupont',
    company: 'Tech Solutions SA',
    email: 'jean.dupont@techsolutions.fr',
    phone: '+33 6 12 34 56 78',
    status: 'Active',
    startDate: '2024-01-15',
    services: ['Consulting', 'Formation'],
    notes: 'Client fidèle depuis 2024'
  },
  {
    name: 'Marie Martin',
    company: 'Digital Agency',
    email: 'marie.martin@digital.fr',
    phone: '+33 6 23 45 67 89',
    status: 'Active',
    startDate: '2024-02-01',
    services: ['Marketing', 'SEO'],
    notes: 'Intéressée par nos services de formation'
  },
  {
    name: 'Pierre Dubois',
    company: 'Startup Innovation',
    email: 'pierre.dubois@startup.fr',
    phone: '+33 6 34 56 78 90',
    status: 'Pending',
    startDate: '2024-02-20',
    services: ['Development'],
    notes: 'En attente de signature du contrat'
  }
];

export function ClientList() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const getStatusColor = (status: Client['status']) => {
    const colors = {
      'Active': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
      'Inactive': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
      'Pending': 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
  };

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'Active').length,
    inactive: clients.filter(c => c.status === 'Inactive').length,
    pending: clients.filter(c => c.status === 'Pending').length
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-emerald-200 dark:border-emerald-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.active}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-amber-200 dark:border-amber-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400">En Attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-red-200 dark:border-red-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">Inactifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.inactive}</div>
          </CardContent>
        </Card>
      </div>

      {/* Client Table */}
      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Liste des Clients</CardTitle>
          <Button 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Ajouter un Client
          </Button>
        </CardHeader>
        <CardContent>
          <ClientTable
            clients={clients}
            onEdit={setSelectedClient}
            getStatusColor={getStatusColor}
          />
        </CardContent>
      </Card>
    </div>
  );
}
