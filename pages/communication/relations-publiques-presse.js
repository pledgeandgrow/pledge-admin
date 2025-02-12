import React, { useState, useEffect, useId, useMemo } from 'react';
import { 
  DocumentTextIcon, 
  NewspaperIcon, 
  PlusIcon, 
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/solid';
import MegaMenu from '../../components/MegaMenu';

// Utility function for date formatting
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Date invalide';
  }
};

// Sentiment color mapping
const getSentimentColor = (sentiment) => {
  switch (sentiment?.toLowerCase()) {
    case 'positif': return 'bg-green-100 text-green-800';
    case 'négatif': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function RelationsPubliquesPresse() {
  const [isClient, setIsClient] = useState(false);
  const baseId = useId();

  // Enhanced state with more comprehensive data
  const [communiques, setCommuniques] = useState([
    {
      id: `${baseId}-1`,
      titre: 'Lancement de Notre Nouvelle Stratégie de Communication',
      date: '2025-02-15',
      media: ['Le Monde', 'TechCrunch', 'Forbes France'],
      statut: 'Publié',
      resume: 'Annonce détaillée de notre approche innovante en communication',
      impact: {
        couverture: 12,
        lecteurs: 250000,
        sentiment: 'Positif',
        portee: 'Nationale',
        valeurMediatic: 45000
      },
      typeCommunique: 'Stratégique',
      motsCles: ['Innovation', 'Communication', 'Stratégie']
    }
  ]);

  // Enhanced new communique state with default values
  const [nouveauCommunique, setNouveauCommunique] = useState({
    titre: '',
    date: new Date().toISOString().split('T')[0],
    media: [],
    statut: 'Brouillon',
    resume: '',
    impact: {
      couverture: 0,
      lecteurs: 0,
      sentiment: 'Neutre',
      portee: 'Locale',
      valeurMediatic: 0
    },
    typeCommunique: 'Stratégique',
    motsCles: []
  });

  // Filtering and search states with default values
  const [filtres, setFiltres] = useState({
    statut: '',
    sentiment: '',
    dateDebut: '',
    dateFin: ''
  });

  const [recherche, setRecherche] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Advanced filtering and search with error handling
  const communiquesFiltres = useMemo(() => {
    try {
      return communiques.filter(comm => {
        const matchRecherche = recherche 
          ? (comm.titre?.toLowerCase().includes(recherche.toLowerCase()) ||
             comm.resume?.toLowerCase().includes(recherche.toLowerCase()) ||
             comm.motsCles?.some(mot => mot.toLowerCase().includes(recherche.toLowerCase())))
          : true;

        const matchStatut = filtres.statut 
          ? comm.statut === filtres.statut 
          : true;

        const matchSentiment = filtres.sentiment 
          ? comm.impact?.sentiment?.toLowerCase() === filtres.sentiment.toLowerCase() 
          : true;

        const matchDateDebut = filtres.dateDebut 
          ? new Date(comm.date) >= new Date(filtres.dateDebut) 
          : true;

        const matchDateFin = filtres.dateFin 
          ? new Date(comm.date) <= new Date(filtres.dateFin) 
          : true;

        return matchRecherche && matchStatut && matchSentiment && matchDateDebut && matchDateFin;
      });
    } catch (filterError) {
      console.error('Filtering error:', filterError);
      setError('Erreur lors du filtrage des communiqués');
      return communiques;
    }
  }, [communiques, recherche, filtres]);

  const handleAddCommunique = () => {
    try {
      // Validation
      if (!nouveauCommunique.titre) {
        setError('Le titre est obligatoire');
        return;
      }

      if (isClient) {
        const newId = `${baseId}-${communiques.length + 1}`;
        const communiqueToAdd = { 
          ...nouveauCommunique, 
          id: newId,
          date: nouveauCommunique.date || new Date().toISOString().split('T')[0]
        };

        setCommuniques(prev => [...prev, communiqueToAdd]);
        
        // Reset form
        setNouveauCommunique({
          titre: '',
          date: new Date().toISOString().split('T')[0],
          media: [],
          statut: 'Brouillon',
          resume: '',
          impact: {
            couverture: 0,
            lecteurs: 0,
            sentiment: 'Neutre',
            portee: 'Locale',
            valeurMediatic: 0
          },
          typeCommunique: 'Stratégique',
          motsCles: []
        });
        
        // Clear any previous errors
        setError('');
      }
    } catch (addError) {
      console.error('Error adding communiqué:', addError);
      setError('Impossible d\'ajouter le communiqué');
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem] space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center">
            <NewspaperIcon className="h-10 w-10 mr-3 text-blue-600" />
            Relations Publiques & Presse
          </h1>
          <button 
            onClick={() => document.getElementById('nouveau-communique').scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouveau Communiqué
          </button>
        </div>

        {/* Filtres et Recherche */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex space-x-4 mb-4">
            <div className="relative flex-grow">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Rechercher un communiqué..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Filtres
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <select 
              value={filtres.statut}
              onChange={(e) => setFiltres({...filtres, statut: e.target.value})}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">Tous les statuts</option>
              <option value="Brouillon">Brouillon</option>
              <option value="Publié">Publié</option>
            </select>
            <select 
              value={filtres.sentiment}
              onChange={(e) => setFiltres({...filtres, sentiment: e.target.value})}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">Tous sentiments</option>
              <option value="Positif">Positif</option>
              <option value="Neutre">Neutre</option>
              <option value="Négatif">Négatif</option>
            </select>
            <input 
              type="date"
              value={filtres.dateDebut}
              onChange={(e) => setFiltres({...filtres, dateDebut: e.target.value})}
              className="border rounded-lg px-3 py-2"
              placeholder="Date début"
            />
            <input 
              type="date"
              value={filtres.dateFin}
              onChange={(e) => setFiltres({...filtres, dateFin: e.target.value})}
              className="border rounded-lg px-3 py-2"
              placeholder="Date fin"
            />
          </div>
        </div>

        {/* Liste des Communiqués */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <DocumentTextIcon className="h-7 w-7 mr-3 text-blue-500" />
            Communiqués de Presse
          </h2>
          {communiquesFiltres.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Aucun communiqué trouvé
            </div>
          ) : (
            communiquesFiltres.map((comm) => (
              <div 
                key={comm.id} 
                className="border-b py-6 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg mb-2">{comm.titre}</h3>
                    <p className="text-gray-600 mb-3">{comm.resume}</p>
                  </div>
                  <span className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${comm.statut === 'Publié' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  `}>
                    {comm.statut}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex space-x-4">
                    <div>
                      <strong className="block text-gray-600 text-sm">Date</strong>
                      <span>{formatDate(comm.date)}</span>
                    </div>
                    <div>
                      <strong className="block text-gray-600 text-sm">Médias</strong>
                      <div className="flex space-x-2">
                        {comm.media.map((m, index) => (
                          <span 
                            key={index} 
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${getSentimentColor(comm.impact.sentiment)}
                  `}>
                    Sentiment: {comm.impact.sentiment}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                  <div>
                    <strong className="block text-gray-600 text-sm">Couverture</strong>
                    <span>{comm.impact.couverture}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600 text-sm">Lecteurs</strong>
                    <span>{comm.impact.lecteurs.toLocaleString()}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600 text-sm">Valeur Médiatique</strong>
                    <span>{comm.impact.valeurMediatic.toLocaleString()} €</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Formulaire Nouveau Communiqué */}
        <div id="nouveau-communique" className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <PlusIcon className="h-7 w-7 mr-3 text-green-500" />
            Nouveau Communiqué de Presse
          </h2>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Titre du Communiqué</label>
                <input 
                  type="text"
                  value={nouveauCommunique.titre}
                  onChange={(e) => setNouveauCommunique({...nouveauCommunique, titre: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Titre du communiqué de presse"
                />
              </div>
              <div>
                <label className="block mb-2">Type de Communiqué</label>
                <select
                  value={nouveauCommunique.typeCommunique}
                  onChange={(e) => setNouveauCommunique({...nouveauCommunique, typeCommunique: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Stratégique">Stratégique</option>
                  <option value="Événementiel">Événementiel</option>
                  <option value="Produit">Produit</option>
                  <option value="Institutionnel">Institutionnel</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block mb-2">Résumé</label>
              <textarea
                value={nouveauCommunique.resume}
                onChange={(e) => setNouveauCommunique({...nouveauCommunique, resume: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                rows="3"
                placeholder="Résumé du communiqué"
              ></textarea>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2">Date</label>
                <input 
                  type="date"
                  value={nouveauCommunique.date}
                  onChange={(e) => setNouveauCommunique({...nouveauCommunique, date: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Médias Cibles</label>
                <input 
                  type="text"
                  value={nouveauCommunique.media.join(', ')}
                  onChange={(e) => setNouveauCommunique({
                    ...nouveauCommunique, 
                    media: e.target.value.split(',').map(m => m.trim())
                  })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Médias (séparés par des virgules)"
                />
              </div>
              <div>
                <label className="block mb-2">Mots-Clés</label>
                <input 
                  type="text"
                  value={nouveauCommunique.motsCles.join(', ')}
                  onChange={(e) => setNouveauCommunique({
                    ...nouveauCommunique, 
                    motsCles: e.target.value.split(',').map(m => m.trim())
                  })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Mots-clés (séparés par des virgules)"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2">Statut</label>
                <select
                  value={nouveauCommunique.statut}
                  onChange={(e) => setNouveauCommunique({...nouveauCommunique, statut: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Brouillon">Brouillon</option>
                  <option value="Publié">Publié</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Sentiment Estimé</label>
                <select
                  value={nouveauCommunique.impact.sentiment}
                  onChange={(e) => setNouveauCommunique({
                    ...nouveauCommunique, 
                    impact: {
                      ...nouveauCommunique.impact,
                      sentiment: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Neutre">Neutre</option>
                  <option value="Positif">Positif</option>
                  <option value="Négatif">Négatif</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Portée Estimée</label>
                <select
                  value={nouveauCommunique.impact.portee}
                  onChange={(e) => setNouveauCommunique({
                    ...nouveauCommunique, 
                    impact: {
                      ...nouveauCommunique.impact,
                      portee: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Sélectionner</option>
                  <option value="Locale">Locale</option>
                  <option value="Régionale">Régionale</option>
                  <option value="Nationale">Nationale</option>
                  <option value="Internationale">Internationale</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                type="button"
                onClick={handleAddCommunique}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Ajouter le Communiqué
              </button>
            </div>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
