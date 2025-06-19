'use client';

import React, { useState } from 'react';
import { Candidate } from '../CandidateContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Edit, Trash2, Mail, Phone, Briefcase, GraduationCap } from 'lucide-react';

interface CandidateListProps {
  candidats: Candidate[];
  onEditCandidate: (candidate: Candidate) => void;
  onRemoveCandidate: (id: number) => void;
  onOpenModal: () => void;
}

const CandidateList: React.FC<CandidateListProps> = ({ 
  candidats, 
  onEditCandidate, 
  onRemoveCandidate,
  onOpenModal 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Prise de contact':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Entretien initial':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Test technique':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Entretien final':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Offre envoyée':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Refusé':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const filteredCandidates = candidats.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.competences.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Liste des Candidats</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Gérez les candidats pour les postes ouverts
              </CardDescription>
            </div>
            <Button 
              onClick={onOpenModal}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white"
            >
              <UserPlus className="h-4 w-4" />
              Ajouter un candidat
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <Input
                type="text"
                placeholder="Rechercher un candidat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="Prise de contact">Prise de contact</option>
              <option value="Entretien initial">Entretien initial</option>
              <option value="Test technique">Test technique</option>
              <option value="Entretien final">Entretien final</option>
              <option value="Offre envoyée">Offre envoyée</option>
              <option value="Refusé">Refusé</option>
            </select>
          </div>
          
          {filteredCandidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCandidates.map((candidate) => (
                <Card key={candidate.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                        {candidate.name}
                      </CardTitle>
                      <Badge className={getStatusColor(candidate.status)}>
                        {candidate.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      {candidate.domaineEtudes}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{candidate.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{candidate.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <GraduationCap className="h-4 w-4 text-gray-400" />
                        <span>{candidate.formations}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span>{candidate.competences}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                        onClick={() => onEditCandidate(candidate)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 dark:text-red-400 border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                        onClick={() => onRemoveCandidate(candidate.id as number)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Aucun candidat ne correspond à votre recherche</p>
              <Button 
                variant="outline" 
                onClick={onOpenModal}
                className="text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter un candidat
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateList;
