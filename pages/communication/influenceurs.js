import React, { useState } from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function Influenceurs() {
  const [influenceurs, setInfluenceurs] = useState([
    {
      id: 1,
      nom: 'Emma Dubois',
      plateforme: 'Tech Insights Blog',
      domaine: 'Tech & Innovation',
      audience: '250K followers',
      statut: 'En négociation',
      objectif: 'Augmenter la visibilité et la crédibilité de la marque',
      metriques: {
        portee: 250000,
        engagement: '3.8%',
        conversions: 85
      }
    }
  ]);

  const [nouvelInfluenceur, setNouvelInfluenceur] = useState({
    nom: '',
    plateforme: '',
    domaine: '',
    audience: '',
    statut: 'Prospection',
    objectif: '',
    metriques: {
      portee: 0,
      engagement: '',
      conversions: 0
    }
  });

  const handleAddInfluenceur = () => {
    if (nouvelInfluenceur.nom && nouvelInfluenceur.plateforme) {
      setInfluenceurs([
        ...influenceurs,
        {
          ...nouvelInfluenceur,
          id: influenceurs.length + 1
        }
      ]);
      setNouvelInfluenceur({
        nom: '',
        plateforme: '',
        domaine: '',
        audience: '',
        statut: 'Prospection',
        objectif: '',
        metriques: {
          portee: 0,
          engagement: '',
          conversions: 0
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">👥 Influenceurs</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Influenceurs Actuels</h2>
            {influenceurs.map((influenceur) => (
              <div 
                key={influenceur.id} 
                className="border-b py-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-lg">{influenceur.nom}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">{influenceur.plateforme}</span>
                  <span className={`
                    px-3 py-1 rounded-full text-sm
                    ${influenceur.statut === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  `}>
                    {influenceur.statut}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{influenceur.objectif}</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <strong className="block text-gray-600">Domaine</strong>
                    <span>{influenceur.domaine}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Audience</strong>
                    <span>{influenceur.audience}</span>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <strong className="block text-gray-600">Portée</strong>
                    <span>{influenceur.metriques.portee}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Engagement</strong>
                    <span>{influenceur.metriques.engagement}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Conversions</strong>
                    <span>{influenceur.metriques.conversions}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Nouvel Influenceur</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-2">Nom de l'Influenceur</label>
                <input 
                  type="text"
                  value={nouvelInfluenceur.nom}
                  onChange={(e) => setNouvelInfluenceur({...nouvelInfluenceur, nom: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Nom de l'influenceur"
                />
              </div>
              <div>
                <label className="block mb-2">Plateforme</label>
                <input 
                  type="text"
                  value={nouvelInfluenceur.plateforme}
                  onChange={(e) => setNouvelInfluenceur({...nouvelInfluenceur, plateforme: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Nom de la plateforme"
                />
              </div>
              <div>
                <label className="block mb-2">Domaine</label>
                <input 
                  type="text"
                  value={nouvelInfluenceur.domaine}
                  onChange={(e) => setNouvelInfluenceur({...nouvelInfluenceur, domaine: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Domaine d'expertise"
                />
              </div>
              <div>
                <label className="block mb-2">Audience</label>
                <input 
                  type="text"
                  value={nouvelInfluenceur.audience}
                  onChange={(e) => setNouvelInfluenceur({...nouvelInfluenceur, audience: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Taille de l'audience"
                />
              </div>
              <div>
                <label className="block mb-2">Objectif</label>
                <textarea 
                  value={nouvelInfluenceur.objectif}
                  onChange={(e) => setNouvelInfluenceur({...nouvelInfluenceur, objectif: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Objectif de la collaboration"
                  rows="3"
                />
              </div>
              <div>
                <label className="block mb-2">Statut</label>
                <select 
                  value={nouvelInfluenceur.statut}
                  onChange={(e) => setNouvelInfluenceur({...nouvelInfluenceur, statut: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Prospection">Prospection</option>
                  <option value="Négociation">Négociation</option>
                  <option value="Actif">Actif</option>
                  <option value="En Pause">En Pause</option>
                  <option value="Terminé">Terminé</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleAddInfluenceur}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Ajouter l'Influenceur
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
