import { Server } from "./types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  ServerIcon,
  CpuIcon,
  CircleIcon,
  HardDriveIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  SettingsIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ServerDetailsDialogProps {
  server: Server | null;
  onOpenChange: (open: boolean) => void;
}

export function ServerDetailsDialog({ server, onOpenChange }: ServerDetailsDialogProps) {
  if (!server) return null;

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "online":
        return {
          label: "En ligne",
          icon: CheckCircleIcon,
          color: "text-green-500",
        };
      case "offline":
        return {
          label: "Hors ligne",
          icon: XCircleIcon,
          color: "text-red-500",
        };
      case "maintenance":
        return {
          label: "Maintenance",
          icon: SettingsIcon,
          color: "text-yellow-500",
        };
      case "warning":
        return {
          label: "Avertissement",
          icon: AlertTriangleIcon,
          color: "text-orange-500",
        };
      default:
        return {
          label: status,
          icon: CircleIcon,
          color: "text-gray-500",
        };
    }
  };

  const statusDetails = getStatusDetails(server.status);
  const StatusIcon = statusDetails.icon;

  return (
    <Dialog open={!!server} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ServerIcon className="h-4 w-4" />
              {server.name}
            </span>
            <Badge 
              variant="outline"
              className={cn(
                "flex items-center gap-1",
                statusDetails.color
              )}
            >
              <StatusIcon className="h-3 w-3" />
              {statusDetails.label}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-1 text-sm">IP</h4>
                <p className="text-sm text-muted-foreground">{server.ip_address}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1 text-sm">Type</h4>
                <p className="text-sm text-muted-foreground">{server.type}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium mb-1 text-sm">Description</h4>
              <p className="text-sm text-muted-foreground">{server.description}</p>
            </div>

            {/* System Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-1 text-sm">Système d&apos;exploitation</h4>
                <p className="text-sm text-muted-foreground">{server.os}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1 text-sm">Localisation</h4>
                <p className="text-sm text-muted-foreground">{server.location}</p>
              </div>
            </div>

            {/* Metrics */}
            <div>
              <h4 className="font-medium mb-3 text-sm">Métriques système</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5">
                      <CpuIcon className="h-4 w-4" />
                      <span>Processeur</span>
                    </div>
                    <span>{server.metrics.cpu_usage}%</span>
                  </div>
                  <Progress 
                    value={server.metrics.cpu_usage} 
                    className="h-2"
                    indicatorClassName={cn(
                      server.metrics.cpu_usage > 90 ? "bg-red-500" :
                      server.metrics.cpu_usage > 70 ? "bg-yellow-500" :
                      "bg-green-500"
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5">
                      <CircleIcon className="h-4 w-4" />
                      <span>Mémoire</span>
                    </div>
                    <span>{server.metrics.memory_usage}%</span>
                  </div>
                  <Progress 
                    value={server.metrics.memory_usage} 
                    className="h-2"
                    indicatorClassName={cn(
                      server.metrics.memory_usage > 90 ? "bg-red-500" :
                      server.metrics.memory_usage > 70 ? "bg-yellow-500" :
                      "bg-green-500"
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5">
                      <HardDriveIcon className="h-4 w-4" />
                      <span>Espace disque</span>
                    </div>
                    <span>{server.metrics.disk_usage}%</span>
                  </div>
                  <Progress 
                    value={server.metrics.disk_usage} 
                    className="h-2"
                    indicatorClassName={cn(
                      server.metrics.disk_usage > 90 ? "bg-red-500" :
                      server.metrics.disk_usage > 70 ? "bg-yellow-500" :
                      "bg-green-500"
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Maintenance */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-1 text-sm flex items-center gap-1.5">
                  <CalendarIcon className="h-4 w-4" />
                  Dernière maintenance
                </h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(server.last_maintenance).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1 text-sm flex items-center gap-1.5">
                  <CalendarIcon className="h-4 w-4" />
                  Prochaine maintenance
                </h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(server.next_maintenance).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-medium mb-2 text-sm">Services actifs</h4>
              <div className="flex flex-wrap gap-2">
                {server.services.map((service, index) => (
                  <Badge key={index} variant="secondary">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
