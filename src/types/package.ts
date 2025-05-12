export interface Package {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  status: 'Available' | 'Coming Soon' | 'Limited' | 'Archived';
  features: string[];
  category: 'Consulting' | 'Development' | 'Support' | 'Training';
  level: 'Basic' | 'Standard' | 'Premium' | 'Enterprise';
}
