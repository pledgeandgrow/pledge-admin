export type ServerStatus = 'online' | 'offline' | 'maintenance' | 'warning';

export interface ServerMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  uptime: number;
  last_check: string;
}

export interface Server {
  id: string;
  name: string;
  description: string;
  ip_address: string;
  type: 'production' | 'staging' | 'development';
  os: string;
  status: ServerStatus;
  metrics: ServerMetrics;
  services: string[];
  location: string;
  created_at: string;
  updated_at: string;
  last_maintenance: string;
  next_maintenance: string;
}
