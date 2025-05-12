'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Calendar, Users, FileText, TrendingUp, Clock } from 'lucide-react';

export function PayrollDashboard() {
  // Sample data for the payroll dashboard
  const payrollData = {
    totalSalaries: 245000,
    averageSalary: 3500,
    totalEmployees: 70,
    payrollCycle: 'Mensuel',
    nextPaymentDate: '2025-03-25',
    payrollBudgetUtilization: 83,
    departmentBreakdown: [
      { department: 'Technologie', amount: 85000, employees: 20 },
      { department: 'Marketing', amount: 45000, employees: 12 },
      { department: 'Commercial', amount: 55000, employees: 15 },
      { department: 'Ressources Humaines', amount: 30000, employees: 8 },
      { department: 'Finance', amount: 30000, employees: 7 }
    ],
    recentPayrolls: [
      { period: 'Février 2025', totalAmount: 245000, status: 'En préparation' },
      { period: 'Janvier 2025', totalAmount: 242000, status: 'Payé' },
      { period: 'Décembre 2024', totalAmount: 260000, status: 'Payé' },
      { period: 'Novembre 2024', totalAmount: 240000, status: 'Payé' }
    ]
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-lg">
              <DollarSign className="h-5 w-5 text-green-500" />
              Total Salaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(payrollData.totalSalaries)}
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Montant mensuel</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-lg">
              <Users className="h-5 w-5 text-blue-500" />
              Employés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{payrollData.totalEmployees}</div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Salariés actifs</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-lg">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Salaire Moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(payrollData.averageSalary)}
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Par employé</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-lg">
              <Calendar className="h-5 w-5 text-orange-500" />
              Prochain Paiement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {new Date(payrollData.nextPaymentDate).toLocaleDateString('fr-FR')}
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">{payrollData.payrollCycle}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Répartition par département
            </CardTitle>
            <CardDescription>Montant total des salaires par département</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {payrollData.departmentBreakdown.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{dept.department}</span>
                      <Badge className="ml-2 bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400">
                        {dept.employees} employés
                      </Badge>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(dept.amount)}
                    </span>
                  </div>
                  <Progress value={(dept.amount / payrollData.totalSalaries) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Historique des paies récentes
            </CardTitle>
            <CardDescription>Les 4 dernières périodes de paie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payrollData.recentPayrolls.map((payroll, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{payroll.period}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(payroll.totalAmount)}</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      payroll.status === 'Payé'
                        ? 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400'
                        : 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400'
                    }
                  >
                    {payroll.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Utilisation du budget de paie
          </CardTitle>
          <CardDescription>Progression par rapport au budget alloué</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Progression</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{payrollData.payrollBudgetUtilization}%</span>
            </div>
            <Progress value={payrollData.payrollBudgetUtilization} className="h-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              L'utilisation du budget de paie est actuellement à {payrollData.payrollBudgetUtilization}% du montant alloué pour l'année fiscale en cours.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
