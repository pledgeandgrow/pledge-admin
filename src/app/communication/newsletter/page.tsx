'use client';

import { type NextPage } from 'next';
import { useState } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';

interface Newsletter {
  id: string;
  titre: string;
  sujet: string;
  contenu: string;
  date: string;
  statut: 'Brouillon' | 'Programmé' | 'Envoyé' | 'Annulé';
  programmationDate?: string;
  destinataires: {
    total: number;
    segments: string[];
  };
  statistiques?: {
    ouvertures: number;
    clics: number;
    desabonnements: number;
    tauxEngagement: number;
  };
}

const NewsletterPage: NextPage = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([
    {
      id: '1',
      titre: 'Newsletter Mensuelle - Mars 2025',
      sujet: 'Découvrez nos dernières innovations',
      contenu: 'Contenu de la newsletter...',
      date: '2025-03-01',
      statut: 'Programmé',
      programmationDate: '2025-03-01T09:00:00',
      destinataires: {
        total: 5000,
        segments: ['Clients actifs', 'Prospects qualifiés']
      }
    },
    {
      id: '2',
      titre: 'Annonce Spéciale - Nouveau Produit',
      sujet: 'Découvrez en avant-première notre nouvelle solution',
      contenu: 'Contenu de la newsletter...',
      date: '2025-02-15',
      statut: 'Envoyé',
      destinataires: {
        total: 10000,
        segments: ['Tous les abonnés']
      },
      statistiques: {
        ouvertures: 6500,
        clics: 2800,
        desabonnements: 45,
        tauxEngagement: 28
      }
    }
  ]);

  const [nouvelleNewsletter, setNouvelleNewsletter] = useState<Omit<Newsletter, 'id'>>({
    titre: '',
    sujet: '',
    contenu: '',
    date: '',
    statut: 'Brouillon',
    destinataires: {
      total: 0,
      segments: []
    }
  });

  const handleAddNewsletter = () => {
    const newNewsletter: Newsletter = {
      ...nouvelleNewsletter,
      id: Math.random().toString(36).substr(2, 9)
    };
    setNewsletters([...newsletters, newNewsletter]);
    setNouvelleNewsletter({
      titre: '',
      sujet: '',
      contenu: '',
      date: '',
      statut: 'Brouillon',
      destinataires: {
        total: 0,
        segments: []
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Newsletter</h1>
          
          {/* Formulaire nouvelle newsletter */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Nouvelle Newsletter</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Titre"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleNewsletter.titre}
                onChange={(e) => setNouvelleNewsletter({...nouvelleNewsletter, titre: e.target.value})}
              />
              <input
                type="text"
                placeholder="Sujet"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleNewsletter.sujet}
                onChange={(e) => setNouvelleNewsletter({...nouvelleNewsletter, sujet: e.target.value})}
              />
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleNewsletter.statut}
                onChange={(e) => setNouvelleNewsletter({...nouvelleNewsletter, statut: e.target.value as Newsletter['statut']})}
              >
                <option value="Brouillon">Brouillon</option>
                <option value="Programmé">Programmé</option>
                <option value="Envoyé">Envoyé</option>
                <option value="Annulé">Annulé</option>
              </select>
              {nouvelleNewsletter.statut === 'Programmé' && (
                <input
                  type="datetime-local"
                  className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={nouvelleNewsletter.programmationDate}
                  onChange={(e) => setNouvelleNewsletter({...nouvelleNewsletter, programmationDate: e.target.value})}
                />
              )}
              <input
                type="text"
                placeholder="Segments (séparés par des virgules)"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleNewsletter.destinataires.segments.join(', ')}
                onChange={(e) => setNouvelleNewsletter({
                  ...nouvelleNewsletter,
                  destinataires: {
                    ...nouvelleNewsletter.destinataires,
                    segments: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  }
                })}
              />
              <input
                type="number"
                placeholder="Nombre de destinataires"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleNewsletter.destinataires.total || ''}
                onChange={(e) => setNouvelleNewsletter({
                  ...nouvelleNewsletter,
                  destinataires: {
                    ...nouvelleNewsletter.destinataires,
                    total: parseInt(e.target.value) || 0
                  }
                })}
              />
            </div>
            <div className="mt-4">
              <textarea
                placeholder="Contenu de la newsletter"
                className="border p-2 rounded w-full h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleNewsletter.contenu}
                onChange={(e) => setNouvelleNewsletter({...nouvelleNewsletter, contenu: e.target.value})}
              />
            </div>
            <button
              onClick={handleAddNewsletter}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Créer la newsletter
            </button>
          </div>

          {/* Liste des newsletters */}
          <div className="grid grid-cols-1 gap-6">
            {newsletters.map((newsletter) => (
              <div key={newsletter.id} className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">{newsletter.titre}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(newsletter.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    newsletter.statut === 'Envoyé' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    newsletter.statut === 'Programmé' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    newsletter.statut === 'Annulé' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {newsletter.statut}
                  </span>
                </div>

                <p className="text-gray-700 mb-4 dark:text-gray-300">{newsletter.sujet}</p>

                {/* Destinataires */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 dark:text-white">Destinataires</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {newsletter.destinataires.segments.map((segment, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded dark:bg-gray-700 dark:text-gray-300"
                        >
                          {segment}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {newsletter.destinataires.total} destinataires
                    </span>
                  </div>
                </div>

                {/* Statistiques */}
                {newsletter.statistiques && (
                  <div>
                    <h4 className="font-semibold mb-2 dark:text-white">Statistiques</h4>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {newsletter.statistiques.ouvertures}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Ouvertures</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {newsletter.statistiques.clics}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Clics</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                          {newsletter.statistiques.desabonnements}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Désabonnements</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {newsletter.statistiques.tauxEngagement}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Taux d'engagement</p>
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

export default NewsletterPage;
