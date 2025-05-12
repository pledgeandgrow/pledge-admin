export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  status: 'Pending' | 'Contacted' | 'Scheduled' | 'Cancelled';
  date: string;
  notes: string;
}
