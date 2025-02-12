import React, { useState } from 'react';
import MegaMenu from '../../components/MegaMenu';
import Image from 'next/image';

export default function Publicite() {
  const [activeSection, setActiveSection] = useState('plateformes');
  const [newCampagne, setNewCampagne] = useState({
    nom: '',
    plateforme: '',
    budget: '',
    dateDebut: '',
    dateFin: ''
  });

  const plateformesPublicitaires = [
    {
      nom: 'Google Ads',
      logo: '/images/platforms/google-ads.png',
      description: 'Publicité search et display',
      coutMoyenClic: 1.50,
      roas: 4.5
    },
    {
      nom: 'Facebook Ads',
      logo: '/images/platforms/facebook-ads.png',
      description: 'Ciblage social et comportemental',
      coutMoyenClic: 1.20,
      roas: 3.8
    },
    {
      nom: 'LinkedIn Ads',
      logo: '/images/platforms/linkedin-ads.png',
      description: 'Publicité B2B et professionnelle',
      coutMoyenClic: 5.50,
      roas: 5.2
    },
    {
      nom: 'Instagram Ads',
      logo: '/images/platforms/instagram-ads.png',
      description: 'Publicité visuelle et créative',
      coutMoyenClic: 1.30,
      roas: 3.5
    }
  ];

  const campagnesActives = [
    {
      nom: 'Lancement Produit CRM',
      plateforme: 'Google Ads',
      budget: '5000 €',
      dateDebut: '2025-01-15',
      dateFin: '2025-03-15',
      statistiques: {
        impressions: 250000,
        clics: 12500,
        tauxConversion: 3.5,
        coutParAcquisition: 40
      }
    },
    {
      nom: 'Recrutement Talents',
      plateforme: 'LinkedIn Ads',
      budget: '3000 €',
      dateDebut: '2025-02-01',
      dateFin: '2025-04-01',
      statistiques: {
        impressions: 100000,
        clics: 5000,
        tauxConversion: 2.8,
        coutParAcquisition: 60
      }
    }
  ];

  const sections = {
    plateformes: {
      title: 'Plateformes Publicitaires',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plateformesPublicitaires.map((plateforme, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <Image 
                  src={plateforme.logo} 
                  alt={plateforme.nom} 
                  width={50} 
                  height={50} 
                  className="mr-4"
                />
                <h3 className="text-xl font-bold">{plateforme.nom}</h3>
              </div>
              <p className="text-gray-600 mb-2">{plateforme.description}</p>
              <div className="space-y-2">
                <p>
                  <strong>Coût Moyen par Clic:</strong> {plateforme.coutMoyenClic} €
                </p>
                <p>
                  <strong>ROAS:</strong> {plateforme.roas}x
                </p>
              </div>
            </div>
          ))}
        </div>
      )
    },
    campagnes: {
      title: 'Campagnes Publicitaires',
      content: (
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4">Créer une Nouvelle Campagne</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Nom de la Campagne</label>
                <input 
                  type="text"
                  value={newCampagne.nom}
                  onChange={(e) => setNewCampagne({...newCampagne, nom: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Entrez le nom de la campagne"
                />
              </div>
              <div>
                <label className="block mb-2">Plateforme</label>
                <select 
                  value={newCampagne.plateforme}
                  onChange={(e) => setNewCampagne({...newCampagne, plateforme: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Sélectionnez une plateforme</option>
                  {plateformesPublicitaires.map((p) => (
                    <option key={p.nom} value={p.nom}>{p.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2">Budget</label>
                <input 
                  type="text"
                  value={newCampagne.budget}
                  onChange={(e) => setNewCampagne({...newCampagne, budget: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Budget de la campagne"
                />
              </div>
              <div>
                <label className="block mb-2">Date de Début</label>
                <input 
                  type="date"
                  value={newCampagne.dateDebut}
                  onChange={(e) => setNewCampagne({...newCampagne, dateDebut: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Date de Fin</label>
                <input 
                  type="date"
                  value={newCampagne.dateFin}
                  onChange={(e) => setNewCampagne({...newCampagne, dateFin: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="col-span-full">
                <button 
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Créer Campagne
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold mb-4">Campagnes Actives</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campagnesActives.map((campagne, index) => (
                <div 
                  key={index} 
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h4 className="text-xl font-semibold mb-2">{campagne.nom}</h4>
                  <p><strong>Plateforme:</strong> {campagne.plateforme}</p>
                  <p><strong>Budget:</strong> {campagne.budget}</p>
                  <p><strong>Période:</strong> {campagne.dateDebut} au {campagne.dateFin}</p>
                  
                  <div className="mt-4 bg-gray-100 p-3 rounded">
                    <h5 className="font-bold mb-2">Statistiques</h5>
                    <p>Impressions: {campagne.statistiques.impressions}</p>
                    <p>Clics: {campagne.statistiques.clics}</p>
                    <p>Taux de Conversion: {campagne.statistiques.tauxConversion}%</p>
                    <p>Coût par Acquisition: {campagne.statistiques.coutParAcquisition} €</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    statistiques: {
      title: 'Statistiques Globales',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold mb-4">Performance Publicitaire</h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold">Budget Total Investi</p>
                <p className="text-2xl text-blue-600">15,000 €</p>
              </div>
              <div>
                <p className="font-semibold">Retour sur Investissement (ROAS)</p>
                <p className="text-2xl text-green-600">4.2x</p>
              </div>
              <div>
                <p className="font-semibold">Coût Moyen par Clic</p>
                <p className="text-2xl text-purple-600">2.50 €</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold mb-4">Répartition des Clics</h3>
            <div className="space-y-3">
              {plateformesPublicitaires.map((plateforme) => (
                <div key={plateforme.nom} className="flex items-center">
                  <div className="w-12 mr-4">
                    <Image 
                      src={plateforme.logo} 
                      alt={plateforme.nom} 
                      width={40} 
                      height={40} 
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold">{plateforme.nom}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{width: `${plateforme.roas * 20}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Gestion Publicitaire</h1>
        
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
