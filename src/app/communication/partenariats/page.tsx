'use client';

import { type NextPage } from 'next';
import { useState } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';

interface Partenariat {
  id: string;
  nom: string;
  type: 'Technologique' | 'Commercial' | 'Stratégique' | 'Académique' | 'Événementiel';
  statut: 'En discussion' | 'Actif' | 'En pause' | 'Terminé';
  dateDebut: string;
  dateFin?: string;
  description: string;
  objectifs: string[];
  contact: {
    nom: string;
    role: string;
    email: string;
    telephone: string;
  };
  valeur: {
    montant: number;
    devise: string;
    type: 'Monétaire' | 'Non monétaire' | 'Mixte';
  };
  avantages: string[];
  engagements: string[];
  documents: Array<{
    nom: string;
    type: 'Contrat' | 'Présentation' | 'Rapport' | 'Autre';
    url: string;
    dateAjout: string;
  }>;
}

const PartenariatsPage: NextPage = () => {
  const [partenariats, setPartenariats] = useState<Partenariat[]>([
    {
      id: '1',
      nom: 'Innovation Tech Labs',
      type: 'Technologique',
      statut: 'Actif',
      dateDebut: '2025-01-01',
      description: 'Partenariat stratégique pour le développement de solutions IA',
      objectifs: [
        'Développer une solution IA commune',
        'Partager les ressources R&D',
        'Organiser des événements tech'
      ],
      contact: {
        nom: 'Marc Lambert',
        role: 'Directeur Innovation',
        email: 'm.lambert@techlabs.fr',
        telephone: '+33 1 23 45 67 89'
      },
      valeur: {
        montant: 150000,
        devise: 'EUR',
        type: 'Mixte'
      },
      avantages: [
        'Accès aux ressources R&D',
        'Co-branding sur les événements',
        'Partage des revenus'
      ],
      engagements: [
        'Développement conjoint',
        'Support technique',
        'Participation aux événements'
      ],
      documents: [
        {
          nom: 'Contrat de partenariat',
          type: 'Contrat',
          url: '/documents/contrat-techlabs.pdf',
          dateAjout: '2024-12-15'
        }
      ]
    }
  ]);

  const [nouveauPartenariat, setNouveauPartenariat] = useState<Omit<Partenariat, 'id' | 'documents'>>({
    nom: '',
    type: 'Technologique',
    statut: 'En discussion',
    dateDebut: '',
    description: '',
    objectifs: [],
    contact: {
      nom: '',
      role: '',
      email: '',
      telephone: ''
    },
    valeur: {
      montant: 0,
      devise: 'EUR',
      type: 'Monétaire'
    },
    avantages: [],
    engagements: []
  });

  const handleAddPartenariat = () => {
    const newPartenariat: Partenariat = {
      ...nouveauPartenariat,
      id: Math.random().toString(36).substr(2, 9),
      documents: []
    };
    setPartenariats([...partenariats, newPartenariat]);
    setNouveauPartenariat({
      nom: '',
      type: 'Technologique',
      statut: 'En discussion',
      dateDebut: '',
      description: '',
      objectifs: [],
      contact: {
        nom: '',
        role: '',
        email: '',
        telephone: ''
      },
      valeur: {
        montant: 0,
        devise: 'EUR',
        type: 'Monétaire'
      },
      avantages: [],
      engagements: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Partenariats</h1>
          
          {/* Formulaire nouveau partenariat */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Nouveau Partenariat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom du partenaire"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauPartenariat.nom}
                onChange={(e) => setNouveauPartenariat({...nouveauPartenariat, nom: e.target.value})}
              />
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauPartenariat.type}
                onChange={(e) => setNouveauPartenariat({...nouveauPartenariat, type: e.target.value as Partenariat['type']})}
              >
                <option value="Technologique">Technologique</option>
                <option value="Commercial">Commercial</option>
                <option value="Stratégique">Stratégique</option>
                <option value="Académique">Académique</option>
                <option value="Événementiel">Événementiel</option>
              </select>
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauPartenariat.statut}
                onChange={(e) => setNouveauPartenariat({...nouveauPartenariat, statut: e.target.value as Partenariat['statut']})}
              >
                <option value="En discussion">En discussion</option>
                <option value="Actif">Actif</option>
                <option value="En pause">En pause</option>
                <option value="Terminé">Terminé</option>
              </select>
              <input
                type="date"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauPartenariat.dateDebut}
                onChange={(e) => setNouveauPartenariat({...nouveauPartenariat, dateDebut: e.target.value})}
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="Montant"
                  className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={nouveauPartenariat.valeur.montant || ''}
                  onChange={(e) => setNouveauPartenariat({
                    ...nouveauPartenariat,
                    valeur: {...nouveauPartenariat.valeur, montant: parseInt(e.target.value) || 0}
                  })}
                />
                <select
                  className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={nouveauPartenariat.valeur.devise}
                  onChange={(e) => setNouveauPartenariat({
                    ...nouveauPartenariat,
                    valeur: {...nouveauPartenariat.valeur, devise: e.target.value}
                  })}
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
                <select
                  className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={nouveauPartenariat.valeur.type}
                  onChange={(e) => setNouveauPartenariat({
                    ...nouveauPartenariat,
                    valeur: {...nouveauPartenariat.valeur, type: e.target.value as Partenariat['valeur']['type']}
                  })}
                >
                  <option value="Monétaire">Monétaire</option>
                  <option value="Non monétaire">Non monétaire</option>
                  <option value="Mixte">Mixte</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <textarea
                placeholder="Description"
                className="border p-2 rounded w-full h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauPartenariat.description}
                onChange={(e) => setNouveauPartenariat({...nouveauPartenariat, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <input
                  type="text"
                  placeholder="Objectifs (séparés par des virgules)"
                  className="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={nouveauPartenariat.objectifs.join(', ')}
                  onChange={(e) => setNouveauPartenariat({
                    ...nouveauPartenariat,
                    objectifs: e.target.value.split(',').map(o => o.trim()).filter(o => o)
                  })}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Avantages (séparés par des virgules)"
                  className="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={nouveauPartenariat.avantages.join(', ')}
                  onChange={(e) => setNouveauPartenariat({
                    ...nouveauPartenariat,
                    avantages: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                  })}
                />
              </div>
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Engagements (séparés par des virgules)"
                className="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauPartenariat.engagements.join(', ')}
                onChange={(e) => setNouveauPartenariat({
                  ...nouveauPartenariat,
                  engagements: e.target.value.split(',').map(e => e.trim()).filter(e => e)
                })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                placeholder="Nom du contact"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauPartenariat.contact.nom}
                onChange={(e) => setNouveauPartenariat({
                  ...nouveauPartenariat,
                  contact: {...nouveauPartenariat.contact, nom: e.target.value}
                })}
              />
              <input
                type="text"
                placeholder="Rôle du contact"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauPartenariat.contact.role}
                onChange={(e) => setNouveauPartenariat({
                  ...nouveauPartenariat,
                  contact: {...nouveauPartenariat.contact, role: e.target.value}
                })}
              />
              <input
                type="email"
                placeholder="Email du contact"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauPartenariat.contact.email}
                onChange={(e) => setNouveauPartenariat({
                  ...nouveauPartenariat,
                  contact: {...nouveauPartenariat.contact, email: e.target.value}
                })}
              />
              <input
                type="tel"
                placeholder="Téléphone du contact"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauPartenariat.contact.telephone}
                onChange={(e) => setNouveauPartenariat({
                  ...nouveauPartenariat,
                  contact: {...nouveauPartenariat.contact, telephone: e.target.value}
                })}
              />
            </div>
            <button
              onClick={handleAddPartenariat}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Créer le partenariat
            </button>
          </div>

          {/* Liste des partenariats */}
          <div className="grid grid-cols-1 gap-6">
            {partenariats.map((partenariat) => (
              <div key={partenariat.id} className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">{partenariat.nom}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {partenariat.type} • Depuis le {new Date(partenariat.dateDebut).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    partenariat.statut === 'Actif' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    partenariat.statut === 'En discussion' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    partenariat.statut === 'En pause' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {partenariat.statut}
                  </span>
                </div>

                <p className="text-gray-700 mb-4 dark:text-gray-300">{partenariat.description}</p>

                {/* Valeur */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                  <h4 className="font-semibold mb-2 dark:text-white">Valeur du partenariat</h4>
                  <div className="flex items-center gap-4">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {partenariat.valeur.montant.toLocaleString()} {partenariat.valeur.devise}
                    </p>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded dark:bg-blue-900 dark:text-blue-200">
                      {partenariat.valeur.type}
                    </span>
                  </div>
                </div>

                {/* Contact */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-2 dark:text-white">Contact principal</h4>
                  <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900">
                        <span className="text-blue-600 font-semibold dark:text-blue-200">
                          {partenariat.contact.nom.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium dark:text-white">{partenariat.contact.nom}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{partenariat.contact.role}</p>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {partenariat.contact.email}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {partenariat.contact.telephone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Objectifs, Avantages, Engagements */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <h4 className="font-semibold mb-2 dark:text-white">Objectifs</h4>
                    <div className="space-y-2">
                      {partenariat.objectifs.map((objectif, index) => (
                        <div
                          key={index}
                          className="p-2 bg-gray-50 rounded dark:bg-gray-700 text-sm dark:text-gray-300"
                        >
                          {objectif}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 dark:text-white">Avantages</h4>
                    <div className="space-y-2">
                      {partenariat.avantages.map((avantage, index) => (
                        <div
                          key={index}
                          className="p-2 bg-gray-50 rounded dark:bg-gray-700 text-sm dark:text-gray-300"
                        >
                          {avantage}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 dark:text-white">Engagements</h4>
                    <div className="space-y-2">
                      {partenariat.engagements.map((engagement, index) => (
                        <div
                          key={index}
                          className="p-2 bg-gray-50 rounded dark:bg-gray-700 text-sm dark:text-gray-300"
                        >
                          {engagement}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Documents */}
                {partenariat.documents.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 dark:text-white">Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {partenariat.documents.map((document, index) => (
                        <a
                          key={index}
                          href={document.url}
                          className="p-3 bg-gray-50 rounded-lg dark:bg-gray-700 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center dark:bg-blue-900">
                            <span className="text-blue-600 text-sm font-semibold dark:text-blue-200">
                              {document.type[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium dark:text-white">{document.nom}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(document.dateAjout).toLocaleDateString()}
                            </p>
                          </div>
                        </a>
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

export default PartenariatsPage;
