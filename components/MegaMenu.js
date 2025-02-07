import { useState } from 'react';

export default function MegaMenu() {
  const [contactSubMenuOpen, setContactSubMenuOpen] = useState(false);
  const [legalSubMenuOpen, setLegalSubMenuOpen] = useState(false);
  const [marketingSubMenuOpen, setMarketingSubMenuOpen] = useState(false);
  const [hrSubMenuOpen, setHrSubMenuOpen] = useState(false);
  const [workspaceSubMenuOpen, setWorkspaceSubMenuOpen] = useState(false);
  const [commercialSubMenuOpen, setCommercialSubMenuOpen] = useState(false);
  const [informatiqueSubMenuOpen, setInformatiqueSubMenuOpen] = useState(false);

  const toggleContactSubMenu = () => {
    console.log('Contact menu toggled. Current state:', contactSubMenuOpen);
    setContactSubMenuOpen(!contactSubMenuOpen);
    if (legalSubMenuOpen) setLegalSubMenuOpen(false);
    if (marketingSubMenuOpen) setMarketingSubMenuOpen(false);
    if (hrSubMenuOpen) setHrSubMenuOpen(false);
    if (workspaceSubMenuOpen) setWorkspaceSubMenuOpen(false);
    if (commercialSubMenuOpen) setCommercialSubMenuOpen(false);
    if (informatiqueSubMenuOpen) setInformatiqueSubMenuOpen(false);
  };

  const toggleLegalSubMenu = () => {
    setLegalSubMenuOpen(!legalSubMenuOpen);
    if (contactSubMenuOpen) setContactSubMenuOpen(false);
    if (marketingSubMenuOpen) setMarketingSubMenuOpen(false);
    if (hrSubMenuOpen) setHrSubMenuOpen(false);
    if (workspaceSubMenuOpen) setWorkspaceSubMenuOpen(false);
    if (commercialSubMenuOpen) setCommercialSubMenuOpen(false);
    if (informatiqueSubMenuOpen) setInformatiqueSubMenuOpen(false);
  };

  const toggleMarketingSubMenu = () => {
    setMarketingSubMenuOpen(!marketingSubMenuOpen);
    if (contactSubMenuOpen) setContactSubMenuOpen(false);
    if (legalSubMenuOpen) setLegalSubMenuOpen(false);
    if (hrSubMenuOpen) setHrSubMenuOpen(false);
    if (workspaceSubMenuOpen) setWorkspaceSubMenuOpen(false);
    if (commercialSubMenuOpen) setCommercialSubMenuOpen(false);
    if (informatiqueSubMenuOpen) setInformatiqueSubMenuOpen(false);
  };

  const toggleHrSubMenu = () => {
    setHrSubMenuOpen(!hrSubMenuOpen);
    if (contactSubMenuOpen) setContactSubMenuOpen(false);
    if (legalSubMenuOpen) setLegalSubMenuOpen(false);
    if (marketingSubMenuOpen) setMarketingSubMenuOpen(false);
    if (workspaceSubMenuOpen) setWorkspaceSubMenuOpen(false);
    if (commercialSubMenuOpen) setCommercialSubMenuOpen(false);
    if (informatiqueSubMenuOpen) setInformatiqueSubMenuOpen(false);
  };

  const toggleWorkspaceSubMenu = () => {
    setWorkspaceSubMenuOpen(!workspaceSubMenuOpen);
    if (contactSubMenuOpen) setContactSubMenuOpen(false);
    if (legalSubMenuOpen) setLegalSubMenuOpen(false);
    if (marketingSubMenuOpen) setMarketingSubMenuOpen(false);
    if (hrSubMenuOpen) setHrSubMenuOpen(false);
    if (commercialSubMenuOpen) setCommercialSubMenuOpen(false);
    if (informatiqueSubMenuOpen) setInformatiqueSubMenuOpen(false);
  };

  const toggleCommercialSubMenu = () => {
    setCommercialSubMenuOpen(!commercialSubMenuOpen);
    if (contactSubMenuOpen) setContactSubMenuOpen(false);
    if (legalSubMenuOpen) setLegalSubMenuOpen(false);
    if (marketingSubMenuOpen) setMarketingSubMenuOpen(false);
    if (hrSubMenuOpen) setHrSubMenuOpen(false);
    if (workspaceSubMenuOpen) setWorkspaceSubMenuOpen(false);
    if (informatiqueSubMenuOpen) setInformatiqueSubMenuOpen(false);
  };

  const toggleInformatiqueSubMenu = () => {
    setInformatiqueSubMenuOpen(!informatiqueSubMenuOpen);
    if (contactSubMenuOpen) setContactSubMenuOpen(false);
    if (legalSubMenuOpen) setLegalSubMenuOpen(false);
    if (marketingSubMenuOpen) setMarketingSubMenuOpen(false);
    if (hrSubMenuOpen) setHrSubMenuOpen(false);
    if (workspaceSubMenuOpen) setWorkspaceSubMenuOpen(false);
    if (commercialSubMenuOpen) setCommercialSubMenuOpen(false);
  };

  return (
    <aside className="fixed inset-y-0 left-0 bg-black text-white w-64 transform transition-transform duration-300 ease-in-out">
      <div className="p-4 h-full">
        <div className="flex justify-between items-center mb-4">
          <a href="/" className="text-white mb-4 block">Exit to Portal</a>
        </div>
        <ul>
          <li>
            <a href="/dashboard" className="block py-2 px-4 hover:bg-gray-700">Dashboard</a>
          </li>
          <li>
            <button onClick={toggleWorkspaceSubMenu} className="block py-2 px-4 hover:bg-gray-700">Workspace</button>
            {workspaceSubMenuOpen && (
              <ul className="absolute left-full top-0 bg-gray-200 w-48 h-full">
                <li><a href="/workspace/informations-generales" className="block py-2 px-4 text-black hover:bg-gray-300">Information General</a></li>
                <li><a href="/workspace/organigrame" className="block py-2 px-4 text-black hover:bg-gray-300">Organigrame</a></li>
                <li><a href="/workspace/task" className="block py-2 px-4 text-black hover:bg-gray-300">Task</a></li>
                <li><a href="/workspace/roadmap-annuelle" className="block py-2 px-4 text-black hover:bg-gray-300">Roadmap Annuel</a></li>
                <li><a href="/workspace/outil-et-logiciel" className="block py-2 px-4 text-black hover:bg-gray-300">Outil & Logiciel</a></li>
                <li><a href="/workspace/one-drive" className="block py-2 px-4 text-black hover:bg-gray-300">One drive (Workspace)</a></li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={toggleContactSubMenu} className="block py-2 px-4 hover:bg-gray-700">Contact</button>
            {contactSubMenuOpen && (
              <ul className="absolute left-full top-0 bg-gray-200 w-48 h-full">
                <li><a href="/contact/board-members" className="block py-2 px-4 text-black hover:bg-gray-300">Board Members</a></li>
                <li><a href="/contact/lead" className="block py-2 px-4 text-black hover:bg-gray-300">Lead</a></li>
                <li><a href="/contact/members" className="block py-2 px-4 text-black hover:bg-gray-300">Members</a></li>
                <li><a href="/contact/freelance" className="block py-2 px-4 text-black hover:bg-gray-300">Freelance</a></li>
                <li><a href="/contact/partenaire" className="block py-2 px-4 text-black hover:bg-gray-300">Partenaires</a></li>
                <li><a href="/contact/support" className="block py-2 px-4 text-black hover:bg-gray-300">Support</a></li>
                <li><a href="/contact/reseau" className="block py-2 px-4 text-black hover:bg-gray-300">Réseau</a></li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={toggleCommercialSubMenu} className="block py-2 px-4 hover:bg-gray-700">Commercial</button>
            {commercialSubMenuOpen && (
              <ul className="absolute left-full top-0 bg-gray-200 w-48 h-full">
                <li><a href="/commercial/lead" className="block py-2 px-4 text-black hover:bg-gray-300">Lead</a></li>
                <li><a href="/commercial/liste-d-attente" className="block py-2 px-4 text-black hover:bg-gray-300">Liste d'attente</a></li>
                <li><a href="/commercial/clients#" className="block py-2 px-4 text-black hover:bg-gray-300">Clients</a></li>
                <li><a href="/commercial/prestations" className="block py-2 px-4 text-black hover:bg-gray-300">Prestations</a></li>
                <li><a href="/commercial/autres-offres" className="block py-2 px-4 text-black hover:bg-gray-300">Autres offres</a></li>
                <li><a href="/commercial/formation" className="block py-2 px-4 text-black hover:bg-gray-300">Formation</a></li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={toggleLegalSubMenu} className="block py-2 px-4 hover:bg-gray-700">Legal</button>
            {legalSubMenuOpen && (
              <ul className="absolute left-full top-0 bg-gray-200 w-48 h-full">
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">Contrats & Accords</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">Conformité & Réglementation</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">Propriété Intellectuelle</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">Gestion des Litiges</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">Politiques Internes</a></li>
                <li><a href="#" className="block py-2 px-4 text-black hover:bg-gray-300">Documentation Légale</a></li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={toggleMarketingSubMenu} className="block py-2 px-4 hover:bg-gray-700">Marketing</button>
            {marketingSubMenuOpen && (
              <ul className="absolute left-full top-0 bg-gray-200 w-48 h-full">
                <li><a href="/marketing/branding" className="block py-2 px-4 text-black hover:bg-gray-300">Branding</a></li>
                <li><a href="/marketing/publicite" className="block py-2 px-4 text-black hover:bg-gray-300">Publicité</a></li>
                <li><a href="/marketing/reseaux-sociaux" className="block py-2 px-4 text-black hover:bg-gray-300">Réseaux Sociaux</a></li>
                <li><a href="/marketing/analyse-optimisation" className="block py-2 px-4 text-black hover:bg-gray-300">Analyse & Optimisation</a></li>
                <li><a href="/marketing/expérience-client-fidelisation" className="block py-2 px-4 text-black hover:bg-gray-300">Expérience Client & Fidélisation</a></li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={toggleHrSubMenu} className="block py-2 px-4 hover:bg-gray-700">Ressources Humaines</button>
            {hrSubMenuOpen && (
              <ul className="absolute left-full top-0 bg-gray-200 w-48 h-full">
                <li><a href="/ressources-humaines/recrutement" className="block py-2 px-4 text-black hover:bg-gray-300">Recrutement</a></li>
                <li><a href="/ressources-humaines/gestion-du-personnel" className="block py-2 px-4 text-black hover:bg-gray-300">Gestion du Personnel</a></li>
                <li><a href="/ressources-humaines/performance-formation" className="block py-2 px-4 text-black hover:bg-gray-300">Performance & Formation</a></li>
                <li><a href="/ressources-humaines/conformite-administration" className="block py-2 px-4 text-black hover:bg-gray-300">Conformité & Administration</a></li>
                <li><a href="/ressources-humaines/culture-engagement" className="block py-2 px-4 text-black hover:bg-gray-300">Culture & Engagement</a></li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={toggleInformatiqueSubMenu} className="block py-2 px-4 hover:bg-gray-700">Informatique</button>
            {informatiqueSubMenuOpen && (
              <ul className="absolute left-full top-0 bg-gray-200 w-48 h-full">
                <li><a href="/informatique/gestion-des-serveurs" className="block py-2 px-4 text-black hover:bg-gray-300">Gestion des serveurs</a></li>
                <li><a href="/informatique/vpn-access-distant" className="block py-2 px-4 text-black hover:bg-gray-300">VPN & accès distant</a></li>
                <li><a href="/informatique/gestion-des-licences" className="block py-2 px-4 text-black hover:bg-gray-300">Gestion des licences</a></li>
                <li><a href="/informatique/outils-metiers-saas" className="block py-2 px-4 text-black hover:bg-gray-300">Outils métiers & SaaS</a></li>
                <li><a href="/informatique/documentation" className="block py-2 px-4 text-black hover:bg-gray-300">Documentation</a></li>
                <li><a href="/informatique/test-et-validation" className="block py-2 px-4 text-black hover:bg-gray-300">Test et validation</a></li>
                <li><a href="/informatique/cahier-des-charges" className="block py-2 px-4 text-black hover:bg-gray-300">Cahier des charges</a></li>
                <li><a href="/informatique/projets-clients" className="block py-2 px-4 text-black hover:bg-gray-300">Projets clients</a></li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </aside>
  );
}
