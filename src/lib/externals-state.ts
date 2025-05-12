import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  status: 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
  budget: {
    amount: number;
    currency: string;
  };
  description: string;
  deliverables: string[];
  milestones: {
    title: string;
    date: string;
    status: 'Pending' | 'Completed' | 'Delayed';
    description: string;
  }[];
}

export interface Contract {
  id: string;
  type: 'Project' | 'Retainer' | 'Time & Materials' | 'Fixed Price';
  startDate: string;
  endDate?: string;
  terms: string[];
  rate: {
    amount: number;
    currency: string;
    unit: 'Hour' | 'Day' | 'Month' | 'Project';
  };
  documents: {
    name: string;
    type: string;
    url: string;
    date: string;
  }[];
}

export interface External {
  id: string;
  name: string;
  type: 'Agency' | 'Consultant' | 'Contractor' | 'Service Provider';
  status: 'Active' | 'Available' | 'Unavailable' | 'Past';
  contact: {
    name: string;
    position: string;
    email: string;
    phone: string;
  };
  company: {
    name: string;
    website: string;
    location: string;
    size: string;
    founded: string;
  };
  expertise: string[];
  services: string[];
  projects: Project[];
  contracts: Contract[];
  performance: {
    rating: number;
    reviews: {
      date: string;
      rating: number;
      comment: string;
      reviewer: string;
      project: string;
    }[];
    strengths: string[];
    areas_for_improvement: string[];
  };
  financials: {
    rateRange: {
      min: number;
      max: number;
      currency: string;
    };
    totalBilled: number;
    outstandingAmount: number;
    currency: string;
  };
  compliance: {
    insurance: {
      type: string;
      provider: string;
      expiryDate: string;
      coverage: number;
    }[];
    certifications: {
      name: string;
      issuer: string;
      date: string;
      expiryDate?: string;
    }[];
    documents: {
      name: string;
      type: string;
      url: string;
      date: string;
    }[];
  };
  notes: string;
  lastContact: string;
  nextFollowUp?: string;
}

interface ExternalState {
  externals: External[];
  addExternal: (external: External) => void;
  updateExternal: (id: string, external: Partial<External>) => void;
  removeExternal: (id: string) => void;
}

export const useExternalStore = create<ExternalState>()(
  persist(
    (set) => ({
      externals: [],
      addExternal: (external) => set((state) => ({ externals: [...state.externals, external] })),
      updateExternal: (id, external) => set((state) => ({
        externals: state.externals.map((e) => e.id === id ? { ...e, ...external } : e),
      })),
      removeExternal: (id) => set((state) => ({
        externals: state.externals.filter((e) => e.id !== id),
      })),
    }),
    {
      name: 'externals-storage',
    }
  )
);
