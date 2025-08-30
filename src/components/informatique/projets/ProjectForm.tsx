"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// Badge import removed as it was unused
// Dialog imports removed as they were unused
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Trash2 } from "lucide-react";
// cn utility import removed as it was unused
import { contactService } from "@/services/contactService";
import { useToast } from "@/components/ui/use-toast";
import { BaseProject, ProjectPriority, ProjectStatus, ProjectType } from "@/services/projectService";
// Card imports removed as they were unused

// Helper functions for mapping between UI display values and database values
export function mapStatus(oldStatus?: string): ProjectStatus {
  if (!oldStatus) return 'Active';
  
  switch (oldStatus) {
    case 'En cours': return 'Active';
    case 'Terminé': return 'Completed';
    case 'En pause': return 'On Hold';
    default: return 'Active';
  }
}

export function reverseMapStatus(newStatus?: ProjectStatus): 'En cours' | 'Terminé' | 'En pause' | string {
  if (!newStatus) return 'En cours';
  
  switch (newStatus) {
    case 'Active': return 'En cours';
    case 'Completed': return 'Terminé';
    case 'On Hold': return 'En pause';
    case 'Cancelled': return 'En pause';
    default: return 'En cours';
  }
}

export function mapPriority(oldPriority?: string): ProjectPriority {
  if (!oldPriority) return 'Medium';
  
  switch (oldPriority) {
    case 'Haute': return 'High';
    case 'Moyenne': return 'Medium';
    case 'Basse': return 'Low';
    default: return 'Medium';
  }
}

export function reverseMapPriority(newPriority?: ProjectPriority): 'Haute' | 'Moyenne' | 'Basse' {
  if (!newPriority) return 'Moyenne';
  
  switch (newPriority) {
    case 'High': return 'Haute';
    case 'Urgent': return 'Haute';
    case 'Medium': return 'Moyenne';
    case 'Low': return 'Basse';
    default: return 'Moyenne';
  }
}

interface ProjectFormProps {
  project?: BaseProject;
  projectType: ProjectType;
  onSubmit: (project: Omit<BaseProject, 'id'> | BaseProject) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function ProjectForm({ project, projectType, onSubmit, onCancel, onDelete }: ProjectFormProps) {
  interface ContactWithDisplayType {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
    displayType: string;
  }
  
  const [contacts, setContacts] = useState<ContactWithDisplayType[]>([]);
  const { toast } = useToast();
  
  interface ExtendedProjectData extends Omit<BaseProject, 'id'> {
    teamMembers: string[];
    client_name: string;
    budget_spent: number;
    budget_unit: string;
  }

  const [formData, setFormData] = useState<ExtendedProjectData>({
    name: project?.name || '',
    description: project?.description || '',
    client_name: project?.metadata?.client_name as string || '',
    teamMembers: Array.isArray(project?.metadata?.team_members) ? project?.metadata?.team_members as string[] : [],
    tags: project?.tags || [],
    start_date: project?.start_date || format(new Date(), 'yyyy-MM-dd'),
    end_date: project?.end_date || format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    status: project?.status || 'Active' as ProjectStatus,
    priority: project?.priority || 'Medium' as ProjectPriority,
    primary_contact_id: project?.primary_contact_id || 'none',
    budget: typeof project?.budget === 'number' ? project.budget : 0,
    budget_spent: project?.metadata?.budget_spent as number || 0,
    budget_unit: project?.metadata?.budget_unit as string || '€',
    progress: project?.progress || 0,
    project_type: projectType // Always use the projectType prop to ensure consistency
  });

  // Fetch contacts for the responsable dropdown
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        // Fetch all contact types - members, board members, and clients
        const [teamMembers, boardMembers, clientContacts] = await Promise.all([
          contactService.getContacts({ type: 'member' }),
          contactService.getContacts({ type: 'board-member' }),
          contactService.getContacts({ type: 'client' })
        ]);
        
        const allContacts = [
          ...(teamMembers || []).map(contact => ({
            ...contact,
            displayType: 'Équipe'
          })),
          ...(boardMembers || []).map(contact => ({
            ...contact,
            displayType: 'Conseil'
          })),
          ...(clientContacts || []).map(contact => ({
            ...contact,
            displayType: 'Client'
          }))
        ];
        
        setContacts(allContacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les contacts.",
          variant: "destructive",
        });
      }
    };

    fetchContacts();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form data before submission:', formData);
    
    // Validate required fields
    if (!formData.name) {
      toast({
        title: "Erreur de validation",
        description: "Le nom du projet est requis",
        variant: "destructive"
      });
      return;
    }
    
    // Ensure dates are in the correct format
    let validStartDate = formData.start_date;
    let validEndDate = formData.end_date;
    
    try {
      // Validate start date format
      if (validStartDate) {
        parse(validStartDate, 'yyyy-MM-dd', new Date());
      } else {
        validStartDate = format(new Date(), 'yyyy-MM-dd');
      }
      
      // Validate end date format
      if (validEndDate) {
        parse(validEndDate, 'yyyy-MM-dd', new Date());
      } else {
        validEndDate = format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
      }
    } catch (error) {
      console.error("Date parsing error:", error);
      toast({
        title: "Erreur de format de date",
        description: "Les dates doivent être au format YYYY-MM-DD",
        variant: "destructive"
      });
      return;
    }
    
    // Map status from UI display values to database values
    const statusMap: Record<string, ProjectStatus> = {
      'En cours': 'Active',
      'Terminé': 'Completed',
      'En pause': 'On Hold'
    };
    
    // Use the mapping or default to the original value (assuming it's already a valid ProjectStatus)
    const mappedStatus = statusMap[formData.status] || formData.status as ProjectStatus;
    
    // Map priority from UI display values to database values
    const priorityMap: Record<string, ProjectPriority> = {
      'Haute': 'High',
      'Moyenne': 'Medium',
      'Basse': 'Low'
    };
    
    // Use the mapping or default to Medium if not found
    const mappedPriority = priorityMap[formData.priority || ''] || 'Medium';
    
    console.log('Mapped status:', mappedStatus);
    console.log('Mapped priority:', mappedPriority);
    
    // Transform form data to match the BaseProject structure
    const projectData: Omit<BaseProject, 'id'> = {
      name: formData.name.trim(),
      description: formData.description,
      start_date: validStartDate,
      end_date: validEndDate,
      status: mappedStatus,
      priority: mappedPriority,
      progress: Number(formData.progress),
      budget: Number(formData.budget),
      primary_contact_id: formData.primary_contact_id === 'none' ? '' : formData.primary_contact_id,
      project_type: projectType, // Use the projectType prop to ensure consistency
      tags: Array.isArray(formData.tags) ? formData.tags : [],
      metadata: {
        team_members: formData.teamMembers.filter(member => member.trim() !== ""),
        client_name: formData.client_name,
        budget_spent: formData.budget_spent,
        budget_unit: formData.budget_unit
      }
    };
    
    console.log('Project data to submit:', projectData);
    
    // If editing an existing project, include the ID
    if (project?.id) {
      onSubmit({
        ...projectData,
        id: project.id,
        created_at: project.created_at,
        updated_at: new Date().toISOString()
      });
    } else {
      onSubmit(projectData);
    }
  };

  // Removed unused getProjectTypeInfo function

  // Removed duplicate handleSelectChange and handleSubmit functions

// Render the form
return (
  <form onSubmit={handleSubmit} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom du projet</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project_type">Type de projet</Label>
        <Select 
          value={formData.project_type} 
          onValueChange={(value) => handleSelectChange('project_type', value as ProjectType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type de projet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Client">Client</SelectItem>
            <SelectItem value="Internal">Interne</SelectItem>
            <SelectItem value="External">Externe</SelectItem>
            <SelectItem value="Partner">Partenaire</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(formData.project_type === 'Client' || formData.project_type === 'External' || formData.project_type === 'Partner') && (
        <div className="space-y-2">
          <Label htmlFor="client_name">Client</Label>
          <Input
            id="client_name"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => handleSelectChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Terminé">Terminé</SelectItem>
            <SelectItem value="En pause">En pause</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priorité</Label>
        <Select 
          value={formData.priority} 
          onValueChange={(value) => handleSelectChange('priority', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une priorité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Haute">Haute</SelectItem>
            <SelectItem value="Moyenne">Moyenne</SelectItem>
            <SelectItem value="Basse">Basse</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="start_date">Date de début</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.start_date ? (() => {
                  try {
                    return format(parse(formData.start_date, 'yyyy-MM-dd', new Date()), 'PPP', { locale: fr });
                  } catch {
                    return "Date invalide";
                  }
                })() : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={(() => {
                  if (!formData.start_date) return undefined;
                  try {
                    return parse(formData.start_date, 'yyyy-MM-dd', new Date());
                  } catch {
                    return undefined;
                  }
                })()}
                onSelect={(date) => date && handleSelectChange('start_date', format(date, 'yyyy-MM-dd'))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">Date de fin</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.end_date ? (() => {
                  try {
                    return format(parse(formData.end_date, 'yyyy-MM-dd', new Date()), 'PPP', { locale: fr });
                  } catch {
                    return "Date invalide";
                  }
                })() : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={(() => {
                  if (!formData.end_date) return undefined;
                  try {
                    return parse(formData.end_date, 'yyyy-MM-dd', new Date());
                  } catch {
                    return undefined;
                  }
                })()}
                onSelect={(date) => date && handleSelectChange('end_date', format(date, 'yyyy-MM-dd'))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="primary_contact_id">Responsable</Label>
          <Select 
            value={formData.primary_contact_id} 
            onValueChange={(value) => handleSelectChange('primary_contact_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un responsable" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Non assigné</SelectItem>
              
              {/* Group contacts by type */}
              <SelectGroup>
                <SelectLabel>Équipe</SelectLabel>
                {contacts
                  .filter(contact => contact.displayType === 'Équipe')
                  .map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {`${contact.first_name} ${contact.last_name}`}
                    </SelectItem>
                  ))
                }
              </SelectGroup>
              
              <SelectGroup>
                <SelectLabel>Conseil</SelectLabel>
                {contacts
                  .filter(contact => contact.displayType === 'Conseil')
                  .map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {`${contact.first_name} ${contact.last_name}`}
                    </SelectItem>
                  ))
                }
              </SelectGroup>
              
              <SelectGroup>
                <SelectLabel>Clients</SelectLabel>
                {contacts
                  .filter(contact => contact.displayType === 'Client')
                  .map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {`${contact.first_name} ${contact.last_name}`}
                    </SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="team_members">Équipe (séparés par des virgules)</Label>
          <Input
            id="team_members"
            name="team_members"
            value={formData.teamMembers.join(', ')}
            onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value.split(',').map(item => item.trim()) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Budget total ({formData.budget_unit})</Label>
          <Input
            id="budget"
            name="budget"
            type="number"
            value={formData.budget}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget_spent">Budget dépensé ({formData.budget_unit})</Label>
          <Input
            id="budget_spent"
            name="budget_spent"
            type="number"
            value={formData.budget_spent}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget_unit">Unité monétaire</Label>
          <Select 
            value={formData.budget_unit} 
            onValueChange={(value) => handleSelectChange('budget_unit', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une unité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="€">Euro (€)</SelectItem>
              <SelectItem value="$">Dollar ($)</SelectItem>
              <SelectItem value="£">Livre (£)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="progress">Progression (%)</Label>
          <Input
            id="progress"
            name="progress"
            type="number"
            min="0"
            max="100"
            value={formData.progress}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Technologies / Tags (séparés par des virgules)</Label>
          <Input
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
        />
      </div>

      <div className="flex justify-between">
        <div>
          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Cela supprimera définitivement le projet et toutes les données associées.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Supprimer</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {project ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </div>
    </form>
  );
}
