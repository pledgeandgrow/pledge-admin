'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Edit, Download, Filter, Plus, DollarSign, FileText } from 'lucide-react';

interface EmployeeSalary {
  id: number;
  employeeId: number;
  employeeName: string;
  employeePhoto: string;
  employeeDepartment: string;
  employeePosition: string;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  currency: string;
  lastUpdate: string;
  paymentMethod: string;
  bankAccount?: string;
}

export function EmployeeSalaries() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showSalaryDialog, setShowSalaryDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeSalary | null>(null);

  // Sample data
  const employeeSalaries: EmployeeSalary[] = [
    {
      id: 1,
      employeeId: 101,
      employeeName: 'Sophie Martin',
      employeePhoto: '/avatars/sophie.jpg',
      employeeDepartment: 'Technologie',
      employeePosition: 'Développeur Senior',
      baseSalary: 4500,
      bonuses: 500,
      deductions: 1200,
      netSalary: 3800,
      currency: 'EUR',
      lastUpdate: '2025-02-15',
      paymentMethod: 'Virement bancaire',
      bankAccount: 'FR76 XXXX XXXX XXXX XXXX'
    },
    {
      id: 2,
      employeeId: 102,
      employeeName: 'Thomas Dubois',
      employeePhoto: '/avatars/thomas.jpg',
      employeeDepartment: 'Marketing',
      employeePosition: 'Responsable Marketing',
      baseSalary: 4200,
      bonuses: 300,
      deductions: 1100,
      netSalary: 3400,
      currency: 'EUR',
      lastUpdate: '2025-02-15',
      paymentMethod: 'Virement bancaire',
      bankAccount: 'FR76 XXXX XXXX XXXX XXXX'
    },
    {
      id: 3,
      employeeId: 103,
      employeeName: 'Léa Bernard',
      employeePhoto: '/avatars/lea.jpg',
      employeeDepartment: 'Commercial',
      employeePosition: 'Responsable Commercial',
      baseSalary: 4000,
      bonuses: 800,
      deductions: 1300,
      netSalary: 3500,
      currency: 'EUR',
      lastUpdate: '2025-02-15',
      paymentMethod: 'Virement bancaire',
      bankAccount: 'FR76 XXXX XXXX XXXX XXXX'
    },
    {
      id: 4,
      employeeId: 104,
      employeeName: 'Lucas Petit',
      employeePhoto: '/avatars/lucas.jpg',
      employeeDepartment: 'Ressources Humaines',
      employeePosition: 'Responsable RH',
      baseSalary: 3800,
      bonuses: 200,
      deductions: 1000,
      netSalary: 3000,
      currency: 'EUR',
      lastUpdate: '2025-02-15',
      paymentMethod: 'Virement bancaire',
      bankAccount: 'FR76 XXXX XXXX XXXX XXXX'
    },
    {
      id: 5,
      employeeId: 105,
      employeeName: 'Emma Leroy',
      employeePhoto: '/avatars/emma.jpg',
      employeeDepartment: 'Finance',
      employeePosition: 'Comptable',
      baseSalary: 3500,
      bonuses: 100,
      deductions: 900,
      netSalary: 2700,
      currency: 'EUR',
      lastUpdate: '2025-02-15',
      paymentMethod: 'Virement bancaire',
      bankAccount: 'FR76 XXXX XXXX XXXX XXXX'
    }
  ];

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);
  };

  // Filter employees based on search term and department
  const filteredEmployees = employeeSalaries.filter(employee => {
    const matchesSearch = employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeePosition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || employee.employeeDepartment === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Handle edit employee salary
  const handleEditSalary = (employee: EmployeeSalary) => {
    setSelectedEmployee(employee);
    setShowSalaryDialog(true);
  };

  return (
    <div className="space-y-8">
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Gestion des Salaires
          </CardTitle>
          <CardDescription>
            Consultez et gérez les salaires des employés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Rechercher un employé..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>{filterDepartment === 'all' ? 'Tous les départements' : filterDepartment}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les départements</SelectItem>
                  <SelectItem value="Technologie">Technologie</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Ressources Humaines">Ressources Humaines</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="md:w-auto" onClick={() => setShowSalaryDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un salaire
            </Button>
          </div>

          <div className="rounded-md border dark:border-gray-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-100 dark:bg-gray-800">
                <TableRow>
                  <TableHead className="w-[250px]">Employé</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead className="text-right">Salaire de base</TableHead>
                  <TableHead className="text-right">Primes</TableHead>
                  <TableHead className="text-right">Déductions</TableHead>
                  <TableHead className="text-right">Salaire net</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={employee.employeePhoto} alt={employee.employeeName} />
                            <AvatarFallback>{employee.employeeName.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{employee.employeeName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">ID: {employee.employeeId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.employeeDepartment}</TableCell>
                      <TableCell>{employee.employeePosition}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(employee.baseSalary, employee.currency)}
                      </TableCell>
                      <TableCell className="text-right text-green-600 dark:text-green-400">
                        +{formatCurrency(employee.bonuses, employee.currency)}
                      </TableCell>
                      <TableCell className="text-right text-red-600 dark:text-red-400">
                        -{formatCurrency(employee.deductions, employee.currency)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(employee.netSalary, employee.currency)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditSalary(employee)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-gray-500 dark:text-gray-400">
                      Aucun employé trouvé avec les critères de recherche actuels.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t dark:border-gray-700 px-6 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Affichage de {filteredEmployees.length} employés sur {employeeSalaries.length}
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </CardFooter>
      </Card>

      {/* Salary Edit Dialog */}
      <Dialog open={showSalaryDialog} onOpenChange={setShowSalaryDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEmployee ? `Modifier le salaire - ${selectedEmployee.employeeName}` : 'Ajouter un nouveau salaire'}
            </DialogTitle>
            <DialogDescription>
              {selectedEmployee 
                ? 'Modifiez les informations de salaire de l\'employé ci-dessous.' 
                : 'Entrez les informations de salaire pour le nouvel employé.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {!selectedEmployee && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employeeSelect" className="text-right">
                  Employé
                </Label>
                <div className="col-span-3">
                  <Select>
                    <SelectTrigger id="employeeSelect">
                      <SelectValue placeholder="Sélectionner un employé" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="101">Sophie Martin</SelectItem>
                      <SelectItem value="102">Thomas Dubois</SelectItem>
                      <SelectItem value="103">Léa Bernard</SelectItem>
                      <SelectItem value="104">Lucas Petit</SelectItem>
                      <SelectItem value="105">Emma Leroy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="baseSalary" className="text-right">
                Salaire de base
              </Label>
              <div className="col-span-3">
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input 
                    id="baseSalary" 
                    placeholder="0.00" 
                    className="pl-8" 
                    defaultValue={selectedEmployee?.baseSalary.toString() || ''} 
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bonuses" className="text-right">
                Primes
              </Label>
              <div className="col-span-3">
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input 
                    id="bonuses" 
                    placeholder="0.00" 
                    className="pl-8" 
                    defaultValue={selectedEmployee?.bonuses.toString() || ''} 
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deductions" className="text-right">
                Déductions
              </Label>
              <div className="col-span-3">
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input 
                    id="deductions" 
                    placeholder="0.00" 
                    className="pl-8" 
                    defaultValue={selectedEmployee?.deductions.toString() || ''} 
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paymentMethod" className="text-right">
                Méthode de paiement
              </Label>
              <div className="col-span-3">
                <Select defaultValue={selectedEmployee?.paymentMethod || 'Virement bancaire'}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Sélectionner une méthode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Virement bancaire">Virement bancaire</SelectItem>
                    <SelectItem value="Chèque">Chèque</SelectItem>
                    <SelectItem value="Espèces">Espèces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSalaryDialog(false)}>
              Annuler
            </Button>
            <Button onClick={() => setShowSalaryDialog(false)}>
              {selectedEmployee ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
