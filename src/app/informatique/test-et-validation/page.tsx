"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Test, 
  TestCard, 
  TestForm, 
  TestStats, 
  TestFilters, 
  TestDetailsDialog 
} from "@/components/informatique/test-et-validation";
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
import { createClient } from "@/lib/supabase";

export default function TestValidationPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [isAddingTest, setIsAddingTest] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();
  
  const supabase = createClient();

  // Fetch tests from Supabase
  const fetchTests = useCallback(async () => {
    try {
      // Get all tests
      const { data: testsData, error: testsError } = await supabase
        .from('tests')
        .select('*')
        .order('created_at', { ascending: false });

      if (testsError) throw testsError;

      // Get all check items
      const { data: checkItemsData, error: checkItemsError } = await supabase
        .from('test_check_items')
        .select('*');

      if (checkItemsError) throw checkItemsError;

      // Combine tests with their check items
      const testsWithCheckItems = testsData?.map(test => ({
        ...test,
        check_items: checkItemsData?.filter(item => item.test_id === test.id) || []
      })) || [];

      setTests(testsWithCheckItems);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de charger les tests";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast, setTests, supabase]);

  const fetchProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setProjects(data || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de charger les projets";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [supabase, toast, setProjects]);

  const handleCreateTest = async (testData: Test) => {
    try {
      // Insert the test
      const { data: newTest, error: testError } = await supabase
        .from('tests')
        .insert({
          title: testData.title,
          description: testData.description,
          status: testData.status,
          priority: testData.priority,
          project_id: testData.project_id || null,
          project_name: testData.project_name || null,
          due_date: testData.due_date || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (testError) throw testError;

      // Insert check items if any
      if (testData.check_items && testData.check_items.length > 0 && newTest) {
        const checkItemsToInsert = testData.check_items.map(item => ({
          test_id: newTest.id,
          description: item.description,
          is_completed: item.is_completed || false,
          created_at: new Date().toISOString()
        }));

        const { error: checkItemsError } = await supabase
          .from('test_check_items')
          .insert(checkItemsToInsert);

        if (checkItemsError) throw checkItemsError;
      }

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

  const handleUpdateTest = async (testData: Test) => {
    try {
      if (!testData.id) throw new Error("ID du test manquant");

      // Update the test
      const { error: testError } = await supabase
        .from('tests')
        .update({
          title: testData.title,
          description: testData.description,
          status: testData.status,
          priority: testData.priority,
          project_id: testData.project_id || null,
          project_name: testData.project_name || null,
          due_date: testData.due_date || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', testData.id);

      if (testError) throw testError;

      // Delete existing check items
      const { error: deleteError } = await supabase
        .from('test_check_items')
        .delete()
        .eq('test_id', testData.id);

      if (deleteError) throw deleteError;

      // Insert updated check items
      if (testData.check_items && testData.check_items.length > 0) {
        const checkItemsToInsert = testData.check_items.map(item => ({
          test_id: testData.id,
          description: item.description,
          is_completed: item.is_completed || false,
          created_at: item.created_at || new Date().toISOString()
        }));

        const { error: checkItemsError } = await supabase
          .from('test_check_items')
          .insert(checkItemsToInsert);

        if (checkItemsError) throw checkItemsError;
      }

      await fetchTests();
      setIsDetailsOpen(false);
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

  // Add a function to handle test deletion (will be used in future implementation)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteTest = async (testId: string) => {
    try {
      // Delete check items first (due to foreign key constraints)
      const { error: checkItemsError } = await supabase
        .from('test_check_items')
        .delete()
        .eq('test_id', testId);

      if (checkItemsError) throw checkItemsError;

      // Delete the test
      const { error: testError } = await supabase
        .from('tests')
        .delete()
        .eq('id', testId);

      if (testError) throw testError;

      toast({
        title: "Succès",
        description: "Test supprimé avec succès",
      });

      fetchTests(); // Refresh tests
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de supprimer le test";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Handle opening test details
  const handleOpenDetails = (test: Test) => {
    setSelectedTest(test);
    setIsDetailsOpen(true);
  };

  // Calculate test statistics
  const calculateStats = () => {
    const total_count = filteredTests.length;
    const pending_count = filteredTests.filter(test => test.status === 'pending').length;
    const in_progress_count = filteredTests.filter(test => test.status === 'in_progress').length;
    const passed_count = filteredTests.filter(test => test.status === 'passed').length;
    const failed_count = filteredTests.filter(test => test.status === 'failed').length;
    
    // Calculate completion rate based on check items
    let totalCheckItems = 0;
    let completedCheckItems = 0;
    
    filteredTests.forEach(test => {
      if (test.check_items && test.check_items.length > 0) {
        totalCheckItems += test.check_items.length;
        completedCheckItems += test.check_items.filter(item => item.is_completed).length;
      }
    });
    
    const completion_rate = totalCheckItems > 0 
      ? Math.round((completedCheckItems / totalCheckItems) * 100) 
      : 0;
    
    return {
      total_count,
      pending_count,
      in_progress_count,
      passed_count,
      failed_count,
      completion_rate
    };
  };

  // Get unique project names for filter
  const getProjectNames = () => {
    const projectNames = tests
      .map(test => test.project_name)
      .filter(name => name !== undefined && name !== null) as string[];
    
    return [...new Set(projectNames)];
  };

  // Filter tests based on search, status, and project
  const filteredTests = tests.filter(test => {
    const matchesSearch = search === '' || 
      test.title?.toLowerCase().includes(search.toLowerCase()) ||
      test.description?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    
    const matchesProject = projectFilter === 'all' || 
      test.project_name === projectFilter;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

  // Handle dialog open state changes
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setIsAddingTest(false);
      setIsDetailsOpen(false);
      setSelectedTest(null);
    }
  };

  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (search !== '') count++;
    if (statusFilter !== 'all') count++;
    if (projectFilter !== 'all') count++;
    return count;
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setProjectFilter('all');
  };

  const stats = calculateStats();
  const projectNames = getProjectNames();
  const activeFiltersCount = countActiveFilters();

  useEffect(() => {
    fetchTests();
    fetchProjects();
  }, [fetchTests, fetchProjects]);

  return (
    <div className="ml-64 p-8 bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Tests et Validation</h1>
            <Dialog open={isAddingTest} onOpenChange={handleDialogOpenChange}>
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

          <TestStats stats={stats} />

          <TestFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            projectFilter={projectFilter}
            onProjectFilterChange={setProjectFilter}
            projects={projectNames}
            activeFilters={activeFiltersCount}
            onClearFilters={clearFilters}
          />
        </div>

        <ScrollArea className="h-[calc(100vh-340px)] rounded-lg border bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
            {filteredTests.length > 0 ? (
              filteredTests.map(test => (
                <TestCard
                  key={test.id}
                  test={test}
                  onClick={() => handleOpenDetails(test)}
                />
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg text-gray-500 mb-4">Aucun test trouvé</p>
                <Button onClick={() => setIsAddingTest(true)}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Créer un test
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>

        <TestDetailsDialog
          test={selectedTest}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          onUpdate={handleUpdateTest}
          projects={projects}
        />
      </div>
    </div>
  );
}
