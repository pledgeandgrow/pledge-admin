import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Member {
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

const initialMembers: Member[] = [
  {
    id: '1',
    name: 'Sarah Martin',
    position: 'Senior Developer',
    email: 'sarah.martin@pledgeandgrow.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris',
    department: 'Technology',
    status: 'Active',
    responsibilities: ['Frontend Development', 'UI/UX Design'],
    jobDescription: {
      summary: "En tant que Senior Developer, diriger le développement technique des projets et mentorer l'équipe.",
      roles: [
        "Développer des solutions techniques innovantes",
        "Assurer la qualité du code et les bonnes pratiques",
        "Participer aux revues de code et au mentorat"
      ],
      missions: [
        "Concevoir et implémenter des fonctionnalités clés",
        "Optimiser les performances des applications",
        "Former et accompagner les développeurs juniors",
        "Contribuer à l'architecture technique"
      ]
    },
    languages: [
      { language: 'French', level: 'Native' },
      { language: 'English', level: 'Fluent' }
    ],
    education: [
      {
        degree: 'Master en Informatique',
        institution: 'École 42',
        year: '2018'
      }
    ]
  },
  {
    id: '2',
    name: 'Thomas Bernard',
    position: 'Product Manager',
    email: 'thomas.bernard@pledgeandgrow.com',
    phone: '+33 6 23 45 67 89',
    location: 'Paris',
    department: 'Product',
    status: 'Active',
    responsibilities: ['Product Strategy', 'User Research'],
    jobDescription: {
      summary: "En tant que Product Manager, définir et exécuter la stratégie produit pour maximiser la valeur pour les utilisateurs.",
      roles: [
        "Définir la roadmap produit",
        "Analyser les besoins utilisateurs",
        "Coordonner avec les équipes de développement"
      ],
      missions: [
        "Identifier les opportunités de marché",
        "Prioriser les fonctionnalités",
        "Mesurer et optimiser les KPIs",
        "Assurer la satisfaction utilisateur"
      ]
    },
    languages: [
      { language: 'French', level: 'Native' },
      { language: 'English', level: 'Fluent' }
    ],
    education: [
      {
        degree: 'Master en Management de Produit',
        institution: 'ESSEC Business School',
        year: '2019'
      }
    ]
  },
  {
    id: '3',
    name: 'Julie Dubois',
    position: 'UX Designer',
    email: 'julie.dubois@pledgeandgrow.com',
    phone: '+33 6 34 56 78 90',
    location: 'Paris',
    department: 'Design',
    status: 'Active',
    responsibilities: ['User Experience', 'Interface Design'],
    jobDescription: {
      summary: "En tant que UX Designer, créer des expériences utilisateur intuitives et engageantes.",
      roles: [
        "Concevoir les parcours utilisateur",
        "Créer des wireframes et prototypes",
        "Réaliser des tests utilisateurs"
      ],
      missions: [
        "Améliorer l'expérience utilisateur",
        "Standardiser le design system",
        "Collaborer avec les développeurs",
        "Innover dans les interactions"
      ]
    },
    languages: [
      { language: 'French', level: 'Native' },
      { language: 'English', level: 'Professional' }
    ],
    education: [
      {
        degree: 'Master en Design Numérique',
        institution: 'ENSCI Les Ateliers',
        year: '2020'
      }
    ]
  }
];

interface MemberState {
  members: Member[];
  addMember: (member: Member) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  removeMember: (id: string) => void;
}

export const useMemberStore = create<MemberState>()(
  persist(
    (set) => ({
      members: initialMembers,
      addMember: (member) =>
        set((state) => ({
          members: [...state.members, member],
        })),
      updateMember: (id, member) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, ...member } : m
          ),
        })),
      removeMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
        })),
    }),
    {
      name: 'members-storage',
    }
  )
);
