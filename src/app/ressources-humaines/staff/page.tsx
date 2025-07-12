'use client';

import React, { useState } from 'react';
import MegaMenu from '../../../components/layout/MegaMenu';
import ListeEmployes, { Employee } from '../../../components/ressources-humaines/staff/ListeEmployes';
import ListeDepartements, { Departement } from '../../../components/ressources-humaines/staff/ListeDepartements';
import StaffStatistics from '../../../components/ressources-humaines/staff/StaffStatistics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Staff() {
  const [employes, setEmployes] = useState<Employee[]>([
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
    },
    {
      id: 3,
      nom: 'Doe',
      prenom: 'John',
      photo: '/images/employes/default.jpg',
      departement: 'Technologie',
      poste: 'Software Engineer',
      dateEmbauche: '2022-01-01',
      email: 'john.doe@entreprise.com',
      telephone: '+33 6 98 76 54 32',
      competences: ['Java', 'Python', 'Cloud Computing'],
      performance: {
        noteAnnuelle: 0,
        objectifsAtteints: 'N/A',
        progression: 'Nouveau'
      }
    }
  ]);

  const departements: Departement[] = [
    {
      nom: 'Membre du conseil',
      effectif: 8,
      responsable: 'Mehdi BEREL',
      budgetFormation: 50000,
      projetsEnCours: 5
    },
    {
      nom: 'Informatique',
      effectif: 12, 
      responsable: 'Mehdi BEREL',
      budgetFormation: 30000,
      projetsEnCours: 4
    },
    {
      nom: 'Marketing',
      effectif: 4,
      responsable: 'Mehdi BEREL',
      budgetFormation: 35000,
      projetsEnCours: 4
    },
    {
      nom: 'Commercial',
      effectif: 0,
      responsable: 'Louis JUNQUA',
      budgetFormation: 0,
      projetsEnCours: 0
    },
    {
      nom: 'Ressources humaines',
      effectif: 2,
      responsable: 'Mehdi BEREL',
      budgetFormation: 0,
      projetsEnCours: 0
    },
    {
      nom: 'Discord',
      effectif: 0,
      responsable: '',
      budgetFormation: 0,
      projetsEnCours: 0
    }
  ];

  const handleAddEmploye = (nouvelEmploye: Omit<Employee, 'id' | 'photo' | 'performance'>) => {
    const newEmploye = {
      ...nouvelEmploye,
      id: employes.length + 1,
      photo: '/images/employes/default.jpg',
      performance: {
        noteAnnuelle: 0,
        objectifsAtteints: 'N/A',
        progression: 'Nouveau'
      }
    };
    setEmployes([...employes, newEmploye]);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Gestion du Personnel</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gérez les employés, les départements et consultez les statistiques du personnel
          </p>
        </div>
        
        <Tabs defaultValue="statistics" className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-1">
            <TabsTrigger 
              value="statistics" 
              className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
            >
              Statistiques
            </TabsTrigger>
            <TabsTrigger 
              value="employes" 
              className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
            >
              Employés
            </TabsTrigger>
            <TabsTrigger 
              value="departements" 
              className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
            >
              Départements
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="statistics" className="mt-6">
            <StaffStatistics employes={employes} departements={departements} />
          </TabsContent>
          
          <TabsContent value="employes" className="mt-6">
            <ListeEmployes 
              employes={employes} 
              setEmployes={setEmployes}
              onAddEmploye={handleAddEmploye}
            />
          </TabsContent>
          
          <TabsContent value="departements" className="mt-6">
            <ListeDepartements />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
