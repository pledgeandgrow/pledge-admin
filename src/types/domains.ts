// Domain name (Nom de domaine) types

export interface DomainName {
  id: string;
  name: string;
  registrar: string;
  status: 'active' | 'expired' | 'expiring_soon' | 'transferred';
  expiration_date: string;
  auto_renew: boolean;
  dns_provider: string;
  nameservers: string[];
  created_at: string;
  updated_at: string;
  project_id?: string;
  project_name?: string;
  notes?: string;
  contacts: {
    technical?: string;
    administrative?: string;
    billing?: string;
  };
  services: {
    email?: boolean;
    web_hosting?: boolean;
    ssl?: boolean;
  };
  records?: DnsRecord[];
}

export interface DnsRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV';
  name: string;
  content: string;
  ttl: number;
  priority?: number;
  proxied?: boolean;
}

export interface DomainStats {
  total: number;
  active: number;
  expiring_soon: number;
  expired: number;
  with_ssl: number;
  with_email: number;
}
