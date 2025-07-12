import React, { useState, useEffect } from 'react';
import { Depense } from '@/types/depense';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, FileText, MoreVertical, Plus, Trash2 } from 'lucide-react';
import PdfUploader from '@/components/functions/PdfUploader';

interface DepenseListWithPdfProps {
  onEdit?: (depense: Depense) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
}

export function DepenseListWithPdf({
  onEdit,
  onDelete,
  onAdd,
}: DepenseListWithPdfProps) {
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedExpense, setExpandedExpense] = useState<string | null>(null);

  useEffect(() => {
    fetchDepenses();
  }, []);

  const fetchDepenses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/comptabilite/depenses');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des dépenses');
      }
      
      const data = await response.json();
      setDepenses(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les dépenses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/comptabilite/depenses?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }
      
      setDepenses((prev) => prev.filter((depense) => depense.id !== id));
      
      toast({
        title: 'Succès',
        description: 'Dépense supprimée avec succès',
      });
      
      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la dépense',
        variant: 'destructive',
      });
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedExpense(expandedExpense === id ? null : id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_attente':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">En attente</Badge>;
      case 'approuve':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approuvé</Badge>;
      case 'refuse':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Refusé</Badge>;
      case 'rembourse':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Remboursé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Dépenses</CardTitle>
            <CardDescription>
              Gérez vos dépenses et leurs justificatifs
            </CardDescription>
          </div>
          {onAdd && (
            <Button onClick={onAdd} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle dépense
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {depenses.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Aucune dépense trouvée
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {depenses.map((depense) => (
                <React.Fragment key={depense.id}>
                  <TableRow 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleExpand(depense.id)}
                  >
                    <TableCell>
                      {depense.date ? format(new Date(depense.date), 'dd MMM yyyy', { locale: fr }) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{depense.description}</div>
                      {depense.justificatif_url && (
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <FileText className="h-3 w-3 mr-1" />
                          Justificatif disponible
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{depense.categorie}</TableCell>
                    <TableCell className="text-right font-medium">
                      {depense.montant.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </TableCell>
                    <TableCell>{getStatusBadge(depense.statut)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            if (onEdit) onEdit(depense);
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(depense.id);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {expandedExpense === depense.id && (
                    <TableRow>
                      <TableCell colSpan={6} className="p-4 bg-muted/30">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Détails</h4>
                              <dl className="space-y-2 text-sm">
                                {depense.projet && (
                                  <div className="flex justify-between">
                                    <dt className="text-muted-foreground">Projet:</dt>
                                    <dd>{depense.projet}</dd>
                                  </div>
                                )}
                                {depense.mission && (
                                  <div className="flex justify-between">
                                    <dt className="text-muted-foreground">Mission:</dt>
                                    <dd>{depense.mission}</dd>
                                  </div>
                                )}
                                {depense.notes && (
                                  <div>
                                    <dt className="text-muted-foreground mb-1">Notes:</dt>
                                    <dd className="text-wrap break-words">{depense.notes}</dd>
                                  </div>
                                )}
                              </dl>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2">Justificatif</h4>
                              <PdfUploader
                                documentId={depense.id}
                                documentType="expense"
                                label="Justificatif de dépense"
                                existingPdfUrl={depense.justificatif_url || undefined}
                                existingPdfName={depense.justificatif_url ? "Justificatif" : undefined}
                                onUploadSuccess={(url: string) => {
                                  // Update the local state when a PDF is uploaded or deleted
                                  setDepenses((prev) =>
                                    prev.map((d) =>
                                      d.id === depense.id
                                        ? { ...d, justificatif_url: url }
                                        : d
                                    )
                                  );
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={fetchDepenses}>
          Rafraîchir
        </Button>
      </CardFooter>
    </Card>
  );
}
