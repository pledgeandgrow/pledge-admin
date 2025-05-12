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

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  getStatusColor: (status: Client['status']) => string;
}

export function ClientTable({ clients, onEdit, getStatusColor }: ClientTableProps) {
  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-gray-200 dark:border-gray-700">
            <TableHead className="font-semibold">Date de début</TableHead>
            <TableHead className="font-semibold">Nom</TableHead>
            <TableHead className="font-semibold">Entreprise</TableHead>
            <TableHead className="hidden lg:table-cell font-semibold">Email</TableHead>
            <TableHead className="hidden lg:table-cell font-semibold">Téléphone</TableHead>
            <TableHead className="font-semibold">Services</TableHead>
            <TableHead className="hidden xl:table-cell font-semibold">Notes</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow 
              key={client.email}
              className="hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
            >
              <TableCell className="font-medium">{client.startDate}</TableCell>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.company}</TableCell>
              <TableCell className="hidden lg:table-cell">{client.email}</TableCell>
              <TableCell className="hidden lg:table-cell">{client.phone}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {client.services.map((service, index) => (
                    <Badge 
                      key={index}
                      variant="secondary" 
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                    >
                      {service}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-cell max-w-xs truncate">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">{client.notes}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-sm whitespace-normal">{client.notes}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(client.status)} shadow-sm`}>
                  {client.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => onEdit(client)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
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

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                        >
                          📋
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Voir les détails</p>
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
