import React, { useState } from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function Partenariats() {
  const [partenariats, setPartenariats] = useState([
    {
      id: 1,
      nom: 'Tech Innovators Network',
      type: 'Réseau Professionnel',
      dateDebut: '2025-01-15',
      statut: 'Actif',
      objectif: 'Partage de connaissances et opportunités de collaboration',
      contacts: [
        { nom: 'Sophie Leroy', entreprise: 'Tech Solutions', role: 'Directrice Partenariats' },
        { nom: 'Lucas Martin', entreprise: 'Innovation Lab', role: 'Responsable Développement' }
      ],
      metriques: {
        opportunitesGenerees: 12,
        valeurEstimee: 75000,
        satisfaction: '4.5/5'
      }
    }
  ]);

  const [nouveauPartenariat, setNouveauPartenariat] = useState({
    nom: '',
    type: 'Réseau Professionnel',
    dateDebut: '',
    statut: 'Prospection',
    objectif: '',
    contacts: [],
    metriques: {
      opportunitesGenerees: 0,
      valeurEstimee: 0,
      satisfaction: ''
    }
  });

  const handleAddPartenariat = () => {
    if (nouveauPartenariat.nom && nouveauPartenariat.objectif) {
      setPartenariats([
        ...partenariats, 
        { 
          ...nouveauPartenariat, 
          id: partenariats.length + 1 
        }
      ]);
      setNouveauPartenariat({
        nom: '',
        type: 'Réseau Professionnel',
        dateDebut: '',
        statut: 'Prospection',
        objectif: '',
        contacts: [],
        metriques: {
          opportunitesGenerees: 0,
          valeurEstimee: 0,
          satisfaction: ''
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">🤝 Partenariats</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Partenariats Existants</h2>
            {partenariats.map((partenariat) => (
              <div 
                key={partenariat.id} 
                className="border-b py-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-lg">{partenariat.nom}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">{partenariat.type}</span>
                  <span className={`
                    px-3 py-1 rounded-full text-sm
                    ${partenariat.statut === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  `}>
                    {partenariat.statut}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{partenariat.objectif}</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <strong className="block text-gray-600">Date de Début</strong>
                    <span>{partenariat.dateDebut}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Type</strong>
                    <span>{partenariat.type}</span>
                  </div>
                </div>
                <div>
                  <strong>Contacts Clés:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {partenariat.contacts.map((contact, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                        title={`${contact.role} chez ${contact.entreprise}`}
                      >
                        {contact.nom}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <strong className="block text-gray-600">Opportunités</strong>
                    <span>{partenariat.metriques.opportunitesGenerees}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Valeur Estimée</strong>
                    <span>{partenariat.metriques.valeurEstimee} €</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Satisfaction</strong>
                    <span>{partenariat.metriques.satisfaction}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Nouveau Partenariat</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-2">Nom du Partenariat</label>
                <input 
                  type="text"
                  value={nouveauPartenariat.nom}
                  onChange={(e) => setNouveauPartenariat({...nouveauPartenariat, nom: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Nom du partenariat"
                />
              </div>
              <div>
                <label className="block mb-2">Type de Partenariat</label>
                <select 
                  value={nouveauPartenariat.type}
                  onChange={(e) => setNouveauPartenariat({...nouveauPartenariat, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Réseau Professionnel">Réseau Professionnel</option>
                  <option value="Collaboration Média">Collaboration Média</option>
                  <option value="Partenariat Technologique">Partenariat Technologique</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Date de Début</label>
                <input 
                  type="date"
                  value={nouveauPartenariat.dateDebut}
                  onChange={(e) => setNouveauPartenariat({...nouveauPartenariat, dateDebut: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Objectif</label>
                <textarea 
                  value={nouveauPartenariat.objectif}
                  onChange={(e) => setNouveauPartenariat({...nouveauPartenariat, objectif: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Objectif du partenariat"
                  rows="3"
                />
              </div>
              <div>
                <label className="block mb-2">Statut</label>
                <select 
                  value={nouveauPartenariat.statut}
                  onChange={(e) => setNouveauPartenariat({...nouveauPartenariat, statut: e.target.value})}
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
                onClick={handleAddPartenariat}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Ajouter le Partenariat
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
