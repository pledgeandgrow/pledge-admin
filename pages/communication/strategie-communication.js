import React, { useState, useEffect, useMemo } from 'react';
import MegaMenu from '../../components/MegaMenu';

// Utility function to safely format numbers
const formatNumber = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return typeof value === 'number' ? value.toLocaleString() : value;
};

// Utility function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case 'En cours': return 'bg-green-100 text-green-800';
    case 'Planification': return 'bg-yellow-100 text-yellow-800';
    case 'Terminée': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function StrategieCommunication() {
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState('');
  const [strategies, setStrategies] = useState([
    {
      id: 1,
      titre: 'Stratégie Communication Digitale',
      objectif: 'Augmenter la visibilité et l\'engagement en ligne',
      canaux: ['LinkedIn', 'Twitter', 'Blog', 'Newsletter'],
      budgetAnnuel: 75000,
      indicateurs: {
        reachTotal: 500000,
        engagement: '3.5%',
        conversions: 250
      },
      statut: 'En cours'
    },
    {
      id: 2,
      titre: 'Positionnement Marque',
      objectif: 'Renforcer l\'image de marque et la différenciation',
      canaux: ['Médias', 'Conférences', 'Contenus Thought Leadership'],
      budgetAnnuel: 50000,
      indicateurs: {
        mentionsPresse: 45,
        notoriete: '65%',
        satisfactionClient: '4.2/5'
      },
      statut: 'Planification'
    }
  ]);

  const [nouvelleStrategie, setNouvelleStrategie] = useState({
    titre: '',
    objectif: '',
    canaux: [],
    budgetAnnuel: 0,
    indicateurs: {
      reachTotal: 0,
      engagement: '',
      conversions: 0
    },
    statut: 'Planification'
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddStrategie = () => {
    try {
      // Validation
      if (!nouvelleStrategie.titre) {
        setError('Le titre de la stratégie est obligatoire');
        return;
      }

      if (!nouvelleStrategie.objectif) {
        setError('L\'objectif de la stratégie est obligatoire');
        return;
      }

      if (nouvelleStrategie.budgetAnnuel <= 0) {
        setError('Le budget annuel doit être supérieur à zéro');
        return;
      }

      const strategieToAdd = {
        ...nouvelleStrategie,
        id: strategies.length + 1,
        canaux: nouvelleStrategie.canaux.filter(canal => canal.trim() !== '')
      };

      setStrategies(prev => [...prev, strategieToAdd]);
      
      // Reset form
      setNouvelleStrategie({
        titre: '',
        objectif: '',
        canaux: [],
        budgetAnnuel: 0,
        indicateurs: {
          reachTotal: 0,
          engagement: '',
          conversions: 0
        },
        statut: 'Planification'
      });

      // Clear any previous errors
      setError('');
    } catch (addError) {
      console.error('Error adding stratégie:', addError);
      setError('Impossible d\'ajouter la stratégie');
    }
  };

  // Memoized filtered strategies for performance
  const strategiesFiltrees = useMemo(() => {
    return strategies.sort((a, b) => {
      // Sort by status priority: En cours > Planification > Terminée
      const statusPriority = { 'En cours': 1, 'Planification': 2, 'Terminée': 3 };
      return statusPriority[a.statut] - statusPriority[b.statut];
    });
  }, [strategies]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">📢 Stratégie de Communication</h1>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
            <span 
              className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
              onClick={() => setError('')}
            >
              ×
            </span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Stratégies Existantes</h2>
            {strategiesFiltrees.map((strategie) => (
              <div 
                key={strategie.id} 
                className="border-b py-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-lg">{strategie.titre}</h3>
                <p className="text-gray-600 mb-2">{strategie.objectif}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className={`
                    px-3 py-1 rounded-full text-sm
                    ${getStatusColor(strategie.statut)}
                  `}>
                    {strategie.statut}
                  </span>
                  <span className="text-blue-600 font-semibold">Budget: {formatNumber(strategie.budgetAnnuel)} €</span>
                </div>
                <div>
                  <strong>Canaux:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {strategie.canaux.map((canal, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                      >
                        {canal}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <strong className="block text-gray-600">Reach Total</strong>
                    <span>{formatNumber(strategie.indicateurs?.reachTotal || strategie.indicateurs?.mentionsPresse)}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Engagement</strong>
                    <span>{strategie.indicateurs?.engagement || strategie.indicateurs?.notoriete || 'N/A'}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Conversions</strong>
                    <span>{formatNumber(strategie.indicateurs?.conversions || strategie.indicateurs?.satisfactionClient)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Nouvelle Stratégie</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-2">Titre de la Stratégie</label>
                <input 
                  type="text"
                  value={nouvelleStrategie.titre}
                  onChange={(e) => setNouvelleStrategie({...nouvelleStrategie, titre: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Nom de la stratégie"
                />
              </div>
              <div>
                <label className="block mb-2">Objectif</label>
                <input 
                  type="text"
                  value={nouvelleStrategie.objectif}
                  onChange={(e) => setNouvelleStrategie({...nouvelleStrategie, objectif: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Objectif principal"
                />
              </div>
              <div>
                <label className="block mb-2">Canaux</label>
                <input 
                  type="text"
                  value={nouvelleStrategie.canaux.join(', ')}
                  onChange={(e) => setNouvelleStrategie({
                    ...nouvelleStrategie, 
                    canaux: e.target.value.split(',').map(c => c.trim())
                  })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Canaux de communication, séparés par des virgules"
                />
              </div>
              <div>
                <label className="block mb-2">Budget Annuel</label>
                <input 
                  type="number"
                  value={nouvelleStrategie.budgetAnnuel}
                  onChange={(e) => setNouvelleStrategie({...nouvelleStrategie, budgetAnnuel: Number(e.target.value)})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Budget annuel en euros"
                />
              </div>
              <div>
                <label className="block mb-2">Statut</label>
                <select 
                  value={nouvelleStrategie.statut}
                  onChange={(e) => setNouvelleStrategie({...nouvelleStrategie, statut: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Planification">Planification</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminée">Terminée</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Indicateurs</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-sm text-gray-600">Reach Total</label>
                    <input 
                      type="number"
                      value={nouvelleStrategie.indicateurs.reachTotal}
                      onChange={(e) => setNouvelleStrategie({
                        ...nouvelleStrategie, 
                        indicateurs: {
                          ...nouvelleStrategie.indicateurs,
                          reachTotal: Number(e.target.value)
                        }
                      })}
                      className="w-full px-2 py-1 border rounded text-sm"
                      placeholder="Reach"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Engagement</label>
                    <input 
                      type="text"
                      value={nouvelleStrategie.indicateurs.engagement}
                      onChange={(e) => setNouvelleStrategie({
                        ...nouvelleStrategie, 
                        indicateurs: {
                          ...nouvelleStrategie.indicateurs,
                          engagement: e.target.value
                        }
                      })}
                      className="w-full px-2 py-1 border rounded text-sm"
                      placeholder="Taux %"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Conversions</label>
                    <input 
                      type="number"
                      value={nouvelleStrategie.indicateurs.conversions}
                      onChange={(e) => setNouvelleStrategie({
                        ...nouvelleStrategie, 
                        indicateurs: {
                          ...nouvelleStrategie.indicateurs,
                          conversions: Number(e.target.value)
                        }
                      })}
                      className="w-full px-2 py-1 border rounded text-sm"
                      placeholder="Nombre"
                    />
                  </div>
                </div>
              </div>
              <button 
                type="button"
                onClick={handleAddStrategie}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Ajouter Stratégie
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
