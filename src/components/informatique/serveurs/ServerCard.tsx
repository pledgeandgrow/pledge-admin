import { Server } from "./types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ServerIcon,
  CpuIcon,
  CircleIcon,
  HardDriveIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  SettingsIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ServerCardProps {
  server: Server;
  onClick?: () => void;
}

export function ServerCard({ server, onClick }: ServerCardProps) {
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "online":
        return {
          label: "En ligne",
          icon: CheckCircleIcon,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
        };
      case "offline":
        return {
          label: "Hors ligne",
          icon: XCircleIcon,
          color: "text-red-500",
          bgColor: "bg-red-500/10",
        };
      case "maintenance":
        return {
          label: "Maintenance",
          icon: SettingsIcon,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
        };
      case "warning":
        return {
          label: "Avertissement",
          icon: AlertTriangleIcon,
          color: "text-orange-500",
          bgColor: "bg-orange-500/10",
        };
      default:
        return {
          label: status,
          icon: CircleIcon,
          color: "text-gray-500",
          bgColor: "bg-gray-500/10",
        };
    }
  };

  const statusDetails = getStatusDetails(server.status);
  const StatusIcon = statusDetails.icon;

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all hover:shadow-lg",
        "border-border/50 hover:border-primary/50 cursor-pointer bg-card",
        statusDetails.bgColor
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary/5 group-hover:to-primary/10 transition-all" />
      
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={cn(
              "flex items-center gap-1 font-medium",
              statusDetails.color
            )}
          >
            <StatusIcon className="h-3 w-3" />
            {statusDetails.label}
          </Badge>
          <Badge variant="secondary">
            {server.type}
          </Badge>
        </div>
        
        <CardTitle className="text-lg flex items-center gap-2">
          <ServerIcon className="h-4 w-4" />
          {server.name}
        </CardTitle>
        
        <CardDescription className="flex items-center gap-2">
          <span>{server.ip_address}</span>
          <span className="text-xs">•</span>
          <span>{server.os}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Resource Usage */}
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <CpuIcon className="h-3.5 w-3.5" />
                  <span>CPU</span>
                </div>
                <span>{server.metrics.cpu_usage}%</span>
              </div>
              <Progress 
                value={server.metrics.cpu_usage} 
                className="h-1"
                indicatorClassName={cn(
                  server.metrics.cpu_usage > 90 ? "bg-red-500" :
                  server.metrics.cpu_usage > 70 ? "bg-yellow-500" :
                  "bg-green-500"
                )}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <CircleIcon className="h-3.5 w-3.5" />
                  <span>Mémoire</span>
                </div>
                <span>{server.metrics.memory_usage}%</span>
              </div>
              <Progress 
                value={server.metrics.memory_usage} 
                className="h-1"
                indicatorClassName={cn(
                  server.metrics.memory_usage > 90 ? "bg-red-500" :
                  server.metrics.memory_usage > 70 ? "bg-yellow-500" :
                  "bg-green-500"
                )}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <HardDriveIcon className="h-3.5 w-3.5" />
                  <span>Disque</span>
                </div>
                <span>{server.metrics.disk_usage}%</span>
              </div>
              <Progress 
                value={server.metrics.disk_usage} 
                className="h-1"
                indicatorClassName={cn(
                  server.metrics.disk_usage > 90 ? "bg-red-500" :
                  server.metrics.disk_usage > 70 ? "bg-yellow-500" :
                  "bg-green-500"
                )}
              />
            </div>
          </div>

          {/* Server Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ClockIcon className="h-3.5 w-3.5" />
              <span>Uptime: {Math.floor(server.metrics.uptime / 3600)}h</span>
            </div>
            <span>{server.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
