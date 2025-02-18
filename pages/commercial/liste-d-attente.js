import React, { useState, useEffect } from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function ListeDAttente() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', position: '', company: '', email: '', phone: '' });

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
    setNewMember({ name: '', position: '', company: '', email: '', phone: '' });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setMembers([...members, newMember]);
    closeAddModal();
  };

  const handleDeleteMember = (memberToDelete) => {
    setMembers(members.filter(member => member !== memberToDelete));
  };

  const moveMemberUp = (index) => {
    if (index === 0) return;
    const newMembers = [...members];
    [newMembers[index - 1], newMembers[index]] = [newMembers[index], newMembers[index - 1]];
    setMembers(newMembers);
  };

  const moveMemberDown = (index) => {
    if (index === members.length - 1) return;
    const newMembers = [...members];
    [newMembers[index + 1], newMembers[index]] = [newMembers[index], newMembers[index + 1]];
    setMembers(newMembers);
  };

  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Liste d'attente</h1>
          <button onClick={handleAddToWaitlist} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Add to Waitlist
          </button>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Liste d'attente</h2>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Name</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Position</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Company</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Email</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Whatsapp</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold"></th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold"></th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="py-3 px-5 border-b border-gray-200">{member.name}</td>
                  <td className="py-3 px-5 border-b border-gray-200">{member.position}</td>
                  <td className="py-3 px-5 border-b border-gray-200">{member.company}</td>
                  <td className="py-3 px-5 border-b border-gray-200">{member.email}</td>
                  <td className="py-3 px-5 border-b border-gray-200">{member.phone}</td>
                  <td className="py-3 px-5 border-b border-gray-200">
                    <button onClick={() => openEditModal(member)} className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
                      ✏️ Edit
                    </button>
                  </td>
                  <td className="py-3 px-5 border-b border-gray-200">
                    <button onClick={() => handleDeleteMember(member)} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
                      🗑️ Delete
                    </button>
                  </td>
                  <td className="py-3 px-5 border-b border-gray-200">
                    <button onClick={() => moveMemberUp(index)} className="text-gray-500 hover:text-gray-800">
                      ⬆️
                    </button>
                    <button onClick={() => moveMemberDown(index)} className="text-gray-500 hover:text-gray-800 ml-1">
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