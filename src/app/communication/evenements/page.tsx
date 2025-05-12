'use client';

import { type NextPage } from 'next';
import { useState } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';

interface Evenement {
  id: string;
  titre: string;
  type: 'Conférence' | 'Séminaire' | 'Webinaire' | 'Salon' | 'Soirée' | 'Formation';
  date: string;
  heure: string;
  lieu: string;
  capacite: number;
  inscrits: number;
  description: string;
  statut: 'À venir' | 'En cours' | 'Terminé' | 'Annulé';
  budget: {
    prevu: number;
    actuel: number;
    devise: string;
  };
  intervenants: Array<{
    nom: string;
    role: string;
    entreprise: string;
  }>;
  sponsors?: Array<{
    nom: string;
    niveau: 'Or' | 'Argent' | 'Bronze';
    logo: string;
  }>;
}

const EvenementsPage: NextPage = () => {
  const [evenements, setEvenements] = useState<Evenement[]>([
    {
      id: '1',
      titre: 'Tech Summit 2025',
      type: 'Conférence',
      date: '2025-06-15',
      heure: '09:00',
      lieu: 'Palais des Congrès',
      capacite: 500,
      inscrits: 350,
      description: 'Le plus grand événement tech de l\'année',
      statut: 'À venir',
      budget: {
        prevu: 50000,
        actuel: 45000,
        devise: 'EUR'
      },
      intervenants: [
        {
          nom: 'Marie Dubois',
          role: 'Keynote Speaker',
          entreprise: 'TechCorp'
        },
        {
          nom: 'Jean Martin',
          role: 'Expert IA',
          entreprise: 'AI Solutions'
        }
      ],
      sponsors: [
        {
          nom: 'TechCorp',
          niveau: 'Or',
          logo: '/sponsors/techcorp.png'
        },
        {
          nom: 'InnovSoft',
          niveau: 'Argent',
          logo: '/sponsors/innovsoft.png'
        }
      ]
    }
  ]);

  const [nouvelEvenement, setNouvelEvenement] = useState<Omit<Evenement, 'id'>>({
    titre: '',
    type: 'Conférence',
    date: '',
    heure: '',
    lieu: '',
    capacite: 0,
    inscrits: 0,
    description: '',
    statut: 'À venir',
    budget: {
      prevu: 0,
      actuel: 0,
      devise: 'EUR'
    },
    intervenants: []
  });

  const handleAddEvenement = () => {
    const newEvenement: Evenement = {
      ...nouvelEvenement,
      id: Math.random().toString(36).substr(2, 9)
    };
    setEvenements([...evenements, newEvenement]);
    setNouvelEvenement({
      titre: '',
      type: 'Conférence',
      date: '',
      heure: '',
      lieu: '',
      capacite: 0,
      inscrits: 0,
      description: '',
      statut: 'À venir',
      budget: {
        prevu: 0,
        actuel: 0,
        devise: 'EUR'
      },
      intervenants: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Événements</h1>
          
          {/* Formulaire nouvel événement */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Nouvel Événement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Titre"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvenement.titre}
                onChange={(e) => setNouvelEvenement({...nouvelEvenement, titre: e.target.value})}
              />
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvenement.type}
                onChange={(e) => setNouvelEvenement({...nouvelEvenement, type: e.target.value as Evenement['type']})}
              >
                <option value="Conférence">Conférence</option>
                <option value="Séminaire">Séminaire</option>
                <option value="Webinaire">Webinaire</option>
                <option value="Salon">Salon</option>
                <option value="Soirée">Soirée</option>
                <option value="Formation">Formation</option>
              </select>
              <input
                type="date"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvenement.date}
                onChange={(e) => setNouvelEvenement({...nouvelEvenement, date: e.target.value})}
              />
              <input
                type="time"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvenement.heure}
                onChange={(e) => setNouvelEvenement({...nouvelEvenement, heure: e.target.value})}
              />
              <input
                type="text"
                placeholder="Lieu"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvenement.lieu}
                onChange={(e) => setNouvelEvenement({...nouvelEvenement, lieu: e.target.value})}
              />
              <input
                type="number"
                placeholder="Capacité"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvenement.capacite || ''}
                onChange={(e) => setNouvelEvenement({...nouvelEvenement, capacite: parseInt(e.target.value) || 0})}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Budget prévu"
                  className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={nouvelEvenement.budget.prevu || ''}
                  onChange={(e) => setNouvelEvenement({
                    ...nouvelEvenement,
                    budget: {...nouvelEvenement.budget, prevu: parseInt(e.target.value) || 0}
                  })}
                />
                <select
                  className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={nouvelEvenement.budget.devise}
                  onChange={(e) => setNouvelEvenement({
                    ...nouvelEvenement,
                    budget: {...nouvelEvenement.budget, devise: e.target.value}
                  })}
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <textarea
                placeholder="Description"
                className="border p-2 rounded w-full h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvenement.description}
                onChange={(e) => setNouvelEvenement({...nouvelEvenement, description: e.target.value})}
              />
            </div>
            <button
              onClick={handleAddEvenement}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Créer l'événement
            </button>
          </div>

          {/* Liste des événements */}
          <div className="grid grid-cols-1 gap-6">
            {evenements.map((evenement) => (
              <div key={evenement.id} className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">{evenement.titre}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {evenement.type} • {new Date(evenement.date).toLocaleDateString()} à {evenement.heure} • {evenement.lieu}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    evenement.statut === 'Terminé' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    evenement.statut === 'En cours' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    evenement.statut === 'Annulé' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {evenement.statut}
                  </span>
                </div>

                <p className="text-gray-700 mb-4 dark:text-gray-300">{evenement.description}</p>

                {/* Statistiques */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {evenement.inscrits}/{evenement.capacite}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Inscrits</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {Math.round((evenement.inscrits / evenement.capacite) * 100)}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Remplissage</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {evenement.budget.actuel.toLocaleString()} {evenement.budget.devise}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Budget actuel</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {evenement.budget.prevu.toLocaleString()} {evenement.budget.devise}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Budget prévu</p>
                  </div>
                </div>

                {/* Intervenants */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-2 dark:text-white">Intervenants</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {evenement.intervenants.map((intervenant, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg dark:bg-gray-700"
                      >
                        <p className="font-medium dark:text-white">{intervenant.nom}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {intervenant.role} • {intervenant.entreprise}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sponsors */}
                {evenement.sponsors && (
                  <div>
                    <h4 className="font-semibold mb-2 dark:text-white">Sponsors</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {evenement.sponsors.map((sponsor, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded-lg dark:bg-gray-700 flex items-center space-x-2"
                        >
                          <img
                            src={sponsor.logo}
                            alt={sponsor.nom}
                            className="w-8 h-8 object-contain"
                          />
                          <div>
                            <p className="font-medium dark:text-white">{sponsor.nom}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Niveau {sponsor.niveau}
                            </p>
                          </div>
                        </div>
                      ))}
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

export default EvenementsPage;
