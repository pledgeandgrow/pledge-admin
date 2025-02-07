import React from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function Freelance() {
  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-2xl font-bold mb-4">Freelance</h1>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Freelance List</h2>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Name</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Specialty</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Email</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Contact</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Zakaria', specialty: 'Web Fullstack Development', skills: 'next.js, node.js, backend', contact: '+123 456 7891' },
                { name: 'Ali', specialty: 'Web Front end Developement', skills: 'next.js, node.js, tailwind', contact: '+123 456 7892' },
                { name: 'Omar', specialty: 'Content Writing', skills: 'next.js, node.js, tailwind', contact: '+123 456 7893' },
                { name: 'Diana ', specialty: 'SEO Specialist', skills: 'next.js, node.js, tailwind', contact: '+123 456 7894' },
                { name: 'Ethan ', specialty: 'Digital Marketing', skills: 'next.js, node.js, tailwind', contact: '+123 456 7895' }
              ].map((freelancer, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="py-3 px-5 border-b border-gray-200">{freelancer.name}</td>
                  <td className="py-3 px-5 border-b border-gray-200">{freelancer.specialty}</td>
                  <td className="py-3 px-5 border-b border-gray-200">{freelancer.skills}</td>
                  <td className="py-3 px-5 border-b border-gray-200">{freelancer.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
