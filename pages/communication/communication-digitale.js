import React, { useState, useEffect, useId } from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function CommunicationDigitale() {
  const [isClient, setIsClient] = useState(false);
  const baseId = useId();

  const [campagnesDigitales, setCampagnesDigitales] = useState([
    {
      id: `${baseId}-1`,
      titre: 'Campagne LinkedIn B2B',
      plateforme: 'LinkedIn',
      objectif: 'Générer des leads qualifiés',
      dateDebut: '2025-02-01',
      dateFin: '2025-02-28',
      budget: 10000,
      metriques: {
        impressions: 250000,
        clics: 5500,
        conversions: 120,
        coutParConversion: 83.33
      },
      statut: 'En cours'
    },
    {
      id: `${baseId}-2`,
      titre: 'Série de Contenus Tech',
      plateforme: 'Blog & Réseaux Sociaux',
      objectif: 'Thought Leadership',
      dateDebut: '2025-01-15',
      dateFin: '2025-03-15',
      budget: 7500,
      metriques: {
        vues: 75000,
        partages: 850,
        tempsLecture: '2m30s',
        engagement: '4.2%'
      },
      statut: 'En cours'
    }
  ]);

  const [nouvelleCampagne, setNouvelleCampagne] = useState({
    titre: '',
    plateforme: '',
    objectif: '',
    dateDebut: '',
    dateFin: '',
    budget: 0,
    metriques: {
      impressions: 0,
      clics: 0,
      conversions: 0,
      coutParConversion: 0
    },
    statut: 'Planification'
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddCampagne = () => {
    if (nouvelleCampagne.titre && isClient) {
      const newId = `${baseId}-${campagnesDigitales.length + 1}`;
      setCampagnesDigitales([
        ...campagnesDigitales, 
        { 
          ...nouvelleCampagne, 
          id: newId 
        }
      ]);
      setNouvelleCampagne({
        titre: '',
        plateforme: '',
        objectif: '',
        dateDebut: '',
        dateFin: '',
        budget: 0,
        metriques: {
          impressions: 0,
          clics: 0,
          conversions: 0,
          coutParConversion: 0
        },
        statut: 'Planification'
      });
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">💻 Communication Digitale</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Campagnes Digitales</h2>
            {campagnesDigitales.map((campagne) => (
              <div 
                key={campagne.id} 
                className="border-b py-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-lg">{campagne.titre}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">{campagne.plateforme}</span>
                  <span className={`
                    px-3 py-1 rounded-full text-sm
                    ${campagne.statut === 'En cours' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  `}>
                    {campagne.statut}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{campagne.objectif}</p>
                <div className="grid grid-cols-2 gap-2 text-center mb-2">
                  <div>
                    <strong className="block text-gray-600">Budget</strong>
                    <span>{campagne.budget} €</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Période</strong>
                    <span>{campagne.dateDebut} - {campagne.dateFin}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <strong className="block text-gray-600">Impressions</strong>
                    <span>
                      {typeof campagne.metriques?.impressions === 'number' 
                        ? campagne.metriques.impressions.toLocaleString() 
                        : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Conversions</strong>
                    <span>
                      {typeof campagne.metriques?.conversions === 'number' 
                        ? campagne.metriques.conversions.toLocaleString() 
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Nouvelle Campagne</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-2">Titre de la Campagne</label>
                <input 
                  type="text"
                  value={nouvelleCampagne.titre}
                  onChange={(e) => setNouvelleCampagne({...nouvelleCampagne, titre: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Nom de la campagne"
                />
              </div>
              <div>
                <label className="block mb-2">Plateforme</label>
                <input 
                  type="text"
                  value={nouvelleCampagne.plateforme}
                  onChange={(e) => setNouvelleCampagne({...nouvelleCampagne, plateforme: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Ex: LinkedIn, Instagram, Blog"
                />
              </div>
              <div>
                <label className="block mb-2">Objectif</label>
                <input 
                  type="text"
                  value={nouvelleCampagne.objectif}
                  onChange={(e) => setNouvelleCampagne({...nouvelleCampagne, objectif: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Objectif de la campagne"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Date de Début</label>
                  <input 
                    type="date"
                    value={nouvelleCampagne.dateDebut}
                    onChange={(e) => setNouvelleCampagne({...nouvelleCampagne, dateDebut: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">Date de Fin</label>
                  <input 
                    type="date"
                    value={nouvelleCampagne.dateFin}
                    onChange={(e) => setNouvelleCampagne({...nouvelleCampagne, dateFin: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2">Budget</label>
                <input 
                  type="number"
                  value={nouvelleCampagne.budget}
                  onChange={(e) => setNouvelleCampagne({...nouvelleCampagne, budget: Number(e.target.value)})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Budget de la campagne"
                />
              </div>
              <div>
                <label className="block mb-2">Statut</label>
                <select 
                  value={nouvelleCampagne.statut}
                  onChange={(e) => setNouvelleCampagne({...nouvelleCampagne, statut: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Planification">Planification</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminée">Terminée</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Métriques</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm text-gray-600">Impressions</label>
                    <input 
                      type="number"
                      value={nouvelleCampagne.metriques.impressions}
                      onChange={(e) => setNouvelleCampagne({
                        ...nouvelleCampagne, 
                        metriques: {
                          ...nouvelleCampagne.metriques,
                          impressions: Number(e.target.value)
                        }
                      })}
                      className="w-full px-2 py-1 border rounded text-sm"
                      placeholder="Nombre d'impressions"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Conversions</label>
                    <input 
                      type="number"
                      value={nouvelleCampagne.metriques.conversions}
                      onChange={(e) => setNouvelleCampagne({
                        ...nouvelleCampagne, 
                        metriques: {
                          ...nouvelleCampagne.metriques,
                          conversions: Number(e.target.value)
                        }
                      })}
                      className="w-full px-2 py-1 border rounded text-sm"
                      placeholder="Nombre de conversions"
                    />
                  </div>
                </div>
              </div>
              <button 
                type="button"
                onClick={handleAddCampagne}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Ajouter Campagne
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
