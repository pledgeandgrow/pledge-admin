import React, { useState } from 'react';
import Head from 'next/head';
import MegaMenu from '../../components/MegaMenu';

export default function ProjetsClients() {
  const [selectedProject, setSelectedProject] = useState(null);

  const projetsEnDeveloppement = [
    {
      id: 1,
      titre: 'WG',
      description: 'Confidentiel',
      technologies: ['Next.js', 'Node.js', 'API', 'PostgreSQL'],
      statut: 'En développement',
      client: 'Private'
    },
    {
      id: 2,
      titre: 'Smile to the world',
      description: 'Confidentiel',
      technologies: ['Next.js', 'GraphQL', 'AWS'],
      statut: 'En développement',
      client: 'Dentiste'
    },
    {
      id: 3,
      titre: 'Cabinet Michou',
      description: 'Cabinet de gestion locative, syndics, ventes',
      technologies: ['Next.js', 'Node.js', 'API', 'PostgreSQL'],
      statut: 'En développement',
      client: 'Immobilier'
    }
  ];

  const projetsEnAttente1 = [
    {
      id: 4,
      titre: 'CRM Personnalisé',
      description: 'Confidentiel',
      technologies: ['Next.js', 'Supabase', 'Tailwind CSS'],
      statut: 'En attente',
      client: 'Confidentiel'
    },
    {
      id: 5,
      titre: 'Importateur de bijouts',
      description: 'Confidentiel',
      technologies: ['React', 'D3.js', 'PostgreSQL'],
      statut: 'En attente',
      client: 'Confidentiel'
    },
    {
      id: 6,
      titre: 'Collaboration',
      description: 'Confidentiel',
      technologies: ['Vue.js', 'Node.js', 'Redis'],
      statut: 'En attente',
      client: 'Confidentiel'
    }
  ];

  const projetsEnAttente2 = [
    {
      id: 7,
      titre: 'Jabb Events',
      description: 'Jabb Events propose des solutions sur mesure pour les entreprises, organisant séminaires, conférences, lancements de produits et team building',
      technologies: ['Webflow', 'API'],
      statut: 'livrée',
      client: 'agence evenementielle',
      lien: 'https://www.jabb.store/'
    },
    {
      id: 8,
      titre: 'Melytop',
      description: 'portfolio pour une professionnelle de la santé et experte en petite enfance',
      technologies: ['Next.js', 'React', 'Node.js', 'API'],
      statut: 'livrée',
      client: 'Aide a la petite enfance',
      lien: 'https://www.melytop.fr/'
    },
    {
      id: 9,
      titre: 'Dualink',
      description: 'Site vitrine pour une agence de marketing',
      technologies: ['Wordpress', 'PHP', 'Plugin premium'],
      statut: 'livrée',
      client: 'Agence de marketing',
      lien: 'https://www.dualink.com/'
    }
  ];

  const handleProjectSelect = (projet) => {
    setSelectedProject(projet);
  };

  return (
    <div className="flex">
      <MegaMenu />
      <main className="flex-grow p-8 ml-[32rem]">
        <Head>
          <title>Projets Clients | Informatique</title>
          <meta name="description" content="Liste des projets clients en informatique" />
        </Head>

        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Projets Clients</h1>

          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Projets en Développement</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {projetsEnDeveloppement.map((projet) => (
              <div 
                key={projet.id} 
                className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-xl transition-all"
                onClick={() => handleProjectSelect(projet)}
              >
                <h2 className="text-xl font-semibold mb-2">{projet.titre}</h2>
                <p className="text-gray-600 mb-4">{projet.description}</p>
                <div className="flex justify-between items-center">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {projet.statut}
                  </span>
                  <span className="text-gray-500 text-sm">{projet.client}</span>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Projets en Attente</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {projetsEnAttente1.map((projet) => (
              <div 
                key={projet.id} 
                className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-xl transition-all"
                onClick={() => handleProjectSelect(projet)}
              >
                <h2 className="text-xl font-semibold mb-2">{projet.titre}</h2>
                <p className="text-gray-600 mb-4">{projet.description}</p>
                <div className="flex justify-between items-center">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    {projet.statut}
                  </span>
                  <span className="text-gray-500 text-sm">{projet.client}</span>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Projets livrés</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {projetsEnAttente2.map((projet) => (
              <div 
                key={projet.id} 
                className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-xl transition-all"
                onClick={() => handleProjectSelect(projet)}
              >
                <h2 className="text-xl font-semibold mb-2">{projet.titre}</h2>
                <p className="text-gray-600 mb-4">{projet.description}</p>
                <div className="flex justify-between items-center">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {projet.statut}
                  </span>
                  <span className="text-gray-500 text-sm">{projet.client}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedProject && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">{selectedProject.titre}</h2>
                <p className="mb-4">{selectedProject.description}</p>
                <div className="mb-4">
                  <strong>Technologies:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedProject.technologies.map((tech) => (
                      <span 
                        key={tech} 
                        className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedProject.statut === 'En développement' ? 'bg-blue-100 text-blue-800' :
                    selectedProject.statut === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                    selectedProject.statut === 'livrée' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedProject.statut}
                  </span>
                  <span className="text-gray-500">Client: {selectedProject.client}</span>
                </div>
                
                {/* Conditionally render the website link button */}
                {selectedProject.lien && (
                  <a 
                    href={selectedProject.lien} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-center transition-colors mb-4"
                  >
                    Visiter le site web
                  </a>
                )}
                
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-black py-2 rounded-lg transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
