export interface InternalProjectType {
  id: string;
  title: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  statut: 'En cours' | 'Terminé' | 'En pause';
  progression: number;
  priorite: 'Haute' | 'Moyenne' | 'Basse';
  responsable: string;
  equipe: string[];
  technologies: string[];
  repository: string;
  pullRequests: number;
  commits: number;
  branches: string[];
  documentation: {
    wiki: string;
    api: string;
    architecture: string;
  };
  taches: {
    id: string;
    titre: string;
    description: string;
    statut: 'À faire' | 'En cours' | 'Terminé';
    assignee: string;
    dateCreation: string;
    dateFin?: string;
  }[];
}

export interface InternalProjectStatisticsType {
  total: number;
  enCours: number;
  termine: number;
  enRetard: number;
}
