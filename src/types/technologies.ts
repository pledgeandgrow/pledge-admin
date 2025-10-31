// Technology (Fiche technique) types

export type TechnologyType = 'framework' | 'language' | 'library' | 'tool' | 'database' | 'platform';

export interface TechnologyBase {
  id: string;
  name: string;
  description: string;
  type: TechnologyType;
  version?: string;
  website?: string;
  documentation?: string;
  created_at: string;
  updated_at: string;
}

export interface Framework extends TechnologyBase {
  type: 'framework';
  ecosystem: string;
  features: string[];
  use_cases: string[];
}

export interface Language extends TechnologyBase {
  type: 'language';
  paradigms: string[];
  compilation_type: 'compiled' | 'interpreted' | 'hybrid';
  typical_uses: string[];
}

export interface Library extends TechnologyBase {
  type: 'library';
  dependencies: string[];
  installation: string;
  common_uses: string[];
}

export interface Tool extends TechnologyBase {
  type: 'tool';
  category: string;
  integration_points: string[];
  platforms: string[];
}

export interface Database extends TechnologyBase {
  type: 'database';
  database_type: 'sql' | 'nosql' | 'graph' | 'other';
  features: string[];
  scaling_options: string[];
}

export interface Platform extends TechnologyBase {
  type: 'platform';
  hosting_type: 'cloud' | 'self-hosted' | 'hybrid';
  services: string[];
  deployment_options: string[];
}

export type Technology = Framework | Language | Library | Tool | Database | Platform;

export interface TechnologyStatistics {
  total: number;
  frameworks: number;
  languages: number;
  libraries: number;
  tools: number;
  databases: number;
  platforms: number;
}
