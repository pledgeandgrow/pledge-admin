import { Test } from "./types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TestCardProps {
  test: Test;
  onClick?: () => void;
}

export function TestCard({ test, onClick }: TestCardProps) {
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "passed":
        return {
          label: "Réussi",
          icon: CheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-500/5",
          borderColor: "border-green-500/20",
        };
      case "failed":
        return {
          label: "Échoué",
          icon: XCircle,
          color: "text-red-500",
          bgColor: "bg-red-500/5",
          borderColor: "border-red-500/20",
        };
      case "in_progress":
        return {
          label: "En cours",
          icon: Clock,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/5",
          borderColor: "border-yellow-500/20",
        };
      case "pending":
        return {
          label: "En attente",
          icon: AlertCircle,
          color: "text-blue-500",
          bgColor: "bg-blue-500/5",
          borderColor: "border-blue-500/20",
        };
      default:
        return {
          label: status,
          icon: ClipboardList,
          color: "text-gray-500",
          bgColor: "bg-gray-500/5",
          borderColor: "border-gray-500/20",
        };
    }
  };

  const statusDetails = getStatusDetails(test.status);
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
            <ClipboardList className="h-5 w-5" />
            <h3 className="font-semibold">{test.name}</h3>
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
          <Badge variant="secondary">{test.project}</Badge>
          <Badge variant="outline">{test.type}</Badge>
          <Badge
            variant="outline"
            className={cn(
              test.priority === "critical"
                ? "border-red-500 text-red-500"
                : test.priority === "high"
                ? "border-orange-500 text-orange-500"
                : test.priority === "medium"
                ? "border-yellow-500 text-yellow-500"
                : "border-blue-500 text-blue-500"
            )}
          >
            {test.priority}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {test.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              {test.assignee}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date(test.due_date).toLocaleDateString()}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Avancement</span>
              <span className="font-medium">{test.progress}%</span>
            </div>
            <Progress
              value={test.progress}
              className="h-2"
              indicatorClassName={cn(
                test.progress === 100
                  ? "bg-green-500"
                  : test.progress >= 70
                  ? "bg-yellow-500"
                  : "bg-blue-500"
              )}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{test.steps.length} étapes</span>
            <span>
              {test.steps.filter((step) => step.status === "passed").length}{" "}
              terminées
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
