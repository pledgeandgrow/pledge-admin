import React from 'react';
import Image from 'next/image';

export default function DetailsEmploye({ employe, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-3xl w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl"
        >
          ×
        </button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 flex flex-col items-center">
            <Image 
              src={employe.photo} 
              alt={`${employe.prenom} ${employe.nom}`} 
              width={200} 
              height={200} 
              className="rounded-full mb-4"
            />
            <h2 className="text-2xl font-bold">{employe.prenom} {employe.nom}</h2>
            <p className="text-gray-600">{employe.poste}</p>
          </div>
          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Email:</strong> {employe.email}
              </div>
              <div>
                <strong>Téléphone:</strong> {employe.telephone}
              </div>
              <div>
                <strong>Département:</strong> {employe.departement}
              </div>
              <div>
                <strong>Date d'Embauche:</strong> {employe.dateEmbauche}
              </div>
            </div>
            <div>
              <strong>Compétences:</strong>
              <ul className="list-disc list-inside">
                {employe.competences.map((competence, index) => (
                  <li key={index}>{competence}</li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="text-xl font-semibold mb-2">Performance</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <strong>Note Annuelle:</strong> {employe.performance.noteAnnuelle}/10
                </div>
                <div>
                  <strong>Objectifs Atteints:</strong> {employe.performance.objectifsAtteints}
                </div>
                <div>
                  <strong>Progression:</strong> {employe.performance.progression}
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Modifier le Profil
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded">
                Évaluation de Performance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
