export interface Lead {
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  commentaires: string;
  status: 'New' | 'In Progress' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
  service: string;
  date?: string;
}

export interface Client {
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Pending';
  startDate: string;
  services: string[];
  notes: string;
}

export interface Formation {
  title: string;
  description: string;
  duration: string;
  price: number;
  capacity: number;
  startDate: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface Package {
  name: string;
  description: string;
  price: number;
  features: string[];
  duration: string;
  status: 'Available' | 'Limited' | 'Unavailable';
}

export interface Prestation {
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  status: 'Available' | 'Unavailable';
}

export interface WaitlistEntry {
  name: string;
  email: string;
  phone: string;
  service: string;
  joinDate: string;
  status: 'Waiting' | 'Contacted' | 'Scheduled' | 'Completed';
  notes: string;
}

export interface AutreOffre {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  availability: 'Available' | 'Coming Soon' | 'Limited Time' | 'Sold Out';
  validUntil?: string;
}
