import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Freelancer {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  department: string;
  location: string;
  rate: string;
  availability: string;
  skills: string[];
  languages: {
    language: string;
    level: string;
  }[];
  experience: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
}

interface FreelancerState {
  freelancers: Freelancer[];
  addFreelancer: (freelancer: Freelancer) => void;
  updateFreelancer: (id: string, freelancer: Partial<Freelancer>) => void;
  removeFreelancer: (id: string) => void;
}

const initialFreelancers: Freelancer[] = [
  {
    id: '1',
    name: 'Sophie Martin',
    position: 'Full Stack Developer',
    email: 'sophie.martin@email.com',
    phone: '+33 6 12 34 56 78',
    department: 'Technology',
    location: 'Paris',
    rate: '600€/day',
    availability: 'Available from March 2025',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
    languages: [
      { language: 'French', level: 'Native' },
      { language: 'English', level: 'Fluent' },
    ],
    experience: [
      {
        company: 'Tech Solutions SA',
        role: 'Senior Developer',
        duration: '2020-2024',
        description: 'Led development of enterprise web applications',
      },
      {
        company: 'Digital Agency',
        role: 'Web Developer',
        duration: '2018-2020',
        description: 'Developed responsive websites for clients',
      },
    ],
    education: [
      {
        degree: 'Master in Computer Science',
        institution: 'École Polytechnique',
        year: '2018',
      },
    ],
  },
  {
    id: '2',
    name: 'Lucas Bernard',
    position: 'UX/UI Designer',
    email: 'lucas.bernard@email.com',
    phone: '+33 6 98 76 54 32',
    department: 'Design',
    location: 'Lyon',
    rate: '500€/day',
    availability: 'Currently Available',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'User Research', 'Prototyping'],
    languages: [
      { language: 'French', level: 'Native' },
      { language: 'English', level: 'Professional' },
      { language: 'Spanish', level: 'Basic' },
    ],
    experience: [
      {
        company: 'Design Studio',
        role: 'Senior UX Designer',
        duration: '2019-2024',
        description: 'Created user-centered designs for mobile and web applications',
      },
    ],
    education: [
      {
        degree: 'Bachelor in Digital Design',
        institution: 'ESAD',
        year: '2019',
      },
    ],
  },
];

export const useFreelancerStore = create<FreelancerState>()(
  persist(
    (set) => ({
      freelancers: initialFreelancers,
      addFreelancer: (freelancer) => set((state) => ({ freelancers: [...state.freelancers, freelancer] })),
      updateFreelancer: (id, freelancer) => set((state) => ({
        freelancers: state.freelancers.map((f) => f.id === id ? { ...f, ...freelancer } : f),
      })),
      removeFreelancer: (id) => set((state) => ({
        freelancers: state.freelancers.filter((f) => f.id !== id),
      })),
    }),
    {
      name: 'freelancers-storage',
    }
  )
);
