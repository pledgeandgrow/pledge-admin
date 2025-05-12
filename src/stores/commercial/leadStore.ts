import { create } from 'zustand';
import { Lead } from '@/types/commercial';

interface LeadStore {
  leads: Lead[];
  fetchLeads: () => void;
  addLead: (lead: Lead) => void;
  updateLead: (lead: Lead) => void;
  deleteLead: (lead: Lead) => void;
  moveLead: (index: number, direction: 'up' | 'down') => void;
}

export const useLeadStore = create<LeadStore>((set, get) => ({
  leads: [],

  fetchLeads: () => {
    const savedLeads = JSON.parse(localStorage.getItem('leads') || '[]') as Lead[];
    set({ leads: savedLeads });
  },

  addLead: (lead) => {
    const leads = [...get().leads, { ...lead, date: new Date().toISOString().split('T')[0] }];
    localStorage.setItem('leads', JSON.stringify(leads));
    set({ leads });
  },

  updateLead: (updatedLead) => {
    const leads = get().leads.map(lead => 
      lead.email === updatedLead.email ? updatedLead : lead
    );
    localStorage.setItem('leads', JSON.stringify(leads));
    set({ leads });
  },

  deleteLead: (leadToDelete) => {
    const leads = get().leads.filter(lead => lead !== leadToDelete);
    localStorage.setItem('leads', JSON.stringify(leads));
    set({ leads });
  },

  moveLead: (index, direction) => {
    const leads = [...get().leads];
    if (direction === 'up' && index > 0) {
      [leads[index], leads[index - 1]] = [leads[index - 1], leads[index]];
    } else if (direction === 'down' && index < leads.length - 1) {
      [leads[index], leads[index + 1]] = [leads[index + 1], leads[index]];
    }
    localStorage.setItem('leads', JSON.stringify(leads));
    set({ leads });
  },
}));
