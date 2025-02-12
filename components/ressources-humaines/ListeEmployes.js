import React, { useState } from 'react';
import Image from 'next/image';
import DetailsEmploye from './DetailsEmploye';

export default function ListeEmployes({ employes }) {
  const [selectedEmploye, setSelectedEmploye] = useState(null);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employes.map((employe) => (
          <div 
            key={employe.id} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setSelectedEmploye(employe)}
          >
            <div className="flex items-center mb-4">
              <div className="w-20 h-20 rounded-full mr-4 overflow-hidden">
                <Image 
                  src={employe.photo} 
                  alt={`${employe.prenom} ${employe.nom}`} 
                  width={80} 
                  height={80} 
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">{employe.prenom} {employe.nom}</h3>
                <p className="text-gray-600">{employe.poste}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p><strong>Département:</strong> {employe.departement}</p>
              <p><strong>Date d'Embauche:</strong> {employe.dateEmbauche}</p>
              <div>
                <strong>Compétences:</strong>
                <ul className="list-disc list-inside text-sm">
                  {employe.competences.map((competence, index) => (
                    <li key={index}>{competence}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedEmploye && (
        <DetailsEmploye 
          employe={selectedEmploye} 
          onClose={() => setSelectedEmploye(null)} 
        />
      )}
    </div>
  );
}
