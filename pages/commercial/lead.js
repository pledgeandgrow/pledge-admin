import React, { useState, useEffect } from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function LeadPage() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', position: '', company: '', email: '', phone: '', commentaires: '', status: 'New', service: '' });

  useEffect(() => {
    const savedMembers = JSON.parse(localStorage.getItem('members')) || [];
    setMembers(savedMembers);
  }, []);

  useEffect(() => {
    localStorage.setItem('members', JSON.stringify(members));
  }, [members]);

  const openEditModal = (member) => {
    setSelectedMember(member);
  };

  const closeEditModal = () => {
    setSelectedMember(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setMembers(members.map(member => member.email === selectedMember.email ? selectedMember : member));
    closeEditModal();
  };

  const handleAddToWaitlist = () => {
    setIsModalOpen(true);
  };

  const closeAddModal = () => {
    setIsModalOpen(false);
    setNewMember({ name: '', position: '', company: '', email: '', phone: '', commentaires: '', status: 'New', service: '' });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const leadWithDate = { ...newMember, date: new Date().toISOString().split('T')[0] };
    setMembers([...members, leadWithDate]);
    closeAddModal();
  };

  const handleDeleteMember = (memberToDelete) => {
    setMembers(members.filter(member => member !== memberToDelete));
  };

  const moveMemberUp = (index) => {
    if (index > 0) {
      const newMembers = [...members];
      [newMembers[index], newMembers[index - 1]] = [newMembers[index - 1], newMembers[index]];
      setMembers(newMembers);
    }
  };

  const moveMemberDown = (index) => {
    if (index < members.length - 1) {
      const newMembers = [...members];
      [newMembers[index], newMembers[index + 1]] = [newMembers[index + 1], newMembers[index]];
      setMembers(newMembers);
    }
  };

  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Lead</h1>
          <button onClick={handleAddToWaitlist} className="bg-transparent text-green-500 hover:bg-green-100 p-2 rounded">
            ➕
          </button>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Lead</h2>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold text-xs">Date du Lead</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold text-xs">Nom</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold text-xs">Position</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold text-xs">Entreprise</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold text-xs">Email</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold text-xs">Phone</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold text-xs">Commentaires</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold text-xs">Status</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold text-xs">Service</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="py-3 px-5 border-b border-gray-200 text-xs">{member.date}</td>
                  <td className="py-3 px-5 border-b border-gray-200 text-xs">{member.name}</td>
                  <td className="py-3 px-5 border-b border-gray-200 text-xs">{member.position}</td>
                  <td className="py-3 px-5 border-b border-gray-200 text-xs">{member.company}</td>
                  <td className="py-3 px-5 border-b border-gray-200 text-xs">{member.email}</td>
                  <td className="py-3 px-5 border-b border-gray-200 text-xs">{member.phone}</td>
                  <td className="py-3 px-5 border-b border-gray-200 text-xs">{member.commentaires}</td>
                  <td className="py-3 px-5 border-b border-gray-200 text-xs">{member.status}</td>
                  <td className="py-3 px-5 border-b border-gray-200 text-xs">{member.service}</td>
                  <td className="py-3 px-5 border-b border-gray-200 text-xs">
                    <button onClick={() => openEditModal(member)} className="bg-transparent text-yellow-500 hover:bg-yellow-100 p-2 rounded">
                      ✏️
                    </button>
                    <button onClick={() => handleDeleteMember(member)} className="bg-transparent text-red-500 hover:bg-red-100 p-2 rounded ml-2">
                      🗑️
                    </button>
                    <button onClick={() => moveMemberUp(index)} className="bg-transparent text-gray-500 hover:bg-gray-100 p-2 rounded ml-1">
                      ⬆️
                    </button>
                    <button onClick={() => moveMemberDown(index)} className="bg-transparent text-gray-500 hover:bg-gray-100 p-2 rounded ml-1">
                      ⬇️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedMember && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Edit Member</h2>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Name</label>
                  <input type="text" name="name" value={selectedMember.name} onChange={handleEditChange} className="border border-gray-300 p-2 w-full rounded" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Position</label>
                  <input type="text" name="position" value={selectedMember.position} onChange={handleEditChange} className="border border-gray-300 p-2 w-full rounded" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Company</label>
                  <input type="text" name="company" value={selectedMember.company} onChange={handleEditChange} className="border border-gray-300 p-2 w-full rounded" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input type="email" name="email" value={selectedMember.email} onChange={handleEditChange} className="border border-gray-300 p-2 w-full rounded" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Phone</label>
                  <input type="text" name="phone" value={selectedMember.phone} onChange={handleEditChange} className="border border-gray-300 p-2 w-full rounded" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Commentaires</label>
                  <input type="text" name="commentaires" value={selectedMember.commentaires} onChange={handleEditChange} className="border border-gray-300 p-2 w-full rounded" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Status</label>
                  <select value={selectedMember.status} onChange={(e) => handleEditChange({ target: { name: 'status', value: e.target.value } })} className="border border-gray-300 p-2 w-full rounded">
                    <option value="New">New</option>
                    <option value="Hot">Hot</option>
                    <option value="Cold">Cold</option>
                    <option value="Découverte">Découverte</option>
                    <option value="Closed">Closed</option>
                    <option value="À relancer">À relancer</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Service</label>
                  <select value={selectedMember.service} onChange={(e) => handleEditChange({ target: { name: 'service', value: e.target.value } })} className="border border-gray-300 p-2 w-full rounded">
                    <option value="Site web">Site web</option>
                    <option value="Application mobile">Application mobile</option>
                    <option value="SAAS">SAAS</option>
                    <option value="Logiciel">Logiciel</option>
                    <option value="Jeux vidéo">Jeux vidéo</option>
                    <option value="Référencement">Référencement</option>
                    <option value="IA">IA</option>
                    <option value="Blockchain">Blockchain</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="UX / IX">UX / IX</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                  Save
                </button>
                <button type="button" onClick={closeEditModal} className="ml-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Add to Waitlist</h2>
              <form onSubmit={handleAddSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Name</label>
                  <input type="text" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} className="border border-gray-300 p-2 w-full rounded" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Position</label>
                  <input type="text" value={newMember.position} onChange={(e) => setNewMember({ ...newMember, position: e.target.value })} className="border border-gray-300 p-2 w-full rounded" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Company</label>
                  <input type="text" value={newMember.company} onChange={(e) => setNewMember({ ...newMember, company: e.target.value })} className="border border-gray-300 p-2 w-full rounded" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input type="email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} className="border border-gray-300 p-2 w-full rounded" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Phone</label>
                  <input type="text" value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} className="border border-gray-300 p-2 w-full rounded" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Commentaires</label>
                  <input type="text" value={newMember.commentaires} onChange={(e) => setNewMember({ ...newMember, commentaires: e.target.value })} className="border border-gray-300 p-2 w-full rounded" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Status</label>
                  <select value={newMember.status} onChange={(e) => setNewMember({ ...newMember, status: e.target.value })} className="border border-gray-300 p-2 w-full rounded">
                    <option value="New">New</option>
                    <option value="Hot">Hot</option>
                    <option value="Cold">Cold</option>
                    <option value="Découverte">Découverte</option>
                    <option value="Closed">Closed</option>
                    <option value="À relancer">À relancer</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Service</label>
                  <select value={newMember.service} onChange={(e) => setNewMember({ ...newMember, service: e.target.value })} className="border border-gray-300 p-2 w-full rounded">
                    <option value="Site web">Site web</option>
                    <option value="Application mobile">Application mobile</option>
                    <option value="SAAS">SAAS</option>
                    <option value="Logiciel">Logiciel</option>
                    <option value="Jeux vidéo">Jeux vidéo</option>
                    <option value="Référencement">Référencement</option>
                    <option value="IA">IA</option>
                    <option value="Blockchain">Blockchain</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="UX / IX">UX / IX</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                  Add
                </button>
                <button type="button" onClick={closeAddModal} className="ml-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
