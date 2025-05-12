import { Test, TestStep } from "./types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  FileIcon,
  PencilIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TestDetailsDialogProps {
  test: Test | null;
  onOpenChange: (open: boolean) => void;
  onEdit?: (test: Test) => void;
}

export function TestDetailsDialog({
  test,
  onOpenChange,
  onEdit,
}: TestDetailsDialogProps) {
  if (!test) return null;

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
    <Dialog open={!!test} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl flex items-center gap-2">
              <ClipboardList className="h-6 w-6" />
              {test.name}
            </DialogTitle>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(test)}>
                <PencilIcon className="h-4 w-4 mr-1" />
                Modifier
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
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
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-6">
          <TabsList>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="steps">Étapes</TabsTrigger>
            {test.attachments && test.attachments.length > 0 && (
              <TabsTrigger value="attachments">Pièces jointes</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground">{test.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Assigné à</h4>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    {test.assignee}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Date d'échéance</h4>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(test.due_date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Progression</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Avancement</span>
                    <span>{test.progress}%</span>
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
              </div>
            </div>
          </TabsContent>

          <TabsContent value="steps" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {test.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={cn(
                      "p-4 rounded-lg border space-y-3",
                      step.status === "passed"
                        ? "bg-green-500/5 border-green-500/20"
                        : step.status === "failed"
                        ? "bg-red-500/5 border-red-500/20"
                        : "bg-card"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Étape {index + 1}</h4>
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize",
                          step.status === "passed"
                            ? "border-green-500 text-green-500"
                            : step.status === "failed"
                            ? "border-red-500 text-red-500"
                            : "border-blue-500 text-blue-500"
                        )}
                      >
                        {step.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <h5 className="text-sm font-medium mb-1">Description</h5>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium mb-1">
                          Résultat attendu
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {step.expected_result}
                        </p>
                      </div>

                      {step.actual_result && (
                        <div>
                          <h5 className="text-sm font-medium mb-1">
                            Résultat obtenu
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            {step.actual_result}
                          </p>
                        </div>
                      )}

                      {step.notes && (
                        <div>
                          <h5 className="text-sm font-medium mb-1">Notes</h5>
                          <p className="text-sm text-muted-foreground">
                            {step.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {test.attachments && test.attachments.length > 0 && (
            <TabsContent value="attachments" className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {test.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-2 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-2">
                        <FileIcon className="h-4 w-4" />
                        <span>{attachment.name}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Télécharger
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
