import React, { useState } from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function TVAEtTaxes() {
  const [activeSection, setActiveSection] = useState('overview');
  const [factureType, setFactureType] = useState('recue');
  const [factureData, setFactureData] = useState({
    montantHT: '',
    montantTVA: '',
    reference: ''
  });
  const [facturesList, setFacturesList] = useState([]);

  const sections = {
    overview: {
      title: 'Vue d\'ensemble TVA et Taxes',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Situation Fiscale</h3>
            <p>Total TVA à verser: <span className="font-bold text-red-600">2,500 €</span></p>
            <p>Total TVA récupérable: <span className="font-bold text-green-600">1,800 €</span>
            </p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Bénéfice Net</h3>
            <p>Bénéfice après versement de TVA: <span className="font-bold text-green-800">15,300 €</span></p>
            <p className="text-sm text-gray-600">Calcul basé sur le dernier trimestre</p>
          </div>
        </div>
      )
    },
    tvaRates: {
      title: 'Liste de factures avec TVA',
      content: (
        <div>
          <h3 className="font-bold text-lg mb-4">Factures Enregistrées</h3>
          {facturesList.length === 0 ? (
            <p className="text-gray-500">Aucune facture enregistrée</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Référence</th>
                  <th className="border p-2">Montant HT</th>
                  <th className="border p-2">Montant TVA</th>
                </tr>
              </thead>
              <tbody>
                {facturesList.map((facture, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border p-2">{facture.reference}</td>
                    <td className="border p-2">{facture.montantHT} €</td>
                    <td className="border p-2">{facture.montantTVA} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )
    },
    declarations: {
      title: 'Déclarer une facture',
      content: (
        <div>
          <div className="mb-4">
            <label className="block mb-2">Type de Facture</label>
            <div className="flex space-x-4">
              <button 
                className={`px-4 py-2 rounded ${factureType === 'recue' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setFactureType('recue')}
              >
                Facture Reçue
              </button>
              <button 
                className={`px-4 py-2 rounded ${factureType === 'emise' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setFactureType('emise')}
              >
                Facture Émise
              </button>
            </div>
          </div>
          <form className="space-y-4">
            <div>
              <label className="block mb-2">Montant HT</label>
              <input 
                type="number" 
                value={factureData.montantHT}
                onChange={(e) => setFactureData({...factureData, montantHT: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                placeholder="Entrez le montant HT"
              />
            </div>
            <div>
              <label className="block mb-2">Montant TVA</label>
              <input 
                type="number" 
                value={factureData.montantTVA}
                onChange={(e) => setFactureData({...factureData, montantTVA: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                placeholder="Entrez le montant de TVA"
              />
            </div>
            <div>
              <label className="block mb-2">Référence de la Facture</label>
              <input 
                type="text" 
                value={factureData.reference}
                onChange={(e) => setFactureData({...factureData, reference: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                placeholder="Entrez la référence de la facture"
              />
            </div>
            <button 
              type="button" 
              onClick={() => {
                setFacturesList([...facturesList, factureData]);
                setFactureData({montantHT: '', montantTVA: '', reference: ''});
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Ajouter la Facture
            </button>
          </form>
        </div>
      )
    },
    calculations: {
      title: 'Calculs et Outils TVA',
      content: 'Outils de calcul et de vérification des montants de TVA.'
    }
  };

  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">TVA & Taxes</h1>
        
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
          {sections[activeSection].content}
        </div>
      </div>
    </div>
  );
}
