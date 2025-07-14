import { Document } from "@/types/documents";
import type { QuoteMetadata } from "../devis/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Receipt,
  Building2,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format";

interface DevisCardProps {
  document: Document;
  onClick?: () => void;
}

export function DevisCard({ document, onClick }: DevisCardProps) {
  // Extract quote metadata from document - first convert to unknown to avoid type errors
  const metadata = document.metadata as unknown as Partial<QuoteMetadata>;
  
  // Ensure metadata exists and has required fields
  if (!metadata || !metadata.quote_number || !metadata.client) {
    return null;
  }
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "accepted":
        return {
          label: "Accepté",
          icon: CheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-500/5",
          borderColor: "border-green-500/20",
        };
      case "rejected":
        return {
          label: "Refusé",
          icon: XCircle,
          color: "text-red-500",
          bgColor: "bg-red-500/5",
          borderColor: "border-red-500/20",
        };
      case "sent":
        return {
          label: "Envoyé",
          icon: Clock,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/5",
          borderColor: "border-yellow-500/20",
        };
      case "draft":
        return {
          label: "Brouillon",
          icon: FileText,
          color: "text-blue-500",
          bgColor: "bg-blue-500/5",
          borderColor: "border-blue-500/20",
        };
      case "expired":
        return {
          label: "Expiré",
          icon: AlertTriangle,
          color: "text-gray-500",
          bgColor: "bg-gray-500/5",
          borderColor: "border-gray-500/20",
        };
      default:
        return {
          label: status || "Nouveau",
          icon: Receipt,
          color: "text-gray-500",
          bgColor: "bg-gray-500/5",
          borderColor: "border-gray-500/20",
        };
    }
  };

  const statusDetails = getStatusDetails(metadata.quote_status || "draft");
  const StatusIcon = statusDetails.icon;
  const dueDate = metadata.due_date ? new Date(metadata.due_date) : new Date();
  const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md cursor-pointer",
        statusDetails.bgColor,
        statusDetails.borderColor
      )}
      onClick={onClick}
    >
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            <h3 className="font-semibold">{metadata.quote_number}</h3>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-1 font-medium",
              statusDetails.color,
              statusDetails.borderColor
            )}
          >
            <StatusIcon className="h-3 w-3" />
            {statusDetails.label}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            {metadata.client?.name || 'Client'}
          </Badge>
          {metadata.project_name && (
            <Badge variant="outline">{metadata.project_name}</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Montant total</p>
            <p className="font-semibold">
              {formatCurrency(metadata.total || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date d&apos;échéance</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{dueDate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {(!metadata.quote_status || metadata.quote_status === "sent") && daysUntilDue <= 7 && daysUntilDue > 0 && (
          <div className="pt-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Expire dans {daysUntilDue} jour{daysUntilDue > 1 ? "s" : ""}
            </Badge>
          </div>
        )}

        {metadata.items && metadata.items.length > 0 && (
          <div className="pt-2 text-sm text-muted-foreground">
            {metadata.items.length} article{metadata.items.length > 1 ? "s" : ""}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
