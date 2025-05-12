'use client';

import { Package } from '@/types/commercial';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PackageTableProps {
  packages: Package[];
  onEdit: (pkg: Package) => void;
  onView: (pkg: Package) => void;
  getStatusColor: (status: Package['status']) => string;
  getCategoryColor: (category: string) => string;
}

export function PackageTable({
  packages,
  onEdit,
  onView,
  getStatusColor,
  getCategoryColor,
}: PackageTableProps) {
  return (
    <div className="rounded-md border bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Durée</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.map((pkg) => (
            <TableRow key={pkg.id} className="hover:bg-white/5 dark:hover:bg-gray-800/50">
              <TableCell className="font-medium">{pkg.name}</TableCell>
              <TableCell className="max-w-[300px] truncate">
                {pkg.description}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getCategoryColor(pkg.category)}>
                  {pkg.category}
                </Badge>
              </TableCell>
              <TableCell>{pkg.price.toLocaleString('fr-FR')} €</TableCell>
              <TableCell>{pkg.duration}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(pkg.status)}>
                  {pkg.status === 'Available' ? 'Disponible' : 'Indisponible'}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(pkg)}
                        className="h-8 w-8 hover:bg-white/20 dark:hover:bg-gray-800/50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Voir les détails</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(pkg)}
                        className="h-8 w-8 hover:bg-white/20 dark:hover:bg-gray-800/50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Modifier</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
