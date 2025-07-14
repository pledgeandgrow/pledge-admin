import { InvoiceStats as InvoiceStatsType } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Receipt,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Wallet,
  EuroIcon,
  AlertOctagon,
  LucideIcon
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";

interface InvoiceStatsProps {
  stats: InvoiceStatsType;
}

interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export function InvoiceStats({ stats }: InvoiceStatsProps) {
  // Ensure stats has default values if any properties are undefined
  const safeStats: InvoiceStatsType = {
    total_count: stats.total_count || 0,
    draft_count: stats.draft_count || 0,
    sent_count: stats.sent_count || 0,
    paid_count: stats.paid_count || 0,
    overdue_count: stats.overdue_count || 0,
    total_amount: stats.total_amount || 0,
    paid_amount: stats.paid_amount || 0,
    overdue_amount: stats.overdue_amount || 0,
    currency: stats.currency || "EUR"
  };
  
  const statItems: StatItem[] = [
    {
      label: "Total factures",
      value: safeStats.total_count,
      icon: Receipt,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Brouillons",
      value: safeStats.draft_count,
      icon: FileText,
      color: "text-gray-500",
      bgColor: "bg-gray-500/10",
    },
    {
      label: "Envoyées",
      value: safeStats.sent_count,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Payées",
      value: safeStats.paid_count,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "En retard",
      value: safeStats.overdue_count,
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      label: "Montant total",
      value: formatCurrency(safeStats.total_amount, safeStats.currency),
      icon: Wallet,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Montant payé",
      value: formatCurrency(safeStats.paid_amount, safeStats.currency),
      icon: EuroIcon,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Montant en retard",
      value: formatCurrency(safeStats.overdue_amount, safeStats.currency),
      icon: AlertOctagon,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <Card key={item.label}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div
                className={`${item.bgColor} ${item.color} p-2 rounded-lg`}
              >
                <item.icon className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
