'use client';

import { type NextPage } from 'next';
import { useState } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';

interface Webinaire {
  id: string;
  titre: string;
  description: string;
  date: string;
  heure: string;
  duree: number; // en minutes
  statut: 'Planifié' | 'En direct' | 'Terminé' | 'Annulé';
  intervenant: {
    nom: string;
    titre: string;
    bio: string;
    photo?: string;
  };
  plateforme: {
    nom: 'Zoom' | 'Teams' | 'Google Meet' | 'Autre';
    lien: string;
    identifiant?: string;
    motDePasse?: string;
  };
  participants: {
    inscrits: number;
    presents?: number;
    capaciteMax: number;
  };
  tags: string[];
  ressources: Array<{
    titre: string;
    type: 'Présentation' | 'Document' | 'Vidéo' | 'Autre';
    url: string;
  }>;
  enregistrement?: {
    url: string;
    duree: number;
    datePublication: string;
  };
  statistiques?: {
    tauxParticipation: number;
    dureemoyenneVisionnage: number;
    tauxInteraction: number;
    noteMoyenne: number;
  };
}

const WebinairesPage: NextPage = () => {
  const [webinaires, setWebinaires] = useState<Webinaire[]>([
    {
      id: '1',
      titre: 'Introduction à la Blockchain',
      description: 'Découvrez les fondamentaux de la technologie blockchain et ses applications dans le monde professionnel.',
      date: '2025-03-15',
      heure: '14:00',
      duree: 90,
      statut: 'Planifié',
      intervenant: {
        nom: 'Sophie Martin',
        titre: 'Expert Blockchain',
        bio: 'Plus de 10 ans d\'expérience dans les technologies blockchain et crypto-monnaies.',
        photo: '/images/intervenants/sophie-martin.jpg'
      },
      plateforme: {
        nom: 'Zoom',
        lien: 'https://zoom.us/j/123456789',
        identifiant: '123456789',
        motDePasse: 'blockchain2025'
      },
      participants: {
        inscrits: 150,
        capaciteMax: 200
      },
      tags: ['Blockchain', 'Technologie', 'Innovation', 'Formation'],
      ressources: [
        {
          titre: 'Support de présentation',
          type: 'Présentation',
          url: '/ressources/presentation-blockchain.pdf'
        }
      ]
    }
  ]);

  const [nouveauWebinaire, setNouveauWebinaire] = useState<Omit<Webinaire, 'id'>>({
    titre: '',
    description: '',
    date: '',
    heure: '',
    duree: 60,
    statut: 'Planifié',
    intervenant: {
      nom: '',
      titre: '',
      bio: ''
    },
    plateforme: {
      nom: 'Zoom',
      lien: '',
    },
    participants: {
      inscrits: 0,
      capaciteMax: 100
    },
    tags: [],
    ressources: []
  });

  const handleAddWebinaire = () => {
    const newWebinaire: Webinaire = {
      ...nouveauWebinaire,
      id: Math.random().toString(36).substr(2, 9)
    };
    setWebinaires([...webinaires, newWebinaire]);
    setNouveauWebinaire({
      titre: '',
      description: '',
      date: '',
      heure: '',
      duree: 60,
      statut: 'Planifié',
      intervenant: {
        nom: '',
        titre: '',
        bio: ''
      },
      plateforme: {
        nom: 'Zoom',
        lien: '',
      },
      participants: {
        inscrits: 0,
        capaciteMax: 100
      },
      tags: [],
      ressources: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Webinaires</h1>
          
          {/* Formulaire nouveau webinaire */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Nouveau Webinaire</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Titre du webinaire"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauWebinaire.titre}
                onChange={(e) => setNouveauWebinaire({...nouveauWebinaire, titre: e.target.value})}
              />
              <input
                type="date"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauWebinaire.date}
                onChange={(e) => setNouveauWebinaire({...nouveauWebinaire, date: e.target.value})}
              />
              <input
                type="time"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauWebinaire.heure}
                onChange={(e) => setNouveauWebinaire({...nouveauWebinaire, heure: e.target.value})}
              />
              <input
                type="number"
                placeholder="Durée (minutes)"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauWebinaire.duree}
                onChange={(e) => setNouveauWebinaire({...nouveauWebinaire, duree: parseInt(e.target.value)})}
              />
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauWebinaire.plateforme.nom}
                onChange={(e) => setNouveauWebinaire({
                  ...nouveauWebinaire,
                  plateforme: {...nouveauWebinaire.plateforme, nom: e.target.value as Webinaire['plateforme']['nom']}
                })}
              >
                <option value="Zoom">Zoom</option>
                <option value="Teams">Teams</option>
                <option value="Google Meet">Google Meet</option>
                <option value="Autre">Autre</option>
              </select>
              <input
                type="url"
                placeholder="Lien de la plateforme"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauWebinaire.plateforme.lien}
                onChange={(e) => setNouveauWebinaire({
                  ...nouveauWebinaire,
                  plateforme: {...nouveauWebinaire.plateforme, lien: e.target.value}
                })}
              />
            </div>
            <div className="mt-4">
              <textarea
                placeholder="Description"
                className="border p-2 rounded w-full h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauWebinaire.description}
                onChange={(e) => setNouveauWebinaire({...nouveauWebinaire, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <input
                  type="text"
                  placeholder="Tags (séparés par des virgules)"
                  className="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={nouveauWebinaire.tags.join(', ')}
                  onChange={(e) => setNouveauWebinaire({
                    ...nouveauWebinaire,
                    tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                  })}
                />
              </div>
              <input
                type="number"
                placeholder="Capacité maximale"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauWebinaire.participants.capaciteMax}
                onChange={(e) => setNouveauWebinaire({
                  ...nouveauWebinaire,
                  participants: {...nouveauWebinaire.participants, capaciteMax: parseInt(e.target.value)}
                })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <input
                type="text"
                placeholder="Nom de l'intervenant"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauWebinaire.intervenant.nom}
                onChange={(e) => setNouveauWebinaire({
                  ...nouveauWebinaire,
                  intervenant: {...nouveauWebinaire.intervenant, nom: e.target.value}
                })}
              />
              <input
                type="text"
                placeholder="Titre de l'intervenant"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauWebinaire.intervenant.titre}
                onChange={(e) => setNouveauWebinaire({
                  ...nouveauWebinaire,
                  intervenant: {...nouveauWebinaire.intervenant, titre: e.target.value}
                })}
              />
              <input
                type="text"
                placeholder="Bio de l'intervenant"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauWebinaire.intervenant.bio}
                onChange={(e) => setNouveauWebinaire({
                  ...nouveauWebinaire,
                  intervenant: {...nouveauWebinaire.intervenant, bio: e.target.value}
                })}
              />
            </div>
            <button
              onClick={handleAddWebinaire}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Créer le webinaire
            </button>
          </div>

          {/* Liste des webinaires */}
          <div className="grid grid-cols-1 gap-6">
            {webinaires.map((webinaire) => (
              <div key={webinaire.id} className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">{webinaire.titre}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(webinaire.date).toLocaleDateString()} à {webinaire.heure} • {webinaire.duree} minutes
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    webinaire.statut === 'En direct' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    webinaire.statut === 'Planifié' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    webinaire.statut === 'Terminé' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {webinaire.statut}
                  </span>
                </div>

                <p className="text-gray-700 mb-4 dark:text-gray-300">{webinaire.description}</p>

                {/* Intervenant */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-2 dark:text-white">Intervenant</h4>
                  <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                    <div className="flex items-center gap-3">
                      {webinaire.intervenant.photo ? (
                        <img
                          src={webinaire.intervenant.photo}
                          alt={webinaire.intervenant.nom}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900">
                          <span className="text-blue-600 font-semibold dark:text-blue-200">
                            {webinaire.intervenant.nom.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium dark:text-white">{webinaire.intervenant.nom}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{webinaire.intervenant.titre}</p>
                      </div>
                    </div>
                    {webinaire.intervenant.bio && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{webinaire.intervenant.bio}</p>
                    )}
                  </div>
                </div>

                {/* Informations de connexion */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 dark:text-white">Plateforme</h4>
                    <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                      <p className="font-medium dark:text-white">{webinaire.plateforme.nom}</p>
                      <a
                        href={webinaire.plateforme.lien}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Lien de connexion
                      </a>
                      {webinaire.plateforme.identifiant && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ID: {webinaire.plateforme.identifiant}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 dark:text-white">Participants</h4>
                    <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Inscrits</span>
                        <span className="font-medium dark:text-white">
                          {webinaire.participants.inscrits} / {webinaire.participants.capaciteMax}
                        </span>
                      </div>
                      {webinaire.participants.presents !== undefined && (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-gray-600 dark:text-gray-400">Présents</span>
                          <span className="font-medium dark:text-white">{webinaire.participants.presents}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {webinaire.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm dark:bg-gray-700 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Ressources */}
                {webinaire.ressources.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2 dark:text-white">Ressources</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {webinaire.ressources.map((ressource, index) => (
                        <a
                          key={index}
                          href={ressource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gray-50 rounded-lg dark:bg-gray-700 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center dark:bg-blue-900">
                            <span className="text-blue-600 text-sm font-semibold dark:text-blue-200">
                              {ressource.type[0]}
                            </span>
                          </div>
                          <p className="font-medium dark:text-white">{ressource.titre}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Statistiques (si disponibles) */}
                {webinaire.statistiques && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2 dark:text-white">Statistiques</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Taux de participation</p>
                        <p className="text-lg font-semibold dark:text-white">
                          {webinaire.statistiques.tauxParticipation}%
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Durée moyenne de visionnage</p>
                        <p className="text-lg font-semibold dark:text-white">
                          {webinaire.statistiques.dureemoyenneVisionnage} min
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Taux d'interaction</p>
                        <p className="text-lg font-semibold dark:text-white">
                          {webinaire.statistiques.tauxInteraction}%
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Note moyenne</p>
                        <p className="text-lg font-semibold dark:text-white">
                          {webinaire.statistiques.noteMoyenne}/5
                        </p>
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

export default WebinairesPage;
