import React from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function BoardMembers() {
  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-2xl font-bold mb-4">Board Members</h1>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Board Members</h2>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Name</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Position</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Email</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Whatsapp</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Mehdi BEREL', position: 'CEO', email: 'mehdi.berel@pledgeandgrow.com', phone: '+33 7 53 69 58 40' },
                { name: 'Shihab BEREL', position: 'CTO', email: 'shihab.berel@pledgeandgrow.com', phone: '+971 50 392 7710' },
                { name: 'Ilyas BEREL', position: 'CFO', email: 'ilyas.berel@pledgeandgrow.com', phone: '+971 50 538 5422' },
                { name: 'Louis JUNQUA-SALANNE', position: 'COO', email: 'louis.junqua@pledgeandgrow.com', phone: '+44 7535 740594' },
                { name: 'Maxime NEAU', position: 'Ambassadeur', email: 'maxime.neau@pledgeandgrow.com', phone: '+33 7 80 02 14 90' },
                { name: 'Mehdi OUALI', position: 'CSMO', email: 'mehdi.ouali@pledgeandgrow.com', phone: '+33 6 15 97 47 61' },
                { name: 'Lyna HAMMOUD', position: 'CCO', email: 'lyna.hammoud@pledgeandgrow.com', phone: '+33 6 52 80 46 71' },
                { name: 'Seydina FAYE', position: 'CSO', email: 'seydina.faye@pledgeandgrow.com', phone: '+33 7 84 32 31 72' }
              ].map((member, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="py-3 px-5 border-b border-gray-200">{member.name}</td>
                  <td className="py-3 px-5 border-b border-gray-200">{member.position}</td>
                  <td className="py-3 px-5 border-b border-gray-200">{member.email}</td>
                  <td className="py-3 px-5 border-b border-gray-200">{member.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
