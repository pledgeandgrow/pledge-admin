'use client';

import React from 'react';
import { Candidate } from '../CandidateContext';

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  candidate: Candidate;
  setCandidate: React.Dispatch<React.SetStateAction<Candidate>>;
}

const CandidateModal: React.FC<CandidateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  candidate,
  setCandidate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          {candidate.id ? 'Modifier le Candidat' : 'Ajouter un Candidat'}
        </h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Nom</label>
            <input 
              type="text" 
              value={candidate.name} 
              onChange={(e) => setCandidate({ ...candidate, name: e.target.value })} 
              className="border rounded w-full px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              required 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Email</label>
            <input 
              type="email" 
              value={candidate.email} 
              onChange={(e) => setCandidate({ ...candidate, email: e.target.value })} 
              className="border rounded w-full px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              required 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Numéro</label>
            <input 
              type="text" 
              value={candidate.phone} 
              onChange={(e) => setCandidate({ ...candidate, phone: e.target.value })} 
              className="border rounded w-full px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              required 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Formations (en cours)</label>
            <input 
              type="text" 
              value={candidate.formations} 
              onChange={(e) => setCandidate({ ...candidate, formations: e.target.value })} 
              className="border rounded w-full px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Domaine d&apos;études</label>
            <input 
              type="text" 
              value={candidate.domaineEtudes} 
              onChange={(e) => setCandidate({ ...candidate, domaineEtudes: e.target.value })} 
              className="border rounded w-full px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Compétences</label>
            <input 
              type="text" 
              value={candidate.competences} 
              onChange={(e) => setCandidate({ ...candidate, competences: e.target.value })} 
              className="border rounded w-full px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Status</label>
            <select 
              value={candidate.status} 
              onChange={(e) => setCandidate({ 
                ...candidate, 
                status: e.target.value as Candidate['status']
              })} 
              className="border rounded w-full px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Prise de contact">Prise de contact</option>
              <option value="Entretien">Entretien</option>
              <option value="Qualification">Qualification</option>
              <option value="Décision finale">Décision finale</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">CV</label>
            <input 
              type="file" 
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  setCandidate({ ...candidate, cv: files[0] });
                }
              }} 
              className="border rounded w-full px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              required={!candidate.id}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {candidate.id ? 'Mettre à jour' : 'Ajouter'}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-gray-300 hover:bg-gray-400 text-black dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white px-4 py-2 rounded-lg transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateModal;
