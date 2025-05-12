export interface Prestation {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  category: 'Consulting' | 'Development' | 'Support' | 'Training';
  status: 'Available' | 'Coming Soon' | 'Limited' | 'Archived';
  features: string[];
}
