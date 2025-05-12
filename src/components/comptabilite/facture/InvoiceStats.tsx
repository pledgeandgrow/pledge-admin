import { InvoiceStats } from "./types";
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
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";

interface InvoiceStatsProps {
  stats: InvoiceStats;
}

export function InvoiceStats({ stats }: InvoiceStatsProps) {
  const statItems = [
    {
      label: "Total factures",
      value: stats.total_count,
      icon: Receipt,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Brouillons",
      value: stats.draft_count,
      icon: FileText,
      color: "text-gray-500",
      bgColor: "bg-gray-500/10",
    },
    {
      label: "Envoyées",
      value: stats.sent_count,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Payées",
      value: stats.paid_count,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "En retard",
      value: stats.overdue_count,
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      label: "Montant total",
      value: formatCurrency(stats.total_amount, stats.currency),
      icon: Wallet,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Montant payé",
      value: formatCurrency(stats.paid_amount, stats.currency),
      icon: EuroIcon,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Montant en retard",
      value: formatCurrency(stats.overdue_amount, stats.currency),
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
