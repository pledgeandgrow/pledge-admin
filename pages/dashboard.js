import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MegaMenu from '../components/MegaMenu';
import { useState,useEffect } from 'react';
import { supabase } from '../utils/supabase';

export default function Dashboard() {




  const [clients, setClients] = useState([]);
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

 
  useEffect(() => {
    async function fetchClients() {
      const { data, error } = await supabase.from("clients").select("*");

      if (error) {
        console.error("erreur");
      } else {
        console.log("Clients récupérés :",data );
        setClients(data);
      }
    }

    fetchClients();
  }, []);

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
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Client Name</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Email</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Phone</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Company</th>
                <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Position</th>
              </tr>
            </thead>
            <tbody>
              {/* {Array(5).fill({
                name: 'Client Name',
                email: 'client@example.com',
                phone: '0123456789',
                company: 'Company Inc.',
                position: 'Manager'
              }).map( */}
               {clients.map((client, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="py-3 px-5 border-b border-gray-200">{client.name}</td>
                      <td className="py-3 px-5 border-b border-gray-200">{client.email}</td>
                      <td className="py-3 px-5 border-b border-gray-200">{client.phone}</td>
                      <td className="py-3 px-5 border-b border-gray-200">{client.company}</td>
                      <td className="py-3 px-5 border-b border-gray-200">{client.position}</td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
