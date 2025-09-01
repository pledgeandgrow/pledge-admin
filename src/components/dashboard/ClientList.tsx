'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ChevronDown } from 'lucide-react';
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

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'On Hold';
  lastContact: string;
  amount: number;
  source?: string;
  priority?: 'High' | 'Medium' | 'Low';
}

interface ClientListProps {
  clients: Client[];
  isLoading?: boolean;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'On Hold':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'Low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export function ClientList({ clients, isLoading = false }: ClientListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || client.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-gray-300 dark:border-gray-700">
                <Filter className="h-4 w-4" />
                Status
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Active')}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Pending')}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('On Hold')}>
                On Hold
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-gray-300 dark:border-gray-700">
                <Filter className="h-4 w-4" />
                Priority
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => setPriorityFilter('all')}>
                All Priorities
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter('High')}>
                High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter('Medium')}>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter('Low')}>
                Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Clients Table */}
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No clients found.
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{client.company}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(client.status)}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityBadge(client.priority || '')}>
                      {client.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(client.lastContact).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${client.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
