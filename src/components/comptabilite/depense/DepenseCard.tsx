import { Depense } from "@/types/depense";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Tag,
  User,
  Building,
  Briefcase,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format";

interface DepenseCardProps {
  depense: Depense;
  onClick?: () => void;
}

export function DepenseCard({ depense, onClick }: DepenseCardProps) {
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "approuve":
        return {
          label: "Approuvé",
          icon: CheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-500/5",
          borderColor: "border-green-500/20",
        };
      case "refuse":
        return {
          label: "Refusé",
          icon: XCircle,
          color: "text-red-500",
          bgColor: "bg-red-500/5",
          borderColor: "border-red-500/20",
        };
      case "en_attente":
        return {
          label: "En attente",
          icon: Clock,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/5",
          borderColor: "border-yellow-500/20",
        };
      case "rembourse":
        return {
          label: "Remboursé",
          icon: CreditCard,
          color: "text-blue-500",
          bgColor: "bg-blue-500/5",
          borderColor: "border-blue-500/20",
        };
      default:
        return {
          label: status || "En attente",
          icon: Clock,
          color: "text-gray-500",
          bgColor: "bg-gray-500/5",
          borderColor: "border-gray-500/20",
        };
    }
  };

  const statusDetails = getStatusDetails(depense.statut);
  const StatusIcon = statusDetails.icon;

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
            <CreditCard className="h-5 w-5" />
            <h3 className="font-semibold truncate">{depense.description}</h3>
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
            <Tag className="h-3 w-3" />
            {depense.categorie}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {depense.beneficiaire}
          </Badge>
          {depense.projet_nom && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              {depense.projet_nom}
            </Badge>
          )}
          {depense.mission_nom && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {depense.mission_nom}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Montant</p>
            <p className="font-semibold">
              {formatCurrency(depense.montant)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(depense.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Mode de paiement: {depense.mode_paiement}</p>
        </div>
      </CardContent>
    </Card>
  );
}
