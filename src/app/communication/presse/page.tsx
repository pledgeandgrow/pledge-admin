'use client';

import { type NextPage } from 'next';
import { useState, useEffect, useId } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';

interface Media {
  nom: string;
  contact: string;
  email: string;
  telephone: string;
  statut: 'À contacter' | 'Contacté' | 'Envoyé' | 'En attente' | 'Refusé';
  reponse: string;
}

interface Document {
  type: 'Communiqué' | 'Photos' | 'Vidéos' | 'Infographies' | 'Dossier';
  url: string;
  langue: 'Français' | 'Anglais' | 'Allemand' | 'Espagnol' | 'N/A';
}

interface Resultats {
  articles: number;
  interviews: number;
  retombeesPresse: number;
  porteeEstimee: number;
}

interface Communique {
  id: string;
  titre: string;
  type: 'Communiqué de presse' | 'Dossier de presse' | 'Note aux médias' | 'Invitation presse';
  date: string;
  statut: 'En préparation' | 'En validation' | 'Prêt à diffuser' | 'Publié';
  priorite: 'Basse' | 'Moyenne' | 'Haute' | 'Urgente';
  responsable: string;
  contenu: string;
  medias: Media[];
  documents: Document[];
  resultats: Resultats;
}

interface NouveauMedia extends Omit<Media, 'id'> {
  communiqueId: string;
}

interface NouveauDocument extends Omit<Document, 'id'> {
  communiqueId: string;
}

const PressePage: NextPage = () => {
  const [isClient, setIsClient] = useState(false);
  const baseId = useId();

  const [communiques, setCommuniques] = useState<Communique[]>([
    {
      id: `${baseId}-1`,
      titre: 'Lancement Innovation Tech 2025',
      type: 'Communiqué de presse',
      date: '2025-02-23',
      statut: 'Publié',
      priorite: 'Haute',
      responsable: 'Sophie Martin',
      contenu: 'Notre entreprise est fière d\'annoncer le lancement de sa nouvelle solution technologique...',
      medias: [
        {
          nom: 'Le Monde',
          contact: 'Jean Dupont',
          email: 'j.dupont@lemonde.fr',
          telephone: '+33 1 23 45 67 89',
          statut: 'Envoyé',
          reponse: 'Intéressé - Interview prévue'
        },
        {
          nom: 'Les Echos',
          contact: 'Marie Lambert',
          email: 'm.lambert@lesechos.fr',
          telephone: '+33 6 12 34 56 78',
          statut: 'En attente',
          reponse: 'Demande d\'informations complémentaires'
        }
      ],
      documents: [
        {
          type: 'Communiqué',
          url: '/documents/cp-innovation-2025.pdf',
          langue: 'Français'
        },
        {
          type: 'Photos',
          url: '/documents/photos-innovation-2025.zip',
          langue: 'N/A'
        }
      ],
      resultats: {
        articles: 12,
        interviews: 3,
        retombeesPresse: 25,
        porteeEstimee: 750000
      }
    }
  ]);

  const [nouveauCommunique, setNouveauCommunique] = useState<Omit<Communique, 'id'>>({
    titre: '',
    type: 'Communiqué de presse',
    date: '',
    statut: 'En préparation',
    priorite: 'Moyenne',
    responsable: '',
    contenu: '',
    medias: [],
    documents: [],
    resultats: {
      articles: 0,
      interviews: 0,
      retombeesPresse: 0,
      porteeEstimee: 0
    }
  });

  const [nouveauMedia, setNouveauMedia] = useState<NouveauMedia>({
    communiqueId: '',
    nom: '',
    contact: '',
    email: '',
    telephone: '',
    statut: 'À contacter',
    reponse: ''
  });

  const [nouveauDocument, setNouveauDocument] = useState<NouveauDocument>({
    communiqueId: '',
    type: 'Communiqué',
    url: '',
    langue: 'Français'
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddCommunique = () => {
    if (!nouveauCommunique.titre || !nouveauCommunique.date || !nouveauCommunique.responsable) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setCommuniques([
      ...communiques,
      {
        ...nouveauCommunique,
        id: `${baseId}-${communiques.length + 1}`
      }
    ]);

    setNouveauCommunique({
      titre: '',
      type: 'Communiqué de presse',
      date: '',
      statut: 'En préparation',
      priorite: 'Moyenne',
      responsable: '',
      contenu: '',
      medias: [],
      documents: [],
      resultats: {
        articles: 0,
        interviews: 0,
        retombeesPresse: 0,
        porteeEstimee: 0
      }
    });
  };

  const handleAddMedia = () => {
    if (!nouveauMedia.communiqueId || !nouveauMedia.nom || !nouveauMedia.contact) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setCommuniques(communiques.map(communique => {
      if (communique.id === nouveauMedia.communiqueId) {
        return {
          ...communique,
          medias: [...communique.medias, {
            nom: nouveauMedia.nom,
            contact: nouveauMedia.contact,
            email: nouveauMedia.email,
            telephone: nouveauMedia.telephone,
            statut: nouveauMedia.statut,
            reponse: nouveauMedia.reponse
          }]
        };
      }
      return communique;
    }));

    setNouveauMedia({
      communiqueId: '',
      nom: '',
      contact: '',
      email: '',
      telephone: '',
      statut: 'À contacter',
      reponse: ''
    });
  };

  const handleAddDocument = () => {
    if (!nouveauDocument.communiqueId || !nouveauDocument.type || !nouveauDocument.url) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setCommuniques(communiques.map(communique => {
      if (communique.id === nouveauDocument.communiqueId) {
        return {
          ...communique,
          documents: [...communique.documents, {
            type: nouveauDocument.type,
            url: nouveauDocument.url,
            langue: nouveauDocument.langue
          }]
        };
      }
      return communique;
    }));

    setNouveauDocument({
      communiqueId: '',
      type: 'Communiqué',
      url: '',
      langue: 'Français'
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
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Presse</h1>
          
          {/* Formulaire nouveau communiqué */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Nouveau Communiqué</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Titre"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauCommunique.titre}
                onChange={(e) => setNouveauCommunique({...nouveauCommunique, titre: e.target.value})}
              />
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauCommunique.type}
                onChange={(e) => setNouveauCommunique({...nouveauCommunique, type: e.target.value as Communique['type']})}
              >
                <option value="Communiqué de presse">Communiqué de presse</option>
                <option value="Dossier de presse">Dossier de presse</option>
                <option value="Note aux médias">Note aux médias</option>
                <option value="Invitation presse">Invitation presse</option>
              </select>
              <input
                type="date"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauCommunique.date}
                onChange={(e) => setNouveauCommunique({...nouveauCommunique, date: e.target.value})}
              />
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauCommunique.priorite}
                onChange={(e) => setNouveauCommunique({...nouveauCommunique, priorite: e.target.value as Communique['priorite']})}
              >
                <option value="Basse">Basse</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Haute">Haute</option>
                <option value="Urgente">Urgente</option>
              </select>
              <input
                type="text"
                placeholder="Responsable"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauCommunique.responsable}
                onChange={(e) => setNouveauCommunique({...nouveauCommunique, responsable: e.target.value})}
              />
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauCommunique.statut}
                onChange={(e) => setNouveauCommunique({...nouveauCommunique, statut: e.target.value as Communique['statut']})}
              >
                <option value="En préparation">En préparation</option>
                <option value="En validation">En validation</option>
                <option value="Prêt à diffuser">Prêt à diffuser</option>
                <option value="Publié">Publié</option>
              </select>
            </div>
            <div className="mt-4">
              <textarea
                placeholder="Contenu du communiqué"
                className="border p-2 rounded w-full h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauCommunique.contenu}
                onChange={(e) => setNouveauCommunique({...nouveauCommunique, contenu: e.target.value})}
              />
            </div>
            <button
              onClick={handleAddCommunique}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Créer le communiqué
            </button>
          </div>

          {/* Liste des communiqués */}
          <div className="grid grid-cols-1 gap-6">
            {communiques.map((communique) => (
              <div key={communique.id} className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">{communique.titre}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {communique.type} • {new Date(communique.date).toLocaleDateString()} • {communique.responsable}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      communique.priorite === 'Haute' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      communique.priorite === 'Moyenne' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {communique.priorite}
                    </span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      communique.statut === 'Publié' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      communique.statut === 'En préparation' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {communique.statut}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 dark:text-gray-300">{communique.contenu}</p>
                
                {/* Médias */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 dark:text-white">Médias contactés</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {communique.medias.map((media, index) => (
                      <div key={index} className="border p-3 rounded dark:border-gray-700">
                        <p className="font-medium dark:text-white">{media.nom}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{media.contact}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{media.email}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{media.telephone}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className={`px-2 py-1 rounded text-sm ${
                            media.statut === 'Envoyé' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            media.statut === 'En attente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                            {media.statut}
                          </span>
                        </div>
                        {media.reponse && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{media.reponse}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 dark:text-white">Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {communique.documents.map((document, index) => (
                      <a
                        key={index}
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-2 border rounded hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <span className="mr-2">📄</span>
                        <div>
                          <p className="font-medium dark:text-white">{document.type}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{document.langue}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Résultats */}
                <div>
                  <h4 className="font-semibold mb-2 dark:text-white">Résultats</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{communique.resultats.articles}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Articles</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{communique.resultats.interviews}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Interviews</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{communique.resultats.retombeesPresse}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Retombées</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{communique.resultats.porteeEstimee.toLocaleString()}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Portée estimée</p>
                    </div>
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

export default PressePage;
