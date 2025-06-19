'use client';

import { type NextPage } from 'next';
import { useState } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';

interface Event {
  id: string;
  nom: string;
  date: string;
  lieu: string;
  type: 'Conférence' | 'Salon' | 'Table ronde' | 'Interview' | 'Autre';
  statut: 'À venir' | 'En cours' | 'Terminé' | 'Annulé';
  participants: string[];
  description: string;
  objectifs: string[];
  resultats?: {
    retombeesPresse: number;
    nouveauxContacts: number;
    opportunites: number;
  };
}

const RelationsPubliquesPage: NextPage = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      nom: 'Forum Innovation Tech',
      date: '2025-03-15',
      lieu: 'Paris Expo',
      type: 'Salon',
      statut: 'À venir',
      participants: ['CEO', 'CTO', 'Marketing Director'],
      description: 'Participation au plus grand salon tech de l\'année',
      objectifs: [
        'Présenter nos nouvelles solutions',
        'Rencontrer des partenaires potentiels',
        'Générer des leads qualifiés'
      ]
    },
    {
      id: '2',
      nom: 'Conférence de presse - Lancement produit',
      date: '2025-02-20',
      lieu: 'Siège social',
      type: 'Conférence',
      statut: 'Terminé',
      participants: ['CEO', 'Product Manager', 'PR Manager'],
      description: 'Présentation officielle de notre nouvelle gamme de produits',
      objectifs: [
        'Annoncer le lancement',
        'Démontrer les innovations',
        'Répondre aux questions des médias'
      ],
      resultats: {
        retombeesPresse: 15,
        nouveauxContacts: 45,
        opportunites: 8
      }
    }
  ]);

  const [nouvelEvent, setNouvelEvent] = useState<Omit<Event, 'id'>>({
    nom: '',
    date: '',
    lieu: '',
    type: 'Conférence',
    statut: 'À venir',
    participants: [],
    description: '',
    objectifs: []
  });

  const handleAddEvent = () => {
    const newEvent: Event = {
      ...nouvelEvent,
      id: Math.random().toString(36).substr(2, 9)
    };
    setEvents([...events, newEvent]);
    setNouvelEvent({
      nom: '',
      date: '',
      lieu: '',
      type: 'Conférence',
      statut: 'À venir',
      participants: [],
      description: '',
      objectifs: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Relations Publiques</h1>
          
          {/* Formulaire nouvel événement */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Nouvel Événement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom de l'événement"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvent.nom}
                onChange={(e) => setNouvelEvent({...nouvelEvent, nom: e.target.value})}
              />
              <input
                type="date"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvent.date}
                onChange={(e) => setNouvelEvent({...nouvelEvent, date: e.target.value})}
              />
              <input
                type="text"
                placeholder="Lieu"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvent.lieu}
                onChange={(e) => setNouvelEvent({...nouvelEvent, lieu: e.target.value})}
              />
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvent.type}
                onChange={(e) => setNouvelEvent({...nouvelEvent, type: e.target.value as Event['type']})}
              >
                <option value="Conférence">Conférence</option>
                <option value="Salon">Salon</option>
                <option value="Table ronde">Table ronde</option>
                <option value="Interview">Interview</option>
                <option value="Autre">Autre</option>
              </select>
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvent.statut}
                onChange={(e) => setNouvelEvent({...nouvelEvent, statut: e.target.value as Event['statut']})}
              >
                <option value="À venir">À venir</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
                <option value="Annulé">Annulé</option>
              </select>
              <input
                type="text"
                placeholder="Participants (séparés par des virgules)"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvent.participants.join(', ')}
                onChange={(e) => setNouvelEvent({
                  ...nouvelEvent,
                  participants: e.target.value.split(',').map(p => p.trim()).filter(p => p)
                })}
              />
            </div>
            <div className="mt-4">
              <textarea
                placeholder="Description"
                className="border p-2 rounded w-full h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvent.description}
                onChange={(e) => setNouvelEvent({...nouvelEvent, description: e.target.value})}
              />
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Objectifs (séparés par des virgules)"
                className="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvent.objectifs.join(', ')}
                onChange={(e) => setNouvelEvent({
                  ...nouvelEvent,
                  objectifs: e.target.value.split(',').map(o => o.trim()).filter(o => o)
                })}
              />
            </div>
            <button
              onClick={handleAddEvent}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Créer l&apos;événement
            </button>
          </div>

          {/* Liste des événements */}
          <div className="grid grid-cols-1 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">{event.nom}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {event.type} • {new Date(event.date).toLocaleDateString()} • {event.lieu}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    event.statut === 'Terminé' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    event.statut === 'En cours' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    event.statut === 'Annulé' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {event.statut}
                  </span>
                </div>

                <p className="text-gray-700 mb-4 dark:text-gray-300">{event.description}</p>

                {/* Participants */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 dark:text-white">Participants</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.participants.map((participant, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded dark:bg-gray-700 dark:text-gray-300"
                      >
                        {participant}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Objectifs */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 dark:text-white">Objectifs</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {event.objectifs.map((objectif, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">
                        {objectif}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Résultats */}
                {event.resultats && (
                  <div>
                    <h4 className="font-semibold mb-2 dark:text-white">Résultats</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {event.resultats.retombeesPresse}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Retombées presse</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {event.resultats.nouveauxContacts}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Nouveaux contacts</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {event.resultats.opportunites}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Opportunités</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelationsPubliquesPage;
