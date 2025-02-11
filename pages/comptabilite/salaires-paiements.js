import React, { useState } from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function SalairesPaiements() {
  const [activeSection, setActiveSection] = useState('overview');
  const [versementData, setVersementData] = useState({
    salaire: '',
    rank: '',
    role: '',
    reference: '',
    typePaiement: 'virement'
  });
  const [versementsList, setVersementsList] = useState([]);
  const [employeeData, setEmployeeData] = useState([
    {
      name: 'Jean Dupont',
      rank: 'Senior Developer',
      salaireMoyen: 4500,
      missions: ['Développement backend', 'Architecture système'],
      specialite: 'Développement Web',
      image: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      name: 'Marie Leclerc',
      rank: 'Product Manager',
      salaireMoyen: 5200,
      missions: ['Gestion de produit', 'Stratégie client'],
      specialite: 'Gestion de Produit',
      image: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      name: 'Pierre Martin',
      rank: 'Junior Designer',
      salaireMoyen: 3200,
      missions: ['Design UI/UX', 'Prototypage'],
      specialite: 'Design Graphique',
      image: 'https://randomuser.me/api/portraits/men/3.jpg'
    }
  ]);

  const typePaiementOptions = [
    'Virement', 
    'PayPal', 
    'Carte', 
    'Fiverr', 
    'Crypto', 
    'Espèce', 
    'Chèque'
  ];

  const sections = {
    overview: {
      title: 'Vue d\'ensemble Salaires & Paiements',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Situation des Salaires</h3>
              <p>Total Salaires Versés: <span className="font-bold text-blue-600">85,000 €</span></p>
              <p>Salaire Moyen des Employés: <span className="font-bold text-green-600">4,250 €</span></p>
              <p>Masse Salariale Annuelle: <span className="font-bold text-purple-600">1,020,000 €</span></p>
            </div>
            
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Performance RH</h3>
              <p>Taux de Rétention: <span className="font-bold text-green-800">92%</span></p>
              <p>Rotation du Personnel: <span className="font-bold text-red-600">8%</span></p>
              <p>Temps Moyen dans l'Entreprise: <span className="font-bold">3.5 ans</span></p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Avantages Sociaux</h3>
              <p>Budget Formation: <span className="font-bold text-yellow-800">120,000 €</span></p>
              <p>Mutuelle Entreprise: <span className="font-bold text-blue-800">Couverture Totale</span></p>
              <p>Tickets Restaurant: <span className="font-bold text-green-800">8.5 € / jour</span></p>
            </div>
            
            <div className="bg-purple-100 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Prévisions</h3>
              <p>Budget Prévisionnel Salaires 2025: <span className="font-bold text-purple-800">1,200,000 €</span></p>
              <p>Nouvelles Embauches Prévues: <span className="font-bold text-blue-800">5 postes</span></p>
              <p>Augmentation Salariale Moyenne: <span className="font-bold text-green-800">3.5%</span></p>
            </div>
          </div>
        </div>
      )
    },
    gestionSalaires: {
      title: 'Liste des Paiements / Salaire',
      content: (
        <div>
          <h3 className="font-bold text-lg mb-4">Historique des Versements</h3>
          {versementsList.length === 0 ? (
            <p className="text-gray-500">Aucun versement enregistré</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Salaire</th>
                  <th className="border p-2">Rank</th>
                  <th className="border p-2">Rôle</th>
                  <th className="border p-2">Référence</th>
                  <th className="border p-2">Type Paiement</th>
                </tr>
              </thead>
              <tbody>
                {versementsList.map((versement, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border p-2">{versement.salaire} €</td>
                    <td className="border p-2">{versement.rank}</td>
                    <td className="border p-2">{versement.role}</td>
                    <td className="border p-2">{versement.reference}</td>
                    <td className="border p-2">{versement.typePaiement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )
    },
    charges: {
      title: 'Ajouter un Versement',
      content: (
        <form className="space-y-4">
          <div>
            <label className="block mb-2">Montant du Salaire</label>
            <input 
              type="number" 
              value={versementData.salaire}
              onChange={(e) => setVersementData({...versementData, salaire: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              placeholder="Entrez le montant du salaire"
            />
          </div>
          <div>
            <label className="block mb-2">Rank</label>
            <input 
              type="text" 
              value={versementData.rank}
              onChange={(e) => setVersementData({...versementData, rank: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              placeholder="Entrez le rank"
            />
          </div>
          <div>
            <label className="block mb-2">Rôle</label>
            <input 
              type="text" 
              value={versementData.role}
              onChange={(e) => setVersementData({...versementData, role: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              placeholder="Entrez le rôle"
            />
          </div>
          <div>
            <label className="block mb-2">Référence</label>
            <input 
              type="text" 
              value={versementData.reference}
              onChange={(e) => setVersementData({...versementData, reference: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              placeholder="Entrez la référence"
            />
          </div>
          <div>
            <label className="block mb-2">Type de Paiement</label>
            <select 
              value={versementData.typePaiement}
              onChange={(e) => setVersementData({...versementData, typePaiement: e.target.value})}
              className="w-full px-3 py-2 border rounded"
            >
              {typePaiementOptions.map((type) => (
                <option key={type} value={type.toLowerCase()}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <button 
            type="button" 
            onClick={() => {
              setVersementsList([...versementsList, versementData]);
              setVersementData({salaire: '', rank: '', role: '', reference: '', typePaiement: 'virement'});
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Ajouter le Versement
          </button>
        </form>
      )
    },
    paiements: {
      title: 'Gestion des Salariés',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {employeeData.map((employee, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <img 
                  src={employee.image} 
                  alt={employee.name} 
                  className="w-16 h-16 rounded-full mr-4 object-cover"
                />
                <div>
                  <h3 className="font-bold text-lg">{employee.name}</h3>
                  <p className="text-gray-500">{employee.rank}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p><strong>Salaire Moyen:</strong> {employee.salaireMoyen} €</p>
                <div>
                  <strong>Missions:</strong>
                  <ul className="list-disc list-inside text-sm">
                    {employee.missions.map((mission, idx) => (
                      <li key={idx}>{mission}</li>
                    ))}
                  </ul>
                </div>
                <p><strong>Spécialité:</strong> {employee.specialite}</p>
              </div>
            </div>
          ))}
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Salaires & Paiements</h1>
        
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
