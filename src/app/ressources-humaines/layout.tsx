'use client';

import React from 'react';
import { CandidateProvider } from '../../components/ressources-humaines/CandidateContext';

export default function RHLayout({ children }: { children: React.ReactNode }) {
  return (
    <CandidateProvider>
      {children}
    </CandidateProvider>
  );
}
