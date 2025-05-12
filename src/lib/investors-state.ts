import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Investment {
  amount: number;
  currency: string;
  date: string;
  type: 'Seed' | 'Series A' | 'Series B' | 'Growth' | 'Other';
  equity: number;
  valuation: number;
}

export interface InvestorProfile {
  focus: string[];
  stage: string[];
  geography: string[];
  ticketSize: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface Investor {
  id: string;
  name: string;
  type: 'VC' | 'Angel' | 'Corporate' | 'Family Office' | 'Other';
  status: 'Active' | 'Prospective' | 'Past' | 'Inactive';
  contact: {
    name: string;
    position: string;
    email: string;
    phone: string;
  };
  location: string;
  website: string;
  portfolio: {
    companyName: string;
    industry: string;
    stage: string;
  }[];
  investments: Investment[];
  profile: InvestorProfile;
  interests: string[];
  expertise: string[];
  notes: string;
  lastContact: string;
  nextFollowUp: string;
  documents: {
    name: string;
    type: string;
    url: string;
    date: string;
  }[];
  events: {
    title: string;
    date: string;
    type: 'Meeting' | 'Call' | 'Pitch' | 'Due Diligence' | 'Other';
    notes: string;
  }[];
}

interface InvestorState {
  investors: Investor[];
  addInvestor: (investor: Investor) => void;
  updateInvestor: (id: string, investor: Partial<Investor>) => void;
  removeInvestor: (id: string) => void;
}

export const useInvestorStore = create<InvestorState>()(
  persist(
    (set) => ({
      investors: [],
      addInvestor: (investor) => set((state) => ({ investors: [...state.investors, investor] })),
      updateInvestor: (id, investor) => set((state) => ({
        investors: state.investors.map((i) => i.id === id ? { ...i, ...investor } : i),
      })),
      removeInvestor: (id) => set((state) => ({
        investors: state.investors.filter((i) => i.id !== id),
      })),
    }),
    {
      name: 'investors-storage',
    }
  )
);
