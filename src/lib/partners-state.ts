import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Partner {
  id: string;
  name: string;
  type: string; // Strategic, Technology, Distribution, etc.
  status: 'Active' | 'Pending' | 'Inactive';
  startDate: string;
  endDate?: string;
  contact: {
    name: string;
    position: string;
    email: string;
    phone: string;
  };
  location: string;
  industry: string;
  advantagesFromUs: string[];
  advantagesToUs: string[];
  partnershipDetails: {
    level: 'Gold' | 'Silver' | 'Bronze';
    revenue: {
      amount: number;
      currency: string;
    };
    projectsCompleted: number;
    activeProjects: number;
  };
  agreements: {
    type: string;
    status: string;
    signedDate: string;
    expiryDate: string;
  }[];
  technologies: string[];
  certifications: string[];
  upcomingMilestones: {
    title: string;
    date: string;
    description: string;
  }[];
}

interface PartnerState {
  partners: Partner[];
  addPartner: (partner: Partner) => void;
  updatePartner: (id: string, partner: Partial<Partner>) => void;
  removePartner: (id: string) => void;
}

const initialPartners: Partner[] = [
  {
    id: '1',
    name: 'TechVision Solutions',
    type: 'Technology',
    status: 'Active',
    startDate: '2024-01',
    contact: {
      name: 'Jean Dupont',
      position: 'Partnership Director',
      email: 'jean.dupont@techvision.com',
      phone: '+33 1 23 45 67 89'
    },
    location: 'Paris, France',
    industry: 'Software Development',
    advantagesFromUs: [
      'Access to our AI technology stack',
      'Co-marketing opportunities',
      'Priority support channels',
      'Joint venture possibilities'
    ],
    advantagesToUs: [
      'Extended market reach',
      'Technical expertise in cloud solutions',
      'Industry-specific knowledge',
      'Complementary product offerings'
    ],
    partnershipDetails: {
      level: 'Gold',
      revenue: {
        amount: 500000,
        currency: 'EUR'
      },
      projectsCompleted: 12,
      activeProjects: 3
    },
    agreements: [
      {
        type: 'Master Service Agreement',
        status: 'Active',
        signedDate: '2024-01-15',
        expiryDate: '2027-01-15'
      },
      {
        type: 'Data Processing Agreement',
        status: 'Active',
        signedDate: '2024-01-15',
        expiryDate: '2027-01-15'
      }
    ],
    technologies: ['Cloud Computing', 'AI/ML', 'Big Data', 'DevOps'],
    certifications: ['ISO 27001', 'ISO 9001', 'Cloud Security Alliance'],
    upcomingMilestones: [
      {
        title: 'Joint Product Launch',
        date: '2025-04',
        description: 'Launch of integrated AI solution'
      },
      {
        title: 'Partnership Review',
        date: '2025-06',
        description: 'Annual partnership performance review'
      }
    ]
  },
  {
    id: '2',
    name: 'DataFlow Analytics',
    type: 'Strategic',
    status: 'Active',
    startDate: '2023-06',
    contact: {
      name: 'Marie Lambert',
      position: 'CEO',
      email: 'marie.lambert@dataflow.com',
      phone: '+33 1 98 76 54 32'
    },
    location: 'Lyon, France',
    industry: 'Data Analytics',
    advantagesFromUs: [
      'Early access to new features',
      'Dedicated support team',
      'Training and certification',
      'Revenue sharing model'
    ],
    advantagesToUs: [
      'Data analytics expertise',
      'Enterprise client base',
      'Research collaboration',
      'Market intelligence'
    ],
    partnershipDetails: {
      level: 'Silver',
      revenue: {
        amount: 250000,
        currency: 'EUR'
      },
      projectsCompleted: 8,
      activeProjects: 2
    },
    agreements: [
      {
        type: 'Strategic Alliance Agreement',
        status: 'Active',
        signedDate: '2023-06-01',
        expiryDate: '2026-06-01'
      }
    ],
    technologies: ['Data Analytics', 'Machine Learning', 'Business Intelligence'],
    certifications: ['ISO 27001', 'GDPR Compliance'],
    upcomingMilestones: [
      {
        title: 'Market Expansion',
        date: '2025-03',
        description: 'Joint entry into DACH market'
      }
    ]
  }
];

export const usePartnerStore = create<PartnerState>()(
  persist(
    (set) => ({
      partners: initialPartners,
      addPartner: (partner) => set((state) => ({ partners: [...state.partners, partner] })),
      updatePartner: (id, partner) => set((state) => ({
        partners: state.partners.map((p) => p.id === id ? { ...p, ...partner } : p),
      })),
      removePartner: (id) => set((state) => ({
        partners: state.partners.filter((p) => p.id !== id),
      })),
    }),
    {
      name: 'partners-storage',
    }
  )
);
