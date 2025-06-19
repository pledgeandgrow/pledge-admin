import { Server } from "./types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ServerIcon, CheckCircleIcon, XCircleIcon, SettingsIcon } from "lucide-react";

interface ServerStatsProps {
  servers: Server[];
}

export function ServerStats({ servers }: ServerStatsProps) {
  const stats = {
    total: servers.length,
    online: servers.filter(s => s.status === "online").length,
    offline: servers.filter(s => s.status === "offline").length,
    maintenance: servers.filter(s => s.status === "maintenance").length,
    warning: servers.filter(s => s.status === "warning").length,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Serveurs</CardTitle>
          <ServerIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>

      <Card className="bg-green-500/5 border-green-500/20 dark:bg-green-500/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En ligne</CardTitle>
          <CheckCircleIcon className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.online}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.online / stats.total) * 100).toFixed(1)}% des serveurs
          </p>
        </CardContent>
      </Card>

      <Card className="bg-red-500/5 border-red-500/20 dark:bg-red-500/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hors ligne</CardTitle>
          <XCircleIcon className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.offline}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.offline / stats.total) * 100).toFixed(1)}% des serveurs
          </p>
        </CardContent>
      </Card>

      <Card className="bg-yellow-500/5 border-yellow-500/20 dark:bg-yellow-500/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
          <SettingsIcon className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.maintenance}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.maintenance / stats.total) * 100).toFixed(1)}% des serveurs
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
