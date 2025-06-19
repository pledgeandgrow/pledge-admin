'use client';

import { type NextPage } from 'next';
import { useState } from 'react';
import Image from 'next/image';
import { MegaMenu } from '@/components/layout/MegaMenu';

interface Influenceur {
  id: string;
  nom: string;
  pseudo: string;
  photo?: string;
  domaine: 'Tech' | 'Mode' | 'Lifestyle' | 'Business' | 'Gaming' | 'Autre';
  plateformes: Array<{
    nom: 'Instagram' | 'YouTube' | 'TikTok' | 'LinkedIn' | 'Twitter' | 'Autre';
    url: string;
    abonnes: number;
  }>;
  contact: {
    email: string;
    telephone?: string;
    agent?: string;
  };
  statut: 'Prospect' | 'En discussion' | 'Actif' | 'Ancien';
  specialites: string[];
  audience: {
    taille: number;
    engagement: number;
    demographique: {
      age: string;
      localisation: string[];
      genres: string[];
    };
  };
  collaborations: Array<{
    type: 'Post' | 'Story' | 'Reel' | 'Video' | 'Live' | 'Autre';
    date: string;
    description: string;
    performance?: {
      vues: number;
      engagement: number;
      clics?: number;
    };
  }>;
  tarifs?: {
    post: number;
    story: number;
    video: number;
    campagne: number;
  };
  notes: string;
}

const InfluenceursPage: NextPage = () => {
  const [influenceurs, setInfluenceurs] = useState<Influenceur[]>([
    {
      id: '1',
      nom: 'Marie Dubois',
      pseudo: '@marietech',
      photo: '/images/influenceurs/marie.jpg',
      domaine: 'Tech',
      plateformes: [
        {
          nom: 'Instagram',
          url: 'https://instagram.com/marietech',
          abonnes: 150000
        },
        {
          nom: 'YouTube',
          url: 'https://youtube.com/marietech',
          abonnes: 200000
        }
      ],
      contact: {
        email: 'marie@influencer.com',
        telephone: '+33 6 12 34 56 78',
        agent: 'Talent Agency'
      },
      statut: 'Actif',
      specialites: ['Tech Reviews', 'Digital Lifestyle', 'Productivité'],
      audience: {
        taille: 350000,
        engagement: 4.5,
        demographique: {
          age: '25-34',
          localisation: ['France', 'Belgique', 'Suisse'],
          genres: ['Femme', 'Homme']
        }
      },
      collaborations: [
        {
          type: 'Video',
          date: '2025-01-15',
          description: 'Review produit IA',
          performance: {
            vues: 50000,
            engagement: 8.5,
            clics: 1200
          }
        }
      ],
      tarifs: {
        post: 1500,
        story: 500,
        video: 3000,
        campagne: 10000
      },
      notes: 'Excellente collaboration précédente, très professionnelle'
    }
  ]);

  const [nouvelInfluenceur, setNouvelInfluenceur] = useState<Omit<Influenceur, 'id'>>({
    nom: '',
    pseudo: '',
    domaine: 'Tech',
    plateformes: [],
    contact: {
      email: ''
    },
    statut: 'Prospect',
    specialites: [],
    audience: {
      taille: 0,
      engagement: 0,
      demographique: {
        age: '',
        localisation: [],
        genres: []
      }
    },
    collaborations: [],
    notes: ''
  });

  const handleAddInfluenceur = () => {
    const newInfluenceur: Influenceur = {
      ...nouvelInfluenceur,
      id: Math.random().toString(36).substr(2, 9)
    };
    setInfluenceurs([...influenceurs, newInfluenceur]);
    setNouvelInfluenceur({
      nom: '',
      pseudo: '',
      domaine: 'Tech',
      plateformes: [],
      contact: {
        email: ''
      },
      statut: 'Prospect',
      specialites: [],
      audience: {
        taille: 0,
        engagement: 0,
        demographique: {
          age: '',
          localisation: [],
          genres: []
        }
      },
      collaborations: [],
      notes: ''
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Influenceurs</h1>
          
          {/* Formulaire nouvel influenceur */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Nouvel Influenceur</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom complet"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelInfluenceur.nom}
                onChange={(e) => setNouvelInfluenceur({...nouvelInfluenceur, nom: e.target.value})}
              />
              <input
                type="text"
                placeholder="Pseudo"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelInfluenceur.pseudo}
                onChange={(e) => setNouvelInfluenceur({...nouvelInfluenceur, pseudo: e.target.value})}
              />
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelInfluenceur.domaine}
                onChange={(e) => setNouvelInfluenceur({...nouvelInfluenceur, domaine: e.target.value as Influenceur['domaine']})}
              >
                <option value="Tech">Tech</option>
                <option value="Mode">Mode</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Business">Business</option>
                <option value="Gaming">Gaming</option>
                <option value="Autre">Autre</option>
              </select>
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelInfluenceur.statut}
                onChange={(e) => setNouvelInfluenceur({...nouvelInfluenceur, statut: e.target.value as Influenceur['statut']})}
              >
                <option value="Prospect">Prospect</option>
                <option value="En discussion">En discussion</option>
                <option value="Actif">Actif</option>
                <option value="Ancien">Ancien</option>
              </select>
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Spécialités (séparées par des virgules)"
                className="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelInfluenceur.specialites.join(', ')}
                onChange={(e) => setNouvelInfluenceur({
                  ...nouvelInfluenceur,
                  specialites: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelInfluenceur.contact.email}
                onChange={(e) => setNouvelInfluenceur({
                  ...nouvelInfluenceur,
                  contact: {...nouvelInfluenceur.contact, email: e.target.value}
                })}
              />
              <input
                type="tel"
                placeholder="Téléphone"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelInfluenceur.contact.telephone || ''}
                onChange={(e) => setNouvelInfluenceur({
                  ...nouvelInfluenceur,
                  contact: {...nouvelInfluenceur.contact, telephone: e.target.value}
                })}
              />
              <input
                type="text"
                placeholder="Agent"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelInfluenceur.contact.agent || ''}
                onChange={(e) => setNouvelInfluenceur({
                  ...nouvelInfluenceur,
                  contact: {...nouvelInfluenceur.contact, agent: e.target.value}
                })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                type="number"
                placeholder="Taille de l'audience"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelInfluenceur.audience.taille || ''}
                onChange={(e) => setNouvelInfluenceur({
                  ...nouvelInfluenceur,
                  audience: {...nouvelInfluenceur.audience, taille: parseInt(e.target.value)}
                })}
              />
              <input
                type="number"
                placeholder="Taux d'engagement (%)"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelInfluenceur.audience.engagement || ''}
                onChange={(e) => setNouvelInfluenceur({
                  ...nouvelInfluenceur,
                  audience: {...nouvelInfluenceur.audience, engagement: parseFloat(e.target.value)}
                })}
              />
            </div>
            <button
              onClick={handleAddInfluenceur}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Créer l&apos;influenceur
            </button>
          </div>

          {/* Liste des influenceurs */}
          <div className="grid grid-cols-1 gap-6">
            {influenceurs.map((influenceur) => (
              <div key={influenceur.id} className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    {influenceur.photo ? (
                      <Image
                        src={influenceur.photo}
                        alt={influenceur.nom}
                        width={64}
                        height={64}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900">
                        <span className="text-blue-600 text-xl font-semibold dark:text-blue-200">
                          {influenceur.nom.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold dark:text-white">{influenceur.nom}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {influenceur.pseudo} • {influenceur.domaine}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    influenceur.statut === 'Actif' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    influenceur.statut === 'En discussion' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    influenceur.statut === 'Prospect' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {influenceur.statut}
                  </span>
                </div>

                {/* Plateformes sociales */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-2 dark:text-white">Plateformes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {influenceur.plateformes.map((plateforme, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium dark:text-white">{plateforme.nom}</span>
                        </div>
                        <span className="text-gray-600 dark:text-gray-400">
                          {formatNumber(plateforme.abonnes)} abonnés
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audience */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-2 dark:text-white">Audience</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Taille totale</p>
                      <p className="text-lg font-semibold dark:text-white">
                        {formatNumber(influenceur.audience.taille)}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Engagement moyen</p>
                      <p className="text-lg font-semibold dark:text-white">
                        {influenceur.audience.engagement}%
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Âge principal</p>
                      <p className="text-lg font-semibold dark:text-white">
                        {influenceur.audience.demographique.age}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-2 dark:text-white">Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="font-medium dark:text-white">{influenceur.contact.email}</p>
                    </div>
                    {influenceur.contact.telephone && (
                      <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Téléphone</p>
                        <p className="font-medium dark:text-white">{influenceur.contact.telephone}</p>
                      </div>
                    )}
                    {influenceur.contact.agent && (
                      <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Agent</p>
                        <p className="font-medium dark:text-white">{influenceur.contact.agent}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Spécialités */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-2 dark:text-white">Spécialités</h4>
                  <div className="flex flex-wrap gap-2">
                    {influenceur.specialites.map((specialite, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm dark:bg-gray-700 dark:text-gray-300"
                      >
                        {specialite}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Collaborations */}
                {influenceur.collaborations.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2 dark:text-white">Dernières collaborations</h4>
                    <div className="space-y-4">
                      {influenceur.collaborations.map((collaboration, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium dark:text-white">{collaboration.type}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(collaboration.date).toLocaleDateString()}
                              </p>
                            </div>
                            {collaboration.performance && (
                              <div className="text-right">
                                <p className="text-sm font-medium dark:text-white">
                                  {formatNumber(collaboration.performance.vues)} vues
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {collaboration.performance.engagement}% engagement
                                </p>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{collaboration.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tarifs */}
                {influenceur.tarifs && (
                  <div>
                    <h4 className="font-semibold mb-2 dark:text-white">Tarifs</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Post</p>
                        <p className="text-lg font-semibold dark:text-white">
                          {influenceur.tarifs.post}€
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Story</p>
                        <p className="text-lg font-semibold dark:text-white">
                          {influenceur.tarifs.story}€
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Vidéo</p>
                        <p className="text-lg font-semibold dark:text-white">
                          {influenceur.tarifs.video}€
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Campagne</p>
                        <p className="text-lg font-semibold dark:text-white">
                          {influenceur.tarifs.campagne}€
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

export default InfluenceursPage;
