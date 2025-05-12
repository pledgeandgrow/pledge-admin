export interface Formation {
  id: string;
  title: string;
  description: string;
  category: 'Development' | 'DevOps' | 'Security' | 'Cloud' | 'Design' | 'Management';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: string;
  price: number;
  status: 'Available' | 'Coming Soon' | 'Full' | 'Archived';
  pdfUrl: string;
  instructor: string;
  nextSession?: string;
  prerequisites?: string[];
  objectives?: string[];
}
