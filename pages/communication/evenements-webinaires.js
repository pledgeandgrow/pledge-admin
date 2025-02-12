import React, { useState, useEffect, useId } from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function EvenementsWebinaires() {
  const [isClient, setIsClient] = useState(false);
  const baseId = useId();

  const [evenements, setEvenements] = useState([
    {
      id: `${baseId}-1`,
      titre: 'Webinaire Tech Innovation',
      type: 'Webinaire',
      date: '2025-03-20',
      heureDebut: '14:00',
      heureFin: '15:30',
      intervenants: [
        { nom: 'Marie Dupont', entreprise: 'Tech Solutions', titre: 'CTO' },
        { nom: 'Jean Martin', entreprise: 'Notre Entreprise', titre: 'Directeur Produit' }
      ],
      participants: {
        inscrits: 250,
        presents: 180,
        engagement: '72%'
      },
      statut: 'Confirmé',
      plateforme: 'Zoom'
    },
    {
      id: `${baseId}-2`,
      titre: 'Conférence Annuelle de Communication',
      type: 'Événement Physique',
      date: '2025-04-15',
      heureDebut: '09:00',
      heureFin: '17:00',
      intervenants: [
        { nom: 'Sophie Leroy', entreprise: 'Notre Entreprise', titre: 'Directrice Communication' },
        { nom: 'Emma Dubois', entreprise: 'Media Consulting', titre: 'Experte en Communication' }
      ],
      participants: {
        inscrits: 150,
        presents: 120,
        engagement: '80%'
      },
      statut: 'En préparation',
      lieu: 'Centre de Conférences de Paris'
    }
  ]);

  const [nouvelEvenement, setNouvelEvenement] = useState({
    titre: '',
    type: 'Webinaire',
    date: '',
    heureDebut: '',
    heureFin: '',
    intervenants: [],
    participants: {
      inscrits: 0,
      presents: 0,
      engagement: ''
    },
    statut: 'Planification',
    plateforme: '',
    lieu: ''
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddEvenement = () => {
    if (nouvelEvenement.titre && isClient) {
      const newId = `${baseId}-${evenements.length + 1}`;
      setEvenements([
        ...evenements, 
        { 
          ...nouvelEvenement, 
          id: newId 
        }
      ]);
      setNouvelEvenement({
        titre: '',
        type: 'Webinaire',
        date: '',
        heureDebut: '',
        heureFin: '',
        intervenants: [],
        participants: {
          inscrits: 0,
          presents: 0,
          engagement: ''
        },
        statut: 'Planification',
        plateforme: '',
        lieu: ''
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
        <h1 className="text-4xl font-bold mb-8 text-gray-800">📆 Événements & Webinaires</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Événements Planifiés</h2>
            {evenements.map((event) => (
              <div 
                key={event.id} 
                className="border-b py-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-lg">{event.titre}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">{event.type}</span>
                  <span className={`
                    px-3 py-1 rounded-full text-sm
                    ${event.statut === 'Confirmé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  `}>
                    {event.statut}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <strong className="block text-gray-600">Date</strong>
                    <span>{event.date}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Horaire</strong>
                    <span>{event.heureDebut} - {event.heureFin}</span>
                  </div>
                </div>
                <div>
                  <strong>Intervenants:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(event.intervenants || []).map((intervenant, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                        title={`${intervenant.titre || 'Intervenant'} chez ${intervenant.entreprise || 'N/A'}`}
                      >
                        {intervenant.nom || 'Participant'}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <strong className="block text-gray-600">Inscrits</strong>
                    <span>
                      {typeof event.participants?.inscrits === 'number' 
                        ? event.participants.inscrits.toLocaleString() 
                        : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Présents</strong>
                    <span>
                      {typeof event.participants?.presents === 'number' 
                        ? event.participants.presents.toLocaleString() 
                        : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Engagement</strong>
                    <span>{event.participants?.engagement || 'Non mesuré'}</span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {event.type === 'Webinaire' ? `Plateforme: ${event.plateforme}` : `Lieu: ${event.lieu}`}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Nouvel Événement</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-2">Titre de l'Événement</label>
                <input 
                  type="text"
                  value={nouvelEvenement.titre}
                  onChange={(e) => setNouvelEvenement({...nouvelEvenement, titre: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Nom de l'événement"
                />
              </div>
              <div>
                <label className="block mb-2">Type</label>
                <select 
                  value={nouvelEvenement.type}
                  onChange={(e) => setNouvelEvenement({...nouvelEvenement, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Webinaire">Webinaire</option>
                  <option value="Événement Physique">Événement Physique</option>
                  <option value="Conférence">Conférence</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Date</label>
                  <input 
                    type="date"
                    value={nouvelEvenement.date}
                    onChange={(e) => setNouvelEvenement({...nouvelEvenement, date: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">Statut</label>
                  <select 
                    value={nouvelEvenement.statut}
                    onChange={(e) => setNouvelEvenement({...nouvelEvenement, statut: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="Planification">Planification</option>
                    <option value="Confirmé">Confirmé</option>
                    <option value="Terminé">Terminé</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Heure de Début</label>
                  <input 
                    type="time"
                    value={nouvelEvenement.heureDebut}
                    onChange={(e) => setNouvelEvenement({...nouvelEvenement, heureDebut: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">Heure de Fin</label>
                  <input 
                    type="time"
                    value={nouvelEvenement.heureFin}
                    onChange={(e) => setNouvelEvenement({...nouvelEvenement, heureFin: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              {nouvelEvenement.type === 'Webinaire' ? (
                <div>
                  <label className="block mb-2">Plateforme</label>
                  <input 
                    type="text"
                    value={nouvelEvenement.plateforme}
                    onChange={(e) => setNouvelEvenement({...nouvelEvenement, plateforme: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Ex: Zoom, Teams, Google Meet"
                  />
                </div>
              ) : (
                <div>
                  <label className="block mb-2">Lieu</label>
                  <input 
                    type="text"
                    value={nouvelEvenement.lieu}
                    onChange={(e) => setNouvelEvenement({...nouvelEvenement, lieu: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Adresse du lieu de l'événement"
                  />
                </div>
              )}
              <div>
                <label className="block mb-2">Intervenants</label>
                <div className="grid grid-cols-3 gap-2">
                  <input 
                    type="text"
                    placeholder="Nom"
                    value={nouvelEvenement.intervenants.map(i => i.nom).join(', ')}
                    onChange={(e) => setNouvelEvenement({
                      ...nouvelEvenement, 
                      intervenants: e.target.value.split(',').map(i => ({
                        nom: i.trim(),
                        entreprise: '',
                        titre: ''
                      }))
                    })}
                    className="w-full px-3 py-2 border rounded"
                  />
                  <input 
                    type="text"
                    placeholder="Entreprise"
                    className="w-full px-3 py-2 border rounded"
                  />
                  <input 
                    type="text"
                    placeholder="Titre"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <button 
                type="button"
                onClick={handleAddEvenement}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Ajouter Événement
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
