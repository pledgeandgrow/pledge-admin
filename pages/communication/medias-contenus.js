import React, { useState } from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function MediasContenus() {
  const [contenus, setContenus] = useState([
    {
      id: 1,
      titre: 'Guide Complet de Transformation Digitale',
      type: 'Livre Blanc',
      auteur: 'Marie Dupont',
      datePublication: '2025-02-15',
      canaux: ['Blog', 'LinkedIn', 'Newsletter'],
      metriques: {
        telechargements: 1200,
        partages: 85,
        tempsLecture: '12 min'
      },
      statut: 'Publié'
    },
    {
      id: 2,
      titre: 'Série de Podcasts Tech Insights',
      type: 'Podcast',
      auteur: 'Jean Martin',
      datePublication: '2025-01-20',
      canaux: ['Spotify', 'Apple Podcasts', 'YouTube'],
      metriques: {
        ecoutes: 5000,
        abonnes: 750,
        noteMoyenne: '4.7/5'
      },
      statut: 'En cours'
    }
  ]);

  const [nouveauContenu, setNouveauContenu] = useState({
    titre: '',
    type: 'Article',
    auteur: '',
    datePublication: '',
    canaux: [],
    metriques: {
      telechargements: 0,
      partages: 0,
      tempsLecture: ''
    },
    statut: 'Brouillon'
  });

  const handleAddContenu = () => {
    if (nouveauContenu.titre && nouveauContenu.auteur) {
      setContenus([
        ...contenus, 
        { 
          ...nouveauContenu, 
          id: contenus.length + 1 
        }
      ]);
      setNouveauContenu({
        titre: '',
        type: 'Article',
        auteur: '',
        datePublication: '',
        canaux: [],
        metriques: {
          telechargements: 0,
          partages: 0,
          tempsLecture: ''
        },
        statut: 'Brouillon'
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">🎤 Médias & Contenus</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Contenus Existants</h2>
            {contenus.map((contenu) => (
              <div 
                key={contenu.id} 
                className="border-b py-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-lg">{contenu.titre}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">{contenu.type}</span>
                  <span className={`
                    px-3 py-1 rounded-full text-sm
                    ${contenu.statut === 'Publié' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  `}>
                    {contenu.statut}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <strong className="block text-gray-600">Auteur</strong>
                    <span>{contenu.auteur}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Date</strong>
                    <span>{contenu.datePublication}</span>
                  </div>
                </div>
                <div>
                  <strong>Canaux:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {contenu.canaux.map((canal, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                      >
                        {canal}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <strong className="block text-gray-600">Téléchargements</strong>
                    <span>{contenu.metriques.telechargements}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Partages</strong>
                    <span>{contenu.metriques.partages}</span>
                  </div>
                  <div>
                    <strong className="block text-gray-600">Temps de Lecture</strong>
                    <span>{contenu.metriques.tempsLecture}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Nouveau Contenu</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-2">Titre du Contenu</label>
                <input 
                  type="text"
                  value={nouveauContenu.titre}
                  onChange={(e) => setNouveauContenu({...nouveauContenu, titre: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Titre du contenu"
                />
              </div>
              <div>
                <label className="block mb-2">Type de Contenu</label>
                <select 
                  value={nouveauContenu.type}
                  onChange={(e) => setNouveauContenu({...nouveauContenu, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Article">Article</option>
                  <option value="Livre Blanc">Livre Blanc</option>
                  <option value="Podcast">Podcast</option>
                  <option value="Vidéo">Vidéo</option>
                  <option value="Infographie">Infographie</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Auteur</label>
                <input 
                  type="text"
                  value={nouveauContenu.auteur}
                  onChange={(e) => setNouveauContenu({...nouveauContenu, auteur: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Nom de l'auteur"
                />
              </div>
              <div>
                <label className="block mb-2">Date de Publication</label>
                <input 
                  type="date"
                  value={nouveauContenu.datePublication}
                  onChange={(e) => setNouveauContenu({...nouveauContenu, datePublication: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Canaux de Distribution</label>
                <input 
                  type="text"
                  value={nouveauContenu.canaux.join(', ')}
                  onChange={(e) => setNouveauContenu({
                    ...nouveauContenu, 
                    canaux: e.target.value.split(',').map(c => c.trim())
                  })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Canaux de distribution, séparés par des virgules"
                />
              </div>
              <div>
                <label className="block mb-2">Statut</label>
                <select 
                  value={nouveauContenu.statut}
                  onChange={(e) => setNouveauContenu({...nouveauContenu, statut: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Brouillon">Brouillon</option>
                  <option value="En cours">En cours</option>
                  <option value="Publié">Publié</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Métriques</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-sm text-gray-600">Téléchargements</label>
                    <input 
                      type="number"
                      value={nouveauContenu.metriques.telechargements}
                      onChange={(e) => setNouveauContenu({
                        ...nouveauContenu, 
                        metriques: {
                          ...nouveauContenu.metriques,
                          telechargements: Number(e.target.value)
                        }
                      })}
                      className="w-full px-2 py-1 border rounded text-sm"
                      placeholder="Nb téléchargements"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Partages</label>
                    <input 
                      type="number"
                      value={nouveauContenu.metriques.partages}
                      onChange={(e) => setNouveauContenu({
                        ...nouveauContenu, 
                        metriques: {
                          ...nouveauContenu.metriques,
                          partages: Number(e.target.value)
                        }
                      })}
                      className="w-full px-2 py-1 border rounded text-sm"
                      placeholder="Nb partages"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Temps de Lecture</label>
                    <input 
                      type="text"
                      value={nouveauContenu.metriques.tempsLecture}
                      onChange={(e) => setNouveauContenu({
                        ...nouveauContenu, 
                        metriques: {
                          ...nouveauContenu.metriques,
                          tempsLecture: e.target.value
                        }
                      })}
                      className="w-full px-2 py-1 border rounded text-sm"
                      placeholder="Ex: 10 min"
                    />
                  </div>
                </div>
              </div>
              <button 
                type="button"
                onClick={handleAddContenu}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Ajouter Contenu
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
