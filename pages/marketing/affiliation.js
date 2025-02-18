import React, { useState } from 'react';
import MegaMenu from '../../components/MegaMenu';

const Affiliation = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentAffiliate, setCurrentAffiliate] = useState(null);
  const [activeTab, setActiveTab] = useState('list');

  const generateHashCode = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  const handleAddAffiliate = (affiliate) => {
    affiliate.hashCode = generateHashCode(); // Generate hash code when adding an affiliate
    setAffiliates([...affiliates, affiliate]);
    setIsOpen(false);
  };

  const handleEditAffiliate = (affiliate) => {
    const updatedAffiliates = affiliates.map((a) => (a.id === affiliate.id ? affiliate : a));
    setAffiliates(updatedAffiliates);
    setIsOpen(false);
  };

  const handleDeleteAffiliate = (id) => {
    const updatedAffiliates = affiliates.filter(a => a.id !== id);
    setAffiliates(updatedAffiliates);
  };

  const moveMemberUp = (index) => {
    if (index > 0) {
      const updatedAffiliates = [...affiliates];
      [updatedAffiliates[index], updatedAffiliates[index - 1]] = [updatedAffiliates[index - 1], updatedAffiliates[index]];
      setAffiliates(updatedAffiliates);
    }
  };

  const moveMemberDown = (index) => {
    if (index < affiliates.length - 1) {
      const updatedAffiliates = [...affiliates];
      [updatedAffiliates[index], updatedAffiliates[index + 1]] = [updatedAffiliates[index + 1], updatedAffiliates[index]];
      setAffiliates(updatedAffiliates);
    }
  };

  const calculateTotalCommissions = () => {
    return affiliates.reduce((total, affiliate) => total + (affiliate.commission || 0), 0);
  };

  const calculateScore = (affiliate) => {
    return affiliate.commission ? affiliate.commission * 10 : 0; // Example scoring logic
  };

  const getLevel = (score) => {
    if (score >= 100) return 'Gold';
    if (score >= 50) return 'Silver';
    return 'Bronze';
  };

  return (
    <div className="min-h-screen flex flex-col p-8 ml-[32rem]">
      <MegaMenu />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Affiliation</h1>
        <button onClick={() => { setIsOpen(true); setCurrentAffiliate(null); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Ajouter un Affilié</button>
      </div>
      <div className="flex mb-4">
        <button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded-lg ${activeTab === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition duration-200 ease-in-out`}>Liste des Affiliés</button>
        <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition duration-200 ease-in-out`}>Tableau de Bord</button>
      </div>
      <style jsx>{`
        .tab-button {
          transition: background-color 0.2s ease-in-out;
        }
      `}</style>
      {activeTab === 'list' && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Liste des Affiliés</h2>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Nom</th>
                <th className="px-4 py-2">Code Généré</th>
                <th className="px-4 py-2">Mail</th>
                <th className="px-4 py-2">Numéro</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((affiliate, index) => (
                <tr key={affiliate.id}>
                  <td className="border px-4 py-2">{affiliate.name}</td>
                  <td className="border px-4 py-2">{affiliate.code}</td>
                  <td className="border px-4 py-2">{affiliate.email}</td>
                  <td className="border px-4 py-2">{affiliate.phone}</td>
                  <td className="border px-4 py-2">
                    <button onClick={() => { setIsOpen(true); setCurrentAffiliate(affiliate); }} className="bg-transparent text-yellow-500 hover:bg-yellow-100 p-2 rounded">✏️</button>
                    <button onClick={() => handleDeleteAffiliate(affiliate.id)} className="bg-transparent text-red-500 hover:bg-red-100 p-2 rounded ml-2">🗑️</button>
                    <button onClick={() => moveMemberUp(index)} className="bg-transparent text-gray-500 hover:bg-gray-100 p-2 rounded ml-1">⬆️</button>
                    <button onClick={() => moveMemberDown(index)} className="bg-transparent text-gray-500 hover:bg-gray-100 p-2 rounded ml-1">⬇️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === 'dashboard' && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Tableau de Bord des Affiliés</h2>
          <p className="text-lg font-semibold">Total Affiliés: {affiliates.length}</p>
          <p className="text-lg font-semibold">Total Commissions: {calculateTotalCommissions()}</p>
          <h3 className="text-lg font-semibold mt-4">Scores et Niveaux</h3>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Nom</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Niveau</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((affiliate) => (
                <tr key={affiliate.id}>
                  <td className="border px-4 py-2">{affiliate.name}</td>
                  <td className="border px-4 py-2">{calculateScore(affiliate)}</td>
                  <td className="border px-4 py-2">{getLevel(calculateScore(affiliate))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isOpen && <AffiliateModal onClose={() => setIsOpen(false)} onSave={currentAffiliate ? handleEditAffiliate : handleAddAffiliate} affiliate={currentAffiliate} />}
    </div>
  );
};

const AffiliateModal = ({ onClose, onSave, affiliate }) => {
  const [name, setName] = useState(affiliate ? affiliate.name : '');
  const [code, setCode] = useState(affiliate ? affiliate.code : '');
  const [email, setEmail] = useState(affiliate ? affiliate.email : '');
  const [phone, setPhone] = useState(affiliate ? affiliate.phone : '');
  const [commission, setCommission] = useState(affiliate ? affiliate.commission : 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAffiliate = { id: affiliate ? affiliate.id : Date.now(), name, code, email, phone, commission };
    onSave(newAffiliate);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">{affiliate ? 'Editer Affilié' : 'Ajouter un Affilié'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nom</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border rounded w-full px-3 py-2" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Code Généré</label>
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="border rounded w-full px-3 py-2" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded w-full px-3 py-2" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Numéro</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="border rounded w-full px-3 py-2" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Commission</label>
            <input type="number" value={commission} onChange={(e) => setCommission(e.target.value)} className="border rounded w-full px-3 py-2" required />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">{affiliate ? 'Mettre à Jour' : 'Ajouter'}</button>
          <button type="button" onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded-lg ml-2">Annuler</button>
        </form>
      </div>
    </div>
  );
};

export default Affiliation;
