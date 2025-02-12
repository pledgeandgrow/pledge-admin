import React from 'react';

export default function ListeDepartements({ departements }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {departements.map((departement, index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-2xl font-bold mb-4">{departement.nom}</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <strong>Responsable:</strong>
              <span>{departement.responsable}</span>
            </div>
            <div className="flex justify-between">
              <strong>Effectif:</strong>
              <span>{departement.effectif} employés</span>
            </div>
            <div className="flex justify-between">
              <strong>Budget Formation:</strong>
              <span>{departement.budgetFormation} €</span>
            </div>
            <div className="flex justify-between">
              <strong>Projets en Cours:</strong>
              <span>{departement.projetsEnCours}</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{width: `${(departement.effectif / 50) * 100}%`}}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Taux d'Occupation: {Math.round((departement.effectif / 50) * 100)}%
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
