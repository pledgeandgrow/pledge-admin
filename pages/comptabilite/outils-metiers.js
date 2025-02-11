import React, { useState } from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function ExportIntegration() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = {
    overview: {
      title: 'Creer un devis',
      content: 'Aperçu global des processus d\'exportation et d\'intégration des données comptables.'
    },
    exportDonnees: {
      title: 'Creer une facture',
      content: 'Méthodes et formats d\'exportation des données financières.'
    },
    integration: {
      title: 'Creer un avoir',
      content: 'Un avoir permet d’annuler ou d’ajuster une facture, généralement en cas de retour de produit ou de modification de commande'
    },
    outils: {
      title: 'Outils d\'Intégration',
      content: 'Logiciels et solutions pour l\'export et l\'intégration de données.'
    }
  };

  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Export & Intégration</h1>
        
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
