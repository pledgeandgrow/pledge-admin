'use client';

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Employee } from './ListeEmployes';
import { Departement } from './ListeDepartements';
import { 
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from 'lucide-react';

interface StaffStatisticsProps {
  employes: Employee[];
  departements: Departement[];
}

const StaffStatistics: React.FC<StaffStatisticsProps> = ({ employes, departements }) => {
  // Calculate statistics
  const totalEmployees = employes.length;
  const averagePerformance = employes.reduce((acc, emp) => acc + emp.performance.noteAnnuelle, 0) / totalEmployees || 0;
  
  // Calculate tenure statistics
  const currentDate = new Date();
  const tenureData = employes.map(emp => {
    const hireDate = new Date(emp.dateEmbauche);
    const tenureMonths = (currentDate.getFullYear() - hireDate.getFullYear()) * 12 + 
                         (currentDate.getMonth() - hireDate.getMonth());
    return {
      ...emp,
      tenureMonths
    };
  });
  
  const averageTenureMonths = tenureData.reduce((acc, emp) => acc + emp.tenureMonths, 0) / totalEmployees || 0;
  
  // Department distribution data for pie chart
  const departmentDistribution = departements
    .filter(dept => dept.effectif > 0)
    .map(dept => ({
      name: dept.nom,
      value: dept.effectif
    }));
  
  // Performance distribution
  const performanceRanges = [
    { range: '0-4', count: 0 },
    { range: '4-6', count: 0 },
    { range: '6-8', count: 0 },
    { range: '8-10', count: 0 }
  ];
  
  employes.forEach(emp => {
    const score = emp.performance.noteAnnuelle;
    if (score >= 0 && score < 4) performanceRanges[0].count++;
    else if (score >= 4 && score < 6) performanceRanges[1].count++;
    else if (score >= 6 && score < 8) performanceRanges[2].count++;
    else if (score >= 8 && score <= 10) performanceRanges[3].count++;
  });
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Check if we have data for charts
  const hasDepartmentData = departmentDistribution.length > 0;
  const hasPerformanceData = performanceRanges.some(range => range.count > 0);
  
  return (
    <div className="space-y-6">
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Effectif Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Répartis sur {departements.filter(d => d.effectif > 0).length} départements
            </p>
          </CardContent>
        </Card>
        
        <Card className="border dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Performance Moyenne</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{averagePerformance.toFixed(1)}/10</div>
            <Progress value={averagePerformance * 10} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card className="border dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Ancienneté Moyenne</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{Math.floor(averageTenureMonths / 12)} ans {Math.round(averageTenureMonths % 12)} mois</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Basé sur les dates d'embauche
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 dark:text-white">Répartition par Département</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Distribution des employés par département</CardDescription>
            </div>
            <PieChartIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {hasDepartmentData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '6px', border: 'none' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  Aucune donnée disponible pour afficher le graphique
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 dark:text-white">Distribution des Performances</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Nombre d'employés par niveau de performance</CardDescription>
            </div>
            <BarChartIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {hasPerformanceData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceRanges}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                    <XAxis dataKey="range" tick={{ fill: 'var(--foreground)' }} />
                    <YAxis tick={{ fill: 'var(--foreground)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '6px', border: 'none' }} />
                    <Bar dataKey="count" fill="#8884d8" name="Nombre d'employés" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  Aucune donnée disponible pour afficher le graphique
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top performers */}
      <Card className="border dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-gray-900 dark:text-white">Top Performers</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">Employés avec les meilleures évaluations</CardDescription>
          </div>
          <Award className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {employes.filter(emp => emp.performance.noteAnnuelle > 0).length > 0 ? (
            <div className="space-y-4">
              {employes
                .filter(emp => emp.performance.noteAnnuelle > 0)
                .sort((a, b) => b.performance.noteAnnuelle - a.performance.noteAnnuelle)
                .slice(0, 5)
                .map((emp, index) => (
                  <div key={emp.id} className="flex items-center space-x-4">
                    <div className="relative w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      {emp.photo ? (
                        <img 
                          src={emp.photo} 
                          alt={`${emp.prenom} ${emp.nom}`} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                          {emp.prenom.charAt(0)}{emp.nom.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-gray-900 dark:text-white">
                        {emp.prenom} {emp.nom}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-gray-400 truncate">
                        {emp.poste} • {emp.departement}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      {emp.performance.noteAnnuelle.toFixed(1)}/10
                    </Badge>
                  </div>
                ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              Aucun employé n'a encore été évalué
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffStatistics;
