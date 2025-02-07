import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MegaMenu from '../components/MegaMenu';
import { useState } from 'react';

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [contactSubMenuOpen, setContactSubMenuOpen] = useState(false);
  const [legalSubMenuOpen, setLegalSubMenuOpen] = useState(false);

  const toggleContactSubMenu = () => {
    setContactSubMenuOpen(!contactSubMenuOpen);
    if (legalSubMenuOpen) setLegalSubMenuOpen(false);
  };

  const toggleLegalSubMenu = () => {
    setLegalSubMenuOpen(!legalSubMenuOpen);
    if (contactSubMenuOpen) setContactSubMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex">
      <Head>
        <title>Tableau de bord</title>
      </Head>
      <MegaMenu />
      <main className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold">Total Leads</h2>
            <p className="text-2xl">150</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold">Total Clients</h2>
            <p className="text-2xl">85</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold">Pending Tasks</h2>
            <p className="text-2xl">23</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow mb-8">
          <h2 className="text-lg font-bold mb-4">Sales Chart</h2>
          <div className="h-64 bg-gray-100">[Chart Placeholder]</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Client List</h2>
          <div className="h-64 bg-gray-100">[Table Placeholder]</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
