'use client';

import React, { useState, useContext, useEffect } from 'react';
import MegaMenu from '../../../components/layout/MegaMenu';
import { CandidateContext, Candidate } from '../../../components/ressources-humaines/CandidateContext';
import RecruitmentProcess from '../../../components/ressources-humaines/recruitment/RecruitmentProcess';
import CandidateList from '../../../components/ressources-humaines/recruitment/CandidateList';
import JobPostings from '../../../components/ressources-humaines/recruitment/JobPostings';
import CandidateModal from '../../../components/ressources-humaines/recruitment/CandidateModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RecruitmentStep {
  etape: string;
  description: string;
  statut: 'En cours' | 'À venir' | 'À planifier';
  candidatsTraites: number;
  candidatsSelectionnes: number;
}

interface JobPosting {
  titre: string;
  departement: string;
  typeContrat: string;
  competencesRequises: string[];
}

export default function Recrutement() {
  const { candidats, setCandidats } = useContext(CandidateContext);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [newCandidate, setNewCandidate] = useState<Candidate>({ 
    name: '', 
    email: '', 
    phone: '', 
    cv: null, 
    id: null,
    formations: '',
    domaineEtudes: '',
    competences: '',
    status: 'Prise de contact'
  });

  useEffect(() => {
    const storedCandidates = localStorage.getItem('candidates');
    if (storedCandidates) {
      try {
        const parsedCandidates = JSON.parse(storedCandidates);
        // Handle file objects which can't be serialized
        setCandidats(parsedCandidates.map((candidate: any) => ({
          ...candidate,
          cv: null // Reset CV since File objects can't be stored in localStorage
        })));
      } catch (error) {
        console.error('Error parsing stored candidates:', error);
      }
    }
  }, [setCandidats]);

  const processusRecrutement: RecruitmentStep[] = [
    {
      etape: "Prise de contact",
      description: "Réception et tri des candidatures",
      statut: "En cours",
      candidatsTraites: 15,
      candidatsSelectionnes: 8
    },
    {
      etape: "Entretien initial",
      description: "Premier entretien avec le service RH",
      statut: "En cours",
      candidatsTraites: 8,
      candidatsSelectionnes: 5
    },
    {
      etape: "Test technique",
      description: "Évaluation des compétences techniques",
      statut: "À venir",
      candidatsTraites: 0,
      candidatsSelectionnes: 0
    },
    {
      etape: "Entretien final",
      description: "Entretien avec le responsable d'équipe",
      statut: "À planifier",
      candidatsTraites: 0,
      candidatsSelectionnes: 0
    }
  ];

  const postesOuverts: JobPosting[] = [
    {
      titre: "Développeur Full Stack",
      departement: "Technologie",
      typeContrat: "CDI",
      competencesRequises: ["React", "Node.js", "TypeScript", "PostgreSQL"]
    },
    {
      titre: "Chef de Projet Digital",
      departement: "Marketing",
      typeContrat: "CDI",
      competencesRequises: ["Gestion de projet", "Marketing digital", "Analyse de données"]
    },
    {
      titre: "Designer UX/UI",
      departement: "Produit",
      typeContrat: "CDD",
      competencesRequises: ["Figma", "Adobe XD", "Prototypage", "Design System"]
    }
  ];

  const handleOpenModal = () => {
    setIsCandidateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCandidateModalOpen(false);
    setNewCandidate({ 
      name: '', 
      email: '', 
      phone: '', 
      cv: null, 
      id: null,
      formations: '',
      domaineEtudes: '',
      competences: '',
      status: 'Prise de contact'
    });
  };

  const handleAddCandidate = (candidate: Candidate) => {
    const newId = candidats.length > 0 ? Math.max(...candidats.map(c => c.id || 0)) + 1 : 1;
    const newCandidate = { ...candidate, id: newId };
    const updatedCandidates = [...candidats, newCandidate];
    setCandidats(updatedCandidates);
    
    // Store in localStorage (without the File object)
    const candidatesToStore = updatedCandidates.map(c => ({
      ...c,
      cv: null // Don't store File objects
    }));
    localStorage.setItem('candidates', JSON.stringify(candidatesToStore));
    
    handleCloseModal();
  };

  const handleEditCandidate = (candidate: Candidate) => {
    // Implementation for editing a candidate
    console.log('Editing candidate:', candidate);
  };

  const handleRemoveCandidate = (id: number) => {
    const updatedCandidates = candidats.filter(c => c.id !== id);
    setCandidats(updatedCandidates);
    
    // Update localStorage
    const candidatesToStore = updatedCandidates.map(c => ({
      ...c,
      cv: null // Don't store File objects
    }));
    localStorage.setItem('candidates', JSON.stringify(candidatesToStore));
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Gestion du Recrutement
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gérez les candidats, les postes ouverts et suivez le processus de recrutement
          </p>
        </div>
        
        <Tabs defaultValue="processus" className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-1">
            <TabsTrigger value="processus" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">Processus</TabsTrigger>
            <TabsTrigger value="candidats" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">Candidats</TabsTrigger>
            <TabsTrigger value="postesOuverts" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">Postes Ouverts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="processus" className="mt-6">
            <RecruitmentProcess processusRecrutement={processusRecrutement} />
          </TabsContent>
          
          <TabsContent value="candidats" className="mt-6">
            <CandidateList 
              candidats={candidats} 
              onEditCandidate={handleEditCandidate}
              onRemoveCandidate={handleRemoveCandidate}
              onOpenModal={handleOpenModal}
            />
          </TabsContent>
          
          <TabsContent value="postesOuverts" className="mt-6">
            <JobPostings postesOuverts={postesOuverts} />
          </TabsContent>
        </Tabs>
      </div>
      
      {isCandidateModalOpen && (
        <CandidateModal
          isOpen={isCandidateModalOpen}
          onClose={handleCloseModal}
          onSave={handleAddCandidate}
          candidate={newCandidate}
          setCandidate={setNewCandidate}
        />
      )}
    </div>
  );
}
