"use client";

import { useState, useCallback, useEffect } from "react";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface SpecificationType {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'in_review' | 'approved' | 'archived';
  createdAt: string;
  updatedAt: string;
}

interface SpecificationStatisticsType {
  total: number;
  draft: number;
  review: number;
  approved: number;
  archived: number;
}

// Formatage de date
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function CahierDesChargesPage() {
  const [specs, setSpecs] = useState<SpecificationType[]>([]);
  const [filteredSpecs, setFilteredSpecs] = useState<SpecificationType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState<SpecificationStatisticsType>({ 
    total: 0, 
    draft: 0, 
    review: 0, 
    approved: 0, 
    archived: 0 
  });
  const [selectedSpec, setSelectedSpec] = useState<SpecificationType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    const loadInitialData = () => {
      setIsLoading(true);
      try {
        // Load from localStorage if available
        const savedSpecs = localStorage.getItem('cahierSpecs');
        if (savedSpecs) {
          const parsedSpecs = JSON.parse(savedSpecs);
          setSpecs(parsedSpecs);
          updateStats(parsedSpecs);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [toast]);

  // Update filtered specs when specs, search or filter changes
  useEffect(() => {
    let result = [...specs];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(spec => 
        spec.title.toLowerCase().includes(query) || 
        spec.content.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(spec => spec.status === statusFilter);
    }
    
    setFilteredSpecs(result);
  }, [specs, searchQuery, statusFilter]);

  // Update statistics
  const updateStats = useCallback((specifications: SpecificationType[]) => {
    const stats = {
      total: specifications.length,
      draft: specifications.filter(s => s.status === 'draft').length,
      review: specifications.filter(s => s.status === 'in_review').length,
      approved: specifications.filter(s => s.status === 'approved').length,
      archived: specifications.filter(s => s.status === 'archived').length,
    };
    setStats(stats);
  }, []);

  // Handle creating a new specification
  const handleCreate = useCallback((spec: Omit<SpecificationType, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newSpec: SpecificationType = {
        ...spec,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedSpecs = [...specs, newSpec];
      setSpecs(updatedSpecs);
      localStorage.setItem('cahierSpecs', JSON.stringify(updatedSpecs));
      updateStats(updatedSpecs);
      
      setIsCreating(false);
      toast({
        title: "Succès",
        description: "Cahier créé avec succès"
      });
    } catch (error) {
      console.error('Error creating specification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le cahier",
        variant: "destructive"
      });
    }
  }, [specs, toast]);

  // Handle updating a specification
  const handleUpdate = useCallback((id: string, updates: Partial<SpecificationType>) => {
    try {
      const updatedSpecs = specs.map(spec => 
        spec.id === id 
          ? { ...spec, ...updates, updatedAt: new Date().toISOString() }
          : spec
      );
      
      setSpecs(updatedSpecs);
      localStorage.setItem('cahierSpecs', JSON.stringify(updatedSpecs));
      updateStats(updatedSpecs);
      
      setIsEditing(false);
      setSelectedSpec(null);
      toast({
        title: "Succès",
        description: "Cahier mis à jour"
      });
    } catch (error) {
      console.error('Error updating specification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le cahier",
        variant: "destructive"
      });
    }
  }, [specs, toast]);

  // Handle deleting a specification
  const handleDelete = useCallback((id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce cahier ?")) return;
    
    try {
      const updatedSpecs = specs.filter(spec => spec.id !== id);
      setSpecs(updatedSpecs);
      localStorage.setItem('cahierSpecs', JSON.stringify(updatedSpecs));
      updateStats(updatedSpecs);
      
      toast({
        title: "Succès",
        description: "Cahier supprimé avec succès"
      });
    } catch (error) {
      console.error('Error deleting specification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le cahier",
        variant: "destructive"
      });
    }
  }, [specs, toast]);

  // Handle status change
  const handleStatusChange = useCallback((id: string, status: SpecificationType['status']) => {
    try {
      const updatedSpecs = specs.map(spec => 
        spec.id === id 
          ? { ...spec, status, updatedAt: new Date().toISOString() }
          : spec
      );
      
      setSpecs(updatedSpecs);
      localStorage.setItem('cahierSpecs', JSON.stringify(updatedSpecs));
      updateStats(updatedSpecs);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }, [specs]);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cahier des charges</h1>
            <p className="text-gray-600 dark:text-gray-400">Gérez vos spécifications techniques</p>
          </div>
          <Button onClick={() => setIsCreating(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouveau cahier
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-blue-500">Brouillons</p>
            <p className="text-2xl font-bold">{stats.draft}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-yellow-500">En revue</p>
            <p className="text-2xl font-bold">{stats.review}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-green-500">Approuvés</p>
            <p className="text-2xl font-bold">{stats.approved}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un cahier..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="in_review">En revue</SelectItem>
                <SelectItem value="approved">Approuvé</SelectItem>
                <SelectItem value="archived">Archivé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Specifications List */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {filteredSpecs.length} {filteredSpecs.length === 1 ? 'cahier' : 'cahiers'} trouvés
          </h2>
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-500">Chargement...</p>
              </div>
            ) : filteredSpecs.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-gray-500">Aucun cahier trouvé</p>
                <Button className="mt-4" onClick={() => setIsCreating(true)}>
                  Créer un nouveau cahier
                </Button>
              </div>
            ) : (
              filteredSpecs.map((spec) => (
                <div key={spec.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {spec.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Mis à jour le {fmtDate(spec.updatedAt)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSpec(spec);
                          setIsEditing(true);
                        }}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => handleDelete(spec.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {spec.content}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        spec.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400' :
                        spec.status === 'in_review' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400' :
                        spec.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {spec.status === 'draft' ? 'Brouillon' :
                         spec.status === 'in_review' ? 'En revue' :
                         spec.status === 'approved' ? 'Approuvé' : 'Archivé'}
                      </span>
                      <div className="flex space-x-2">
                        {spec.status !== 'draft' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(spec.id, 'draft')}
                            className="hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                          >
                            Brouillon
                          </Button>
                        )}
                        {spec.status !== 'in_review' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(spec.id, 'in_review')}
                            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            En revue
                          </Button>
                        )}
                        {spec.status !== 'approved' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(spec.id, 'approved')}
                            className="hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            Approuver
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreating || isEditing} onOpenChange={(open) => {
        if (!open) {
          setIsCreating(false);
          setIsEditing(false);
          setSelectedSpec(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              {isCreating ? 'Nouveau cahier des charges' : 'Modifier le cahier'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Titre
                </label>
                <Input
                  placeholder="Titre du cahier des charges"
                  value={selectedSpec?.title || ''}
                  onChange={(e) => 
                    setSelectedSpec(prev => 
                      prev ? { ...prev, title: e.target.value } : null
                    )
                  }
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contenu
                </label>
                <textarea
                  className="w-full min-h-[200px] p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  placeholder="Détails du cahier des charges..."
                  value={selectedSpec?.content || ''}
                  onChange={(e) => 
                    setSelectedSpec(prev => 
                      prev ? { ...prev, content: e.target.value } : null
                    )
                  }
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Statut
                </label>
                <Select
                  value={selectedSpec?.status || 'draft'}
                  onValueChange={(value) =>
                    setSelectedSpec(prev =>
                      prev ? { ...prev, status: value as any } : null
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="in_review">En revue</SelectItem>
                    <SelectItem value="approved">Approuvé</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setIsEditing(false);
                  setSelectedSpec(null);
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  if (isCreating && selectedSpec) {
                    handleCreate(selectedSpec);
                  } else if (isEditing && selectedSpec) {
                    handleUpdate(selectedSpec.id, selectedSpec);
                  }
                }}
                disabled={!selectedSpec?.title || !selectedSpec?.content}
              >
                {isCreating ? 'Créer' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
