import React, { useState } from 'react';
import MegaMenu from '../../components/MegaMenu';

const Contenu = () => {
  const [activeSection, setActiveSection] = useState('ideesPosts');

  return (
    <div className="min-h-screen flex flex-col p-8 ml-[32rem]">
      <MegaMenu />
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Page Contenu</h1>
      <p className="mb-6">Welcome to the Contenu page.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === 'ideesPosts' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => setActiveSection('ideesPosts')}
        >
          Idées de Posts
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === 'strategies' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => setActiveSection('strategies')}
        >
          Stratégies de Contenu
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === 'meilleuresPratiques' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => setActiveSection('meilleuresPratiques')}
        >
          Meilleures Pratiques de Contenu
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        {activeSection === 'ideesPosts' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Idées de Posts</h2>
            <ul className="list-disc list-inside">
              <li>Post sur les tendances du marché</li>
              <li>Conseils pour améliorer la productivité</li>
              <li>Études de cas de clients satisfaits</li>
              <li>Annonce de nouveaux produits ou services</li>
              <li>Partage d'articles intéressants du secteur</li>
            </ul>
          </div>
        )}
        {activeSection === 'strategies' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Stratégies de Contenu</h2>
            <p>Dans cette section, nous discutons des différentes stratégies pour créer un contenu engageant et pertinent.</p>
            <ul className="list-disc list-inside">
              <li>Utiliser des visuels attrayants</li>
              <li>Incorporer des témoignages de clients</li>
              <li>Rester à jour avec les tendances du secteur</li>
              <li>Encourager l'interaction avec le public</li>
            </ul>
          </div>
        )}
        {activeSection === 'meilleuresPratiques' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Meilleures Pratiques de Contenu</h2>
            <p>Dans cette section, nous allons explorer les meilleures pratiques pour créer un contenu de qualité qui répond aux besoins de votre public cible.</p>
            <ul className="list-disc list-inside">
              <li>Définir vos objectifs de contenu</li>
              <li>Connaître votre public cible</li>
              <li>Créer un calendrier de contenu</li>
              <li>Utiliser des outils de création de contenu</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contenu;
