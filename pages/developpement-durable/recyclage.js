import React from 'react';
import MegaMenu from '../../components/MegaMenu';

const Recyclage = () => {
    return (
        <div>
            <MegaMenu />
            <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-4">Gestion des Déchets</h1>
                <p className="text-lg text-gray-700">Content for the waste management page.</p>
            </div>
        </div>
    );
};

export default Recyclage;
