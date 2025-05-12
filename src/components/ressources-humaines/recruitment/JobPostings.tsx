'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Building, Clock, Search, Plus, X } from 'lucide-react';

interface JobPosting {
  titre: string;
  departement: string;
  typeContrat: string;
  competencesRequises: string[];
}

interface JobPostingsProps {
  postesOuverts: JobPosting[];
}

const JobPostings: React.FC<JobPostingsProps> = ({ postesOuverts }) => {
  const [newPoste, setNewPoste] = useState<JobPosting & { nouvelleCompetence: string }>({
    titre: '',
    departement: '',
    typeContrat: '',
    competencesRequises: [],
    nouvelleCompetence: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showNewJobForm, setShowNewJobForm] = useState(false);

  const handleAddCompetence = () => {
    if (newPoste.nouvelleCompetence && !newPoste.competencesRequises.includes(newPoste.nouvelleCompetence)) {
      setNewPoste({
        ...newPoste,
        competencesRequises: [...newPoste.competencesRequises, newPoste.nouvelleCompetence],
        nouvelleCompetence: ''
      });
    }
  };

  const handleRemoveCompetence = (competence: string) => {
    setNewPoste({
      ...newPoste,
      competencesRequises: newPoste.competencesRequises.filter(c => c !== competence)
    });
  };

  const handleCreateJob = () => {
    // This would typically send the data to an API or update a context
    console.log('Creating new job posting:', newPoste);
    // Reset form after submission
    setNewPoste({
      titre: '',
      departement: '',
      typeContrat: '',
      competencesRequises: [],
      nouvelleCompetence: ''
    });
  };

  const filteredJobs = postesOuverts.filter(job => {
    const matchesSearch = 
      job.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.departement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.competencesRequises.some(comp => comp.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = departmentFilter === 'all' || job.departement === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  // Get unique departments for filtering
  const departments = Array.from(new Set(postesOuverts.map(job => job.departement)));

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Postes Ouverts</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Consultez et gérez les offres d'emploi actuellement disponibles
              </CardDescription>
            </div>
            <Button 
              onClick={() => setShowNewJobForm(!showNewJobForm)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white"
            >
              {showNewJobForm ? (
                <>
                  <X className="h-4 w-4" />
                  Annuler
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Nouveau poste
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showNewJobForm && (
            <Card className="mb-6 bg-gray-50 dark:bg-gray-700 border dark:border-gray-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Créer un nouveau poste</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Titre du poste</label>
                    <Input 
                      value={newPoste.titre} 
                      onChange={(e) => setNewPoste({...newPoste, titre: e.target.value})}
                      placeholder="ex: Développeur Full Stack"
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Département</label>
                    <Input 
                      value={newPoste.departement} 
                      onChange={(e) => setNewPoste({...newPoste, departement: e.target.value})}
                      placeholder="ex: Technologie"
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type de contrat</label>
                  <select 
                    value={newPoste.typeContrat} 
                    onChange={(e) => setNewPoste({...newPoste, typeContrat: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Stage">Stage</option>
                    <option value="Alternance">Alternance</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Compétences requises</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newPoste.competencesRequises.map((competence, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                        {competence}
                        <button 
                          onClick={() => handleRemoveCompetence(competence)}
                          className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      value={newPoste.nouvelleCompetence} 
                      onChange={(e) => setNewPoste({...newPoste, nouvelleCompetence: e.target.value})}
                      placeholder="Ajouter une compétence"
                      className="flex-grow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCompetence())}
                    />
                    <Button 
                      onClick={handleAddCompetence}
                      variant="outline"
                      className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      Ajouter
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewJobForm(false)}
                  className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleCreateJob}
                  disabled={!newPoste.titre || !newPoste.departement || !newPoste.typeContrat}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Créer le poste
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <Input
                type="text"
                placeholder="Rechercher un poste..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les départements</option>
              {Array.from(new Set(postesOuverts.map(poste => poste.departement))).map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((poste, index) => (
                <Card key={index} className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                        {poste.titre}
                      </CardTitle>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {poste.typeContrat}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <Building className="h-3.5 w-3.5" />
                      {poste.departement}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Compétences requises:</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {poste.competencesRequises.map((competence, i) => (
                            <Badge key={i} variant="outline" className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600">
                              {competence}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                        >
                          Voir détails
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-blue-600 dark:text-blue-400 border-gray-200 dark:border-gray-700"
                        >
                          Candidatures
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Aucun poste ne correspond à votre recherche</p>
              <Button 
                variant="outline" 
                onClick={() => setShowNewJobForm(true)}
                className="text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer un nouveau poste
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobPostings;
