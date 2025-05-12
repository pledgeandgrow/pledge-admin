'use client';

import { type NextPage } from 'next';
import { useState, useEffect, useId } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';

interface Engagement {
  likes: number;
  partages: number;
  commentaires: number;
}

interface Action {
  type: 'Réponse' | 'Modération' | 'Escalade';
  date: string;
  statut: 'En cours' | 'Complété' | 'En attente';
  responsable: string;
}

interface Mention {
  id: string;
  source: 'Twitter' | 'LinkedIn' | 'Facebook' | 'Instagram' | 'Presse';
  titre: string;
  contenu: string;
  auteur: string;
  date: string;
  sentiment: 'Positif' | 'Neutre' | 'Négatif';
  impact: 'Faible' | 'Moyen' | 'Fort';
  engagement: Engagement;
  url: string;
  tags: string[];
  actions: Action[];
}

interface Filtres {
  source: string;
  sentiment: string;
  impact: string;
  dateDebut: string;
  dateFin: string;
  tags: string[];
}

interface NouvelleMention extends Omit<Mention, 'id'> {}

interface NouvelleAction extends Omit<Action, 'id'> {
  mentionId: string;
}

const EReputationPage: NextPage = () => {
  const [isClient, setIsClient] = useState(false);
  const baseId = useId();

  const [mentions, setMentions] = useState<Mention[]>([
    {
      id: `${baseId}-1`,
      source: 'Twitter',
      titre: 'Discussion produit',
      contenu: 'Le nouveau service client de @CompanyName est vraiment efficace !',
      auteur: '@ClientSatisfait',
      date: '2025-02-23',
      sentiment: 'Positif',
      impact: 'Moyen',
      engagement: {
        likes: 45,
        partages: 12,
        commentaires: 8
      },
      url: 'https://twitter.com/ClientSatisfait/status/123456789',
      tags: ['Service Client', 'Satisfaction', 'Innovation'],
      actions: [
        {
          type: 'Réponse',
          date: '2025-02-23',
          statut: 'Complété',
          responsable: 'Marie Lambert'
        }
      ]
    }
  ]);

  const [nouvelleMention, setNouvelleMention] = useState<NouvelleMention>({
    source: 'Twitter',
    titre: '',
    contenu: '',
    auteur: '',
    date: '',
    sentiment: 'Neutre',
    impact: 'Faible',
    engagement: {
      likes: 0,
      partages: 0,
      commentaires: 0
    },
    url: '',
    tags: [],
    actions: []
  });

  const [nouvelleAction, setNouvelleAction] = useState<NouvelleAction>({
    mentionId: '',
    type: 'Réponse',
    date: '',
    statut: 'En cours',
    responsable: ''
  });

  const [filtres, setFiltres] = useState<Filtres>({
    source: '',
    sentiment: '',
    impact: '',
    dateDebut: '',
    dateFin: '',
    tags: []
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddMention = () => {
    if (!nouvelleMention.titre || !nouvelleMention.contenu || !nouvelleMention.date) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setMentions([
      ...mentions,
      {
        ...nouvelleMention,
        id: `${baseId}-${mentions.length + 1}`
      }
    ]);

    setNouvelleMention({
      source: 'Twitter',
      titre: '',
      contenu: '',
      auteur: '',
      date: '',
      sentiment: 'Neutre',
      impact: 'Faible',
      engagement: {
        likes: 0,
        partages: 0,
        commentaires: 0
      },
      url: '',
      tags: [],
      actions: []
    });
  };

  const handleAddAction = () => {
    if (!nouvelleAction.mentionId || !nouvelleAction.date || !nouvelleAction.responsable) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setMentions(mentions.map(mention => {
      if (mention.id === nouvelleAction.mentionId) {
        return {
          ...mention,
          actions: [...mention.actions, {
            type: nouvelleAction.type,
            date: nouvelleAction.date,
            statut: nouvelleAction.statut,
            responsable: nouvelleAction.responsable
          }]
        };
      }
      return mention;
    }));

    setNouvelleAction({
      mentionId: '',
      type: 'Réponse',
      date: '',
      statut: 'En cours',
      responsable: ''
    });
  };

  const filtrerMentions = () => {
    return mentions.filter(mention => {
      if (filtres.source && mention.source !== filtres.source) return false;
      if (filtres.sentiment && mention.sentiment !== filtres.sentiment) return false;
      if (filtres.impact && mention.impact !== filtres.impact) return false;
      if (filtres.dateDebut && new Date(mention.date) < new Date(filtres.dateDebut)) return false;
      if (filtres.dateFin && new Date(mention.date) > new Date(filtres.dateFin)) return false;
      if (filtres.tags.length > 0 && !filtres.tags.some(tag => mention.tags.includes(tag))) return false;
      return true;
    });
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">E-réputation</h1>
          
          {/* Filtres */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Filtres</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={filtres.source}
                onChange={(e) => setFiltres({...filtres, source: e.target.value})}
              >
                <option value="">Toutes les sources</option>
                <option value="Twitter">Twitter</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="Presse">Presse</option>
              </select>
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={filtres.sentiment}
                onChange={(e) => setFiltres({...filtres, sentiment: e.target.value})}
              >
                <option value="">Tous les sentiments</option>
                <option value="Positif">Positif</option>
                <option value="Neutre">Neutre</option>
                <option value="Négatif">Négatif</option>
              </select>
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={filtres.impact}
                onChange={(e) => setFiltres({...filtres, impact: e.target.value})}
              >
                <option value="">Tous les impacts</option>
                <option value="Faible">Faible</option>
                <option value="Moyen">Moyen</option>
                <option value="Fort">Fort</option>
              </select>
              <input
                type="date"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={filtres.dateDebut}
                onChange={(e) => setFiltres({...filtres, dateDebut: e.target.value})}
              />
              <input
                type="date"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={filtres.dateFin}
                onChange={(e) => setFiltres({...filtres, dateFin: e.target.value})}
              />
              <input
                type="text"
                placeholder="Tags (séparés par des virgules)"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={filtres.tags.join(', ')}
                onChange={(e) => setFiltres({
                  ...filtres,
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                })}
              />
            </div>
          </div>

          {/* Formulaire nouvelle mention */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Nouvelle Mention</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleMention.source}
                onChange={(e) => setNouvelleMention({...nouvelleMention, source: e.target.value as Mention['source']})}
              >
                <option value="Twitter">Twitter</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="Presse">Presse</option>
              </select>
              <input
                type="text"
                placeholder="Titre"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleMention.titre}
                onChange={(e) => setNouvelleMention({...nouvelleMention, titre: e.target.value})}
              />
              <input
                type="text"
                placeholder="Auteur"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleMention.auteur}
                onChange={(e) => setNouvelleMention({...nouvelleMention, auteur: e.target.value})}
              />
              <input
                type="date"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleMention.date}
                onChange={(e) => setNouvelleMention({...nouvelleMention, date: e.target.value})}
              />
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleMention.sentiment}
                onChange={(e) => setNouvelleMention({...nouvelleMention, sentiment: e.target.value as Mention['sentiment']})}
              >
                <option value="Positif">Positif</option>
                <option value="Neutre">Neutre</option>
                <option value="Négatif">Négatif</option>
              </select>
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleMention.impact}
                onChange={(e) => setNouvelleMention({...nouvelleMention, impact: e.target.value as Mention['impact']})}
              >
                <option value="Faible">Faible</option>
                <option value="Moyen">Moyen</option>
                <option value="Fort">Fort</option>
              </select>
              <input
                type="url"
                placeholder="URL"
                className="border p-2 rounded col-span-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleMention.url}
                onChange={(e) => setNouvelleMention({...nouvelleMention, url: e.target.value})}
              />
              <textarea
                placeholder="Contenu"
                className="border p-2 rounded col-span-2 h-24 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleMention.contenu}
                onChange={(e) => setNouvelleMention({...nouvelleMention, contenu: e.target.value})}
              />
              <div className="col-span-2 grid grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Likes"
                  className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={nouvelleMention.engagement.likes}
                  onChange={(e) => setNouvelleMention({
                    ...nouvelleMention,
                    engagement: {...nouvelleMention.engagement, likes: parseInt(e.target.value)}
                  })}
                />
                <input
                  type="number"
                  placeholder="Partages"
                  className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={nouvelleMention.engagement.partages}
                  onChange={(e) => setNouvelleMention({
                    ...nouvelleMention,
                    engagement: {...nouvelleMention.engagement, partages: parseInt(e.target.value)}
                  })}
                />
                <input
                  type="number"
                  placeholder="Commentaires"
                  className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={nouvelleMention.engagement.commentaires}
                  onChange={(e) => setNouvelleMention({
                    ...nouvelleMention,
                    engagement: {...nouvelleMention.engagement, commentaires: parseInt(e.target.value)}
                  })}
                />
              </div>
            </div>
            <button
              onClick={handleAddMention}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Ajouter la mention
            </button>
          </div>

          {/* Liste des mentions */}
          <div className="grid grid-cols-1 gap-6">
            {filtrerMentions().map((mention) => (
              <div key={mention.id} className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">{mention.titre}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {mention.source} • {new Date(mention.date).toLocaleDateString()} • {mention.auteur}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      mention.sentiment === 'Positif' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      mention.sentiment === 'Négatif' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {mention.sentiment}
                    </span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      mention.impact === 'Fort' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      mention.impact === 'Moyen' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {mention.impact}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 dark:text-gray-300">{mention.contenu}</p>
                
                {/* Engagement */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{mention.engagement.likes}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Likes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{mention.engagement.partages}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Partages</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{mention.engagement.commentaires}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Commentaires</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {mention.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded dark:bg-gray-700 dark:text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h4 className="font-semibold mb-2 dark:text-white">Actions</h4>
                  <div className="space-y-2">
                    {mention.actions.map((action, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded dark:bg-gray-700"
                      >
                        <div>
                          <p className="font-medium dark:text-white">{action.type}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {action.responsable} • {new Date(action.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-sm ${
                          action.statut === 'Complété' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          action.statut === 'En cours' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {action.statut}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EReputationPage;
