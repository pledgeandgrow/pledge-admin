import { useState } from 'react';

export default function MegaMenu() {
  const [contactSubMenuOpen, setContactSubMenuOpen] = useState(false);
  const [workspaceSubMenuOpen, setWorkspaceSubMenuOpen] = useState(false);
  const [comptabiliterSubMenuOpen, setComptabiliterSubMenuOpen] = useState(false);
  const [commercialSubMenuOpen, setCommercialSubMenuOpen] = useState(false);
  const [legalSubMenuOpen, setLegalSubMenuOpen] = useState(false);
  const [marketingSubMenuOpen, setMarketingSubMenuOpen] = useState(false);
  const [hrSubMenuOpen, setHrSubMenuOpen] = useState(false);
  const [informatiqueSubMenuOpen, setInformatiqueSubMenuOpen] = useState(false);
  const [operationsSubMenuOpen, setOperationsSubMenuOpen] = useState(false);
  const [developpementDurableSubMenuOpen, setDeveloppementDurableSubMenuOpen] = useState(false);
  const [communicationSubMenuOpen, setCommunicationSubMenuOpen] = useState(false);
  const [strategieSubMenuOpen, setStrategieSubMenuOpen] = useState(false);

  const closeAllSubMenus = () => {
    setContactSubMenuOpen(false);
    setWorkspaceSubMenuOpen(false);
    setComptabiliterSubMenuOpen(false);
    setCommercialSubMenuOpen(false);
    setLegalSubMenuOpen(false);
    setMarketingSubMenuOpen(false);
    setHrSubMenuOpen(false);
    setInformatiqueSubMenuOpen(false);
    setOperationsSubMenuOpen(false);
    setDeveloppementDurableSubMenuOpen(false);
    setCommunicationSubMenuOpen(false);
    setStrategieSubMenuOpen(false);
  };

  const toggleContactSubMenu = () => {
    closeAllSubMenus();
    setContactSubMenuOpen(!contactSubMenuOpen);
  };

  const toggleWorkspaceSubMenu = () => {
    closeAllSubMenus();
    setWorkspaceSubMenuOpen(!workspaceSubMenuOpen);
  };

  const toggleComptabiliterSubMenu = () => {
    closeAllSubMenus();
    setComptabiliterSubMenuOpen(!comptabiliterSubMenuOpen);
  };

  const toggleCommercialSubMenu = () => {
    closeAllSubMenus();
    setCommercialSubMenuOpen(!commercialSubMenuOpen);
  };

  const toggleLegalSubMenu = () => {
    closeAllSubMenus();
    setLegalSubMenuOpen(!legalSubMenuOpen);
  };

  const toggleMarketingSubMenu = () => {
    closeAllSubMenus();
    setMarketingSubMenuOpen(!marketingSubMenuOpen);
  };

  const toggleHrSubMenu = () => {
    closeAllSubMenus();
    setHrSubMenuOpen(!hrSubMenuOpen);
  };

  const toggleInformatiqueSubMenu = () => {
    closeAllSubMenus();
    setInformatiqueSubMenuOpen(!informatiqueSubMenuOpen);
  };

  const toggleOperationsSubMenu = () => {
    closeAllSubMenus();
    setOperationsSubMenuOpen(!operationsSubMenuOpen);
  };

  const toggleDeveloppementDurableSubMenu = () => {
    closeAllSubMenus();
    setDeveloppementDurableSubMenuOpen(!developpementDurableSubMenuOpen);
  };

  const toggleCommunicationSubMenu = () => {
    closeAllSubMenus();
    setCommunicationSubMenuOpen(!communicationSubMenuOpen);
  };

  const toggleStrategieSubMenu = () => {
    closeAllSubMenus();
    setStrategieSubMenuOpen(!strategieSubMenuOpen);
  };

  return (
    <aside className="fixed inset-y-0 left-0 bg-black text-white w-64 transform transition-transform duration-300 ease-in-out">
      <div className="p-4 h-full">
        <div className="flex flex-col items-center mb-4">
          <img src="/logo-white.png" alt="Company Logo" className="h-20 w-auto mb-2" />
          <span className="text-lg w-full text-left ml-8">Hello User</span>
        </div>
        <ul>
          <li>
            <a href="/dashboard" className="block py-2 px-4 hover:bg-gray-700">📊 Dashboard</a>
          </li>
          <li>
            <button onClick={toggleWorkspaceSubMenu} className="block py-2 px-4 hover:bg-gray-700">🏢 Workspace</button>
            {workspaceSubMenuOpen && (
              <ul className="absolute left-full top-0 bg-gray-200 w-48 h-full">
                <li><a href="/workspace/informations-generales" className="block py-2 px-4 text-black hover:bg-gray-300">📝 Information General</a></li>
                <li><a href="/workspace/organigrame" className="block py-2 px-4 text-black hover:bg-gray-300">📈 Organigrame</a></li>
                <li><a href="/workspace/task" className="block py-2 px-4 text-black hover:bg-gray-300">📝 Task</a></li>
                <li><a href="/workspace/roadmap-annuelle" className="block py-2 px-4 text-black hover:bg-gray-300">🗓️ Roadmap Annuel</a></li>
                <li><a href="/workspace/outil-et-logiciel" className="block py-2 px-4 text-black hover:bg-gray-300">💻 Outil & Logiciel</a></li>
                <li><a href="/workspace/one-drive" className="block py-2 px-4 text-black hover:bg-gray-300">📁 One drive (Workspace)</a></li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={toggleContactSubMenu} className="block py-2 px-4 hover:bg-gray-700">📞 Contact</button>
            {contactSubMenuOpen && (
              <ul className="absolute left-full top-0 bg-gray-200 w-48 h-full">
                <li><a href="/contact/board-members" className="block py-2 px-4 text-black hover:bg-gray-300">🤵 Board Members</a></li>
                <li><a href="/contact/members" className="block py-2 px-4 text-black hover:bg-gray-300">👥 Members</a></li>
                <li><a href="/contact/freelance" className="block py-2 px-4 text-black hover:bg-gray-300">🦸🏽‍♂️ Freelance</a></li>
                <li><a href="/contact/partenaire" className="block py-2 px-4 text-black hover:bg-gray-300">🤝 Partenaires</a></li>
                <li><a href="/contact/support" className="block py-2 px-4 text-black hover:bg-gray-300">💪 Support</a></li>
                <li><a href="/contact/reseau" className="block py-2 px-4 text-black hover:bg-gray-300">☁️ Réseau</a></li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={toggleComptabiliterSubMenu} className="block py-2 px-4 hover:bg-gray-700">📊 Comptabilité</button>
            {comptabiliterSubMenuOpen && (
              <ul className="absolute left-full top-0 bg-gray-200 w-48 h-full">
                <li><a href="/comptabilite/facturation" className="block py-2 px-4 text-black hover:bg-gray-300">💸 Facturation</a></li>
                <li><a href="/comptabilite/devis" className="block py-2 px-4 text-black hover:bg-gray-300">📜 Devis</a></li>
                <li><a href="/comptabilite/depenses" className="block py-2 px-4 text-black hover:bg-gray-300">💰 Dépenses</a></li>
                <li><a href="/comptabilite/recettes" className="block py-2 px-4 text-black hover:bg-gray-300">📈 Recettes</a></li>
                <li><a href="/comptabilite/gestion-fournisseurs" className="block py-2 px-4 text-black hover:bg-gray-300">👥 Fournisseurs</a></li>
                <li><a href="/comptabilite/comptes-bancaires" className="block py-2 px-4 text-black hover:bg-gray-300">🏦 Comptes bancaires</a></li>
                <li><a href="/comptabilite/ecritures-comptables" className="block py-2 px-4 text-black hover:bg-gray-300">📝 Écritures comptables</a></li>
                <li><a href="/comptabilite/tva-et-taxes" className="block py-2 px-4 text-black hover:bg-gray-300">💼 TVA & Taxes</a></li>
                <li><a href="/comptabilite/rapports-financiers" className="block py-2 px-4 text-black hover:bg-gray-300">📊 Rapports financiers</a></li>
                <li><a href="/comptabilite/salaires-paiements" className="block py-2 px-4 text-black hover:bg-gray-300">💵 Salaires & Paiements</a></li>
                <li><a href="/comptabilite/export-integration" className="block py-2 px-4 text-black hover:bg-gray-300">🔄 Export & Intégration</a></li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={toggleCommercialSubMenu} className="block py-2 px-4 hover:bg-gray-700">📈 Commercial</button>
            {commercialSubMenuOpen && (
              <ul className="absolute left-full top-0 bg-gray-200 w-48 h-full">
                <li><a href="/commercial/lead" className="block py-2 px-4 text-black hover:bg-gray-300">📈 Lead</a></li>
                <li><a href="/commercial/liste-d-attente" className="block py-2 px-4 text-black hover:bg-gray-300">🕒 Liste d'attente</a></li>
                <li><a href="/commercial/clients#" className="block py-2 px-4 text-black hover:bg-gray-300">🙎🏻‍♂️ Clients</a></li>
                <li><a href="/commercial/prestations" className="block py-2 px-4 text-black hover:bg-gray-300">⭐ Prestations</a></li>
                <li><a href="/commercial/autres-offres" className="block py-2 px-4 text-black hover:bg-gray-300">🎁 Autres offres</a></li>
                <li><a href="/commercial/formation" className="block py-2 px-4 text-black hover:bg-gray-300">📚 Formation</a></li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={toggleLegalSubMenu} className="block py-2 px-4 hover:bg-gray-700">📜 Legal</button>
            {legalSubMenuOpen && (
              <ul className="absolute left-full top-0 bg-gray-200 w-48 h-full">
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">📑 Contrats & Accords</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">📊 Conformité & Réglementation</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">🔒 Propriété Intellectuelle</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">⚖️ Gestion des Litiges</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">📜 Politiques Internes</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">📚 Documentation Légale</a></li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={toggleMarketingSubMenu} className="block py-2 px-4 hover:bg-gray-700">📈 Marketing</button>
            {marketingSubMenuOpen && (
              <ul className="absolute left-full top-0 bg-gray-200 w-48 h-full">
                <li><a href="/marketing/branding" className="block py-2 px-4 text-black hover:bg-gray-300">🎨 Branding</a></li>
                <li><a href="/marketing/publicite" className="block py-2 px-4 text-black hover:bg-gray-300">📢 Publicité</a></li>
                <li><a href="/marketing/reseaux-sociaux" className="block py-2 px-4 text-black hover:bg-gray-300">🌐 Réseaux Sociaux</a></li>
                <li><a href="/marketing/analyse-optimisation" className="block py-2 px-4 text-black hover:bg-gray-300">📊 Analyse & Optimisation</a></li>
                <li><a href="/marketing/expérience-client-fidelisation" className="block py-2 px-4 text-black hover:bg-gray-300">💡 Expérience Client & Fidélisation</a></li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={toggleHrSubMenu} className="block py-2 px-4 hover:bg-gray-700">🧑 Ressources Humaines</button>
            {hrSubMenuOpen && (
              <ul className="absolute left-full top-0 bg-gray-200 w-48 h-full">
                <li><a href="/ressources-humaines/recrutement" className="block py-2 px-4 text-black hover:bg-gray-300">🔍 Recrutement</a></li>
                <li><a href="/ressources-humaines/gestion-du-personnel" className="block py-2 px-4 text-black hover:bg-gray-300">👥 Gestion du Personnel</a></li>
                <li><a href="/ressources-humaines/performance-formation" className="block py-2 px-4 text-black hover:bg-gray-300">📈 Performance & Formation</a></li>
                <li><a href="/ressources-humaines/conformite-administration" className="block py-2 px-4 text-black hover:bg-gray-300">📋 Conformité & Administration</a></li>
                <li><a href="/ressources-humaines/culture-engagement" className="block py-2 px-4 text-black hover:bg-gray-300">🌟 Culture & Engagement</a></li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={toggleInformatiqueSubMenu} className="block py-2 px-4 hover:bg-gray-700">💻 Informatique</button>
            {informatiqueSubMenuOpen && (
              <ul className="absolute left-full top-0 bg-gray-200 w-48 h-full">
                <li><a href="/informatique/gestion-des-serveurs" className="block py-2 px-4 text-black hover:bg-gray-300">🖥️ Gestion des serveurs</a></li>
                <li><a href="/informatique/vpn-access-distant" className="block py-2 px-4 text-black hover:bg-gray-300">🔐 VPN & accès distant</a></li>
                <li><a href="/informatique/gestion-des-licences" className="block py-2 px-4 text-black hover:bg-gray-300">🔑 Gestion des licences</a></li>
                <li><a href="/informatique/outils-metiers-saas" className="block py-2 px-4 text-black hover:bg-gray-300">🛠️ Outils métiers & SaaS</a></li>
                <li><a href="/informatique/documentation" className="block py-2 px-4 text-black hover:bg-gray-300">📄 Documentation</a></li>
                <li><a href="/informatique/test-et-validation" className="block py-2 px-4 text-black hover:bg-gray-300">🧪 Test et validation</a></li>
                <li><a href="/informatique/cahier-des-charges" className="block py-2 px-4 text-black hover:bg-gray-300">📋 Cahier des charges</a></li>
                <li><a href="/informatique/projets-clients" className="block py-2 px-4 text-black hover:bg-gray-300">🖥️ Projets Clients</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">🔐 Sécurité & Conformité</a></li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={toggleOperationsSubMenu} className="block py-2 px-4 hover:bg-gray-700">⚙️ Opérations</button>
            {operationsSubMenuOpen && (
              <ul className="absolute left-full top-0 bg-gray-200 w-48 h-full">
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">📍 Gestion des Stocks</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">🚛 Temps de Livraison</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">🏢 Gestion des Societe</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">📦 Suivi des Missions</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">🔄 Gestion des Remboursements</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">💰 Coûts & Budgétisation</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">📜 Fournisseurs & Achats</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">📅 Planification & Prévisions</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">📡 Suivi en Temps Réel</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">📈 Optimisation des Processus</a></li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={toggleDeveloppementDurableSubMenu} className="block py-2 px-2 text-sm hover:bg-gray-700">🌍 Développement Durable</button>
            {developpementDurableSubMenuOpen && (
              <ul className="absolute left-full top-0 bg-gray-200 w-48 h-full">
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">🌱 Stratégie & Engagements</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">💡 Énergies & Ressources</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">♻️ Gestion des Déchets</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">🚀 Éco-conception</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">🏢 Infrastructures Durables</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">🚗 Mobilité Durable</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">🤝 Impact Social</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">📈 Mesure d’Impact</a></li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={toggleCommunicationSubMenu} className="block py-2 px-4 hover:bg-gray-700">📢 Communication</button>
            {communicationSubMenuOpen && (
              <ul className="absolute left-full top-0 bg-gray-200 w-48 h-full">
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">📰 Relations Publiques & Presse</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">📢 Stratégie de Communication</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">💻 Communication Digitale</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">📩 Communication Interne</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">📆 Événements & Webinaires</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">🎤 Médias & Contenus</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">🤝 Partenariats & Influenceurs</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">🔎 Veille & E-réputation</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">📈 Rapports & Analyse</a></li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={toggleStrategieSubMenu} className="block py-2 px-4 hover:bg-gray-700">📈 Strategie</button>
            {strategieSubMenuOpen && (
              <ul className="absolute left-full top-0 bg-gray-200 w-48 h-full">
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">🚀 Vision & Objectifs</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">📈 Business Intelligence</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">🏆 Avantage Concurrentiel</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">📍 Expansion International</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">💰 Stratégie Financière</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">🔄 Transformation Digitale</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">🎯 Alignement Interdépartemental</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">📦 Innovation & Product Research</a></li>
              </ul>
            )}
          </li>
        </ul>
        <div className="absolute bottom-0 w-full bg-black">
          <a href="/dashboard" className="text-white mb-4 block">Pledge Portal 2025</a>
        </div>
      </div>
    </aside>
  );
}
