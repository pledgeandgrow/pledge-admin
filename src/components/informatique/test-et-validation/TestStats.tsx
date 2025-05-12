import { Test } from "./types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface TestStatsProps {
  tests: Test[];
}

export function TestStats({ tests }: TestStatsProps) {
  const stats = {
    total: tests.length,
    passed: tests.filter(t => t.status === "passed").length,
    failed: tests.filter(t => t.status === "failed").length,
    pending: tests.filter(t => t.status === "pending").length,
    inProgress: tests.filter(t => t.status === "in_progress").length,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card className="bg-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>

      <Card className="bg-green-500/5 border-green-500/20 dark:bg-green-500/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Réussis</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.passed}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.passed / stats.total) * 100).toFixed(1)}% des tests
          </p>
        </CardContent>
      </Card>

      <Card className="bg-red-500/5 border-red-500/20 dark:bg-red-500/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Échoués</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.failed}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.failed / stats.total) * 100).toFixed(1)}% des tests
          </p>
        </CardContent>
      </Card>

      <Card className="bg-yellow-500/5 border-yellow-500/20 dark:bg-yellow-500/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En cours</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inProgress}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.inProgress / stats.total) * 100).toFixed(1)}% des tests
          </p>
        </CardContent>
      </Card>

      <Card className="bg-blue-500/5 border-blue-500/20 dark:bg-blue-500/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En attente</CardTitle>
          <AlertCircle className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pending}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.pending / stats.total) * 100).toFixed(1)}% des tests
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
