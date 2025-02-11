import React, { useState } from 'react';
import MegaMenu from '../../components/MegaMenu';
import Image from 'next/image';

export default function Branding() {
  const [activeSection, setActiveSection] = useState('overview');

  const brandingData = {
    logo: {
      primary: '/images/branding/logo-primary.svg',
      secondary: '/images/branding/logo-secondary.svg',
      white: '/images/branding/logo-white.svg'
    },
    colors: {
      primary: '#0066CC',
      secondary: '#00A86B',
      accent: '#FF6B6B',
      background: '#F4F4F4',
      text: '#333333'
    },
    typography: {
      headlineFont: 'Montserrat',
      bodyFont: 'Open Sans',
      fontSizes: {
        h1: '2.5rem',
        h2: '2rem',
        h3: '1.75rem',
        body: '1rem'
      }
    },
    businessCards: [
      { 
        type: 'Standard', 
        dimensions: '85 x 55 mm', 
        paper: 'Papier mat 350g',
        image: '/images/branding/business-card-front.jpg'
      }
    ],
    banners: [
      { 
        type: 'Web Banner', 
        dimensions: '1200 x 300 px', 
        image: '/images/branding/web-banner.jpg'
      },
      { 
        type: 'Social Media Banner', 
        dimensions: '1500 x 500 px', 
        image: '/images/branding/social-banner.jpg'
      }
    ],
    emailSignature: {
      template: '/images/branding/email-signature.jpg',
      components: [
        'Nom complet',
        'Titre du poste',
        'Coordonnées',
        'Logo de l\'entreprise'
      ]
    },
    plaquette: {
      type: 'Brochure d\'entreprise',
      pages: 8,
      format: 'A4',
      image: '/images/branding/corporate-brochure.jpg'
    }
  };

  const sections = {
    overview: {
      title: 'Vue d\'ensemble du Branding',
      content: (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Identité Visuelle</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(brandingData.logo).map(([variant, src]) => (
                <div key={variant} className="text-center">
                  <h3 className="font-semibold capitalize mb-2">{variant} Logo</h3>
                  <div className="bg-gray-100 p-4 rounded-lg flex justify-center items-center">
                    <Image 
                      src={src} 
                      alt={`${variant} logo`} 
                      width={200} 
                      height={100} 
                      className="max-h-24 object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Palette de Couleurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {Object.entries(brandingData.colors).map(([name, color]) => (
                <div key={name} className="text-center">
                  <div 
                    className="w-full h-24 rounded-lg shadow-md"
                    style={{ backgroundColor: color }}
                  />
                  <p className="mt-2 font-semibold capitalize">{name}</p>
                  <p className="text-sm">{color}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Typographie</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold">Polices</h3>
                <p>Titre: {brandingData.typography.headlineFont}</p>
                <p>Corps: {brandingData.typography.bodyFont}</p>
              </div>
              <div>
                <h3 className="font-bold">Tailles de Police</h3>
                {Object.entries(brandingData.typography.fontSizes).map(([type, size]) => (
                  <p key={type}>{type}: {size}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    materials: {
      title: 'Supports de Communication',
      content: (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Cartes de Visite</h2>
            {brandingData.businessCards.map((card, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Image 
                  src={card.image} 
                  alt="Business Card" 
                  width={300} 
                  height={200} 
                  className="rounded-lg"
                />
                <div>
                  <p><strong>Type:</strong> {card.type}</p>
                  <p><strong>Dimensions:</strong> {card.dimensions}</p>
                  <p><strong>Papier:</strong> {card.paper}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Bannières</h2>
            {brandingData.banners.map((banner, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold mb-2">{banner.type}</h3>
                <Image 
                  src={banner.image} 
                  alt={banner.type} 
                  width={1200} 
                  height={300} 
                  className="rounded-lg"
                />
                <p className="mt-2"><strong>Dimensions:</strong> {banner.dimensions}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    digitalAssets: {
      title: 'Actifs Numériques',
      content: (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Signature Email</h2>
            <div className="flex items-center space-x-4">
              <Image 
                src={brandingData.emailSignature.template} 
                alt="Email Signature" 
                width={600} 
                height={200} 
                className="rounded-lg"
              />
              <div>
                <h3 className="font-semibold">Composants</h3>
                <ul className="list-disc list-inside">
                  {brandingData.emailSignature.components.map((component, index) => (
                    <li key={index}>{component}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Plaquette Entreprise</h2>
            <div className="flex items-center space-x-4">
              <Image 
                src={brandingData.plaquette.image} 
                alt="Corporate Brochure" 
                width={400} 
                height={300} 
                className="rounded-lg"
              />
              <div>
                <p><strong>Type:</strong> {brandingData.plaquette.type}</p>
                <p><strong>Nombre de Pages:</strong> {brandingData.plaquette.pages}</p>
                <p><strong>Format:</strong> {brandingData.plaquette.format}</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Charte Graphique & Branding</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
