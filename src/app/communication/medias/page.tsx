'use client';

import { type NextPage } from 'next';
import { useState } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';

interface Contact {
  id: string;
  nom: string;
  media: string;
  type: 'Journal' | 'Magazine' | 'TV' | 'Radio' | 'Web';
  role: string;
  email: string;
  telephone: string;
  specialites: string[];
  derniereInteraction: string;
  statut: 'Actif' | 'En pause' | 'Inactif';
  notes: string;
  historique: Array<{
    date: string;
    type: 'Appel' | 'Email' | 'Rencontre' | 'Interview';
    description: string;
    resultat?: string;
  }>;
}

const MediasPage: NextPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      nom: 'Pierre Durand',
      media: 'TechNews France',
      type: 'Web',
      role: 'Journaliste Tech',
      email: 'p.durand@technews.fr',
      telephone: '+33 1 23 45 67 89',
      specialites: ['Intelligence Artificielle', 'Startups', 'Innovation'],
      derniereInteraction: '2025-02-15',
      statut: 'Actif',
      notes: 'Très réactif, préfère les contacts par email',
      historique: [
        {
          date: '2025-02-15',
          type: 'Interview',
          description: 'Interview sur notre nouvelle solution IA',
          resultat: 'Article publié le 18/02'
        }
      ]
    }
  ]);

  const [nouveauContact, setNouveauContact] = useState<Omit<Contact, 'id' | 'historique'>>({
    nom: '',
    media: '',
    type: 'Web',
    role: '',
    email: '',
    telephone: '',
    specialites: [],
    derniereInteraction: new Date().toISOString().split('T')[0],
    statut: 'Actif',
    notes: ''
  });

  const [nouvelleInteraction, setNouvelleInteraction] = useState({
    contactId: '',
    type: 'Email' as Contact['historique'][0]['type'],
    description: '',
    resultat: ''
  });

  const handleAddContact = () => {
    const newContact: Contact = {
      ...nouveauContact,
      id: Math.random().toString(36).substr(2, 9),
      historique: []
    };
    setContacts([...contacts, newContact]);
    setNouveauContact({
      nom: '',
      media: '',
      type: 'Web',
      role: '',
      email: '',
      telephone: '',
      specialites: [],
      derniereInteraction: new Date().toISOString().split('T')[0],
      statut: 'Actif',
      notes: ''
    });
  };

  const handleAddInteraction = () => {
    const updatedContacts = contacts.map(contact => {
      if (contact.id === nouvelleInteraction.contactId) {
        return {
          ...contact,
          historique: [
            {
              date: new Date().toISOString().split('T')[0],
              type: nouvelleInteraction.type,
              description: nouvelleInteraction.description,
              resultat: nouvelleInteraction.resultat
            },
            ...contact.historique
          ],
          derniereInteraction: new Date().toISOString().split('T')[0]
        };
      }
      return contact;
    });
    setContacts(updatedContacts);
    setNouvelleInteraction({
      contactId: '',
      type: 'Email',
      description: '',
      resultat: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Relations Médias</h1>
          
          {/* Formulaire nouveau contact */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Nouveau Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauContact.nom}
                onChange={(e) => setNouveauContact({...nouveauContact, nom: e.target.value})}
              />
              <input
                type="text"
                placeholder="Média"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauContact.media}
                onChange={(e) => setNouveauContact({...nouveauContact, media: e.target.value})}
              />
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauContact.type}
                onChange={(e) => setNouveauContact({...nouveauContact, type: e.target.value as Contact['type']})}
              >
                <option value="Web">Web</option>
                <option value="Journal">Journal</option>
                <option value="Magazine">Magazine</option>
                <option value="TV">TV</option>
                <option value="Radio">Radio</option>
              </select>
              <input
                type="text"
                placeholder="Rôle"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauContact.role}
                onChange={(e) => setNouveauContact({...nouveauContact, role: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauContact.email}
                onChange={(e) => setNouveauContact({...nouveauContact, email: e.target.value})}
              />
              <input
                type="tel"
                placeholder="Téléphone"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauContact.telephone}
                onChange={(e) => setNouveauContact({...nouveauContact, telephone: e.target.value})}
              />
              <input
                type="text"
                placeholder="Spécialités (séparées par des virgules)"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauContact.specialites.join(', ')}
                onChange={(e) => setNouveauContact({
                  ...nouveauContact,
                  specialites: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                })}
              />
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauContact.statut}
                onChange={(e) => setNouveauContact({...nouveauContact, statut: e.target.value as Contact['statut']})}
              >
                <option value="Actif">Actif</option>
                <option value="En pause">En pause</option>
                <option value="Inactif">Inactif</option>
              </select>
            </div>
            <div className="mt-4">
              <textarea
                placeholder="Notes"
                className="border p-2 rounded w-full h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouveauContact.notes}
                onChange={(e) => setNouveauContact({...nouveauContact, notes: e.target.value})}
              />
            </div>
            <button
              onClick={handleAddContact}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Ajouter le contact
            </button>
          </div>

          {/* Formulaire nouvelle interaction */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Nouvelle Interaction</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleInteraction.contactId}
                onChange={(e) => setNouvelleInteraction({...nouvelleInteraction, contactId: e.target.value})}
              >
                <option value="">Sélectionner un contact</option>
                {contacts.map(contact => (
                  <option key={contact.id} value={contact.id}>
                    {contact.nom} - {contact.media}
                  </option>
                ))}
              </select>
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleInteraction.type}
                onChange={(e) => setNouvelleInteraction({...nouvelleInteraction, type: e.target.value as Contact['historique'][0]['type']})}
              >
                <option value="Email">Email</option>
                <option value="Appel">Appel</option>
                <option value="Rencontre">Rencontre</option>
                <option value="Interview">Interview</option>
              </select>
              <input
                type="text"
                placeholder="Description"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleInteraction.description}
                onChange={(e) => setNouvelleInteraction({...nouvelleInteraction, description: e.target.value})}
              />
              <input
                type="text"
                placeholder="Résultat"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelleInteraction.resultat}
                onChange={(e) => setNouvelleInteraction({...nouvelleInteraction, resultat: e.target.value})}
              />
            </div>
            <button
              onClick={handleAddInteraction}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              disabled={!nouvelleInteraction.contactId}
            >
              Ajouter l&apos;interaction
            </button>
          </div>

          {/* Liste des contacts */}
          <div className="grid grid-cols-1 gap-6">
            {contacts.map((contact) => (
              <div key={contact.id} className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">{contact.nom}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {contact.media} • {contact.type} • {contact.role}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    contact.statut === 'Actif' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    contact.statut === 'En pause' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {contact.statut}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="dark:text-white">{contact.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Téléphone</p>
                    <p className="dark:text-white">{contact.telephone}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Spécialités</p>
                  <div className="flex flex-wrap gap-2">
                    {contact.specialites.map((specialite, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded dark:bg-gray-700 dark:text-gray-300"
                      >
                        {specialite}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Notes</p>
                  <p className="dark:text-white">{contact.notes}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 dark:text-white">Historique des interactions</h4>
                  <div className="space-y-3">
                    {contact.historique.map((interaction, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg dark:bg-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium dark:text-white">
                              {interaction.type}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(interaction.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-700 dark:text-gray-300">{interaction.description}</p>
                        {interaction.resultat && (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Résultat: {interaction.resultat}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediasPage;
