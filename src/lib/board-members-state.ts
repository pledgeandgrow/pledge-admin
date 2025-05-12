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
      summary: "En tant que CFO, superviser la stratégie financière et la gestion des ressources de l'entreprise.",
      roles: [
        "Gérer la stratégie financière globale",
        "Superviser la comptabilité et le reporting",
        "Optimiser la structure financière"
      ],
      missions: [
        "Assurer la santé financière de l'entreprise",
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
  },
  {
    id: '4',
    name: 'Louis JUNQUA-SALANNE',
    position: 'COO',
    email: 'louis.junqua@pledgeandgrow.com',
    phone: '+44 7535 740594',
    location: 'London',
    department: 'Operations',
    status: 'Active',
    responsibilities: ['Operations Management'],
    jobDescription: {
      summary: "En tant que COO, assurer l'excellence opérationnelle et l'efficacité de l'entreprise.",
      roles: [
        "Superviser les opérations quotidiennes",
        "Optimiser les processus opérationnels",
        "Gérer la performance opérationnelle"
      ],
      missions: [
        "Améliorer l'efficacité opérationnelle",
        "Développer les capacités opérationnelles",
        "Assurer la qualité des services",
        "Gérer les ressources opérationnelles"
      ]
    },
    languages: [
      { language: 'French', level: 'Native' },
      { language: 'English', level: 'Fluent' }
    ],
    education: []
  },
  {
    id: '5',
    name: 'Maxime NEAU',
    position: 'Ambassadeur',
    email: 'maxime.neau@pledgeandgrow.com',
    phone: '+33 7 80 02 14 90',
    location: 'Paris',
    department: 'Relations',
    status: 'Active',
    responsibilities: ['Public Relations'],
    jobDescription: {
      summary: "En tant qu'Ambassadeur, représenter l'entreprise et développer son réseau de relations.",
      roles: [
        "Représenter l'entreprise lors d'événements",
        "Développer des partenariats stratégiques",
        "Promouvoir la marque et les valeurs"
      ],
      missions: [
        "Établir des relations durables",
        "Identifier des opportunités de collaboration",
        "Renforcer la présence de l'entreprise",
        "Faciliter les connexions stratégiques"
      ]
    },
    languages: [
      { language: 'French', level: 'Native' },
      { language: 'English', level: 'Fluent' }
    ],
    education: []
  },
  {
    id: '6',
    name: 'Mehdi OUALI',
    position: 'CSMO',
    email: 'mehdi.ouali@pledgeandgrow.com',
    phone: '+33 6 15 97 47 61',
    location: 'Paris',
    department: 'Marketing',
    status: 'Active',
    responsibilities: ['Marketing Strategy'],
    jobDescription: {
      summary: "En tant que CSMO, diriger la stratégie marketing et commerciale de l'entreprise.",
      roles: [
        "Définir la stratégie marketing globale",
        "Superviser les campagnes marketing",
        "Développer la présence sur le marché"
      ],
      missions: [
        "Accroître la visibilité de la marque",
        "Générer des leads qualifiés",
        "Optimiser le ROI marketing",
        "Développer les canaux de distribution"
      ]
    },
    languages: [
      { language: 'French', level: 'Native' },
      { language: 'English', level: 'Fluent' }
    ],
    education: []
  },
  {
    id: '7',
    name: 'Lyna HAMMOUD',
    position: 'CCO',
    email: 'lyna.hammoud@pledgeandgrow.com',
    phone: '+33 6 52 80 46 71',
    location: 'Paris',
    department: 'Communications',
    status: 'Active',
    responsibilities: ['Communication Strategy'],
    jobDescription: {
      summary: "En tant que CCO, diriger la stratégie de communication et l'image de l'entreprise.",
      roles: [
        "Définir la stratégie de communication",
        "Gérer la communication corporate",
        "Superviser les relations médias"
      ],
      missions: [
        "Renforcer l'image de marque",
        "Gérer la communication de crise",
        "Développer la communication interne",
        "Assurer la cohérence des messages"
      ]
    },
    languages: [
      { language: 'French', level: 'Native' },
      { language: 'English', level: 'Fluent' }
    ],
    education: []
  },
  {
    id: '8',
    name: 'Seydina FAYE',
    position: 'CSO',
    email: 'seydina.faye@pledgeandgrow.com',
    phone: '+33 7 84 32 31 72',
    location: 'Paris',
    department: 'Strategy',
    status: 'Active',
    responsibilities: ['Strategic Planning'],
    jobDescription: {
      summary: "En tant que CSO, développer et mettre en œuvre la stratégie de croissance de l'entreprise.",
      roles: [
        "Définir la stratégie de développement",
        "Identifier les opportunités de croissance",
        "Analyser les tendances du marché"
      ],
      missions: [
        "Élaborer le plan stratégique",
        "Piloter les projets stratégiques",
        "Évaluer les opportunités d'expansion",
        "Optimiser le positionnement"
      ]
    },
    languages: [
      { language: 'French', level: 'Native' },
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
