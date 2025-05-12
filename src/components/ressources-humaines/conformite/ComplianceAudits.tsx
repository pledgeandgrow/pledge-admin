'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, FileText, Calendar } from 'lucide-react';

interface Audit {
  id: number;
  title: string;
  type: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  auditor: string;
  department: string;
}

export function ComplianceAudits() {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data
  const audits: Audit[] = [
    {
      id: 1,
      title: 'Audit RGPD Annuel',
      type: 'Interne',
      status: 'planned',
      startDate: '2025-03-15',
      endDate: '2025-03-30',
      auditor: 'Marie Dupont',
      department: 'Tous les départements'
    },
    {
      id: 2,
      title: 'Audit de Sécurité IT',
      type: 'Externe',
      status: 'in_progress',
      startDate: '2025-02-20',
      endDate: '2025-03-05',
      auditor: 'SecureAudit Inc.',
      department: 'IT'
    },
    {
      id: 3,
      title: 'Audit des Processus RH',
      type: 'Interne',
      status: 'completed',
      startDate: '2025-01-10',
      endDate: '2025-01-25',
      auditor: 'Thomas Martin',
      department: 'Ressources Humaines'
    },
    {
      id: 4,
      title: 'Audit Financier',
      type: 'Externe',
      status: 'completed',
      startDate: '2024-11-05',
      endDate: '2024-11-20',
      auditor: 'FinanceAudit SA',
      department: 'Finance'
    },
    {
      id: 5,
      title: 'Audit des Fournisseurs',
      type: 'Interne',
      status: 'planned',
      startDate: '2025-04-10',
      endDate: '2025-04-25',
      auditor: 'Sophie Leroy',
      department: 'Achats'
    }
  ];

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Planifié</Badge>;
      case 'in_progress':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Terminé</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Annulé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  // Filter audits based on search term
  const filteredAudits = audits.filter(audit => {
    return audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           audit.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
           audit.auditor.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-8">
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Audits de Conformité
          </CardTitle>
          <CardDescription>
            Planifiez et suivez les audits de conformité internes et externes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Rechercher un audit..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel audit
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Auditeur</TableHead>
                <TableHead>Département</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAudits.map((audit) => (
                <TableRow key={audit.id}>
                  <TableCell className="font-medium">{audit.title}</TableCell>
                  <TableCell>{audit.type}</TableCell>
                  <TableCell>{getStatusBadge(audit.status)}</TableCell>
                  <TableCell>
                    {new Date(audit.startDate).toLocaleDateString('fr-FR')} - {new Date(audit.endDate).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>{audit.auditor}</TableCell>
                  <TableCell>{audit.department}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredAudits.length === 0 && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              Aucun audit ne correspond à votre recherche.
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t dark:border-gray-700 px-6 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Affichage de {filteredAudits.length} audits sur {audits.length}
          </div>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Calendrier des audits
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
