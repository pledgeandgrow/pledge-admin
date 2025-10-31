'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProject } from '@/hooks/useProject';
import { Plus, Edit2, Trash2, Users, Clock, Calendar } from 'lucide-react';

interface ResourceType {
  id: string;
  name: string;
  role: string;
  allocation: number; // percentage
  start_date?: string;
  end_date?: string;
  cost_rate?: number;
  cost_currency?: string;
  status: string;
  user_id?: string;
}

interface ProjectResourcesProps {
  projectId: string;
}

export function ProjectResources({ projectId }: ProjectResourcesProps) {
  const [resources, setResources] = useState<ResourceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    allocation: 100,
    start_date: '',
    end_date: '',
    cost_rate: 0,
    cost_currency: 'EUR',
    status: 'active',
  });
  const [availableTeamMembers, setAvailableTeamMembers] = useState<{id: string, name: string}[]>([]);
  const { fetchProjectResources, addProjectResource, updateProjectResource, deleteProjectResource, fetchTeamMembers } = useProject(projectId);

  useEffect(() => {
    const loadResources = async () => {
      setIsLoading(true);
      try {
        const fetchedResources = await fetchProjectResources();
        setResources(fetchedResources);
        
        const teamMembers = await fetchTeamMembers();
        setAvailableTeamMembers(teamMembers);
      } catch (error) {
        console.error('Error loading resources:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project resources',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadResources();
  }, [projectId, fetchProjectResources, fetchTeamMembers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'allocation' || name === 'cost_rate' ? parseFloat(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      allocation: 100,
      start_date: '',
      end_date: '',
      cost_rate: 0,
      cost_currency: 'EUR',
      status: 'active',
    });
    setEditingResource(null);
  };

  const handleOpenDialog = (resource?: ResourceType) => {
    if (resource) {
      setEditingResource(resource);
      setFormData({
        name: resource.name,
        role: resource.role,
        allocation: resource.allocation,
        start_date: resource.start_date || '',
        end_date: resource.end_date || '',
        cost_rate: resource.cost_rate || 0,
        cost_currency: resource.cost_currency || 'EUR',
        status: resource.status,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingResource) {
        // Update existing resource
        await updateProjectResource(editingResource.id, {
          ...formData,
          project_id: projectId,
        });
        
        setResources(prev => 
          prev.map(res => 
            res.id === editingResource.id 
              ? { ...res, ...formData } 
              : res
          )
        );
        
        toast({
          title: 'Success',
          description: 'Resource updated successfully',
        });
      } else {
        // Add new resource
        const newResource = await addProjectResource({
          ...formData,
          project_id: projectId,
        });
        
        setResources(prev => [...prev, newResource]);
        
        toast({
          title: 'Success',
          description: 'Resource added successfully',
        });
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving resource:', error);
      toast({
        title: 'Error',
        description: 'Failed to save resource',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (resourceId: string) => {
    try {
      await deleteProjectResource(resourceId);
      setResources(prev => prev.filter(res => res.id !== resourceId));
      
      toast({
        title: 'Success',
        description: 'Resource removed successfully',
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete resource',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ressources du projet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ressources du projet</CardTitle>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Ajouter une ressource
        </Button>
      </CardHeader>
      <CardContent>
        {resources.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Aucune ressource n'a été allouée à ce projet.
          </div>
        ) : (
          <div className="grid gap-4">
            {resources.map((resource) => (
              <Card key={resource.id} className="overflow-hidden">
                <div className="p-4 flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <h3 className="font-medium">{resource.name}</h3>
                      {getStatusBadge(resource.status)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {resource.role}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span>Allocation: {resource.allocation}%</span>
                      </div>
                      {resource.start_date && resource.end_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span>
                            {new Date(resource.start_date).toLocaleDateString()} - {new Date(resource.end_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    {resource.cost_rate && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Taux: {resource.cost_rate} {resource.cost_currency || 'EUR'}/h
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleOpenDialog(resource)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(resource.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingResource ? 'Modifier la ressource' : 'Ajouter une ressource'}
              </DialogTitle>
              <DialogDescription>
                {editingResource 
                  ? 'Modifiez les détails de cette ressource du projet.' 
                  : 'Ajoutez une nouvelle ressource à ce projet.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nom
                  </Label>
                  <div className="col-span-3">
                    {availableTeamMembers.length > 0 ? (
                      <Select 
                        value={formData.name} 
                        onValueChange={(value) => handleSelectChange('name', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un membre" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTeamMembers.map((member) => (
                            <SelectItem key={member.id} value={member.name}>
                              {member.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom">Autre...</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Nom de la ressource"
                        required
                      />
                    )}
                  </div>
                </div>
                
                {formData.name === 'custom' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customName" className="text-right">
                      Nom personnalisé
                    </Label>
                    <Input
                      id="customName"
                      name="name"
                      value={formData.name === 'custom' ? '' : formData.name}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="Nom de la ressource"
                      required
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Rôle
                  </Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => handleSelectChange('role', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Développeur</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="project_manager">Chef de projet</SelectItem>
                      <SelectItem value="tester">Testeur</SelectItem>
                      <SelectItem value="analyst">Analyste</SelectItem>
                      <SelectItem value="consultant">Consultant</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="allocation" className="text-right">
                    Allocation (%)
                  </Label>
                  <Input
                    id="allocation"
                    name="allocation"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.allocation}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="start_date" className="text-right">
                    Date de début
                  </Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="end_date" className="text-right">
                    Date de fin
                  </Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cost_rate" className="text-right">
                    Taux horaire
                  </Label>
                  <Input
                    id="cost_rate"
                    name="cost_rate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cost_rate}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cost_currency" className="text-right">
                    Devise
                  </Label>
                  <Select 
                    value={formData.cost_currency} 
                    onValueChange={(value) => handleSelectChange('cost_currency', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner une devise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Statut
                  </Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingResource ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
