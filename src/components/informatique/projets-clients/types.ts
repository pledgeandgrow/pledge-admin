export interface ProjectType {
  id: number;
  title: string;
  client: string;
  dateDebut: string;
  dateFin: string;
  statut: 'En cours' | 'Terminé' | 'En pause';
  progression: number;
  priorite: 'Haute' | 'Moyenne' | 'Basse';
  responsable: string;
  equipe: string[];
  description: string;
  budget: {
    total: number;
    depense: number;
    unite: string;
  };
  technologies: string[];
  documents: {
    id: number;
    nom: string;
    type: string;
    dateCreation: string;
    taille: string;
    url: string;
  }[];
  taches: {
    id: number;
    titre: string;
    statut: 'Terminée' | 'En cours' | 'À faire';
    priorite: 'Haute' | 'Moyenne' | 'Basse';
    assigneA: string;
    dateEcheance: string;
  }[];
}

export interface ProjectFilterType {
  status: string;
  priority: string;
  search: string;
}

export interface ProjectStatisticsType {
  total: number;
  enCours: number;
  termine: number;
  enRetard: number;
}
