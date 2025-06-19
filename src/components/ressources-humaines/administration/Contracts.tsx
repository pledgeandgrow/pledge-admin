'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, FileText, Download, Eye, Calendar } from 'lucide-react';

interface Contract {
  id: string;
  title: string;
  employeeName: string;
  type: string;
  department: string;
  startDate: string;
  endDate?: string;
  status: 'draft' | 'pending_signature' | 'active' | 'expired' | 'terminated';
  pdfUrl: string;
}

export function Contracts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  // PDF preview is now handled through Dialog component directly

  // Sample data
  const contracts: Contract[] = [
    {
      id: '1',
      title: 'Contrat CDI - Développeur Full Stack',
      employeeName: 'Alexandre Dubois',
      type: 'CDI',
      department: 'IT',
      startDate: '2024-02-01',
      status: 'active',
      pdfUrl: '/contracts/contract-1.pdf'
    },
    {
      id: '2',
      title: 'Contrat CDI - Responsable Marketing',
      employeeName: 'Sophie Martin',
      type: 'CDI',
      department: 'Marketing',
      startDate: '2023-09-15',
      status: 'active',
      pdfUrl: '/contracts/contract-2.pdf'
    },
    {
      id: '3',
      title: 'Contrat CDD - Analyste Financier',
      employeeName: 'Thomas Bernard',
      type: 'CDD',
      department: 'Finance',
      startDate: '2024-01-10',
      endDate: '2024-07-10',
      status: 'active',
      pdfUrl: '/contracts/contract-3.pdf'
    },
    {
      id: '4',
      title: 'Contrat CDI - Responsable RH',
      employeeName: 'Émilie Petit',
      type: 'CDI',
      department: 'Ressources Humaines',
      startDate: '2022-05-01',
      status: 'terminated',
      pdfUrl: '/contracts/contract-4.pdf'
    },
    {
      id: '5',
      title: 'Contrat Stage - Assistant Commercial',
      employeeName: 'Lucas Moreau',
      type: 'Stage',
      department: 'Commercial',
      startDate: '2025-03-01',
      endDate: '2025-09-01',
      status: 'pending_signature',
      pdfUrl: '/contracts/contract-5.pdf'
    },
    {
      id: '6',
      title: 'Contrat Alternance - Développeur Junior',
      employeeName: 'Julie Lefevre',
      type: 'Alternance',
      department: 'IT',
      startDate: '2024-09-01',
      endDate: '2026-09-01',
      status: 'draft',
      pdfUrl: '/contracts/contract-6.pdf'
    },
    {
      id: '7',
      title: 'Contrat Freelance - Designer UX/UI',
      employeeName: 'Marc Dupont',
      type: 'Freelance',
      department: 'Design',
      startDate: '2024-03-15',
      endDate: '2024-09-15',
      status: 'active',
      pdfUrl: '/contracts/contract-7.pdf'
    },
    {
      id: '8',
      title: 'Contrat CDI - Chef de Projet',
      employeeName: 'Caroline Blanc',
      type: 'CDI',
      department: 'IT',
      startDate: '2023-06-01',
      status: 'active',
      pdfUrl: '/contracts/contract-8.pdf'
    }
  ];

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">Brouillon</Badge>;
      case 'pending_signature':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">En attente de signature</Badge>;
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Actif</Badge>;
      case 'expired':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Expiré</Badge>;
      case 'terminated':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Résilié</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  // Filter contracts based on search term, status, and type
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      contract.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || contract.status === filterStatus;
    const matchesType = filterType === 'all' || contract.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Bibliothèque de Contrats
          </CardTitle>
          <CardDescription>
            Consultez et gérez tous les contrats disponibles dans le système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher un contrat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="cdi">CDI</SelectItem>
                  <SelectItem value="cdd">CDD</SelectItem>
                  <SelectItem value="stage">Stage</SelectItem>
                  <SelectItem value="alternance">Alternance</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="pending_signature">En attente de signature</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="expired">Expiré</SelectItem>
                  <SelectItem value="terminated">Résilié</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContracts.map((contract) => (
              <Card key={contract.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{contract.title}</CardTitle>
                    {getStatusBadge(contract.status)}
                  </div>
                  <CardDescription>
                    {contract.employeeName} - {contract.department}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Début: {formatDate(contract.startDate)}</span>
                    </div>
                    {contract.endDate && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Fin: {formatDate(contract.endDate)}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Type: {contract.type}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedContract(contract)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir PDF
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>{selectedContract?.title}</DialogTitle>
                        <DialogDescription>
                          {selectedContract?.employeeName} - {selectedContract?.type}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex-1 h-full overflow-hidden">
                        <iframe 
                          src={selectedContract?.pdfUrl} 
                          className="w-full h-full border-0" 
                          title={`PDF preview for ${selectedContract?.title}`}
                        />
                      </div>
                      <DialogFooter>
                        <a href={selectedContract?.pdfUrl} download target="_blank" rel="noopener noreferrer" className="inline-flex">
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                          </Button>
                        </a>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <a href={contract.pdfUrl} download className="inline-flex">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredContracts.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Aucun contrat trouvé</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Aucun contrat ne correspond à vos critères de recherche.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
