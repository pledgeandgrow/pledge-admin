export interface NetworkContact {
  id: string;
  name: string;
  title: string;
  organization: string;
  category: string[];
  expertise: string[];
  bio: string;
  contact: {
    email?: string;
    phone?: string;
    linkedin?: string;
  };
  supportAreas: string[];
  achievements: string[];
  location: string;
  languages: {
    language: string;
    level: string;
  }[];
  status: 'Active' | 'Available' | 'Unavailable' | 'Past';
}
