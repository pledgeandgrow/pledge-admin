import React, { useState } from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function VeilleEReputation() {
  const [surveillances, setSurveillances] = useState([
    {
      id: 1,
      nom: 'Monitoring Médias Sociaux',
      type: 'Réseaux Sociaux',
      plateformes: ['Twitter', 'LinkedIn', 'Facebook'],
      periodeAnalyse: {
        debut: '2025-01-01',
        fin: '2025-01-31'
      },
      metriques: {
        mentionsTotales: 450,
        sentimentGlobal: 'Positif',
        porteeMaximale: 750000,
        engagementMoyen: '3.5%'
      },
      alertes: [
        { 
          niveau: 'Attention', 
          description: 'Augmentation des commentaires négatifs sur LinkedIn',
          date: '2025-01-15'
        }
      ],
      statut: 'En cours'
    },
    {
      id: 2,
      nom: 'Analyse Réputation Web',
      type: 'Recherche Web',
      plateformes: ['Google', 'Forums Professionnels', 'Sites Spécialisés'],
      periodeAnalyse: {
        debut: '2025-02-01',
        fin: '2025-02-28'
      },
      metriques: {
        articlesMentions: 85,
        notesMoyennes: '4.2/5',
        visibiliteGlobale: '85%',
        tendance: 'En hausse'
      },
      alertes: [
        { 
          niveau: 'Information', 
          description: 'Nouvelle mention positive dans un blog tech influent',
          date: '2025-02-10'
        }
      ],
      statut: 'Terminé'
    }
  ]);

  const [nouvelleSurveillance, setNouvelleSurveillance] = useState({
    nom: '',
    type: 'Réseaux Sociaux',
    plateformes: [],
    periodeAnalyse: {
      debut: '',
      fin: ''
    },
    metriques: {
      mentionsTotales: 0,
      sentimentGlobal: '',
      porteeMaximale: 0,
      engagementMoyen: ''
    },
    alertes: [],
    statut: 'Planification'
  });

  const handleAddSurveillance = () => {
    if (nouvelleSurveillance.nom) {
      setSurveillances([
        ...surveillances, 
        { 
          ...nouvelleSurveillance, 
          id: surveillances.length + 1 
        }
      ]);
      setNouvelleSurveillance({
        nom: '',
        type: 'Réseaux Sociaux',
        plateformes: [],
        periodeAnalyse: {
          debut: '',
          fin: ''
        },
        metriques: {
          mentionsTotales: 0,
          sentimentGlobal: '',
          porteeMaximale: 0,
          engagementMoyen: ''
        },
        alertes: [],
        statut: 'Planification'
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">🔎 Veille & E-réputation</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Surveillances Existantes</h2>
            {surveillances.map((surveillance) => (
              <div 
                key={surveillance.id} 
                className="border-b py-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-lg">{surveillance.nom}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">{surveillance.type}</span>
                  <span className={`
                    px-3 py-1 rounded-full text-sm
                    ${surveillance.statut === 'En cours' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                  `}>
                    {surveillance.statut}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <strong className="block text-gray-600">Période</strong>
                    <span>{surveillance.periodeAnalyse.debut} - {surveillance.periodeAnalyse.fin}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Plateformes</strong>
                    <div className="flex flex-wrap gap-1">
                      {surveillance.plateformes.map((plateforme, index) => (
                        <span 
                          key={index} 
                          className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                        >
                          {plateforme}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <strong className="block text-gray-600">Mentions Totales</strong>
                    <span>{surveillance.metriques.mentionsTotales}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Sentiment Global</strong>
                    <span>{surveillance.metriques.sentimentGlobal}</span>
                  </div>
                </div>
                <div>
                  <strong>Alertes:</strong>
                  {surveillance.alertes.map((alerte, index) => (
                    <div 
                      key={index} 
                      className={`
                        mt-2 p-2 rounded
                        ${alerte.niveau === 'Attention' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}
                      `}
                    >
                      <div className="flex justify-between">
                        <strong>{alerte.niveau}</strong>
                        <span className="text-sm">{alerte.date}</span>
                      </div>
                      <p className="text-sm">{alerte.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Nouvelle Surveillance</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-2">Nom de la Surveillance</label>
                <input 
                  type="text"
                  value={nouvelleSurveillance.nom}
                  onChange={(e) => setNouvelleSurveillance({...nouvelleSurveillance, nom: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Nom de la surveillance"
                />
              </div>
              <div>
                <label className="block mb-2">Type de Surveillance</label>
                <select 
                  value={nouvelleSurveillance.type}
                  onChange={(e) => setNouvelleSurveillance({...nouvelleSurveillance, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Réseaux Sociaux">Réseaux Sociaux</option>
                  <option value="Recherche Web">Recherche Web</option>
                  <option value="Médias">Médias</option>
                  <option value="Forums">Forums</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Plateformes</label>
                <input 
                  type="text"
                  value={nouvelleSurveillance.plateformes.join(', ')}
                  onChange={(e) => setNouvelleSurveillance({
                    ...nouvelleSurveillance, 
                    plateformes: e.target.value.split(',').map(p => p.trim())
                  })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Plateformes à surveiller, séparées par des virgules"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Date de Début</label>
                  <input 
                    type="date"
                    value={nouvelleSurveillance.periodeAnalyse.debut}
                    onChange={(e) => setNouvelleSurveillance({
                      ...nouvelleSurveillance, 
                      periodeAnalyse: {
                        ...nouvelleSurveillance.periodeAnalyse,
                        debut: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">Date de Fin</label>
                  <input 
                    type="date"
                    value={nouvelleSurveillance.periodeAnalyse.fin}
                    onChange={(e) => setNouvelleSurveillance({
                      ...nouvelleSurveillance, 
                      periodeAnalyse: {
                        ...nouvelleSurveillance.periodeAnalyse,
                        fin: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2">Statut</label>
                <select 
                  value={nouvelleSurveillance.statut}
                  onChange={(e) => setNouvelleSurveillance({...nouvelleSurveillance, statut: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Planification">Planification</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Métriques</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm text-gray-600">Mentions Totales</label>
                    <input 
                      type="number"
                      value={nouvelleSurveillance.metriques.mentionsTotales}
                      onChange={(e) => setNouvelleSurveillance({
                        ...nouvelleSurveillance, 
                        metriques: {
                          ...nouvelleSurveillance.metriques,
                          mentionsTotales: Number(e.target.value)
                        }
                      })}
                      className="w-full px-2 py-1 border rounded text-sm"
                      placeholder="Nombre de mentions"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Sentiment Global</label>
                    <select 
                      value={nouvelleSurveillance.metriques.sentimentGlobal}
                      onChange={(e) => setNouvelleSurveillance({
                        ...nouvelleSurveillance, 
                        metriques: {
                          ...nouvelleSurveillance.metriques,
                          sentimentGlobal: e.target.value
                        }
                      })}
                      className="w-full px-2 py-1 border rounded text-sm"
                    >
                      <option value="">Sélectionner</option>
                      <option value="Positif">Positif</option>
                      <option value="Neutre">Neutre</option>
                      <option value="Négatif">Négatif</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label className="block mb-2">Alertes</label>
                <div className="grid grid-cols-3 gap-2">
                  <input 
                    type="text"
                    placeholder="Description"
                    value={nouvelleSurveillance.alertes.map(a => a.description).join(', ')}
                    onChange={(e) => setNouvelleSurveillance({
                      ...nouvelleSurveillance, 
                      alertes: e.target.value.split(',').map(a => ({
                        niveau: 'Information',
                        description: a.trim(),
                        date: new Date().toISOString().split('T')[0]
                      }))
                    })}
                    className="w-full px-3 py-2 border rounded"
                  />
                  <select 
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Niveau"
                  >
                    <option value="Information">Information</option>
                    <option value="Attention">Attention</option>
                    <option value="Critique">Critique</option>
                  </select>
                  <input 
                    type="date"
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Date"
                  />
                </div>
              </div>
              <button 
                type="button"
                onClick={handleAddSurveillance}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Ajouter Surveillance
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
