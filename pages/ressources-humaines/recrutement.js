import React, { useState, useContext, useEffect } from 'react';
import MegaMenu from '../../components/MegaMenu';
import Image from 'next/image';
import { CandidateContext } from '../../components/ressources-humaines/CandidateContext';

export default function Recrutement() {
  const { candidats, setCandidats } = useContext(CandidateContext);
  const [activeSection, setActiveSection] = useState('processus');
  const [selectedCandidat, setSelectedCandidat] = useState(null);
  const [newPoste, setNewPoste] = useState({
    titre: '',
    departement: '',
    typeContrat: '',
    competencesRequises: [],
    nouvelleCompetence: ''
  });
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [newCandidate, setNewCandidate] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    cv: null, 
    id: null,
    formations: '',
    domaineEtudes: '',
    competences: '',
    status: 'Prise de contact'
  });

  useEffect(() => {
    const storedCandidates = localStorage.getItem('candidates');
    if (storedCandidates) {
      setCandidats(JSON.parse(storedCandidates));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('candidates', JSON.stringify(candidats));
  }, [candidats]);

  console.log(candidats);

  const processusRecrutement = [
    {
      etape: 'Sourcing',
      description: 'Identification et recherche de candidats potentiels',
      statut: 'En cours',
      candidatsTraites: 25,
      candidatsSelectionnes: 10
    },
    {
      etape: 'Entretiens Initiaux',
      description: 'Premiers entretiens téléphoniques et vidéo',
      statut: 'En cours',
      candidatsTraites: 10,
      candidatsSelectionnes: 5
    },
    {
      etape: 'Entretiens Techniques',
      description: 'Évaluations techniques et compétences',
      statut: 'À venir',
      candidatsTraites: 0,
      candidatsSelectionnes: 0
    },
    {
      etape: 'Entretiens Finaux',
      description: 'Rencontres avec la direction',
      statut: 'À planifier',
      candidatsTraites: 0,
      candidatsSelectionnes: 0
    }
  ];

  const postesOuverts = [
    {
      titre: 'Développeur Full Stack',
      departement: 'Technologie',
      typeContrat: 'CDI',
      competencesRequises: [
        'React',
        'Node.js',
        'PostgreSQL',
        'Docker',
        'Kubernetes'
      ]
    },
    {
      titre: 'Product Manager',
      departement: 'Produit',
      typeContrat: 'CDI',
      competencesRequises: [
        'Gestion de Produit',
        'Méthodologies Agile',
        'UX Design',
        'Analyse de Données'
      ]
    }
  ];

  const handleAddCompetence = () => {
    if (newPoste.nouvelleCompetence && !newPoste.competencesRequises.includes(newPoste.nouvelleCompetence)) {
      setNewPoste({
        ...newPoste,
        competencesRequises: [...newPoste.competencesRequises, newPoste.nouvelleCompetence],
        nouvelleCompetence: ''
      });
    }
  };

  const handleAddCandidate = (e) => {
    e.preventDefault();
    console.log('Before adding candidate:', candidats);
    if (newCandidate.id) {
        // Update existing candidate
        const updatedCandidats = candidats.map(candidate => 
            candidate.id === newCandidate.id ? { ...candidate, ...newCandidate } : candidate
        );
        setCandidats(updatedCandidats);
        console.log('Updated candidates:', updatedCandidats);
    } else {
        // Add new candidate
        const newCandidateWithId = { ...newCandidate, id: Date.now() };
        setCandidats([...candidats, newCandidateWithId]);
        console.log('Added candidate:', newCandidateWithId);
    }
    // Reset newCandidate state for the next entry
    setNewCandidate({ name: '', email: '', phone: '', cv: null, id: null, formations: '', domaineEtudes: '', competences: '', status: 'Prise de contact' });
    setIsCandidateModalOpen(false);
    console.log('Current candidates state after addition:', candidats);
  };

  const handleEditCandidate = (candidate) => {
    setNewCandidate({ ...candidate });
    setIsCandidateModalOpen(true);
  };

  const handleRemoveCandidate = (id) => {
    console.log('Before removing candidate:', candidats);
    const updatedCandidats = candidats.filter(candidate => candidate.id !== id);
    setCandidats(updatedCandidats);
    console.log('Removed candidate with id:', id);
    console.log('Updated candidates:', updatedCandidats);
  };

  const sections = {
    processus: {
      title: 'Processus de Recrutement',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processusRecrutement.map((etape, index) => (
            <div 
              key={index} 
              className={`
                bg-white rounded-lg shadow-md p-6
                ${etape.statut === 'En cours' ? 'border-l-4 border-green-500' : 
                  etape.statut === 'À venir' ? 'border-l-4 border-yellow-500' : 
                  'border-l-4 border-gray-300'}
              `}
            >
              <h3 className="text-xl font-bold mb-2">{etape.etape}</h3>
              <p className="text-gray-600 mb-4">{etape.description}</p>
              <div className="space-y-2">
                <p><strong>Statut:</strong> {etape.statut}</p>
                <p>Candidats traités: {etape.candidatsTraites}</p>
                <p>Candidats sélectionnés: {etape.candidatsSelectionnes}</p>
              </div>
            </div>
          ))}
        </div>
      )
    },
    candidats: {
      title: 'Candidats',
      content: (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Recrutement</h1>
            <button onClick={() => setIsCandidateModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">+</button>
          </div>
          {candidats.map((candidate) => (
            <div key={candidate.id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{candidate.name}</h3>
                <p>Email: {candidate.email}</p>
                <p>Numéro: {candidate.phone}</p>
                <p>Formations: {candidate.formations}</p>
                <p>Domaine d'études: {candidate.domaineEtudes}</p>
                <p>Compétences: {candidate.competences}</p>
                <p>Status: {candidate.status}</p>
                <p>CV: {candidate.cv ? <a href={candidate.cv} className="text-blue-600 hover:underline">Télécharger CV</a> : 'No CV uploaded'}</p>
              </div>
              <div className="flex items-center">
                <button onClick={() => handleEditCandidate(candidate)} className="text-yellow-500 px-2"><span role="img" aria-label="edit">✏️</span></button>
                <button onClick={() => handleRemoveCandidate(candidate.id)} className="text-red-500 px-2"><span role="img" aria-label="delete">🗑️</span></button>
              </div>
            </div>
          ))}
        </div>
      )
    },
    postesOuverts: {
      title: 'Postes Ouverts',
      content: (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {postesOuverts.map((poste, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-2xl font-bold mb-4">{poste.titre}</h3>
                <div className="space-y-2">
                  <p><strong>Département:</strong> {poste.departement}</p>
                  <p><strong>Type de Contrat:</strong> {poste.typeContrat}</p>
                  <div>
                    <strong>Compétences Requises:</strong>
                    <ul className="list-disc list-inside">
                      {poste.competencesRequises.map((competence, i) => (
                        <li key={i}>{competence}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold mb-4">Créer un Nouveau Poste</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Titre du Poste</label>
                  <input 
                    type="text"
                    value={newPoste.titre}
                    onChange={(e) => setNewPoste({...newPoste, titre: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Ex: Développeur Full Stack"
                  />
                </div>
                <div>
                  <label className="block mb-2">Département</label>
                  <select 
                    value={newPoste.departement}
                    onChange={(e) => setNewPoste({...newPoste, departement: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Sélectionnez un département</option>
                    <option value="Technologie">Technologie</option>
                    <option value="Produit">Produit</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Ventes">Ventes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Type de Contrat</label>
                  <select 
                    value={newPoste.typeContrat}
                    onChange={(e) => setNewPoste({...newPoste, typeContrat: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Sélectionnez un type de contrat</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Stage">Stage</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Compétences Requises</label>
                  <div className="flex">
                    <input 
                      type="text"
                      value={newPoste.nouvelleCompetence}
                      onChange={(e) => setNewPoste({...newPoste, nouvelleCompetence: e.target.value})}
                      className="w-full px-3 py-2 border rounded mr-2"
                      placeholder="Ajouter une compétence"
                    />
                    <button 
                      type="button"
                      onClick={handleAddCompetence}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-2">
                    {newPoste.competencesRequises.map((competence, index) => (
                      <span 
                        key={index} 
                        className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2"
                      >
                        {competence}
                        <button 
                          type="button"
                          onClick={() => setNewPoste({
                            ...newPoste,
                            competencesRequises: newPoste.competencesRequises.filter(c => c !== competence)
                          })}
                          className="ml-2 text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                type="button"
                className="w-full bg-green-600 text-white py-2 rounded-lg"
              >
                Créer le Poste
              </button>
            </form>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Gestion du Recrutement</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.keys(sections).map((key) => (
            <button
              key={key}
              className={`
                px-4 py-2 rounded-lg transition-all duration-300
                ${activeSection === key 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
              `}
              onClick={() => setActiveSection(key)}
            >
              {sections[key].title}
            </button>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {sections[activeSection].title}
          </h2>
          {sections[activeSection].content}
        </div>
      </div>
      {isCandidateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Ajouter un Candidat</h2>
            <form onSubmit={handleAddCandidate}>
              <div className="mb-4">
                <label className="block text-gray-700">Nom</label>
                <input type="text" value={newCandidate.name} onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })} className="border rounded w-full px-3 py-2" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input type="email" value={newCandidate.email} onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })} className="border rounded w-full px-3 py-2" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Numéro</label>
                <input type="text" value={newCandidate.phone} onChange={(e) => setNewCandidate({ ...newCandidate, phone: e.target.value })} className="border rounded w-full px-3 py-2" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Formations (en cours)</label>
                <input type="text" value={newCandidate.formations} onChange={(e) => setNewCandidate({ ...newCandidate, formations: e.target.value })} className="border rounded w-full px-3 py-2" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Domaine d'études</label>
                <input type="text" value={newCandidate.domaineEtudes} onChange={(e) => setNewCandidate({ ...newCandidate, domaineEtudes: e.target.value })} className="border rounded w-full px-3 py-2" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Compétences</label>
                <input type="text" value={newCandidate.competences} onChange={(e) => setNewCandidate({ ...newCandidate, competences: e.target.value })} className="border rounded w-full px-3 py-2" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Status</label>
                <select value={newCandidate.status} onChange={(e) => setNewCandidate({ ...newCandidate, status: e.target.value })} className="border rounded w-full px-3 py-2">
                  <option value="Prise de contact">Prise de contact</option>
                  <option value="Entretien">Entretien</option>
                  <option value="Qualification">Qualification</option>
                  <option value="Décision finale">Décision finale</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">CV</label>
                <input type="file" onChange={(e) => setNewCandidate({ ...newCandidate, cv: e.target.files[0] })} className="border rounded w-full px-3 py-2" required />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Ajouter</button>
              <button type="button" onClick={() => setIsCandidateModalOpen(false)} className="bg-gray-300 text-black px-4 py-2 rounded-lg ml-2">Annuler</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
