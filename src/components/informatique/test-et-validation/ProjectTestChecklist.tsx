import { useState, useEffect } from 'react';
import { TestCase, TestStep, ClientProject } from './types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectTestChecklistProps {
  test: TestCase;
  onUpdate: (updatedTest: TestCase) => void;
}

export function ProjectTestChecklist({ test, onUpdate }: ProjectTestChecklistProps) {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>(test.project_id || '');
  const [steps, setSteps] = useState<TestStep[]>(test.steps);
  const [completionPercentage, setCompletionPercentage] = useState(test.completion_percentage || 0);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const completed = steps.filter(step => step.completed).length;
    const total = steps.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    setCompletionPercentage(percentage);

    // Update test status if all steps are completed
    if (percentage === 100 && test.status !== 'passed') {
      handleTestCompletion();
    }
  }, [steps]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/client-projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les projets',
        variant: 'destructive',
      });
    }
  };

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
    const project = projects.find(p => p.id === projectId);
    onUpdate({
      ...test,
      project_id: projectId,
      project_name: project?.name,
    });
  };

  const handleStepToggle = (index: number) => {
    const newSteps = [...steps];
    newSteps[index] = {
      ...newSteps[index],
      completed: !newSteps[index].completed,
      status: !newSteps[index].completed ? 'passed' : undefined,
    };
    setSteps(newSteps);
    onUpdate({
      ...test,
      steps: newSteps,
    });
  };

  const handleTestCompletion = () => {
    const updatedTest = {
      ...test,
      status: 'passed' as const,
      executed_at: new Date().toISOString(),
      steps,
      completion_percentage: 100,
    };
    onUpdate(updatedTest);
    toast({
      title: 'Test validé',
      description: 'Toutes les étapes ont été complétées avec succès',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Liste de vérification</span>
          <div className="text-sm font-normal">
            Progression: {completionPercentage}%
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Projet associé</label>
          <Select value={selectedProject} onValueChange={handleProjectChange}>
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

        <Progress value={completionPercentage} className="w-full" />

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <Checkbox
                checked={step.completed}
                onCheckedChange={() => handleStepToggle(index)}
              />
              <div className="space-y-1 flex-1">
                <div className="font-medium">{step.description}</div>
                <div className="text-sm text-muted-foreground">
                  Résultat attendu: {step.expected_result}
                </div>
                {step.actual_result && (
                  <div className="text-sm text-muted-foreground">
                    Résultat obtenu: {step.actual_result}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {completionPercentage === 100 && (
          <div className="flex items-center justify-center p-4 bg-green-500/10 rounded-lg">
            <span className="text-green-600 dark:text-green-400 font-medium">
              Test validé avec succès !
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
