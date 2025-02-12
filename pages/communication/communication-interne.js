import React, { useState, useEffect, useId } from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function CommunicationInterne() {
  const [isClient, setIsClient] = useState(false);
  const baseId = useId();

  const [communications, setCommunications] = useState([
    {
      id: `${baseId}-1`,
      titre: 'Réunion Mensuelle d\'Équipe',
      type: 'Réunion',
      date: '2025-03-15',
      participants: [
        { nom: 'Marie Dupont', departement: 'Technologie' },
        { nom: 'Jean Martin', departement: 'Produit' },
        { nom: 'Sophie Leroy', departement: 'Marketing' }
      ],
      objectif: 'Revue des objectifs et des projets en cours',
      statut: 'Planifiée',
      canal: 'Visioconférence'
    },
    {
      id: `${baseId}-2`,
      titre: 'Newsletter Interne Trimestrielle',
      type: 'Communication Écrite',
      date: '2025-02-28',
      participants: [
        { nom: 'Tous les employés', departement: 'Entreprise' }
      ],
      objectif: 'Partager les réalisations, actualités et success stories',
      statut: 'En préparation',
      canal: 'Email & Intranet'
    }
  ]);

  const [nouvelleCommunication, setNouvelleCommunication] = useState({
    titre: '',
    type: 'Réunion',
    date: '',
    participants: [],
    objectif: '',
    statut: 'Planifiée',
    canal: ''
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddCommunication = () => {
    if (nouvelleCommunication.titre && isClient) {
      const newId = `${baseId}-${communications.length + 1}`;
      setCommunications([
        ...communications, 
        { 
          ...nouvelleCommunication, 
          id: newId 
        }
      ]);
      setNouvelleCommunication({
        titre: '',
        type: 'Réunion',
        date: '',
        participants: [],
        objectif: '',
        statut: 'Planifiée',
        canal: ''
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
        <h1 className="text-4xl font-bold mb-8 text-gray-800">📩 Communication Interne</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Communications Existantes</h2>
            {communications.map((comm) => (
              <div 
                key={comm.id} 
                className="border-b py-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-lg">{comm.titre}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">{comm.type}</span>
                  <span className={`
                    px-3 py-1 rounded-full text-sm
                    ${comm.statut === 'Planifiée' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}
                  `}>
                    {comm.statut}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{comm.objectif}</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <strong className="block text-gray-600">Date</strong>
                    <span>{comm.date || 'N/A'}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Canal</strong>
                    <span>{comm.canal || 'Non spécifié'}</span>
                  </div>
                </div>
                <div>
                  <strong>Participants:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(comm.participants || []).map((participant, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                        title={participant.departement || 'Département non spécifié'}
                      >
                        {participant.nom || 'Participant'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Nouvelle Communication</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-2">Titre</label>
                <input 
                  type="text"
                  value={nouvelleCommunication.titre}
                  onChange={(e) => setNouvelleCommunication({...nouvelleCommunication, titre: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Titre de la communication"
                />
              </div>
              <div>
                <label className="block mb-2">Type</label>
                <select 
                  value={nouvelleCommunication.type}
                  onChange={(e) => setNouvelleCommunication({...nouvelleCommunication, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Réunion">Réunion</option>
                  <option value="Communication Écrite">Communication Écrite</option>
                  <option value="Événement">Événement</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Date</label>
                <input 
                  type="date"
                  value={nouvelleCommunication.date}
                  onChange={(e) => setNouvelleCommunication({...nouvelleCommunication, date: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Canal</label>
                <input 
                  type="text"
                  value={nouvelleCommunication.canal}
                  onChange={(e) => setNouvelleCommunication({...nouvelleCommunication, canal: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Ex: Visioconférence, Email, Intranet"
                />
              </div>
              <div>
                <label className="block mb-2">Objectif</label>
                <textarea 
                  value={nouvelleCommunication.objectif}
                  onChange={(e) => setNouvelleCommunication({...nouvelleCommunication, objectif: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Objectif de la communication"
                  rows="3"
                />
              </div>
              <div>
                <label className="block mb-2">Participants</label>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text"
                    placeholder="Nom"
                    value={nouvelleCommunication.participants.map(p => p.nom).join(', ')}
                    onChange={(e) => setNouvelleCommunication({
                      ...nouvelleCommunication, 
                      participants: e.target.value.split(',').map(p => ({
                        nom: p.trim(),
                        departement: ''
                      }))
                    })}
                    className="w-full px-3 py-2 border rounded"
                  />
                  <input 
                    type="text"
                    placeholder="Département (optionnel)"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2">Statut</label>
                <select 
                  value={nouvelleCommunication.statut}
                  onChange={(e) => setNouvelleCommunication({...nouvelleCommunication, statut: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Planifiée">Planifiée</option>
                  <option value="En préparation">En préparation</option>
                  <option value="Terminée">Terminée</option>
                </select>
              </div>
              <button 
                type="button"
                onClick={handleAddCommunication}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Ajouter Communication
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
