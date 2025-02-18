import React, { useState } from 'react';
import MegaMenu from '../../components/MegaMenu';
import Image from 'next/image';

export default function Recrutement() {
  const [activeSection, setActiveSection] = useState('processus');
  const [selectedCandidat, setSelectedCandidat] = useState(null);
  const [newPoste, setNewPoste] = useState({
    titre: '',
    departement: '',
    typeContrat: '',
    competencesRequises: [],
    nouvelleCompetence: ''
  });

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

  const candidats = [
    { id: 1, nom: 'John Doe', poste: 'Software Engineer' },
    { id: 2, nom: 'Jane Smith', poste: 'Product Manager' },
    { id: 3, nom: 'Alice Johnson', poste: 'UX Designer' },
    { id: 4, nom: 'Bob Brown', poste: 'Marketing Specialist' },
    { id: 5, nom: 'Charlie Brown', poste: 'Data Analyst' },
    { id: 6, nom: 'Emily Davis', poste: 'Project Coordinator' }
  ];

  console.log(candidats);

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
          <div className="flex flex-wrap justify-between">
            {candidats && candidats.length > 0 ? (
              candidats.map((candidat, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4 m-2 w-1/4 text-center shadow-sm">
                  <h3 className="text-lg font-semibold">{candidat.nom}</h3>
                  <p className="text-sm text-gray-600">{candidat.poste}</p>
                </div>
              ))
            ) : (
              <p>No candidates available.</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {candidats && candidats.length > 0 ? (
              candidats.map((candidat) => (
                <div 
                  key={candidat.id} 
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => setSelectedCandidat(candidat)}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex items-center justify-center">
                      {candidat.nom.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{candidat.nom}</h3>
                      <p className="text-gray-600">{candidat.poste}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Étape:</strong> {candidat.etape}</p>
                    <p><strong>Note Entretien:</strong> {candidat.noteEntretien}/10</p>
                    {candidat && candidat.competences && candidat.competences.length > 0 ? (
                      <div>
                        <strong>Compétences:</strong>
                        <ul className="list-disc list-inside text-sm">
                          {candidat.competences.map((competence, index) => (
                            <li key={index}>{competence}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p>Aucune compétence disponible.</p>
                    )}
                    <a 
                      href={candidat.cv} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Voir CV
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p>No candidates available.</p>
            )}
            
            {selectedCandidat && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg max-w-2xl w-full relative">
                  <button 
                    onClick={() => setSelectedCandidat(null)}
                    className="absolute top-4 right-4 text-2xl"
                  >
                    ×
                  </button>
                  <h2 className="text-2xl font-bold mb-4">{selectedCandidat.nom}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Poste:</strong> {selectedCandidat.poste}
                    </div>
                    <div>
                      <strong>Étape:</strong> {selectedCandidat.etape}
                    </div>
                    <div>
                      <strong>Note Entretien:</strong> {selectedCandidat.noteEntretien}/10
                    </div>
                    {selectedCandidat && selectedCandidat.competences && selectedCandidat.competences.length > 0 ? (
                      <div>
                        <strong>Compétences:</strong>
                        <ul className="list-disc list-inside">
                          {selectedCandidat.competences.map((competence, index) => (
                            <li key={index}>{competence}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p>Aucune compétence disponible.</p>
                    )}
                  </div>
                  <div className="mt-6 flex space-x-4">
                    <button className="bg-green-500 text-white px-4 py-2 rounded">
                      Avancer
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded">
                      Rejeter
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
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
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
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
    </div>
  );
}
