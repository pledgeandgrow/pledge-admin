import React, { useState } from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function EcrituresComptables() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = {
    overview: {
      title: 'Vue d\'ensemble Écritures Comptables',
      content: 'Aperçu global du processus de comptabilisation et d\'enregistrement.'
    },
    types: {
      title: 'Types d\'Écritures',
      content: 'Classification et description des différents types d\'écritures comptables.'
    },
    enregistrement: {
      title: 'Enregistrement des Écritures',
      content: 'Processus de saisie et de validation des écritures comptables.'
    },
    verification: {
      title: 'Vérification Comptable',
      content: 'Méthodes de contrôle et de validation des écritures.'
    }
  };

  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Écritures Comptables</h1>
        
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
