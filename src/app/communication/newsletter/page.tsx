'use client';

import { useState } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';

interface Newsletter {
  id: string;
  titre: string;
  contenu: string;
  date: string;
}

export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');

  const publierNewsletter = () => {
    if (!titre || !contenu) return;

    const nouvelleNewsletter: Newsletter = {
      id: crypto.randomUUID(),
      titre,
      contenu,
      date: new Date().toLocaleDateString(),
    };

    setNewsletters([nouvelleNewsletter, ...newsletters]);
    setTitre('');
    setContenu('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Rédiger une newsletter</h1>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
            <input
              type="text"
              placeholder="Titre de la newsletter"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="w-full mb-4 p-2 rounded border dark:bg-gray-700 dark:text-white"
            />
            <textarea
              placeholder="Contenu de la newsletter..."
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              className="w-full h-40 p-2 rounded border dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={publierNewsletter}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Publier
            </button>
          </div>

          {newsletters.length > 0 ? (
            newsletters.map((nl) => (
              <div key={nl.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
                <h2 className="text-xl font-semibold dark:text-white">{nl.titre}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{nl.date}</p>
                <p className="mt-2 dark:text-gray-300 whitespace-pre-wrap">{nl.contenu}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Aucune newsletter publiée pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
