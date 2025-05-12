'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, FileText, Download, Eye, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Contract {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  position: string;
  department: string;
  startDate: string;
  endDate?: string;
  status: 'draft' | 'pending_signature' | 'active' | 'expired' | 'terminated';
  createdAt: string;
}

export function UserContractDisplay() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isContractDetailOpen, setIsContractDetailOpen] = useState(false);

  // Sample data
  const contracts: Contract[] = [
    {
      id: '1',
      employeeId: '1',
      employeeName: 'Alexandre Dubois',
      type: 'CDI',
      position: 'Développeur Full Stack',
      department: 'IT',
      startDate: '2024-02-01',
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Sophie Martin',
      type: 'CDI',
      position: 'Responsable Marketing',
      department: 'Marketing',
      startDate: '2023-09-15',
      status: 'active',
      createdAt: '2023-08-20'
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: 'Thomas Bernard',
      type: 'CDD',
      position: 'Analyste Financier',
      department: 'Finance',
      startDate: '2024-01-10',
      endDate: '2024-07-10',
      status: 'active',
      createdAt: '2023-12-15'
    },
    {
      id: '4',
      employeeId: '4',
      employeeName: 'Émilie Petit',
      type: 'CDI',
      position: 'Responsable RH',
      department: 'Ressources Humaines',
      startDate: '2022-05-01',
      status: 'terminated',
      createdAt: '2022-04-10'
    },
    {
      id: '5',
      employeeId: '5',
      employeeName: 'Lucas Moreau',
      type: 'Stage',
      position: 'Assistant Commercial',
      department: 'Commercial',
      startDate: '2025-03-01',
      endDate: '2025-09-01',
      status: 'pending_signature',
      createdAt: '2025-02-15'
    },
    {
      id: '6',
      employeeId: '6',
      employeeName: 'Julie Lefevre',
      type: 'Alternance',
      position: 'Développeur Junior',
      department: 'IT',
      startDate: '2024-09-01',
      endDate: '2026-09-01',
      status: 'draft',
      createdAt: '2024-08-10'
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
      contract.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      contract.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            Contrats des Utilisateurs
          </CardTitle>
          <CardDescription>
            Consultez et gérez les contrats de tous les utilisateurs
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
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{contract.employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{contract.employeeName}</div>
                    </div>
                  </TableCell>
                  <TableCell>{contract.type}</TableCell>
                  <TableCell>{contract.position}</TableCell>
                  <TableCell>{contract.department}</TableCell>
                  <TableCell>
                    {formatDate(contract.startDate)}
                    {contract.endDate && ` - ${formatDate(contract.endDate)}`}
                  </TableCell>
                  <TableCell>{getStatusBadge(contract.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedContract(contract);
                          setIsContractDetailOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredContracts.length === 0 && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              Aucun contrat ne correspond à votre recherche.
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t dark:border-gray-700 px-6 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Affichage de {filteredContracts.length} contrats sur {contracts.length}
          </div>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Exporter la liste
          </Button>
        </CardFooter>
      </Card>
      
      {/* Contract Detail Dialog */}
      <Dialog open={isContractDetailOpen} onOpenChange={setIsContractDetailOpen}>
        <DialogContent className="sm:max-w-3xl">
          {selectedContract && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle>Détails du Contrat</DialogTitle>
                  {getStatusBadge(selectedContract.status)}
                </div>
                <DialogDescription>
                  {selectedContract.type} • {selectedContract.position}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 border rounded-md">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{selectedContract.employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-lg font-medium">{selectedContract.employeeName}</div>
                    <div className="text-sm text-muted-foreground">{selectedContract.department}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Informations générales</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium">Type de contrat</div>
                        <div className="text-sm">{selectedContract.type}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium">Poste</div>
                        <div className="text-sm">{selectedContract.position}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium">Département</div>
                        <div className="text-sm">{selectedContract.department}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium">Date de création</div>
                        <div className="text-sm">{formatDate(selectedContract.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Période</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium">Date de début</div>
                        <div className="text-sm">{formatDate(selectedContract.startDate)}</div>
                      </div>
                      {selectedContract.endDate && (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm font-medium">Date de fin</div>
                          <div className="text-sm">{formatDate(selectedContract.endDate)}</div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium">Statut</div>
                        <div className="text-sm">{getStatusBadge(selectedContract.status)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le contrat
                    </Button>
                    
                    {selectedContract.status === 'draft' && (
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Finaliser et envoyer
                      </Button>
                    )}
                    
                    {selectedContract.status === 'pending_signature' && (
                      <Button size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Relancer la signature
                      </Button>
                    )}
                    
                    {selectedContract.status === 'active' && (
                      <Button variant="destructive" size="sm">
                        <XCircle className="h-4 w-4 mr-2" />
                        Résilier le contrat
                      </Button>
                    )}
                  </div>
                </div>
                
                {selectedContract.status === 'pending_signature' && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-900/20">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      <div>
                        <h3 className="font-medium text-amber-800 dark:text-amber-300">En attente de signature</h3>
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                          Ce contrat a été envoyé à {selectedContract.employeeName} le {formatDate(selectedContract.createdAt)} et est en attente de signature.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
