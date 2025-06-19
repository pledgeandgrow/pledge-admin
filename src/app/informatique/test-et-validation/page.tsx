"use client";

import { useState, useEffect, useCallback } from "react";
import { Test } from "@/components/informatique/test-et-validation/types";
import { TestCard } from "@/components/informatique/test-et-validation/TestCard";
import { TestForm } from "@/components/informatique/test-et-validation/TestForm";
import { TestStats } from "@/components/informatique/test-et-validation/TestStats";
import { TestFilters } from "@/components/informatique/test-et-validation/TestFilters";
import { TestDetailsDialog } from "@/components/informatique/test-et-validation/TestDetailsDialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

export default function TestValidationPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [isAddingTest, setIsAddingTest] = useState(false);
  const [isEditingTest, setIsEditingTest] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTests();
    fetchProjects();
  }, [fetchTests, fetchProjects]);

  const fetchTests = useCallback(async () => {
    try {
      const response = await fetch("/api/test-et-validation");
      if (!response.ok) throw new Error("Failed to fetch tests");
      const data = await response.json();
      setTests(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de charger les tests";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast, setTests]);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch("/api/client-projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de charger les projets";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast, setProjects]);

  const handleCreateTest = async (testData: Partial<Test>) => {
    try {
      const response = await fetch("/api/test-et-validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      });

      if (!response.ok) throw new Error("Failed to create test");

      await fetchTests();
      setIsAddingTest(false);
      toast({
        title: "Succès",
        description: "Test créé avec succès",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de créer le test";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleUpdateTest = async (testData: Partial<Test>) => {
    try {
      const response = await fetch(`/api/test-et-validation?id=${testData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      });

      if (!response.ok) throw new Error("Failed to update test");

      await fetchTests();
      setIsEditingTest(false);
      setSelectedTest(null);
      toast({
        title: "Succès",
        description: "Test mis à jour avec succès",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de mettre à jour le test";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(search.toLowerCase()) ||
      test.description?.toLowerCase().includes(search.toLowerCase()) ||
      test.assignee.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || test.status === statusFilter;
    const matchesProject = projectFilter === "all" || test.project === projectFilter;

    return matchesSearch && matchesStatus && matchesProject;
  });

  return (
    <div className="ml-64 p-8 bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Tests et Validation</h1>
            <Dialog open={isAddingTest} onOpenChange={setIsAddingTest}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Nouveau test
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau test</DialogTitle>
                </DialogHeader>
                <TestForm
                  onSubmit={handleCreateTest}
                  onCancel={() => setIsAddingTest(false)}
                  projects={projects}
                />
              </DialogContent>
            </Dialog>
          </div>

          <TestStats tests={tests} />

          <TestFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            projectFilter={projectFilter}
            onProjectFilterChange={setProjectFilter}
            projects={projects.map(p => p.name)}
          />
        </div>

        <ScrollArea className="h-[calc(100vh-340px)] rounded-lg border bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
            {filteredTests.map(test => (
              <TestCard
                key={test.id}
                test={test}
                onClick={() => setSelectedTest(test)}
              />
            ))}
          </div>
        </ScrollArea>

        <TestDetailsDialog
          test={selectedTest}
          onOpenChange={(open) => !open && setSelectedTest(null)}
          onEdit={() => {
            setSelectedTest(null);
            setIsEditingTest(true);
          }}
        />

        <Dialog open={isEditingTest} onOpenChange={setIsEditingTest}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Modifier le test</DialogTitle>
            </DialogHeader>
            <TestForm
              onSubmit={handleUpdateTest}
              onCancel={() => setIsEditingTest(false)}
              projects={projects}
              initialData={selectedTest || undefined}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
