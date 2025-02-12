import React from 'react';
import Image from 'next/image';

export default function SocialPlatforms({ platforms }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {platforms.map((plateforme, index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center mb-4">
            <Image 
              src={plateforme.logo} 
              alt={plateforme.nom} 
              width={50} 
              height={50} 
              className="mr-4"
            />
            <h3 className="text-xl font-bold">{plateforme.nom}</h3>
          </div>
          <p className="text-gray-600 mb-2">{plateforme.description}</p>
          <div className="space-y-2">
            <p><strong>Followers:</strong> {plateforme.followers}</p>
            <p><strong>Taux d'Engagement:</strong> {plateforme.engagement}%</p>
            <div>
              <strong>Types de Contenu:</strong>
              <ul className="list-disc list-inside text-sm">
                {plateforme.typeContenu.map((type, i) => (
                  <li key={i}>{type}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
