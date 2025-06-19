'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, CheckCircle, Clock, FileText, Download } from 'lucide-react';

interface EmployeeTraining {
  id: number;
  employeeId: number;
  employeeName: string;
  employeePhoto: string;
  employeeDepartment: string;
  formationId: number;
  formationTitle: string;
  formationCategory: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'in_progress' | 'planned' | 'cancelled';
  progress: number;
  score?: number;
  certificationObtained: boolean;
  certificationDate?: string;
  certificationExpiry?: string;
}

interface Employee {
  id: number;
  name: string;
  photo: string;
  department: string;
  completedTrainings: number;
  inProgressTrainings: number;
  certifications: number;
}

export function EmployeeTrainingProgress() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);

  // Sample data
  const employees: Employee[] = [
    {
      id: 1,
      name: 'Marie Dupont',
      photo: '',
      department: 'Technologie',
      completedTrainings: 8,
      inProgressTrainings: 2,
      certifications: 5
    },
    {
      id: 2,
      name: 'Jean Martin',
      photo: '',
      department: 'Produit',
      completedTrainings: 5,
      inProgressTrainings: 1,
      certifications: 3
    },
    {
      id: 3,
      name: 'John Doe',
      photo: '',
      department: 'Technologie',
      completedTrainings: 2,
      inProgressTrainings: 3,
      certifications: 1
    },
    {
      id: 4,
      name: 'Sophie Dubois',
      photo: '',
      department: 'Marketing',
      completedTrainings: 6,
      inProgressTrainings: 0,
      certifications: 4
    },
    {
      id: 5,
      name: 'Pierre Lefebvre',
      photo: '',
      department: 'Commercial',
      completedTrainings: 4,
      inProgressTrainings: 1,
      certifications: 2
    }
  ];

  const trainings: EmployeeTraining[] = [
    {
      id: 1,
      employeeId: 1,
      employeeName: 'Marie Dupont',
      employeePhoto: '',
      employeeDepartment: 'Technologie',
      formationId: 1,
      formationTitle: 'Développement Web Avancé',
      formationCategory: 'Technique',
      startDate: '2025-01-15',
      endDate: '2025-01-22',
      status: 'completed',
      progress: 100,
      score: 92,
      certificationObtained: true,
      certificationDate: '2025-01-22',
      certificationExpiry: '2027-01-22'
    },
    {
      id: 2,
      employeeId: 1,
      employeeName: 'Marie Dupont',
      employeePhoto: '',
      employeeDepartment: 'Technologie',
      formationId: 3,
      formationTitle: 'Cybersécurité Fondamentale',
      formationCategory: 'Sécurité',
      startDate: '2025-02-10',
      endDate: '2025-02-12',
      status: 'completed',
      progress: 100,
      score: 88,
      certificationObtained: true,
      certificationDate: '2025-02-12',
      certificationExpiry: '2027-02-12'
    },
    {
      id: 3,
      employeeId: 1,
      employeeName: 'Marie Dupont',
      employeePhoto: '',
      employeeDepartment: 'Technologie',
      formationId: 4,
      formationTitle: 'Communication Professionnelle',
      formationCategory: 'Soft Skills',
      startDate: '2025-02-20',
      endDate: '2025-02-21',
      status: 'in_progress',
      progress: 60,
      certificationObtained: false
    },
    {
      id: 4,
      employeeId: 2,
      employeeName: 'Jean Martin',
      employeePhoto: '',
      employeeDepartment: 'Produit',
      formationId: 2,
      formationTitle: 'Leadership et Management d\'Équipe',
      formationCategory: 'Management',
      startDate: '2025-01-20',
      endDate: '2025-01-23',
      status: 'completed',
      progress: 100,
      score: 95,
      certificationObtained: true,
      certificationDate: '2025-01-23',
      certificationExpiry: '2027-01-23'
    },
    {
      id: 5,
      employeeId: 2,
      employeeName: 'Jean Martin',
      employeePhoto: '',
      employeeDepartment: 'Produit',
      formationId: 4,
      formationTitle: 'Communication Professionnelle',
      formationCategory: 'Soft Skills',
      startDate: '2025-03-15',
      endDate: '2025-03-16',
      status: 'planned',
      progress: 0,
      certificationObtained: false
    },
    {
      id: 6,
      employeeId: 3,
      employeeName: 'John Doe',
      employeePhoto: '',
      employeeDepartment: 'Technologie',
      formationId: 1,
      formationTitle: 'Développement Web Avancé',
      formationCategory: 'Technique',
      startDate: '2025-02-01',
      endDate: '2025-02-08',
      status: 'in_progress',
      progress: 45,
      certificationObtained: false
    },
    {
      id: 7,
      employeeId: 4,
      employeeName: 'Sophie Dubois',
      employeePhoto: '',
      employeeDepartment: 'Marketing',
      formationId: 4,
      formationTitle: 'Communication Professionnelle',
      formationCategory: 'Soft Skills',
      startDate: '2025-01-10',
      endDate: '2025-01-11',
      status: 'completed',
      progress: 100,
      score: 90,
      certificationObtained: true,
      certificationDate: '2025-01-11',
      certificationExpiry: '2027-01-11'
    }
  ];

  const departments = [...new Set(employees.map(emp => emp.department))];

  // Filter employees based on search term and department
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Filter trainings based on selected employee and status
  const filteredTrainings = trainings.filter(training => {
    const matchesEmployee = selectedEmployee === null || training.employeeId === selectedEmployee;
    const matchesStatus = filterStatus === 'all' || training.status === filterStatus;
    return matchesEmployee && matchesStatus;
  });

  // Get trainings for a specific employee
  const getEmployeeTrainings = (employeeId: number) => {
    return trainings.filter(training => training.employeeId === employeeId);
  };

  // Calculate training completion rate for an employee
  const getCompletionRate = (employeeId: number) => {
    const employeeTrainings = getEmployeeTrainings(employeeId);
    if (employeeTrainings.length === 0) return 0;
    
    const completedCount = employeeTrainings.filter(t => t.status === 'completed').length;
    return Math.round((completedCount / employeeTrainings.length) * 100);
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Terminé</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">En cours</Badge>;
      case 'planned':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Planifié</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Annulé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un employé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          
          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Département" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les départements</SelectItem>
              {departments.map((dept, index) => (
                <SelectItem key={index} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedEmployee !== null && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedEmployee(null)}>
              Voir tous les employés
            </Button>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="planned">Planifié</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      {selectedEmployee === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="overflow-hidden border dark:border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-semibold">{employee.name}</CardTitle>
                    <CardDescription>{employee.department}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-300">Taux de complétion</span>
                      <span className="text-gray-600 dark:text-gray-300">{getCompletionRate(employee.id)}%</span>
                    </div>
                    <Progress value={getCompletionRate(employee.id)} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
                      <div className="text-lg font-semibold text-green-600 dark:text-green-400">{employee.completedTrainings}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Terminées</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
                      <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{employee.inProgressTrainings}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">En cours</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
                      <div className="text-lg font-semibold text-amber-600 dark:text-amber-400">{employee.certifications}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Certifications</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setSelectedEmployee(employee.id)}
                >
                  Voir les formations
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border dark:border-gray-700">
          <CardHeader>
            <CardTitle>Parcours de formation</CardTitle>
            <CardDescription>
              {employees.find(e => e.id === selectedEmployee)?.name} - {employees.find(e => e.id === selectedEmployee)?.department}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Formation</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Progression</TableHead>
                  <TableHead>Certification</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrainings.map((training) => (
                  <TableRow key={training.id}>
                    <TableCell className="font-medium">{training.formationTitle}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        training.formationCategory === 'Technique' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        training.formationCategory === 'Management' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                        training.formationCategory === 'Sécurité' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        training.formationCategory === 'Soft Skills' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                      }>
                        {training.formationCategory}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Début: {new Date(training.startDate).toLocaleDateString()}</div>
                        <div>Fin: {new Date(training.endDate).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(training.status)}</TableCell>
                    <TableCell>
                      <div className="w-24">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{training.progress}%</span>
                        </div>
                        <Progress value={training.progress} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      {training.certificationObtained ? (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-xs">
                            Obtenue le {new Date(training.certificationDate!).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span className="text-xs">Non obtenue</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FileText className="h-4 w-4" />
                        </Button>
                        {training.certificationObtained && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 dark:text-green-400">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {(selectedEmployee === null && filteredEmployees.length === 0) && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Aucun employé ne correspond à votre recherche.
        </div>
      )}
      
      {(selectedEmployee !== null && filteredTrainings.length === 0) && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Aucune formation ne correspond à votre recherche.
        </div>
      )}
    </div>
  );
}
