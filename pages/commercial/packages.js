import React, { useState } from 'react';
import Head from 'next/head';
import MegaMenu from '../../components/MegaMenu';

const Packages = () => {
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const packageData = [
        {
            name: 'Pack Basic📚',
            pricing: '€450',
            deliveryTime: '2 semaines',
            type: 'Idéal pour étudiants, freelances et indépendants ! ✅',
            specifications: 'Landing page',
            advantages: '🔹 Site professionnel 5 pages\n🔹 Mentions légales, CGV & conformité RGPD\n🔹 Optimisation SEO + blog intégré',
            bonuses: '3 mois offert de maintenance',
            technology: 'next.js, node.js, tailwind'
        },
        {
            name: 'Pack Business💼',
            pricing: '€950',
            deliveryTime: '1 mois',
            type: 'Idéal pour entrepreneurs, startups et petites entreprises ! ✅',
            specifications: 'Standard features',
            advantages: 'Site professionnel 5 pages\n Mentions légales, CGV & conformité RGPD\n Optimisation SEO + blog intégré',
            bonuses: '3 mois offert de maintenance',
            technology: 'next.js, node.js, tailwind, API'
        },
        {
            name: 'Pack Entreprise🏢',
            pricing: '€4000',
            deliveryTime: '2 mois',
            type: 'Idéal pour entreprises de taille moyenne ou grande ! ✅',
            specifications: 'All features',
            advantages: 'Site Fullstack (14 pages)\n Fonctionnalités avancées\n Conformité RGPD & politiques\n Back-office intuitif avec authentification sécurisée',
            bonuses: '3 mois offert de maintenance',
            technology: 'next.js, node.js, tailwind, API, database'
        },
        // Hebergements Section
        {
            name: 'Hebergement Starter',
            pricing: '€10/mois',
            features: '5 GB Storage, 1 Domain, 24/7 Support',
            advantages: 'Fiabilité et rapidité\n Sauvegardes automatiques',
        },
        {
            name: 'Hebergement Pro',
            pricing: '€30/mois',
            features: '10 GB Storage, 3 Domains, 24/7 Support',
            advantages: 'Performance optimale\n Support prioritaire',
        },
        {
            name: 'Hebergement Prestige',
            pricing: '€200/mois',
            features: '20 GB Storage, 10 Domains, 24/7 Support',
            advantages: 'Performance améliorée\n Sauvegardes quotidiennes\n Certificat SSL gratuit',
        },
        // Maintenance Section
        {
            name: 'Support Basique',
            pricing: '€100/mois',
            serviceDetails: 'Mises à jour régulières et support',
            advantages: 'Tranquillité d’esprit\n Assistance rapide',
        },
        {
            name: 'Support Premium',
            pricing: '€1500/mois',
            serviceDetails: 'Mises à jour, sauvegardes et support prioritaire',
            advantages: 'Protection complète\n Service client dédié',
        },
        {
            name: 'Support Prestige',
            pricing: '€4000/mois',
            serviceDetails: 'Mises à jour complètes, sauvegardes, et support prioritaire',
            advantages: 'Protection complète\n Équipe dédiée disponible 24/7',
        },
    ];

    const openModal = (pkg) => {
        setSelectedPackage(pkg);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPackage(null);
    };

    const renderCards = () => {
        return (
            <>
                {/* Promotion Section */}
                <h1 className="text-2xl font-bold mb-4">Promotion 2025</h1>
                <div className="grid md:grid-cols-3 gap-4">
                    {packageData.slice(0, 3).map((pkg, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold mb-2">{pkg.name}</h2>
                            <p className="text-md font-bold mb-2">{pkg.pricing}</p>
                            <button
                                onClick={() => openModal(pkg)}
                                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            >
                                Details
                            </button>
                        </div>
                    ))}
                </div>

                {/* Hebergements Section */}
                <h1 className="text-2xl font-bold mb-4 mt-8">Hebergements</h1>
                <div className="grid md:grid-cols-3 gap-4">
                    {packageData.slice(3, 6).map((pkg, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold mb-2">{pkg.name}</h2>
                            <p className="text-md font-bold mb-2">{pkg.pricing}</p>
                            <button
                                onClick={() => openModal(pkg)}
                                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            >
                                Details
                            </button>
                        </div>
                    ))}
                </div>

                {/* Maintenance Section */}
                <h1 className="text-2xl font-bold mb-4 mt-8">Maintenance</h1>
                <div className="grid md:grid-cols-3 gap-4">
                    {packageData.slice(6, 9).map((pkg, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold mb-2">{pkg.name}</h2>
                            <p className="text-md font-bold mb-2">{pkg.pricing}</p>
                            <button
                                onClick={() => openModal(pkg)}
                                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            >
                                Details
                            </button>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    const renderModal = () => {
        if (!selectedPackage) return null;

        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-4 text-blue-600">{selectedPackage.name}</h2>
                    {selectedPackage.pricing && <p className="font-semibold text-lg"><span className="font-bold">Pricing:</span> {selectedPackage.pricing}</p>}
                    {selectedPackage.deliveryTime && <p className="font-semibold text-lg"><span className="font-bold">Delivery Time:</span> {selectedPackage.deliveryTime}</p>}
                    {selectedPackage.type && <p className="font-semibold text-lg"><span className="font-bold">Type:</span> {selectedPackage.type}</p>}
                    {selectedPackage.specifications && <p className="font-semibold text-lg"><span className="font-bold">Specifications:</span> {selectedPackage.specifications}</p>}
                    {selectedPackage.advantages && (
                        <div>
                            <span className="font-bold">Advantages:</span>
                            <ul className="list-disc ml-5">
                                {selectedPackage.advantages.split('\n').map((advantage, index) => (
                                    <li key={index} className="ml-2">{advantage}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {selectedPackage.bonuses && <p className="font-semibold text-lg"><span className="font-bold">Bonuses:</span> {selectedPackage.bonuses}</p>}
                    {selectedPackage.technology && <p className="font-semibold text-lg"><span className="font-bold">Technology:</span> {selectedPackage.technology}</p>}
                    {selectedPackage.features && <p className="font-semibold text-lg"><span className="font-bold">Features:</span> {selectedPackage.features}</p>}
                    {selectedPackage.serviceDetails && <p className="font-semibold text-lg"><span className="font-bold">Service Details:</span> {selectedPackage.serviceDetails}</p>}
                    <button
                        onClick={closeModal}
                        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex flex-col ml-[32rem]">
            <Head>
                <title>Our Packages</title>
            </Head>
            <header className="bg-white shadow-md">
                <MegaMenu />
            </header>
            <main className="flex-grow p-8">
                <div className="container mx-auto p-4 pt-6">
                    {renderCards()}
                </div>
                {renderModal()}
            </main>
        </div>
    );
};

export default Packages;
