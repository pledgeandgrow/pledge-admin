import React, { useState } from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function Facturation() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = {
    overview: {
      title: 'Vue d\'ensemble Facturation',
      content: 'Aperçu général du processus de facturation et des pratiques de l\'entreprise.'
    },
    clients: {
      title: 'Clients et Facturation',
      content: 'Détails sur la facturation des clients, suivi des paiements et historique.'
    },
    creation: {
      title: 'Création de Factures',
      content: 'Processus de génération et personnalisation des factures.'
    },
    suiviPaiements: {
      title: 'Suivi des Paiements',
      content: 'Méthodes de suivi et de relance des paiements en attente.'
    }
  };

  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem] bg-gray-50">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Facturation</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
          <p className="text-gray-600">
            {sections[activeSection].content}
          </p>
        </div>
      </div>
    </div>
  );
}
