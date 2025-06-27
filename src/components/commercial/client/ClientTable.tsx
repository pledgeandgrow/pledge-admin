// src/components/commercial/client/ClientTable.tsx
'use client';

import { Client } from '@/types/commercial';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onView: (client: Client) => void;
  getStatusColor: (status: string) => string;
}

export function ClientTable({ 
  clients, 
  onEdit, 
  onDelete,
  onView,
  getStatusColor 
}: ClientTableProps) {
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PP', { locale: fr });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-gray-200 dark:border-gray-700">
            <TableHead className="font-semibold">Date d&apos;ajout</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Nom/Entreprise</TableHead>
            <TableHead className="font-semibold">Contact</TableHead>
            <TableHead className="hidden lg:table-cell font-semibold">Email</TableHead>
            <TableHead className="hidden lg:table-cell font-semibold">Téléphone</TableHead>
            <TableHead className="font-semibold">Pays</TableHead>
            <TableHead className="font-semibold">Statut</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow 
              key={client.id}
              className="hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
            >
              <TableCell>{formatDate(client.created_at)}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {client.is_company ? 'Entreprise' : 'Particulier'}
                </Badge>
              </TableCell>
              <TableCell>
                {client.is_company ? (
                  <div className="font-medium">{client.company_name}</div>
                ) : (
                  <div className="font-medium">{client.name}</div>
                )}
              </TableCell>
              <TableCell>
                {client.name} {client.contact_person && `(${client.contact_person})`}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {client.email || '-'}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {client.phone || '-'}
              </TableCell>
              <TableCell>{client.country || '-'}</TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(client.status || 'Active')} shadow-sm`}>
                  {client.status || 'Active'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => onView(client)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          👁️
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Voir les détails</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => onEdit(client)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                        >
                          ✏️
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Modifier</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => client.id && onDelete(client.id)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          🗑️
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Supprimer</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}