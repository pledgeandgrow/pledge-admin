import { Lead } from '@/types/commercial';
import { useLeadStore } from '@/stores/commercial/leadStore';
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

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  getStatusColor: (status: Lead['status']) => string;
}

export function LeadTable({ leads, onEdit, getStatusColor }: LeadTableProps) {
  const { deleteLead, moveLead } = useLeadStore();

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-gray-200 dark:border-gray-700">
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Nom</TableHead>
            <TableHead className="hidden md:table-cell font-semibold">Position</TableHead>
            <TableHead className="font-semibold">Entreprise</TableHead>
            <TableHead className="hidden lg:table-cell font-semibold">Email</TableHead>
            <TableHead className="hidden lg:table-cell font-semibold">Téléphone</TableHead>
            <TableHead className="hidden xl:table-cell font-semibold">Commentaires</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Service</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead, index) => (
            <TableRow 
              key={lead.email} 
              className="hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
            >
              <TableCell className="font-medium">{lead.date}</TableCell>
              <TableCell>{lead.name}</TableCell>
              <TableCell className="hidden md:table-cell">{lead.position}</TableCell>
              <TableCell>{lead.company}</TableCell>
              <TableCell className="hidden lg:table-cell">{lead.email}</TableCell>
              <TableCell className="hidden lg:table-cell">{lead.phone}</TableCell>
              <TableCell className="hidden xl:table-cell max-w-xs truncate">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">{lead.commentaires}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-sm whitespace-normal">{lead.commentaires}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(lead.status)} shadow-sm`}>
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell>{lead.service}</TableCell>
              <TableCell>
                <div className="flex justify-end space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => onEdit(lead)}
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
                          onClick={() => deleteLead(lead)}
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
                          onClick={() => moveLead(index, 'up')}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
                          disabled={index === 0}
                        >
                          ⬆️
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Déplacer vers le haut</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => moveLead(index, 'down')}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
                          disabled={index === leads.length - 1}
                        >
                          ⬇️
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Déplacer vers le bas</p>
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
