'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Search, Filter, Plus, Calendar, Users, Lightbulb, ArrowRight, ThumbsUp, Eye } from 'lucide-react';

interface CultureInitiative {
  id: number;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'planned';
  progress: number;
  participants: number;
  lead: string;
  leadAvatar: string;
  impact: 'high' | 'medium' | 'low';
}

export function CultureInitiatives() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample data
  const initiatives: CultureInitiative[] = [
    {
      id: 1,
      title: 'Programme de mentorat',
      description: 'Programme de mentorat pour favoriser le développement professionnel et le partage de connaissances entre les employés.',
      category: 'Développement',
      startDate: '2025-01-15',
      endDate: '2025-12-31',
      status: 'active',
      progress: 45,
      participants: 24,
      lead: 'Sophie Martin',
      leadAvatar: '/avatars/sophie.jpg',
      impact: 'high'
    },
    {
      id: 2,
      title: 'Journées bien-être',
      description: 'Journées dédiées au bien-être des employés avec des activités de relaxation, de méditation et de sport.',
      category: 'Bien-être',
      startDate: '2025-02-01',
      endDate: '2025-12-31',
      status: 'active',
      progress: 60,
      participants: 35,
      lead: 'Thomas Dubois',
      leadAvatar: '/avatars/thomas.jpg',
      impact: 'medium'
    },
    {
      id: 3,
      title: 'Ateliers d\'innovation',
      description: 'Ateliers mensuels pour encourager l\'innovation et la créativité au sein de l\'entreprise.',
      category: 'Innovation',
      startDate: '2025-01-10',
      endDate: '2025-12-31',
      status: 'active',
      progress: 70,
      participants: 28,
      lead: 'Lucas Petit',
      leadAvatar: '/avatars/lucas.jpg',
      impact: 'high'
    },
    {
      id: 4,
      title: 'Programme de reconnaissance',
      description: 'Programme de reconnaissance des employés pour valoriser les contributions exceptionnelles.',
      category: 'Reconnaissance',
      startDate: '2025-03-01',
      endDate: '2025-12-31',
      status: 'planned',
      progress: 0,
      participants: 0,
      lead: 'Emma Leroy',
      leadAvatar: '/avatars/emma.jpg',
      impact: 'medium'
    },
    {
      id: 5,
      title: 'Journée portes ouvertes',
      description: 'Journée portes ouvertes pour les familles des employés afin de renforcer le sentiment d\'appartenance.',
      category: 'Engagement',
      startDate: '2024-11-15',
      endDate: '2024-11-15',
      status: 'completed',
      progress: 100,
      participants: 45,
      lead: 'Léa Bernard',
      leadAvatar: '/avatars/lea.jpg',
      impact: 'medium'
    },
    {
      id: 6,
      title: 'Équipe verte',
      description: 'Initiative pour promouvoir des pratiques durables et écologiques au sein de l\'entreprise.',
      category: 'Responsabilité',
      startDate: '2025-01-20',
      endDate: '2025-12-31',
      status: 'active',
      progress: 35,
      participants: 18,
      lead: 'Thomas Dubois',
      leadAvatar: '/avatars/thomas.jpg',
      impact: 'medium'
    }
  ];

  // Get status badge class and text
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return {
          class: 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400',
          text: 'Active'
        };
      case 'completed':
        return {
          class: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400',
          text: 'Terminée'
        };
      case 'planned':
        return {
          class: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400',
          text: 'Planifiée'
        };
      default:
        return {
          class: 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-400',
          text: status
        };
    }
  };

  // Get impact badge class
  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400';
      case 'medium':
        return 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400';
      case 'low':
        return 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-400';
      default:
        return 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-400';
    }
  };

  // Filter initiatives based on search term, category and status
  const filteredInitiatives = initiatives.filter(initiative => {
    const matchesSearch = initiative.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         initiative.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || initiative.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || initiative.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Initiatives culturelles
          </CardTitle>
          <CardDescription>
            Gérez les initiatives visant à renforcer la culture d&apos;entreprise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Rechercher une initiative..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>{filterCategory === 'all' ? 'Toutes les catégories' : filterCategory}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="Développement">Développement</SelectItem>
                  <SelectItem value="Bien-être">Bien-être</SelectItem>
                  <SelectItem value="Innovation">Innovation</SelectItem>
                  <SelectItem value="Reconnaissance">Reconnaissance</SelectItem>
                  <SelectItem value="Engagement">Engagement</SelectItem>
                  <SelectItem value="Responsabilité">Responsabilité</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>
                      {filterStatus === 'all' && 'Tous les statuts'}
                      {filterStatus === 'active' && 'Active'}
                      {filterStatus === 'completed' && 'Terminée'}
                      {filterStatus === 'planned' && 'Planifiée'}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                  <SelectItem value="planned">Planifiée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle initiative
            </Button>
          </div>

          <div className="space-y-6">
            {filteredInitiatives.length > 0 ? (
              filteredInitiatives.map((initiative) => (
                <Card key={initiative.id} className="bg-gray-50 dark:bg-gray-800/50 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{initiative.title}</h3>
                          <Badge className={getStatusBadge(initiative.status).class}>
                            {getStatusBadge(initiative.status).text}
                          </Badge>
                          <Badge className={getImpactBadge(initiative.impact)}>
                            {initiative.impact === 'high' && 'Impact élevé'}
                            {initiative.impact === 'medium' && 'Impact moyen'}
                            {initiative.impact === 'low' && 'Impact faible'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{initiative.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>
                              {new Date(initiative.startDate).toLocaleDateString('fr-FR')} 
                              {initiative.endDate && <> <ArrowRight className="inline h-3 w-3 mx-1" /> {new Date(initiative.endDate).toLocaleDateString('fr-FR')}</>}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Lightbulb className="h-4 w-4 text-amber-500" />
                            <span>{initiative.category}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Users className="h-4 w-4 text-blue-500" />
                            <span>{initiative.participants} participants</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center md:items-end gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Responsable:</span>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={initiative.leadAvatar} alt={initiative.lead} />
                              <AvatarFallback>{initiative.lead.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{initiative.lead}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Détails
                          </Button>
                          <Button variant="outline" size="sm">
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Participer
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {initiative.status !== 'planned' && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progression</span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{initiative.progress}%</span>
                        </div>
                        <Progress value={initiative.progress} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Aucune initiative trouvée avec les critères de recherche actuels.
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t dark:border-gray-700 px-6 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Affichage de {filteredInitiatives.length} initiatives sur {initiatives.length}
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Proposer une initiative
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
