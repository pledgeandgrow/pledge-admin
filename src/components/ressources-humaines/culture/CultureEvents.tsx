'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, Filter, Plus, MapPin, Clock, Users, CalendarDays, ThumbsUp, ThumbsDown } from 'lucide-react';

interface CultureEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  capacity: number;
  registered: number;
  status: 'upcoming' | 'ongoing' | 'past';
  image: string;
}

export function CultureEvents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample data
  const events: CultureEvent[] = [
    {
      id: 1,
      title: 'Journée d\'intégration',
      description: 'Une journée dédiée à l\'intégration des nouveaux employés et au renforcement de l\'esprit d\'équipe.',
      date: '2025-03-15',
      time: '09:00 - 17:00',
      location: 'Siège social',
      type: 'Team Building',
      capacity: 50,
      registered: 42,
      status: 'upcoming',
      image: '/images/events/team-building.jpg'
    },
    {
      id: 2,
      title: 'Atelier bien-être',
      description: 'Atelier sur la gestion du stress et la méditation pour améliorer le bien-être au travail.',
      date: '2025-03-10',
      time: '14:00 - 16:00',
      location: 'Salle de conférence A',
      type: 'Bien-être',
      capacity: 30,
      registered: 25,
      status: 'upcoming',
      image: '/images/events/wellness.jpg'
    },
    {
      id: 3,
      title: 'Hackathon d\'innovation',
      description: 'Un hackathon de 24 heures pour développer des solutions innovantes aux défis de l\'entreprise.',
      date: '2025-04-05',
      time: '09:00 - 09:00 (le lendemain)',
      location: 'Espace innovation',
      type: 'Innovation',
      capacity: 40,
      registered: 32,
      status: 'upcoming',
      image: '/images/events/hackathon.jpg'
    },
    {
      id: 4,
      title: 'Célébration des succès trimestriels',
      description: 'Célébration des réussites et des succès du trimestre précédent.',
      date: '2025-03-31',
      time: '17:00 - 19:00',
      location: 'Cafétéria',
      type: 'Célébration',
      capacity: 70,
      registered: 65,
      status: 'upcoming',
      image: '/images/events/celebration.jpg'
    },
    {
      id: 5,
      title: 'Séminaire leadership',
      description: 'Séminaire sur le développement des compétences en leadership pour les managers.',
      date: '2025-02-20',
      time: '09:00 - 17:00',
      location: 'Hôtel Grand Plaza',
      type: 'Formation',
      capacity: 25,
      registered: 25,
      status: 'past',
      image: '/images/events/leadership.jpg'
    },
    {
      id: 6,
      title: 'Journée portes ouvertes',
      description: 'Journée portes ouvertes pour les familles des employés.',
      date: '2025-05-15',
      time: '10:00 - 16:00',
      location: 'Siège social',
      type: 'Familial',
      capacity: 100,
      registered: 45,
      status: 'upcoming',
      image: '/images/events/open-day.jpg'
    }
  ];

  // Get status badge class and text
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return {
          class: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400',
          text: 'À venir'
        };
      case 'ongoing':
        return {
          class: 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400',
          text: 'En cours'
        };
      case 'past':
        return {
          class: 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-400',
          text: 'Passé'
        };
      default:
        return {
          class: 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-400',
          text: status
        };
    }
  };

  // Get type badge class
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Team Building':
        return 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400';
      case 'Bien-être':
        return 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400';
      case 'Innovation':
        return 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400';
      case 'Célébration':
        return 'bg-pink-500/10 text-pink-500 dark:bg-pink-500/20 dark:text-pink-400';
      case 'Formation':
        return 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400';
      case 'Familial':
        return 'bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 dark:text-orange-400';
      default:
        return 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-400';
    }
  };

  // Filter events based on search term, type and status
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Événements culturels
          </CardTitle>
          <CardDescription>
            Découvrez et participez aux événements qui renforcent notre culture d'entreprise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Rechercher un événement..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>{filterType === 'all' ? 'Tous les types' : filterType}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="Team Building">Team Building</SelectItem>
                  <SelectItem value="Bien-être">Bien-être</SelectItem>
                  <SelectItem value="Innovation">Innovation</SelectItem>
                  <SelectItem value="Célébration">Célébration</SelectItem>
                  <SelectItem value="Formation">Formation</SelectItem>
                  <SelectItem value="Familial">Familial</SelectItem>
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
                      {filterStatus === 'upcoming' && 'À venir'}
                      {filterStatus === 'ongoing' && 'En cours'}
                      {filterStatus === 'past' && 'Passé'}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="upcoming">À venir</SelectItem>
                  <SelectItem value="ongoing">En cours</SelectItem>
                  <SelectItem value="past">Passé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel événement
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Card key={event.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="h-40 bg-gray-200 dark:bg-gray-700 relative">
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Badge className={getStatusBadge(event.status).class}>
                        {getStatusBadge(event.status).text}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                      </div>
                      <Badge className={getTypeBadge(event.type)} className="mb-2">
                        {event.type}
                      </Badge>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-2">{event.description}</p>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-blue-500" />
                        <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-500" />
                        <span>{event.registered} / {event.capacity} participants</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      {event.status === 'past' ? (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            J'ai aimé
                          </Button>
                          <Button variant="outline" size="sm">
                            <ThumbsDown className="h-4 w-4 mr-2" />
                            À améliorer
                          </Button>
                        </div>
                      ) : (
                        <Button className="w-full" disabled={event.registered >= event.capacity}>
                          {event.registered >= event.capacity ? 'Complet' : 'S\'inscrire'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500 dark:text-gray-400">
                Aucun événement trouvé avec les critères de recherche actuels.
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t dark:border-gray-700 px-6 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Affichage de {filteredEvents.length} événements sur {events.length}
          </div>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Voir le calendrier
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
