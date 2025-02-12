import React, { useState } from 'react';
import MegaMenu from '../../components/MegaMenu';
import ListeEmployes from '../../components/ressources-humaines/ListeEmployes';
import ListeDepartements from '../../components/ressources-humaines/ListeDepartements';
import ListeFormations from '../../components/ressources-humaines/ListeFormations';

export default function GestionDuPersonnel() {
  const [activeSection, setActiveSection] = useState('employes');
  const [employes, setEmployes] = useState([
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Marie',
      photo: '/images/employes/marie_dupont.jpg',
      departement: 'Technologie',
      poste: 'Développeur Senior',
      dateEmbauche: '2020-03-15',
      email: 'marie.dupont@entreprise.com',
      telephone: '+33 6 12 34 56 78',
      competences: ['React', 'Node.js', 'DevOps'],
      performance: {
        noteAnnuelle: 8.5,
        objectifsAtteints: '95%',
        progression: 'Excellente'
      }
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Jean',
      photo: '/images/employes/jean_martin.jpg',
      departement: 'Produit',
      poste: 'Product Manager',
      dateEmbauche: '2019-07-22',
      email: 'jean.martin@entreprise.com',
      telephone: '+33 6 87 65 43 21',
      competences: ['Gestion de Produit', 'UX Design', 'Agile'],
      performance: {
        noteAnnuelle: 8.2,
        objectifsAtteints: '90%',
        progression: 'Très Bien'
      }
    }
  ]);

  const departements = [
    {
      nom: 'Technologie',
      effectif: 25,
      responsable: 'Sophie Leroy',
      budgetFormation: 50000,
      projetsEnCours: 5
    },
    {
      nom: 'Produit',
      effectif: 12,
      responsable: 'Lucas Moreau',
      budgetFormation: 30000,
      projetsEnCours: 3
    },
    {
      nom: 'Marketing',
      effectif: 15,
      responsable: 'Emma Dubois',
      budgetFormation: 35000,
      projetsEnCours: 4
    }
  ];

  const formationsDisponibles = [
    {
      id: 1,
      titre: 'Certification DevOps Avancée',
      departement: 'Technologie',
      duree: '3 mois',
      cout: 5000,
      placesDisponibles: 10
    },
    {
      id: 2,
      titre: 'Formation UX Design Expert',
      departement: 'Produit',
      duree: '2 mois',
      cout: 3500,
      placesDisponibles: 8
    },
    {
      id: 3,
      titre: 'Marketing Digital Stratégique',
      departement: 'Marketing',
      duree: '1 mois',
      cout: 2500,
      placesDisponibles: 12
    }
  ];

  const handleAddEmploye = (nouvelEmploye) => {
    const newEmploye = {
      ...nouvelEmploye,
      id: employes.length + 1,
      photo: '/images/employes/default.jpg', // Default photo
      performance: {
        noteAnnuelle: 0,
        objectifsAtteints: 'N/A',
        progression: 'Nouveau'
      }
    };
    setEmployes([...employes, newEmploye]);
  };

  const sections = {
    employes: {
      title: 'Liste des Employés',
      content: <ListeEmployes employes={employes} />
    },
    departements: {
      title: 'Départements',
      content: <ListeDepartements departements={departements} />
    },
    formations: {
      title: 'Formations',
      content: (
        <ListeFormations 
          formations={formationsDisponibles} 
          departements={departements}
          onAddEmploye={handleAddEmploye}
        />
      )
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Gestion du Personnel</h1>
        
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
