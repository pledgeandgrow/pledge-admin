import React from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function Prestations() {
  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-2xl font-bold mb-4">Prestations</h1>
        <div className="bg-white p-4 rounded shadow">
          <p>This page is dedicated to prestations.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🌐', title: 'Site web', price: '$500 - $5,000' },
            { icon: '📱', title: 'Application mobile', price: '$1,000 - $10,000' },
            { icon: '💻', title: 'Saas / logiciel', price: '$2,000 - $20,000' },
            { icon: '🎮', title: 'Jeux video', price: '$10,000 - $100,000' },
            { icon: '🛒', title: 'E-commerce', price: '$1,000 - $15,000' },
            { icon: '⛓️', title: 'Blockchain', price: '$5,000 - $50,000' },
            { icon: '🤖', title: 'IA / Automatisation', price: '$3,000 - $30,000' },
            { icon: '🔒', title: 'Cybersecurite', price: '$1,500 - $15,000' },
            { icon: '📄', title: 'Documentation', price: '$500 - $3,000' },
            { icon: '🎨', title: 'UX / IX Design', price: '$1,000 - $10,000' },
            { icon: '🔍', title: 'Referencement', price: '$500 - $5,000' },
            { icon: '🔧', title: 'Maintenance', price: '$200 - $2,000' }
          ].map((service, index) => (
            <div key={index} className="bg-white p-4 rounded shadow flex flex-col items-center">
              <div className="text-4xl mb-2">{service.icon}</div>
              <h2 className="text-xl font-semibold">{service.title}</h2>
              <p className="text-gray-500">Price Range: {service.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
