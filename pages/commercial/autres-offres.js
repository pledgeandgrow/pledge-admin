import React from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function AutresOffres() {
  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-2xl font-bold mb-4">Autres Offres</h1>
        <div className="bg-white p-4 rounded shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Adhesion',
                price: '287€/an',
                description: 'Une offre idéale pour les petites structures qui ont besoin d’un support occasionnel, avec des interventions à la demande.',
                features: [
                  'Support occasionnel',
                  'Interventions à la demande',
                  'Accès aux ressources en ligne',
                  'Conseils personnalisés'
                ]
              },
              {
                title: 'Prestige',
                price: '4789€/an',
                description: 'Une solution complète qui inclut un support prioritaire, des interventions illimitées, et une gestion avancée de vos infrastructures.',
                features: [
                  'Support prioritaire',
                  'Interventions illimitées',
                  'Gestion avancée des infrastructures',
                  'Rapports détaillés'
                ]
              }
            ].map((offer, index) => (
              <div key={index} className="bg-white p-4 rounded shadow flex flex-col">
                <h2 className="text-xl font-semibold mb-2">{offer.title}</h2>
                <p className="text-gray-500 mb-2">{offer.price}</p>
                <p className="text-gray-700 mb-4">{offer.description}</p>
                <ul className="list-disc pl-5">
                  {offer.features.map((feature, i) => (
                    <li key={i} className="text-gray-600">{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
