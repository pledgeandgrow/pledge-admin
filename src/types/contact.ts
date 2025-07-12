export interface BaseContact {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  type: ContactType;
  status: string;
  notes?: string;
  company?: string;
  position?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type ContactType = 
  | 'board-member' 
  | 'external' 
  | 'freelance' 
  | 'member' 
  | 'network' 
  | 'partner'
  | 'waitlist'
  | 'blacklist'
  | 'lead'
  | 'client'
  | 'investor';

export interface BoardMemberContact extends BaseContact {
  type: 'board-member';
  position: string;
  company: string;
  joined_at?: string;
}

export interface ExternalContact extends BaseContact {
  type: 'external';
  company: string;
  position: string;
}

export interface FreelanceContact extends BaseContact {
  type: 'freelance';
  position: string;
  metadata: {
    skills: string[];
    hourly_rate?: number;
    daily_rate?: number;
    availability?: string;
    experience?: Array<{
      company: string;
      role: string;
      duration: string;
      description: string;
    }>;
    education?: Array<{
      degree: string;
      institution: string;
      year: string;
    }>;
    languages?: Array<{
      language: string;
      level: string;
    }>;
  };
}

export interface MemberContact extends BaseContact {
  type: 'member';
  position: string;
  metadata: {
    department: string;
    join_date: string;
    responsibilities?: string[];
    job_description?: {
      summary: string;
      roles: string[];
      missions: string[];
    };
    languages?: Array<{
      language: string;
      level: string;
    }>;
    education?: Array<{
      degree: string;
      institution: string;
      year: string;
    }>;
  };
}

export interface NetworkContact extends BaseContact {
  type: 'network';
  company: string;
  position: string;
  metadata: {
    connection_strength?: number; // 1-5
  };
}

export interface PartnerContact extends BaseContact {
  type: 'partner';
  company: string;
  metadata: {
    partnership_type: string;
    since: string;
  };
}

export interface WaitlistContact extends BaseContact {
  type: 'waitlist';
  service: string;
  waitlist_position?: number;
  joined_at?: string;
}

export interface BlacklistContact extends BaseContact {
  type: 'blacklist';
  reason: string;
  added_by?: string;
  expires_at?: string;
}

export interface LeadContact extends BaseContact {
  type: 'lead';
  company?: string;
  position?: string;
  source?: string;
  probability?: number;
  last_contacted_at?: string;
  next_follow_up?: string;
  estimated_value?: number;
}

export interface ClientContact extends BaseContact {
  type: 'client';
  company: string;
  position?: string;
  first_contact_date?: string;
  last_purchase_date?: string;
  total_spent?: number;
}

export interface InvestorContact extends BaseContact {
  type: 'investor';
  company?: string;
  position?: string;
  investment_stage?: 'seed' | 'series-a' | 'series-b' | 'series-c' | 'growth' | 'private-equity';
  investment_focus?: string[];
  portfolio_companies?: string[];
  minimum_check_size?: number;
  maximum_check_size?: number;
  preferred_industries?: string[];
  last_contact_date?: string;
  investment_status?: 'active' | 'inactive' | 'following' | 'not-interested';
}

export type Contact = 
  | BoardMemberContact
  | ExternalContact
  | FreelanceContact
  | MemberContact
  | NetworkContact
  | PartnerContact
  | WaitlistContact
  | BlacklistContact
  | LeadContact
  | ClientContact
  | InvestorContact;

export const getFullName = (contact: BaseContact): string => {
  return `${contact.first_name} ${contact.last_name}`;
};

export const getContactStatusBadgeColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'inactive':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'blocked':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'following':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'not-interested':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};
