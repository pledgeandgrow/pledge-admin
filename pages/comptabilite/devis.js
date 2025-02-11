import React, { useState } from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function Devis() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = {
    overview: {
      title: 'Vue d\'ensemble Devis',
      content: 'Aperçu général de la gestion des devis et des propositions commerciales.'
    },
    creation: {
      title: 'Création de Devis',
      content: 'Processus de génération et personnalisation des devis pour les clients.'
    },
    suivi: {
      title: 'Suivi des Devis',
      content: 'Méthodes de suivi et de conversion des devis en contrats.'
    },
    historique: {
      title: 'Historique des Devis',
      content: 'Consultation et analyse des devis précédents.'
    }
  };

  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem] bg-gray-50">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Devis</h1>
        
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
