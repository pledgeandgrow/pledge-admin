import React, { useState } from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function TestEtValidation() {
  // Project data with expanded checklists
  const projets = [
    {
      id: 1,
      titre: 'WG',
      checklist: [
        { id: 1, tache: 'Validation du design initial', statut: false },
        { id: 2, tache: 'Tests de fonctionnalités principales', statut: false },
        { id: 3, tache: 'Test de performance', statut: false },
        { id: 4, tache: 'Validation de l\'intégration API', statut: false },
        { id: 5, tache: 'Tests de sécurité', statut: false },
        { id: 6, tache: 'Validation de l\'architecture système', statut: false },
        { id: 7, tache: 'Tests de compatibilité navigateurs', statut: false },
        { id: 8, tache: 'Vérification des contraintes de scalabilité', statut: false },
        { id: 9, tache: 'Audit de la documentation technique', statut: false },
        { id: 10, tache: 'Validation des processus de déploiement', statut: false },
        { id: 11, tache: 'Tests de charge et de stress', statut: false },
        { id: 12, tache: 'Vérification de la gestion des erreurs', statut: false },
        { id: 13, tache: 'Validation de l\'expérience utilisateur', statut: false },
        { id: 14, tache: 'Tests d\'accessibilité', statut: false },
        { id: 15, tache: 'Analyse de la performance réseau', statut: false }
      ]
    },
    {
      id: 2,
      titre: 'Smile to the world',
      checklist: [
        { id: 1, tache: 'Validation du design dentaire', statut: false },
        { id: 2, tache: 'Tests de navigation', statut: false },
        { id: 3, tache: 'Validation du contenu', statut: false },
        { id: 4, tache: 'Tests de responsive design', statut: false },
        { id: 5, tache: 'Validation des formulaires', statut: false },
        { id: 6, tache: 'Tests de compatibilité mobile', statut: false },
        { id: 7, tache: 'Validation de l\'intégration des médias', statut: false },
        { id: 8, tache: 'Tests de performance du site', statut: false },
        { id: 9, tache: 'Vérification des métadonnées SEO', statut: false },
        { id: 10, tache: 'Validation de l\'expérience patient', statut: false },
        { id: 11, tache: 'Tests de chargement des images', statut: false },
        { id: 12, tache: 'Validation des liens externes', statut: false },
        { id: 13, tache: 'Tests de sécurité des formulaires', statut: false },
        { id: 14, tache: 'Vérification de l\'accessibilité', statut: false },
        { id: 15, tache: 'Validation du parcours de réservation', statut: false }
      ]
    },
    {
      id: 3,
      titre: 'Cabinet Michou',
      checklist: [
        { id: 1, tache: 'Validation de l\'interface immobilière', statut: false },
        { id: 2, tache: 'Tests de gestion de propriétés', statut: false },
        { id: 3, tache: 'Validation des calculs et statistiques', statut: false },
        { id: 4, tache: 'Tests de génération de rapports', statut: false },
        { id: 5, tache: 'Validation de la base de données', statut: false },
        { id: 6, tache: 'Tests de recherche et filtrage', statut: false },
        { id: 7, tache: 'Validation de la gestion des utilisateurs', statut: false },
        { id: 8, tache: 'Tests de sécurité des données', statut: false },
        { id: 9, tache: 'Vérification de l\'intégration des API', statut: false },
        { id: 10, tache: 'Validation du système de notifications', statut: false },
        { id: 11, tache: 'Tests de performance des requêtes', statut: false },
        { id: 12, tache: 'Validation de l\'export de données', statut: false },
        { id: 13, tache: 'Tests de compatibilité des navigateurs', statut: false },
        { id: 14, tache: 'Vérification de l\'historique des transactions', statut: false },
        { id: 15, tache: 'Validation du tableau de bord administrateur', statut: false }
      ]
    }
  ];

  const [selectedProjet, setSelectedProjet] = useState(projets[0]);
  const [checklist, setChecklist] = useState(selectedProjet.checklist);

  const handleProjetSelect = (projet) => {
    setSelectedProjet(projet);
    setChecklist(projet.checklist);
  };

  const toggleChecklistItem = (itemId) => {
    setChecklist(prevChecklist => 
      prevChecklist.map(item => 
        item.id === itemId ? { ...item, statut: !item.statut } : item
      )
    );
  };

  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Test et Validation</h1>
        
        {/* Scrollable Project Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-4 pb-4">
            {projets.map((projet) => (
              <button
                key={projet.id}
                onClick={() => handleProjetSelect(projet)}
                className={`px-6 py-2 rounded-lg transition-all ${
                  selectedProjet.id === projet.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {projet.titre}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Checklist for Selected Project */}
        <div className="bg-white shadow-md rounded-lg p-6 max-h-[600px] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 sticky top-0 bg-white z-10 pb-2 border-b">
            Checklist pour {selectedProjet.titre}
          </h2>
          
          <div className="space-y-4">
            {checklist.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center bg-gray-100 p-4 rounded-lg"
              >
                <input 
                  type="checkbox" 
                  checked={item.statut}
                  onChange={() => toggleChecklistItem(item.id)}
                  className="mr-4 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className={`flex-grow ${item.statut ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {item.tache}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  item.statut 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.statut ? 'Fait' : 'Pas fait'}
                </span>
              </div>
            ))}
          </div>

          {/* Progress Summary */}
          <div className="mt-6 bg-gray-50 p-4 rounded-lg sticky bottom-0">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">
                Progression Globale
              </span>
              <span className="text-xl font-bold text-blue-600">
                {`${checklist.filter(item => item.statut).length} / ${checklist.length}`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ 
                  width: `${(checklist.filter(item => item.statut).length / checklist.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
