import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BoardMember {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  location: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Remote';
  responsibilities: string[];
  jobDescription: {
    summary: string;
    roles: string[];
    missions: string[];
  };
  languages: {
    language: string;
    level: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
}

const initialBoardMembers: BoardMember[] = [
  {
    id: '1',
    name: 'Mehdi BEREL',
    position: 'CEO',
    email: 'mehdi.berel@pledgeandgrow.com',
    phone: '+33 7 53 69 58 40',
    location: 'Paris',
    department: 'Executive',
    status: 'Active',
    responsibilities: ['Strategic Leadership'],
    jobDescription: {
      summary: "En tant que CEO, diriger l'orientation stratégique globale de l'entreprise et assurer sa croissance durable.",
      roles: [
        "Définir et mettre en œuvre la vision et la stratégie de l'entreprise",
        "Développer et maintenir des relations avec les partenaires clés",
        "Superviser les opérations globales et la performance de l'entreprise"
      ],
      missions: [
        "Assurer la croissance et la rentabilité de l'entreprise",
        "Représenter l'entreprise auprès des parties prenantes externes",
        "Diriger et inspirer l'équipe de direction",
        "Prendre les décisions stratégiques majeures"
      ]
    },
    languages: [
      { language: 'French', level: 'Native' },
      { language: 'English', level: 'Fluent' }
    ],
    education: []
  },
  {
    id: '2',
    name: 'Shihab BEREL',
    position: 'CTO',
    email: 'shihab.berel@pledgeandgrow.com',
    phone: '+971 50 392 7710',
    location: 'Dubai',
    department: 'Technology',
    status: 'Active',
    responsibilities: ['Technical Strategy'],
    jobDescription: {
      summary: "En tant que CTO, diriger la stratégie technologique et l'innovation de l'entreprise.",
      roles: [
        "Définir la vision technologique et la feuille de route",
        "Superviser le développement des produits et services",
        "Assurer la sécurité et la fiabilité des systèmes"
      ],
      missions: [
        "Diriger l'innovation technologique",
        "Gérer l'équipe technique et les ressources",
        "Optimiser les processus de développement",
        "Garantir l'excellence technique des solutions"
      ]
    },
    languages: [
      { language: 'Arabic', level: 'Native' },
      { language: 'English', level: 'Fluent' }
    ],
    education: []
  },
  {
    id: '3',
    name: 'Ilyas BEREL',
    position: 'CFO',
    email: 'ilyas.berel@pledgeandgrow.com',
    phone: '+971 50 538 5422',
    location: 'Dubai',
    department: 'Finance',
    status: 'Active',
    responsibilities: ['Financial Strategy'],
    jobDescription: {
      summary: "En tant que CFO, superviser la stratégie financière et la gestion des ressources de l&apos;entreprise.",
      roles: [
        "Gérer la stratégie financière globale",
        "Superviser la comptabilité et le reporting",
        "Optimiser la structure financière"
      ],
      missions: [
        "Assurer la santé financière de l&apos;entreprise",
        "Gérer les relations avec les investisseurs",
        "Optimiser la gestion des ressources",
        "Développer les projections financières"
      ]
    },
    languages: [
      { language: 'Arabic', level: 'Native' },
      { language: 'English', level: 'Fluent' }
    ],
    education: []
  }
];

interface BoardMemberState {
  boardMembers: BoardMember[];
  addBoardMember: (member: BoardMember) => void;
  updateBoardMember: (id: string, member: Partial<BoardMember>) => void;
  removeBoardMember: (id: string) => void;
}

export const useBoardMemberStore = create<BoardMemberState>()(
  persist(
    (set) => ({
      boardMembers: initialBoardMembers,
      addBoardMember: (member) =>
        set((state) => ({
          boardMembers: [...state.boardMembers, member],
        })),
      updateBoardMember: (id, member) =>
        set((state) => ({
          boardMembers: state.boardMembers.map((m) =>
            m.id === id ? { ...m, ...member } : m
          ),
        })),
      removeBoardMember: (id) =>
        set((state) => ({
          boardMembers: state.boardMembers.filter((m) => m.id !== id),
        })),
    }),
    {
      name: 'board-members-storage',
    }
  )
);
