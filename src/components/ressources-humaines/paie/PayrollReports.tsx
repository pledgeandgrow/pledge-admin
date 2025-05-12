'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Filter, Calendar, BarChart, PieChart, DollarSign } from 'lucide-react';

interface PayrollReport {
  id: string;
  title: string;
  period: string;
  generatedDate: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'custom';
  status: 'generated' | 'processing' | 'scheduled';
  fileSize?: string;
  downloadUrl?: string;
}

export function PayrollReports() {
  const [yearFilter, setYearFilter] = useState('2025');
  const [typeFilter, setTypeFilter] = useState('all');

  // Sample data
  const payrollReports: PayrollReport[] = [
    {
      id: 'PR-2025-02',
      title: 'Rapport de paie mensuel',
      period: 'Février 2025',
      generatedDate: '2025-02-25',
      type: 'monthly',
      status: 'generated',
      fileSize: '2.4 MB',
      downloadUrl: '/reports/payroll-feb-2025.pdf'
    },
    {
      id: 'PR-2025-01',
      title: 'Rapport de paie mensuel',
      period: 'Janvier 2025',
      generatedDate: '2025-01-25',
      type: 'monthly',
      status: 'generated',
      fileSize: '2.3 MB',
      downloadUrl: '/reports/payroll-jan-2025.pdf'
    },
    {
      id: 'PR-2024-Q4',
      title: 'Rapport de paie trimestriel',
      period: 'Q4 2024',
      generatedDate: '2025-01-10',
      type: 'quarterly',
      status: 'generated',
      fileSize: '4.8 MB',
      downloadUrl: '/reports/payroll-q4-2024.pdf'
    },
    {
      id: 'PR-2024-12',
      title: 'Rapport de paie mensuel',
      period: 'Décembre 2024',
      generatedDate: '2024-12-25',
      type: 'monthly',
      status: 'generated',
      fileSize: '2.5 MB',
      downloadUrl: '/reports/payroll-dec-2024.pdf'
    },
    {
      id: 'PR-2024-11',
      title: 'Rapport de paie mensuel',
      period: 'Novembre 2024',
      generatedDate: '2024-11-25',
      type: 'monthly',
      status: 'generated',
      fileSize: '2.2 MB',
      downloadUrl: '/reports/payroll-nov-2024.pdf'
    },
    {
      id: 'PR-2024-ANNUAL',
      title: 'Rapport de paie annuel',
      period: 'Année 2024',
      generatedDate: '2025-01-15',
      type: 'annual',
      status: 'generated',
      fileSize: '8.7 MB',
      downloadUrl: '/reports/payroll-annual-2024.pdf'
    },
    {
      id: 'PR-2025-03',
      title: 'Rapport de paie mensuel',
      period: 'Mars 2025',
      generatedDate: '2025-03-25',
      type: 'monthly',
      status: 'scheduled'
    },
    {
      id: 'PR-2025-Q1',
      title: 'Rapport de paie trimestriel',
      period: 'Q1 2025',
      generatedDate: '2025-04-10',
      type: 'quarterly',
      status: 'scheduled'
    }
  ];

  // Filter reports based on year and type
  const filteredReports = payrollReports.filter(report => {
    const matchesYear = report.period.includes(yearFilter);
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    return matchesYear && matchesType;
  });

  return (
    <div className="space-y-8">
      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reports">Rapports de paie</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
          <TabsTrigger value="tax">Déclarations fiscales</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports" className="space-y-6">
          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Rapports de paie
              </CardTitle>
              <CardDescription>
                Consultez et téléchargez les rapports de paie générés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="w-full md:w-48">
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Année: {yearFilter}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-48">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>
                          {typeFilter === 'all' && 'Tous les types'}
                          {typeFilter === 'monthly' && 'Mensuel'}
                          {typeFilter === 'quarterly' && 'Trimestriel'}
                          {typeFilter === 'annual' && 'Annuel'}
                          {typeFilter === 'custom' && 'Personnalisé'}
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                      <SelectItem value="quarterly">Trimestriel</SelectItem>
                      <SelectItem value="annual">Annuel</SelectItem>
                      <SelectItem value="custom">Personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 md:text-right">
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Générer un nouveau rapport
                  </Button>
                </div>
              </div>

              <div className="rounded-md border dark:border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-100 dark:bg-gray-800">
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Titre</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Date de génération</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Taille</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <TableRow key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                          <TableCell className="font-medium">{report.id}</TableCell>
                          <TableCell>{report.title}</TableCell>
                          <TableCell>{report.period}</TableCell>
                          <TableCell>
                            {new Date(report.generatedDate).toLocaleDateString('fr-FR')}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                report.type === 'monthly'
                                  ? 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400'
                                  : report.type === 'quarterly'
                                  ? 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400'
                                  : report.type === 'annual'
                                  ? 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400'
                                  : 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-400'
                              }
                            >
                              {report.type === 'monthly' && 'Mensuel'}
                              {report.type === 'quarterly' && 'Trimestriel'}
                              {report.type === 'annual' && 'Annuel'}
                              {report.type === 'custom' && 'Personnalisé'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                report.status === 'generated'
                                  ? 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400'
                                  : report.status === 'processing'
                                  ? 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400'
                                  : 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400'
                              }
                            >
                              {report.status === 'generated' && 'Généré'}
                              {report.status === 'processing' && 'En cours'}
                              {report.status === 'scheduled' && 'Planifié'}
                            </Badge>
                          </TableCell>
                          <TableCell>{report.fileSize || '-'}</TableCell>
                          <TableCell className="text-right">
                            {report.status === 'generated' ? (
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Télécharger
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" disabled>
                                <Download className="h-4 w-4 mr-2" />
                                Indisponible
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-gray-500 dark:text-gray-400">
                          Aucun rapport trouvé avec les critères de filtrage actuels.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t dark:border-gray-700 px-6 py-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Affichage de {filteredReports.length} rapports
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter la liste
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Analyses de paie
              </CardTitle>
              <CardDescription>
                Visualisez les tendances et analyses des données de paie
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-50 dark:bg-gray-800/50 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-blue-500" />
                      Tendances salariales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Visualisez l'évolution des salaires sur différentes périodes.
                    </p>
                    <Button variant="outline" className="w-full mt-4">
                      Voir les tendances
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50 dark:bg-gray-800/50 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-purple-500" />
                      Répartition par département
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Analysez la répartition des salaires par département.
                    </p>
                    <Button variant="outline" className="w-full mt-4">
                      Voir la répartition
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50 dark:bg-gray-800/50 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      Analyse des coûts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Évaluez les coûts salariaux et identifiez les opportunités d'optimisation.
                    </p>
                    <Button variant="outline" className="w-full mt-4">
                      Voir l'analyse
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border dark:border-gray-700 text-center shadow-sm hover:shadow-md transition-shadow">
                <BarChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Analyses avancées disponibles
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Des analyses plus détaillées sont disponibles dans le module d'analyse de données.
                </p>
                <Button>
                  Accéder aux analyses avancées
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tax" className="space-y-6">
          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Déclarations fiscales
              </CardTitle>
              <CardDescription>
                Gérez les déclarations fiscales liées à la paie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  Cette section est en cours de développement. Les fonctionnalités de gestion des déclarations fiscales seront bientôt disponibles.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-50 dark:bg-gray-800/50 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Déclarations sociales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Gérez les déclarations sociales mensuelles et trimestrielles.
                    </p>
                    <Button variant="outline" className="w-full mt-4" disabled>
                      Bientôt disponible
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50 dark:bg-gray-800/50 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Déclarations fiscales annuelles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Préparez et soumettez les déclarations fiscales annuelles.
                    </p>
                    <Button variant="outline" className="w-full mt-4" disabled>
                      Bientôt disponible
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
