import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BanknoteIcon,
  CheckCircle2,
  Clock,
  CreditCard,
  XCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";
import { Data } from "@/types/data";

export interface DepenseStatsType {
  total_count: number;
  total_amount: number;
  approved_count: number;
  approved_amount: number;
  pending_count: number;
  pending_amount: number;
  refused_count: number;
  reimbursed_count: number;
  reimbursed_amount: number;
}

interface DepenseStatsProps {
  stats: DepenseStatsType;
}

// Helper function to calculate stats from Data array
export function calculateDepenseStats(depenses: Data[]): DepenseStatsType {
  const initialStats: DepenseStatsType = {
    total_count: 0,
    total_amount: 0,
    approved_count: 0,
    approved_amount: 0,
    pending_count: 0,
    pending_amount: 0,
    refused_count: 0,
    reimbursed_count: 0,
    reimbursed_amount: 0
  };
  
  return depenses.reduce((stats, depense) => {
    const montant = depense.metadata?.montant as number || 0;
    const statut = depense.metadata?.statut as string || 'en_attente';
    
    stats.total_count++;
    stats.total_amount += montant;
    
    switch (statut) {
      case 'approuve':
        stats.approved_count++;
        stats.approved_amount += montant;
        break;
      case 'en_attente':
        stats.pending_count++;
        stats.pending_amount += montant;
        break;
      case 'refuse':
        stats.refused_count++;
        break;
      case 'rembourse':
        stats.reimbursed_count++;
        stats.reimbursed_amount += montant;
        break;
    }
    
    return stats;
  }, initialStats);
}

export function DepenseStats({ stats }: DepenseStatsProps) {
  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    className = "",
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    description?: string;
    className?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${className}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Aperçu</TabsTrigger>
        <TabsTrigger value="details">Détails</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total des dépenses"
            value={stats.total_count}
            icon={CreditCard}
            description={`Montant total: ${formatCurrency(stats.total_amount)}`}
          />
          <StatCard
            title="Dépenses approuvées"
            value={stats.approved_count}
            icon={CheckCircle2}
            description={`Montant: ${formatCurrency(stats.approved_amount)}`}
            className="text-green-500"
          />
          <StatCard
            title="Dépenses remboursées"
            value={stats.reimbursed_count}
            icon={BanknoteIcon}
            description={`Montant: ${formatCurrency(stats.reimbursed_amount)}`}
            className="text-blue-500"
          />
          <StatCard
            title="Dépenses en attente"
            value={stats.pending_count}
            icon={Clock}
            description={`Montant: ${formatCurrency(stats.pending_amount)}`}
            className="text-yellow-500"
          />
        </div>
      </TabsContent>

      <TabsContent value="details" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Dépenses en attente"
            value={stats.pending_count}
            icon={Clock}
            description={`Montant: ${formatCurrency(stats.pending_amount)}`}
            className="text-yellow-500"
          />
          <StatCard
            title="Dépenses approuvées"
            value={stats.approved_count}
            icon={CheckCircle2}
            description={`Montant: ${formatCurrency(stats.approved_amount)}`}
            className="text-green-500"
          />
          <StatCard
            title="Dépenses refusées"
            value={stats.refused_count}
            icon={XCircle}
            description="Dépenses rejetées"
            className="text-red-500"
          />
          <StatCard
            title="Dépenses remboursées"
            value={stats.reimbursed_count}
            icon={BanknoteIcon}
            description={`Montant: ${formatCurrency(stats.reimbursed_amount)}`}
            className="text-blue-500"
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Dépenses par statut</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span>En attente</span>
                  </div>
                  <span className="font-medium">{Math.round((stats.pending_count / stats.total_count) * 100)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Approuvées</span>
                  </div>
                  <span className="font-medium">{Math.round((stats.approved_count / stats.total_count) * 100)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>Refusées</span>
                  </div>
                  <span className="font-medium">{Math.round((stats.refused_count / stats.total_count) * 100)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BanknoteIcon className="h-4 w-4 text-blue-500" />
                    <span>Remboursées</span>
                  </div>
                  <span className="font-medium">{Math.round((stats.reimbursed_count / stats.total_count) * 100)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Montant moyen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  stats.total_count > 0
                    ? stats.total_amount / stats.total_count
                    : 0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Montant moyen par dépense
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
