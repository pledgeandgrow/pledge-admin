import { useState } from "react";
import { Test, TestStep } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestFormProps {
  onSubmit: (test: Partial<Test>) => void;
  onCancel: () => void;
  projects: { id: string; name: string }[];
  initialData?: Partial<Test>;
}

export function TestForm({ onSubmit, onCancel, projects, initialData }: TestFormProps) {
  const [formData, setFormData] = useState<Partial<Test>>(
    initialData || {
      name: "",
      description: "",
      project: "",
      type: "functional",
      priority: "medium",
      environment: "development",
      steps: [],
    }
  );

  const [steps, setSteps] = useState<Partial<TestStep>[]>(
    initialData?.steps || [
      {
        description: "",
        expected_result: "",
        status: "pending",
      },
    ]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      steps: steps.map((step, index) => ({
        ...step,
        id: step.id || crypto.randomUUID(),
        order: index + 1,
      })),
    });
  };

  const addStep = () => {
    setSteps([
      ...steps,
      {
        description: "",
        expected_result: "",
        status: "pending",
      },
    ]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: string, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="project">Projet</Label>
            <Select
              value={formData.project}
              onValueChange={(value) => setFormData({ ...formData, project: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un projet" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priorité</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: string) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Basse</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="high">Haute</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nom du test</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nom du test"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description détaillée du test"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type de test</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="functional">Fonctionnel</SelectItem>
                <SelectItem value="integration">Intégration</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="security">Sécurité</SelectItem>
                <SelectItem value="usability">Utilisabilité</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="environment">Environnement</Label>
            <Select
              value={formData.environment}
              onValueChange={(value) => setFormData({ ...formData, environment: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un environnement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="development">Développement</SelectItem>
                <SelectItem value="staging">Pré-production</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Étapes du test</Label>
            <Button type="button" variant="outline" size="sm" onClick={addStep}>
              <PlusIcon className="h-4 w-4 mr-1" />
              Ajouter une étape
            </Button>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "space-y-3 p-4 rounded-lg border",
                  "bg-card/50 hover:bg-card/80 transition-colors"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Étape {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStep(index)}
                  >
                    <Trash2Icon className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={step.description}
                    onChange={(e) => updateStep(index, "description", e.target.value)}
                    placeholder="Description de l'étape"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Résultat attendu</Label>
                  <Textarea
                    value={step.expected_result}
                    onChange={(e) => updateStep(index, "expected_result", e.target.value)}
                    placeholder="Résultat attendu"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {initialData ? "Mettre à jour" : "Créer"} le test
        </Button>
      </div>
    </form>
  );
}
