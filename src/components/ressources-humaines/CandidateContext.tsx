'use client';

import React, { createContext, useState, ReactNode } from 'react';

export interface Candidate {
  id: number | null;
  name: string;
  email: string;
  phone: string;
  cv: File | null;
  formations: string;
  domaineEtudes: string;
  competences: string;
  status: 'Prise de contact' | 'Entretien' | 'Qualification' | 'Décision finale';
}

interface CandidateContextType {
  candidats: Candidate[];
  setCandidats: React.Dispatch<React.SetStateAction<Candidate[]>>;
}

export const CandidateContext = createContext<CandidateContextType>({
  candidats: [],
  setCandidats: () => {},
});

interface CandidateProviderProps {
  children: ReactNode;
}

export const CandidateProvider: React.FC<CandidateProviderProps> = ({ children }) => {
  const [candidats, setCandidats] = useState<Candidate[]>([]);

  return (
    <CandidateContext.Provider value={{ candidats, setCandidats }}>
      {children}
    </CandidateContext.Provider>
  );
};
