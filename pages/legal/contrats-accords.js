import React, { useState } from 'react';
import Head from 'next/head';
import MegaMenu from '../../components/MegaMenu';

export default function ContratsAccords() {
  const [selectedContract, setSelectedContract] = useState(null);
  const [fileName, setFileName] = useState('');

  const contrats = [
    {
      id: 1,
      titre: 'Contrat A',
      description: 'Description of Contrat A',
      pdf: '/path/to/contrat-a.pdf',
      type: 'Type A',
      destinataire: 'Destinataire A',
      status: 'En cours',
      dateEmission: '2022-01-01',
    },
    {
      id: 2,
      titre: 'Contrat B',
      description: 'Description of Contrat B',
      pdf: '/path/to/contrat-b.pdf',
      type: 'Type B',
      destinataire: 'Destinataire B',
      status: 'Terminé',
      dateEmission: '2022-02-01',
    },
    // Add more contracts as needed
  ];

  const handleContractSelect = (contrat) => {
    setSelectedContract(contrat);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFileName(file.name);
    } else {
      setFileName(''); // Reset the file name if the file is not a PDF
      alert('Please upload a valid PDF file.');
    }
  };

  return (
    <div className="flex">
      <MegaMenu />
      <main className="flex-grow p-8 ml-[32rem]">
        <Head>
          <title>Contrats & Accords | Legal</title>
          <meta name="description" content="Liste des contrats et accords" />
        </Head>

        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Contrats & Accords</h1>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contrats.map((contrat) => (
              <div 
                key={contrat.id} 
                className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-xl transition-all"
                onClick={() => handleContractSelect(contrat)}
              >
                <h2 className="text-xl font-semibold mb-2">{contrat.titre}</h2>
                <p className="text-gray-600 mb-4">{contrat.description}</p>
              </div>
            ))}
          </div>

          {selectedContract && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-3/4 flex">
                <iframe src={selectedContract.pdf} className="w-2/3 h-full border rounded" />
                <div className="ml-4 flex flex-col justify-between w-1/3">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">{selectedContract.titre}</h2>
                    <div className="mt-4 space-y-2">
                      <p className="text-lg"><strong>Type de contrats :</strong> {selectedContract.type || 'N/A'}</p>
                      <p className="text-lg"><strong>Destinataire :</strong> {selectedContract.destinataire || 'N/A'}</p>
                      <p className="text-lg"><strong>Status :</strong> {selectedContract.status || 'N/A'}</p>
                      <p className="text-lg"><strong>Date d'émission :</strong> {selectedContract.dateEmission || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-lg"><strong>Imported File:</strong> {fileName || 'No file imported'}</p>
                    <input type="file" className="mt-2 border border-gray-300 rounded p-2 w-full" onChange={handleFileChange} />
                  </div>
                </div>
                <button onClick={() => setSelectedContract(null)} className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Close</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
