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
import { Search, Edit, Download, Filter, Plus, Star, FileText, Eye } from 'lucide-react';

interface EmployeeEvaluation {
  id: number;
  employeeId: number;
  employeeName: string;
  employeePhoto: string;
  employeeDepartment: string;
  employeePosition: string;
  evaluationPeriod: string;
  evaluationDate: string;
  overallScore: number;
  performanceAreas: {
    name: string;
    score: number;
  }[];
  status: 'completed' | 'in_progress' | 'scheduled';
  evaluator: string;
  comments: string;
}

export function EmployeeEvaluations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showEvaluationDialog, setShowEvaluationDialog] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<EmployeeEvaluation | null>(null);

  // Sample data
  const employeeEvaluations: EmployeeEvaluation[] = [
    {
      id: 1,
      employeeId: 101,
      employeeName: 'Sophie Martin',
      employeePhoto: '/avatars/sophie.jpg',
      employeeDepartment: 'Technologie',
      employeePosition: 'Développeur Senior',
      evaluationPeriod: 'Q1 2025',
      evaluationDate: '2025-03-15',
      overallScore: 8.5,
      performanceAreas: [
        { name: 'Qualité du travail', score: 9.0 },
        { name: 'Productivité', score: 8.5 },
        { name: 'Communication', score: 8.0 },
        { name: 'Travail d\'équipe', score: 8.5 }
      ],
      status: 'completed',
      evaluator: 'Thomas Dubois',
      comments: 'Excellente performance globale. A dépassé les attentes sur plusieurs projets clés.'
    },
    {
      id: 2,
      employeeId: 102,
      employeeName: 'Thomas Dubois',
      employeePhoto: '/avatars/thomas.jpg',
      employeeDepartment: 'Marketing',
      employeePosition: 'Responsable Marketing',
      evaluationPeriod: 'Q1 2025',
      evaluationDate: '2025-03-10',
      overallScore: 7.8,
      performanceAreas: [
        { name: 'Qualité du travail', score: 8.0 },
        { name: 'Productivité', score: 7.5 },
        { name: 'Communication', score: 8.0 },
        { name: 'Leadership', score: 7.5 }
      ],
      status: 'completed',
      evaluator: 'Emma Leroy',
      comments: 'Bonne performance globale. A atteint la plupart des objectifs fixés.'
    },
    {
      id: 3,
      employeeId: 103,
      employeeName: 'Léa Bernard',
      employeePhoto: '/avatars/lea.jpg',
      employeeDepartment: 'Commercial',
      employeePosition: 'Responsable Commercial',
      evaluationPeriod: 'Q1 2025',
      evaluationDate: '2025-03-20',
      overallScore: 8.2,
      performanceAreas: [
        { name: 'Qualité du travail', score: 8.0 },
        { name: 'Productivité', score: 8.5 },
        { name: 'Communication', score: 8.0 },
        { name: 'Leadership', score: 8.0 }
      ],
      status: 'in_progress',
      evaluator: 'Lucas Petit',
      comments: 'Évaluation en cours...'
    },
    {
      id: 4,
      employeeId: 104,
      employeeName: 'Lucas Petit',
      employeePhoto: '/avatars/lucas.jpg',
      employeeDepartment: 'Ressources Humaines',
      employeePosition: 'Responsable RH',
      evaluationPeriod: 'Q1 2025',
      evaluationDate: '2025-03-25',
      overallScore: 0,
      performanceAreas: [],
      status: 'scheduled',
      evaluator: 'Emma Leroy',
      comments: ''
    },
    {
      id: 5,
      employeeId: 105,
      employeeName: 'Emma Leroy',
      employeePhoto: '/avatars/emma.jpg',
      employeeDepartment: 'Finance',
      employeePosition: 'Comptable',
      evaluationPeriod: 'Q1 2025',
      evaluationDate: '2025-03-18',
      overallScore: 7.5,
      performanceAreas: [
        { name: 'Qualité du travail', score: 7.5 },
        { name: 'Productivité', score: 7.0 },
        { name: 'Communication', score: 7.5 },
        { name: 'Précision', score: 8.0 }
      ],
      status: 'completed',
      evaluator: 'Thomas Dubois',
      comments: 'Performance satisfaisante. Quelques points à améliorer en termes de productivité.'
    }
  ];

  // Get score color class
  const getScoreColorClass = (score: number) => {
    if (score >= 8.0) return 'text-green-500 dark:text-green-400';
    if (score >= 7.0) return 'text-blue-500 dark:text-blue-400';
    if (score >= 6.0) return 'text-amber-500 dark:text-amber-400';
    return 'text-red-500 dark:text-red-400';
  };

  // Get status badge class and text
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          class: 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400',
          text: 'Complété'
        };
      case 'in_progress':
        return {
          class: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400',
          text: 'En cours'
        };
      case 'scheduled':
        return {
          class: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400',
          text: 'Planifié'
        };
      default:
        return {
          class: 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-400',
          text: status
        };
    }
  };

  // Filter evaluations based on search term, department and status
  const filteredEvaluations = employeeEvaluations.filter(evaluation => {
    const matchesSearch = evaluation.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluation.employeePosition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || evaluation.employeeDepartment === filterDepartment;
    const matchesStatus = filterStatus === 'all' || evaluation.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Handle view evaluation details
  const handleViewEvaluation = (evaluation: EmployeeEvaluation) => {
    setSelectedEvaluation(evaluation);
    setShowEvaluationDialog(true);
  };

  return (
    <div className="space-y-8">
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Évaluations des employés
          </CardTitle>
          <CardDescription>
            Consultez et gérez les évaluations de performance des employés
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
            <div className="w-full md:w-48">
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
            <div className="w-full md:w-48">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>
                      {filterStatus === 'all' && 'Tous les statuts'}
                      {filterStatus === 'completed' && 'Complété'}
                      {filterStatus === 'in_progress' && 'En cours'}
                      {filterStatus === 'scheduled' && 'Planifié'}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="completed">Complété</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="scheduled">Planifié</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle évaluation
            </Button>
          </div>

          <div className="rounded-md border dark:border-gray-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-100 dark:bg-gray-800">
                <TableRow>
                  <TableHead className="w-[250px]">Employé</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Date d'évaluation</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Évaluateur</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvaluations.length > 0 ? (
                  filteredEvaluations.map((evaluation) => (
                    <TableRow key={evaluation.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={evaluation.employeePhoto} alt={evaluation.employeeName} />
                            <AvatarFallback>{evaluation.employeeName.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{evaluation.employeeName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{evaluation.employeePosition}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{evaluation.employeeDepartment}</TableCell>
                      <TableCell>{evaluation.evaluationPeriod}</TableCell>
                      <TableCell>{new Date(evaluation.evaluationDate).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        {evaluation.status !== 'scheduled' ? (
                          <div className="flex items-center gap-1">
                            <span className={`font-semibold ${getScoreColorClass(evaluation.overallScore)}`}>
                              {evaluation.overallScore.toFixed(1)}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">/10</span>
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(evaluation.status).class}>
                          {getStatusBadge(evaluation.status).text}
                        </Badge>
                      </TableCell>
                      <TableCell>{evaluation.evaluator}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewEvaluation(evaluation)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {evaluation.status !== 'completed' && (
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {evaluation.status === 'completed' && (
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-gray-500 dark:text-gray-400">
                      Aucune évaluation trouvée avec les critères de recherche actuels.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t dark:border-gray-700 px-6 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Affichage de {filteredEvaluations.length} évaluations sur {employeeEvaluations.length}
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </CardFooter>
      </Card>

      {/* Evaluation Details Dialog */}
      <Dialog open={showEvaluationDialog} onOpenChange={setShowEvaluationDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Détails de l'évaluation - {selectedEvaluation?.employeeName}
            </DialogTitle>
            <DialogDescription>
              Période d'évaluation: {selectedEvaluation?.evaluationPeriod}
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvaluation && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedEvaluation.employeePhoto} alt={selectedEvaluation.employeeName} />
                  <AvatarFallback>{selectedEvaluation.employeeName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedEvaluation.employeeName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedEvaluation.employeePosition} - {selectedEvaluation.employeeDepartment}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusBadge(selectedEvaluation.status).class}>
                      {getStatusBadge(selectedEvaluation.status).text}
                    </Badge>
                    {selectedEvaluation.status !== 'scheduled' && (
                      <div className="flex items-center gap-1">
                        <Star className={`h-4 w-4 ${getScoreColorClass(selectedEvaluation.overallScore)}`} />
                        <span className={`font-semibold ${getScoreColorClass(selectedEvaluation.overallScore)}`}>
                          {selectedEvaluation.overallScore.toFixed(1)}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">/10</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedEvaluation.status !== 'scheduled' && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Domaines de performance</h4>
                    <div className="space-y-4">
                      {selectedEvaluation.performanceAreas.map((area, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{area.name}</span>
                            <span className={`text-sm font-medium ${getScoreColorClass(area.score)}`}>
                              {area.score.toFixed(1)}/10
                            </span>
                          </div>
                          <Progress value={(area.score / 10) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Commentaires</h4>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md border dark:border-gray-700">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {selectedEvaluation.comments || 'Aucun commentaire disponible.'}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <div>Évaluateur: {selectedEvaluation.evaluator}</div>
                <div>Date: {new Date(selectedEvaluation.evaluationDate).toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {selectedEvaluation?.status === 'completed' && (
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Télécharger le rapport
              </Button>
            )}
            {selectedEvaluation?.status !== 'completed' && (
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
            <Button onClick={() => setShowEvaluationDialog(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
