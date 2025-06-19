'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Users, Award, Calendar, Edit, Trash2, Plus, Search } from 'lucide-react';

interface Formation {
  id: number;
  titre: string;
  categorie: string;
  duree: string;
  niveau: string;
  participants: number;
  description: string;
  dateProchaineSessions: string[];
  formateur: string;
  competencesAcquises: string[];
}

export function FormationCatalogue() {
  const [formations, setFormations] = useState<Formation[]>([
    {
      id: 1,
      titre: 'Développement Web Avancé',
      categorie: 'Technique',
      duree: '35 heures',
      niveau: 'Avancé',
      participants: 12,
      description: 'Formation approfondie sur les frameworks modernes et les meilleures pratiques de développement web.',
      dateProchaineSessions: ['2025-03-15', '2025-04-22'],
      formateur: 'Jean Dupont',
      competencesAcquises: ['React', 'Node.js', 'TypeScript', 'API REST']
    },
    {
      id: 2,
      titre: 'Leadership et Management d\'Équipe',
      categorie: 'Management',
      duree: '21 heures',
      niveau: 'Intermédiaire',
      participants: 8,
      description: 'Apprenez à diriger efficacement une équipe et à développer vos compétences en leadership.',
      dateProchaineSessions: ['2025-03-10', '2025-05-05'],
      formateur: 'Marie Martin',
      competencesAcquises: ['Communication', 'Délégation', 'Gestion de conflits', 'Motivation d\'équipe']
    },
    {
      id: 3,
      titre: 'Cybersécurité Fondamentale',
      categorie: 'Sécurité',
      duree: '14 heures',
      niveau: 'Débutant',
      participants: 15,
      description: 'Introduction aux principes fondamentaux de la cybersécurité et aux bonnes pratiques.',
      dateProchaineSessions: ['2025-04-05'],
      formateur: 'Paul Lefebvre',
      competencesAcquises: ['Sécurité des données', 'Prévention des attaques', 'RGPD', 'Authentification']
    },
    {
      id: 4,
      titre: 'Communication Professionnelle',
      categorie: 'Soft Skills',
      duree: '14 heures',
      niveau: 'Tous niveaux',
      participants: 10,
      description: 'Améliorez vos compétences en communication écrite et orale dans un contexte professionnel.',
      dateProchaineSessions: ['2025-03-20', '2025-04-15', '2025-05-10'],
      formateur: 'Sophie Dubois',
      competencesAcquises: ['Prise de parole', 'Rédaction professionnelle', 'Écoute active', 'Négociation']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategorie, setFilterCategorie] = useState('all');
  const [filterNiveau, setFilterNiveau] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFormation, setNewFormation] = useState<Omit<Formation, 'id'>>({
    titre: '',
    categorie: '',
    duree: '',
    niveau: '',
    participants: 0,
    description: '',
    dateProchaineSessions: [''],
    formateur: '',
    competencesAcquises: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewFormation({
      ...newFormation,
      [name]: value
    });
  };

  const handleCompetencesChange = (value: string) => {
    setNewFormation({
      ...newFormation,
      competencesAcquises: value.split(',').map(comp => comp.trim()).filter(comp => comp !== '')
    });
  };

  const handleDatesChange = (value: string) => {
    setNewFormation({
      ...newFormation,
      dateProchaineSessions: value.split(',').map(date => date.trim()).filter(date => date !== '')
    });
  };

  const handleAddFormation = () => {
    const formationToAdd = {
      ...newFormation,
      id: formations.length + 1,
      participants: Number(newFormation.participants)
    };
    
    setFormations([...formations, formationToAdd]);
    setIsAddDialogOpen(false);
    
    // Reset form
    setNewFormation({
      titre: '',
      categorie: '',
      duree: '',
      niveau: '',
      participants: 0,
      description: '',
      dateProchaineSessions: [''],
      formateur: '',
      competencesAcquises: []
    });
  };

  const handleDeleteFormation = (id: number) => {
    setFormations(formations.filter(formation => formation.id !== id));
  };

  const filteredFormations = formations.filter(formation => {
    const matchesSearch = formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         formation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.formateur.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategorie = filterCategorie === 'all' || formation.categorie === filterCategorie;
    const matchesNiveau = filterNiveau === 'all' || formation.niveau === filterNiveau;
    
    return matchesSearch && matchesCategorie && matchesNiveau;
  });

  const categories = [...new Set(formations.map(formation => formation.categorie))];
  const niveaux = [...new Set(formations.map(formation => formation.niveau))];

  return (
    <div className="space-y-6">
      <Card className="border dark:border-gray-700">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-gray-900 dark:text-white">Catalogue de formations</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Parcourez et gérez les formations disponibles
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" /> Ajouter une formation
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] dark:bg-gray-800 dark:border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-white">Ajouter une nouvelle formation</DialogTitle>
                  <DialogDescription className="text-gray-500 dark:text-gray-400">
                    Complétez les informations pour ajouter une formation au catalogue
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="titre" className="text-gray-900 dark:text-white">Titre</Label>
                      <Input
                        id="titre"
                        name="titre"
                        value={newFormation.titre}
                        onChange={handleInputChange}
                        required
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="formateur" className="text-gray-900 dark:text-white">Formateur</Label>
                      <Input
                        id="formateur"
                        name="formateur"
                        value={newFormation.formateur}
                        onChange={handleInputChange}
                        required
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="categorie" className="text-gray-900 dark:text-white">Catégorie</Label>
                      <Select 
                        value={newFormation.categorie} 
                        onValueChange={(value) => setNewFormation({...newFormation, categorie: value})}
                      >
                        <SelectTrigger id="categorie" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                          <SelectItem value="Technique">Technique</SelectItem>
                          <SelectItem value="Management">Management</SelectItem>
                          <SelectItem value="Sécurité">Sécurité</SelectItem>
                          <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                          <SelectItem value="Réglementaire">Réglementaire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="niveau" className="text-gray-900 dark:text-white">Niveau</Label>
                      <Select 
                        value={newFormation.niveau} 
                        onValueChange={(value) => setNewFormation({...newFormation, niveau: value})}
                      >
                        <SelectTrigger id="niveau" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Sélectionner un niveau" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                          <SelectItem value="Débutant">Débutant</SelectItem>
                          <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                          <SelectItem value="Avancé">Avancé</SelectItem>
                          <SelectItem value="Tous niveaux">Tous niveaux</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duree" className="text-gray-900 dark:text-white">Durée</Label>
                      <Input
                        id="duree"
                        name="duree"
                        value={newFormation.duree}
                        onChange={handleInputChange}
                        placeholder="Ex: 14 heures"
                        required
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="participants" className="text-gray-900 dark:text-white">Nombre de participants</Label>
                      <Input
                        id="participants"
                        name="participants"
                        type="number"
                        value={newFormation.participants.toString()}
                        onChange={handleInputChange}
                        required
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-900 dark:text-white">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newFormation.description}
                      onChange={handleInputChange}
                      rows={3}
                      required
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="competencesAcquises" className="text-gray-900 dark:text-white">Compétences acquises (séparées par des virgules)</Label>
                    <Textarea
                      id="competencesAcquises"
                      value={newFormation.competencesAcquises.join(', ')}
                      onChange={(e) => handleCompetencesChange(e.target.value)}
                      rows={2}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateProchaineSessions" className="text-gray-900 dark:text-white">Dates des prochaines sessions (séparées par des virgules)</Label>
                    <Input
                      id="dateProchaineSessions"
                      value={newFormation.dateProchaineSessions.join(', ')}
                      onChange={(e) => handleDatesChange(e.target.value)}
                      placeholder="AAAA-MM-JJ, AAAA-MM-JJ"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    Annuler
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddFormation}>
                    Ajouter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher une formation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <Select value={filterCategorie} onValueChange={setFilterCategorie}>
                <SelectTrigger className="w-full md:w-48 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((categorie, index) => (
                    <SelectItem key={index} value={categorie}>{categorie}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterNiveau} onValueChange={setFilterNiveau}>
                <SelectTrigger className="w-full md:w-48 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  {niveaux.map((niveau, index) => (
                    <SelectItem key={index} value={niveau}>{niveau}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFormations.map((formation) => (
              <Card key={formation.id} className="overflow-hidden border dark:border-gray-700">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{formation.titre}</CardTitle>
                    <Badge variant="outline" className={
                      formation.categorie === 'Technique' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      formation.categorie === 'Management' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                      formation.categorie === 'Sécurité' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      formation.categorie === 'Soft Skills' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                    }>
                      {formation.categorie}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                    Formateur: {formation.formateur}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {formation.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{formation.duree}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <Award className="h-4 w-4 text-gray-400" />
                      <span>{formation.niveau}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{formation.participants} participants</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{formation.dateProchaineSessions.length} sessions</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-xs font-medium mb-2 text-gray-500 dark:text-gray-400">Compétences acquises:</p>
                    <div className="flex flex-wrap gap-1">
                      {formation.competencesAcquises.map((comp, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    <Calendar className="mr-1 h-3 w-3" /> Voir les sessions
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteFormation(formation.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
        {filteredFormations.length === 0 && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            Aucune formation ne correspond à votre recherche.
          </div>
        )}
      </Card>
    </div>
  );
}
