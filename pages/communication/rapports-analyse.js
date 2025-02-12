import React, { useState } from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function RapportsAnalyse() {
  const [rapports, setRapports] = useState([
    {
      id: 1,
      titre: 'Performance Communication Q1 2025',
      type: 'Rapport Trimestriel',
      dateGeneration: '2025-04-15',
      couverture: {
        canaux: ['Digital', 'Médias', 'Événements'],
        porteeGlobale: 1500000,
        engagement: '4.2%'
      },
      sections: [
        {
          nom: 'Communication Digitale',
          metriques: {
            impressions: 750000,
            clics: 45000,
            taux_conversion: '3.8%'
          }
        },
        {
          nom: 'Relations Médias',
          metriques: {
            communiques: 12,
            mentions: 85,
            valeur_publicitaire: 125000
          }
        }
      ],
      statut: 'Publié',
      fichier: '/rapports/performance-q1-2025.pdf'
    },
    {
      id: 2,
      titre: 'Analyse Stratégie Communication 2024',
      type: 'Rapport Annuel',
      dateGeneration: '2025-01-10',
      couverture: {
        canaux: ['Réseaux Sociaux', 'Événements', 'Partenariats'],
        porteeGlobale: 2500000,
        engagement: '4.5%'
      },
      sections: [
        {
          nom: 'Réseaux Sociaux',
          metriques: {
            followers: 50000,
            interactions: 180000,
            croissance: '22%'
          }
        },
        {
          nom: 'Événements',
          metriques: {
            nombre: 18,
            participants: 5000,
            satisfaction: '4.7/5'
          }
        }
      ],
      statut: 'En Révision',
      fichier: '/rapports/strategie-communication-2024.pdf'
    }
  ]);

  const [nouveauRapport, setNouveauRapport] = useState({
    titre: '',
    type: 'Rapport Trimestriel',
    dateGeneration: '',
    couverture: {
      canaux: [],
      porteeGlobale: 0,
      engagement: ''
    },
    sections: [],
    statut: 'Brouillon',
    fichier: ''
  });

  const handleAddRapport = () => {
    if (nouveauRapport.titre) {
      setRapports([
        ...rapports, 
        { 
          ...nouveauRapport, 
          id: rapports.length + 1 
        }
      ]);
      setNouveauRapport({
        titre: '',
        type: 'Rapport Trimestriel',
        dateGeneration: '',
        couverture: {
          canaux: [],
          porteeGlobale: 0,
          engagement: ''
        },
        sections: [],
        statut: 'Brouillon',
        fichier: ''
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">📈 Rapports & Analyse</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Rapports Existants</h2>
            {rapports.map((rapport) => (
              <div 
                key={rapport.id} 
                className="border-b py-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-lg">{rapport.titre}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">{rapport.type}</span>
                  <span className={`
                    px-3 py-1 rounded-full text-sm
                    ${rapport.statut === 'Publié' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  `}>
                    {rapport.statut}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <strong className="block text-gray-600">Date de Génération</strong>
                    <span>{rapport.dateGeneration}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Canaux</strong>
                    <div className="flex flex-wrap gap-1">
                      {rapport.couverture.canaux.map((canal, index) => (
                        <span 
                          key={index} 
                          className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                        >
                          {canal}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mb-2">
                  <div>
                    <strong className="block text-gray-600">Portée Globale</strong>
                    <span>{rapport.couverture.porteeGlobale.toLocaleString()}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Engagement</strong>
                    <span>{rapport.couverture.engagement}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Fichier</strong>
                    <a 
                      href={rapport.fichier} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Télécharger
                    </a>
                  </div>
                </div>
                <div>
                  <strong>Sections du Rapport:</strong>
                  {rapport.sections.map((section, index) => (
                    <div 
                      key={index} 
                      className="mt-2 p-2 bg-gray-100 rounded"
                    >
                      <h4 className="font-semibold">{section.nom}</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        {Object.entries(section.metriques).map(([key, value]) => (
                          <div key={key}>
                            <strong className="capitalize">{key.replace('_', ' ')}</strong>
                            <span className="block">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Nouveau Rapport</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-2">Titre du Rapport</label>
                <input 
                  type="text"
                  value={nouveauRapport.titre}
                  onChange={(e) => setNouveauRapport({...nouveauRapport, titre: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Titre du rapport"
                />
              </div>
              <div>
                <label className="block mb-2">Type de Rapport</label>
                <select 
                  value={nouveauRapport.type}
                  onChange={(e) => setNouveauRapport({...nouveauRapport, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Rapport Trimestriel">Rapport Trimestriel</option>
                  <option value="Rapport Annuel">Rapport Annuel</option>
                  <option value="Rapport Mensuel">Rapport Mensuel</option>
                  <option value="Rapport Ponctuel">Rapport Ponctuel</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Date de Génération</label>
                <input 
                  type="date"
                  value={nouveauRapport.dateGeneration}
                  onChange={(e) => setNouveauRapport({...nouveauRapport, dateGeneration: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Canaux de Communication</label>
                <input 
                  type="text"
                  value={nouveauRapport.couverture.canaux.join(', ')}
                  onChange={(e) => setNouveauRapport({
                    ...nouveauRapport, 
                    couverture: {
                      ...nouveauRapport.couverture,
                      canaux: e.target.value.split(',').map(c => c.trim())
                    }
                  })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Canaux, séparés par des virgules"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Portée Globale</label>
                  <input 
                    type="number"
                    value={nouveauRapport.couverture.porteeGlobale}
                    onChange={(e) => setNouveauRapport({
                      ...nouveauRapport, 
                      couverture: {
                        ...nouveauRapport.couverture,
                        porteeGlobale: Number(e.target.value)
                      }
                    })}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Portée globale"
                  />
                </div>
                <div>
                  <label className="block mb-2">Taux d'Engagement</label>
                  <input 
                    type="text"
                    value={nouveauRapport.couverture.engagement}
                    onChange={(e) => setNouveauRapport({
                      ...nouveauRapport, 
                      couverture: {
                        ...nouveauRapport.couverture,
                        engagement: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Ex: 4.5%"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2">Statut du Rapport</label>
                <select 
                  value={nouveauRapport.statut}
                  onChange={(e) => setNouveauRapport({...nouveauRapport, statut: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Brouillon">Brouillon</option>
                  <option value="En Révision">En Révision</option>
                  <option value="Publié">Publié</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Fichier du Rapport</label>
                <input 
                  type="text"
                  value={nouveauRapport.fichier}
                  onChange={(e) => setNouveauRapport({...nouveauRapport, fichier: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Chemin du fichier PDF"
                />
              </div>
              <div>
                <label className="block mb-2">Sections du Rapport</label>
                <div className="grid grid-cols-3 gap-2">
                  <input 
                    type="text"
                    placeholder="Nom de la section"
                    value={nouveauRapport.sections.map(s => s.nom).join(', ')}
                    onChange={(e) => setNouveauRapport({
                      ...nouveauRapport, 
                      sections: e.target.value.split(',').map(s => ({
                        nom: s.trim(),
                        metriques: {}
                      }))
                    })}
                    className="w-full px-3 py-2 border rounded"
                  />
                  <input 
                    type="text"
                    placeholder="Clé de métrique"
                    className="w-full px-3 py-2 border rounded"
                  />
                  <input 
                    type="text"
                    placeholder="Valeur de métrique"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <button 
                type="button"
                onClick={handleAddRapport}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Ajouter Rapport
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
