import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import MegaMenu from '../../components/MegaMenu';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor } from 'slate';

export default function PolitiquesInternes() {
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);

  const politiques = [
    {
      id: 1,
      titre: 'Politique de Confidentialité',
      description: 'Nous nous engageons à protéger la confidentialité de nos employés et clients.',
    },
    {
      id: 2,
      titre: 'Politique de Sécurité',
      description: 'La sécurité de nos données et de nos systèmes est une priorité.',
    },
    {
      id: 3,
      titre: 'Politique de Conformité',
      description: 'Nous respectons toutes les lois et réglementations applicables.',
    },
  ];

  const handlePolicySelect = (policy) => {
    setSelectedPolicy(policy);
    setValue([
      {
        type: 'paragraph',
        children: [{ text: policy.description || '' }],
      },
    ]);
  };

  return (
    <div className="flex">
      <MegaMenu />
      <main className="flex-grow p-8 ml-[32rem]">
        <Head>
          <title>Politiques Internes | Legal</title>
          <meta name="description" content="Liste des politiques internes" />
        </Head>

        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Politiques Internes</h1>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {politiques.map((policy) => (
              <div 
                key={policy.id} 
                className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-xl transition-all"
                onClick={() => handlePolicySelect(policy)}
              >
                <h2 className="text-xl font-semibold mb-2">{policy.titre}</h2>
                <p className="text-gray-600 mb-4">{policy.description}</p>
              </div>
            ))}
          </div>

          {selectedPolicy && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-3/4 flex">
                <div className="w-2/3 p-4 border border-gray-300 rounded-lg h-full">
                  <h2 className="text-2xl font-semibold mb-4">{selectedPolicy.titre}</h2>
                  <div className="text-lg">
                    <Slate editor={editor} value={value} onChange={setValue}>
                      <Editable />
                    </Slate>
                  </div>
                </div>
                <div className="w-1/3 p-4">
                  <h2 className="text-xl font-semibold mb-4">Edit Policy</h2>
                  <button onClick={() => setSelectedPolicy(null)} className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Close</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
