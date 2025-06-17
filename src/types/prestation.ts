export interface Prestation {
  id: string;
  title: string;
  description: string;
  priceMin: number;
  priceMax: number;
  duration: string;
  category: 'Site Web' | 'SaaS' | 'Application Mobile' | 'Logiciel' | 'Jeux Vidéo' | 'E-commerce' | 
    'IA & Automatisation' | 'Blockchain' | 'Cybersécurité' | 'Cloud / DevOps' | 
    'Documentation' | 'Design UX/UI' | 'Référencement' | 'Maintenance' | 'Conseil / Formation';
  status: 'Available' | 'Coming Soon' | 'Limited' | 'Archived';
  features: string[];
}
