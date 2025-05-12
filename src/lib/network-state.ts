import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NetworkEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  type: 'Conference' | 'Meetup' | 'Workshop' | 'Networking' | 'Other';
  description: string;
  attendees: number;
  status: 'Upcoming' | 'Past' | 'Cancelled';
  organizer: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface NetworkContact {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  email: string;
  phone: string;
  location: string;
  interests: string[];
  expertise: string[];
  status: 'Active' | 'Inactive' | 'Potential';
  source: string;
  lastContact: string;
  nextFollowUp?: string;
  notes: string;
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  tags: string[];
  interactions: {
    date: string;
    type: 'Meeting' | 'Call' | 'Email' | 'Event' | 'Other';
    notes: string;
    outcome: string;
  }[];
  opportunities: {
    title: string;
    type: 'Collaboration' | 'Business' | 'Investment' | 'Other';
    status: 'Active' | 'Completed' | 'Pending' | 'Cancelled';
    description: string;
    date: string;
  }[];
}

interface NetworkState {
  contacts: NetworkContact[];
  events: NetworkEvent[];
  addContact: (contact: NetworkContact) => void;
  updateContact: (id: string, contact: Partial<NetworkContact>) => void;
  removeContact: (id: string) => void;
  addEvent: (event: NetworkEvent) => void;
  updateEvent: (id: string, event: Partial<NetworkEvent>) => void;
  removeEvent: (id: string) => void;
}

export const useNetworkStore = create<NetworkState>()(
  persist(
    (set) => ({
      contacts: [
        {
          id: '1',
          name: 'Sarah Chen',
          title: 'Chief Technology Officer',
          company: 'TechVision AI',
          email: 'sarah.chen@techvision.ai',
          phone: '+33 6 12 34 56 78',
          location: 'Paris, France',
          status: 'Active',
          expertise: ['Artificial Intelligence', 'Machine Learning', 'Cloud Architecture'],
          interests: ['Deep Tech', 'Sustainable Technology', 'Innovation'],
          notes: 'Met at AI Summit 2024. Interested in collaboration on AI projects.',
          lastContact: '2025-02-20',
          nextFollowUp: '2025-03-15'
        },
        {
          id: '2',
          name: 'Marc Dubois',
          title: 'Investment Director',
          company: 'Green Future Capital',
          email: 'marc.dubois@greenfuture.vc',
          phone: '+33 6 98 76 54 32',
          location: 'Lyon, France',
          status: 'Potential',
          expertise: ['Venture Capital', 'CleanTech', 'Sustainability'],
          interests: ['Impact Investing', 'Renewable Energy', 'Climate Tech'],
          notes: 'Introduced through LinkedIn. Looking for investment opportunities in sustainable technology.',
          lastContact: '2025-02-15',
          nextFollowUp: '2025-03-01'
        }
      ],
      events: [],
      addContact: (contact) => set((state) => ({ contacts: [...state.contacts, { ...contact, id: String(state.contacts.length + 1) }]})),
      updateContact: (id, contact) => set((state) => ({
        contacts: state.contacts.map((c) => c.id === id ? { ...c, ...contact } : c),
      })),
      removeContact: (id) => set((state) => ({
        contacts: state.contacts.filter((c) => c.id !== id),
      })),
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEvent: (id, event) => set((state) => ({
        events: state.events.map((e) => e.id === id ? { ...e, ...event } : e),
      })),
      removeEvent: (id) => set((state) => ({
        events: state.events.filter((e) => e.id !== id),
      })),
    }),
    {
      name: 'network-storage',
    }
  )
);
