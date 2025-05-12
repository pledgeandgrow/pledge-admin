'use client';

import { type NextPage } from 'next';
import { useState } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';

interface Communication {
  id: string;
  titre: string;
  type: 'Annonce' | 'Note de service' | 'Flash info' | 'Newsletter interne' | 'Rapport';
  date: string;
  contenu: string;
  importance: 'Normale' | 'Importante' | 'Urgente';
  statut: 'Brouillon' | 'Publié' | 'Archivé';
  departements: string[];
  auteur: {
    nom: string;
    role: string;
    departement: string;
  };
  statistiques?: {
    vues: number;
    reactions: {
      likes: number;
      commentaires: number;
    };
    tauxLecture: number;
  };
}

const InternePage: NextPage = () => {
  const [communications, setCommunications] = useState<Communication[]>([
    {
      id: '1',
      titre: 'Nouvelle politique de télétravail',
      type: 'Note de service',
      date: '2025-02-20',
      contenu: 'Suite à la réunion du comité de direction...',
      importance: 'Importante',
      statut: 'Publié',
      departements: ['Tous les départements'],
      auteur: {
        nom: 'Sophie Martin',
        role: 'Directrice RH',
        departement: 'Ressources Humaines'
      },
      statistiques: {
        vues: 450,
        reactions: {
          likes: 89,
          commentaires: 23
        },
        tauxLecture: 85
      }
    }
  ]);

  const [nouvelleCommunication, setNouvelleCommunication] = useState<Omit<Communication, 'id'>>({
    titre: '',
    type: 'Annonce',
    date: new Date().toISOString().split('T')[0],
    contenu: '',
    importance: 'Normale',
    statut: 'Brouillon',
    departements: [],
    auteur: {
      nom: '',
      role: '',
      departement: ''
    }
  });

  const handleAddCommunication = () => {
    const newCommunication: Communication = {
      ...nouvelleCommunication,
      id: Math.random().toString(36).substr(2, 9)
    };
    setCommunications([...communications, newCommunication]);
    setNouvelleCommunication({
      titre: '',
      type: 'Annonce',
      date: new Date().toISOString().split('T')[0],
      contenu: '',
      importance: 'Normale',
      statut: 'Brouillon',
      departements: [],
      auteur: {
        nom: '',
        role: '',
        departement: ''
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Communication Interne</h1>
          
          {/* Formulaire nouvelle communication */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Nouvelle Communication</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Titre"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleCommunication.titre}
                onChange={(e) => setNouvelleCommunication({...nouvelleCommunication, titre: e.target.value})}
              />
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleCommunication.type}
                onChange={(e) => setNouvelleCommunication({...nouvelleCommunication, type: e.target.value as Communication['type']})}
              >
                <option value="Annonce">Annonce</option>
                <option value="Note de service">Note de service</option>
                <option value="Flash info">Flash info</option>
                <option value="Newsletter interne">Newsletter interne</option>
                <option value="Rapport">Rapport</option>
              </select>
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleCommunication.importance}
                onChange={(e) => setNouvelleCommunication({...nouvelleCommunication, importance: e.target.value as Communication['importance']})}
              >
                <option value="Normale">Normale</option>
                <option value="Importante">Importante</option>
                <option value="Urgente">Urgente</option>
              </select>
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleCommunication.statut}
                onChange={(e) => setNouvelleCommunication({...nouvelleCommunication, statut: e.target.value as Communication['statut']})}
              >
                <option value="Brouillon">Brouillon</option>
                <option value="Publié">Publié</option>
                <option value="Archivé">Archivé</option>
              </select>
              <input
                type="text"
                placeholder="Départements (séparés par des virgules)"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleCommunication.departements.join(', ')}
                onChange={(e) => setNouvelleCommunication({
                  ...nouvelleCommunication,
                  departements: e.target.value.split(',').map(d => d.trim()).filter(d => d)
                })}
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Nom de l'auteur"
                  className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={nouvelleCommunication.auteur.nom}
                  onChange={(e) => setNouvelleCommunication({
                    ...nouvelleCommunication,
                    auteur: {...nouvelleCommunication.auteur, nom: e.target.value}
                  })}
                />
                <input
                  type="text"
                  placeholder="Rôle"
                  className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={nouvelleCommunication.auteur.role}
                  onChange={(e) => setNouvelleCommunication({
                    ...nouvelleCommunication,
                    auteur: {...nouvelleCommunication.auteur, role: e.target.value}
                  })}
                />
                <input
                  type="text"
                  placeholder="Département"
                  className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={nouvelleCommunication.auteur.departement}
                  onChange={(e) => setNouvelleCommunication({
                    ...nouvelleCommunication,
                    auteur: {...nouvelleCommunication.auteur, departement: e.target.value}
                  })}
                />
              </div>
            </div>
            <div className="mt-4">
              <textarea
                placeholder="Contenu"
                className="border p-2 rounded w-full h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleCommunication.contenu}
                onChange={(e) => setNouvelleCommunication({...nouvelleCommunication, contenu: e.target.value})}
              />
            </div>
            <button
              onClick={handleAddCommunication}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Publier la communication
            </button>
          </div>

          {/* Liste des communications */}
          <div className="grid grid-cols-1 gap-6">
            {communications.map((communication) => (
              <div key={communication.id} className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold dark:text-white">{communication.titre}</h3>
                      <span className={`px-2 py-1 rounded text-sm ${
                        communication.importance === 'Urgente' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        communication.importance === 'Importante' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {communication.importance}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {communication.type} • {new Date(communication.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    communication.statut === 'Publié' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    communication.statut === 'Archivé' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {communication.statut}
                  </span>
                </div>

                <p className="text-gray-700 mb-4 dark:text-gray-300">{communication.contenu}</p>

                {/* Auteur */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                  <h4 className="font-semibold mb-2 dark:text-white">Auteur</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900">
                      <span className="text-blue-600 font-semibold dark:text-blue-200">
                        {communication.auteur.nom.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">{communication.auteur.nom}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {communication.auteur.role} • {communication.auteur.departement}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Départements */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 dark:text-white">Départements concernés</h4>
                  <div className="flex flex-wrap gap-2">
                    {communication.departements.map((departement, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded dark:bg-gray-700 dark:text-gray-300"
                      >
                        {departement}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Statistiques */}
                {communication.statistiques && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {communication.statistiques.vues}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Vues</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                      <div className="flex justify-center gap-4">
                        <div>
                          <p className="text-xl font-bold text-green-600 dark:text-green-400">
                            {communication.statistiques.reactions.likes}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Likes</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                            {communication.statistiques.reactions.commentaires}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Commentaires</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {communication.statistiques.tauxLecture}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Taux de lecture</p>
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

export default InternePage;
