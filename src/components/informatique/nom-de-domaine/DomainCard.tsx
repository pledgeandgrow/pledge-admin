import { DomainName } from "./types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe2,
  Shield,
  Mail,
  Calendar,
  Server,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DomainCardProps {
  domain: DomainName;
  onClick?: () => void;
}

export function DomainCard({ domain, onClick }: DomainCardProps) {
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "active":
        return {
          label: "Actif",
          color: "text-green-500",
          bgColor: "bg-green-500/5",
          borderColor: "border-green-500/20",
        };
      case "expired":
        return {
          label: "Expiré",
          color: "text-red-500",
          bgColor: "bg-red-500/5",
          borderColor: "border-red-500/20",
        };
      case "expiring_soon":
        return {
          label: "Expiration proche",
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/5",
          borderColor: "border-yellow-500/20",
        };
      case "transferred":
        return {
          label: "Transféré",
          color: "text-blue-500",
          bgColor: "bg-blue-500/5",
          borderColor: "border-blue-500/20",
        };
      default:
        return {
          label: status,
          color: "text-gray-500",
          bgColor: "bg-gray-500/5",
          borderColor: "border-gray-500/20",
        };
    }
  };

  const statusDetails = getStatusDetails(domain.status);
  const daysUntilExpiration = Math.ceil(
    (new Date(domain.expiration_date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

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
            <Globe2 className="h-5 w-5" />
            <h3 className="font-semibold">{domain.name}</h3>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-1 font-medium",
              statusDetails.color,
              statusDetails.borderColor
            )}
          >
            {statusDetails.label}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {domain.services.ssl && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              SSL
            </Badge>
          )}
          {domain.services.email && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              Email
            </Badge>
          )}
          {domain.services.web_hosting && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Server className="h-3 w-3" />
              Hébergement
            </Badge>
          )}
          {domain.auto_renew && (
            <Badge variant="outline" className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              Renouvellement auto
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Registrar</p>
            <p className="font-medium">{domain.registrar}</p>
          </div>
          <div>
            <p className="text-muted-foreground">DNS Provider</p>
            <p className="font-medium">{domain.dns_provider}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              Expire le {new Date(domain.expiration_date).toLocaleDateString()}
            </span>
          </div>
          {daysUntilExpiration <= 30 && daysUntilExpiration > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {daysUntilExpiration} jours restants
            </Badge>
          )}
        </div>

        {domain.project_name && (
          <div className="text-sm">
            <p className="text-muted-foreground">Projet associé</p>
            <p className="font-medium">{domain.project_name}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
