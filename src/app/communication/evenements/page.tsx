'use client';
import { type NextPage } from 'next';
import { useState } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { jsPDF } from 'jspdf';

interface Evenement {
  id: string;
  titre: string;
  type: 'Conférence' | 'Séminaire' | 'Webinaire' | 'Salon' | 'Soirée' | 'Formation';
  date: string;
  heure: string;
  lieu: string;
  capacite: number;
  inscrits: number;
  description: string;
  statut: 'À venir' | 'En cours' | 'Terminé' | 'Annulé';
  budget: {
    prévu: number;
    actuel: number;
    devise: string;
  };
  intervenants: Array<{ nom: string; role: string; entreprise: string }>;
  sponsors?: Array<{ nom: string; niveau: 'Or' | 'Argent' | 'Bronze'; logo: string }>;
}

const EvenementsPage: NextPage = () => {
  const [evenements, setEvenements] = useState<Evenement[]>([
    {
      id: '1',
      titre: 'Tech Summit 2025',
      type: 'Conférence',
      date: '2025-06-15',
      heure: '09:00',
      lieu: 'Palais des Congrès',
      capacite: 500,
      inscrits: 350,
      description: "Le plus grand événement tech de l'année",
      statut: 'À venir',
      budget: {
        prévu: 50000,
        actuel: 45000,
        devise: 'EUR',
      },
      intervenants: [
        { nom: 'Marie Dubois', role: 'Keynote Speaker', entreprise: 'TechCorp' },
        { nom: 'Jean Martin', role: 'Expert IA', entreprise: 'AI Solutions' },
      ],
      sponsors: [
        { nom: 'TechCorp', niveau: 'Or', logo: '/sponsors/techcorp.png' },
        { nom: 'InnovSoft', niveau: 'Argent', logo: '/sponsors/innovsoft.png' },
      ],
    },
  ]);

  const [nouvelEvenement, setNouvelEvenement] = useState<Omit<Evenement, 'id'>>({
    titre: '',
    type: 'Conférence',
    date: '',
    heure: '',
    lieu: '',
    capacite: 0,
    inscrits: 0,
    description: '',
    statut: 'À venir',
    budget: {
      prevu: 0,
      actuel: 0,
      devise: 'EUR',
    },
    intervenants: [],
  });

  const handleAddEvenement = () => {
    const newEvenement: Evenement = {
      ...nouvelEvenement,
      id: Math.random().toString(36).substr(2, 9),
    };
    setEvenements([...evenements, newEvenement]);
    setNouvelEvenement({
      titre: '',
      type: 'Conférence',
      date: '',
      heure: '',
      lieu: '',
      capacite: 0,
      inscrits: 0,
      description: '',
      statut: 'À venir',
      budget: {
        prevu: 0,
        actuel: 0,
        devise: 'EUR',
      },
      intervenants: [],
    });
  };

  // Fonction pour exporter en PDF
  const exportToPDF = (evenement: Evenement) => {
    const doc = new jsPDF();

    // Titre de l'événement
    doc.setFontSize(18);
    doc.text(`Événement: ${evenement.titre}`, 10, 10);

    // Informations principales
    doc.setFontSize(12);
    doc.text(`Type: ${evenement.type}`, 10, 20);
    doc.text(`Date: ${new Date(evenement.date).toLocaleDateString()} à ${evenement.heure}`, 10, 30);
    doc.text(`Lieu: ${evenement.lieu}`, 10, 40);
    doc.text(`Capacité: ${evenement.capacite}`, 10, 50);
    doc.text(`Inscrits: ${evenement.inscrits}`, 10, 60);
    doc.text(`Statut: ${evenement.statut}`, 10, 70);
    doc.text(`Description: ${evenement.description}`, 10, 80);

    // Budget
    doc.text(`Budget prévu: ${evenement.budget.prevu} ${evenement.budget.devise}`, 10, 90);
    doc.text(`Budget actuel: ${evenement.budget.actuel} ${evenement.budget.devise}`, 10, 100);

    // Intervenants
    doc.text(`Intervenants:`, 10, 110);
    let yPosition = 120;
    evenement.intervenants.forEach((intervenant) => {
      doc.text(`- ${intervenant.nom}, ${intervenant.role} chez ${intervenant.entreprise}`, 10, yPosition);
      yPosition += 10;
    });

    // Sponsors
    if (evenement.sponsors) {
      doc.text(`Sponsors:`, 10, yPosition);
      yPosition += 10;
      evenement.sponsors.forEach((sponsor) => {
        doc.text(`- ${sponsor.nom}, Niveau: ${sponsor.niveau}`, 10, yPosition);
        yPosition += 10;
      });
    }

    // Génération du PDF
    doc.save(`${evenement.titre}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Événements</h1>

          {/* Formulaire nouvel événement */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Nouvel Événement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Titre"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvenement.titre}
                onChange={(e) => setNouvelEvenement({ ...nouvelEvenement, titre: e.target.value })}
              />
              <select
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvenement.type}
                onChange={(e) => setNouvelEvenement({ ...nouvelEvenement, type: e.target.value as Evenement['type'] })}
              >
                <option value="Conférence">Conférence</option>
                <option value="Séminaire">Séminaire</option>
                <option value="Webinaire">Webinaire</option>
                <option value="Salon">Salon</option>
                <option value="Soirée">Soirée</option>
                <option value="Formation">Formation</option>
              </select>
              <input
                type="date"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvenement.date}
                onChange={(e) => setNouvelEvenement({ ...nouvelEvenement, date: e.target.value })}
              />
              <input
                type="time"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvenement.heure}
                onChange={(e) => setNouvelEvenement({ ...nouvelEvenement, heure: e.target.value })}
              />
              <input
                type="text"
                placeholder="Lieu"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvenement.lieu}
                onChange={(e) => setNouvelEvenement({ ...nouvelEvenement, lieu: e.target.value })}
              />
              <input
                type="number"
                placeholder="Capacité"
                className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvenement.capacite || ''}
                onChange={(e) => setNouvelEvenement({ ...nouvelEvenement, capacite: parseInt(e.target.value) || 0 })}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Budget prévu"
                  className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={nouvelEvenement.budget.prevu || ''}
                  onChange={(e) =>
                    setNouvelEvenement({
                      ...nouvelEvenement,
                      budget: { ...nouvelEvenement.budget, prevu: parseInt(e.target.value) || 0 },
                    })
                  }
                />
                <select
                  className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={nouvelEvenement.budget.devise}
                  onChange={(e) =>
                    setNouvelEvenement({
                      ...nouvelEvenement,
                      budget: { ...nouvelEvenement.budget, devise: e.target.value },
                    })
                  }
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <textarea
                placeholder="Description"
                className="border p-2 rounded w-full h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={nouvelEvenement.description}
                onChange={(e) => setNouvelEvenement({ ...nouvelEvenement, description: e.target.value })}
              />
            </div>
            <button
              onClick={handleAddEvenement}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Créer l'événement
            </button>
          </div>

          {/* Liste des événements */}
          <div className="grid grid-cols-1 gap-6">
            {evenements.map((evenement) => (
              <div key={evenement.id} className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">{evenement.titre}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {evenement.type} • {new Date(evenement.date).toLocaleDateString()} à {evenement.heure}
                    </p>
                  </div>
                  <button
                    onClick={() => exportToPDF(evenement)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    Exporter en PDF
                  </button>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{evenement.description}</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Lieu: {evenement.lieu} | Capacité: {evenement.capacite} | Inscrits: {evenement.inscrits}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvenementsPage;
