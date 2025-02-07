import React from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function Members() {
  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-2xl font-bold mb-4">Members</h1>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Members List</h2>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Name</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Position</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Email</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Contact</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Samy', position: 'Business Developer', email: 'samy.rabia@pledgeandgrow.com', contact: '+33 6 60 77 79 85' },
                { name: 'Hedi', position: 'Responsable prospection', email: 'hedi.bouzanouni@pledgeandgrow.com', contact: '+33 6 52 11 07 78' },
                { name: 'Florentino Neves', position: 'Responsable prospection', email: 'florentino.neves@pledgeandgrow.com', contact: '+33 7 79 67 93 74' }
              ].map((member, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="py-3 px-5 border-b border-gray-200">{member.name}</td>
                  <td className="py-3 px-5 border-b border-gray-200">{member.position}</td>
                  <td className="py-3 px-5 border-b border-gray-200">{member.email}</td>
                  <td className="py-3 px-5 border-b border-gray-200">{member.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
