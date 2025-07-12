import { BaseProject, ProjectPriority, ProjectStatus } from '@/services/projectService';

// Helper functions for mapping between old and new status/priority values
export function mapStatus(oldStatus?: string): ProjectStatus {
  if (!oldStatus) return 'Active';
  
  switch (oldStatus) {
    case 'En cours': return 'Active';
    case 'Terminé': return 'Completed';
    case 'En pause': return 'On Hold';
    default: return 'Active';
  }
}

export function reverseMapStatus(newStatus?: ProjectStatus): 'En cours' | 'Terminé' | 'En pause' {
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

// Internal project type extending the base project type
export interface InternalProjectType extends BaseProject {
  // Legacy fields for backward compatibility
  title?: string; // Maps to name
  dateDebut?: string; // Maps to start_date
  dateFin?: string; // Maps to end_date
  statut?: 'En cours' | 'Terminé' | 'En pause'; // Maps to status
  progression?: number; // Maps to progress
  priorite?: 'Haute' | 'Moyenne' | 'Basse'; // Maps to priority
  responsable?: string; // Maps to primary_contact_id or stored in metadata
  equipe?: string[]; // Maps to team_contacts
  technologies?: string[]; // Maps to tags
  repository?: string; // Maps to metadata.repository
  pullRequests?: number; // Maps to metadata.pullRequests
  commits?: number; // Maps to metadata.commits
  branches?: string[]; // Maps to metadata.branches
  documentation?: {
    wiki: string;
    api: string;
    architecture: string;
  }; // Maps to metadata.documentation
  taches?: {
    id: string;
    titre: string;
    description: string;
    statut: 'À faire' | 'En cours' | 'Terminé';
    assignee: string;
    dateCreation: string;
    dateFin?: string;
  }[]; // Maps to metadata.tasks
}

export interface InternalProjectStatisticsType {
  total: number;
  enCours: number;
  termine: number;
  enRetard: number;
}
