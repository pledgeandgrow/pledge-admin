import MegaMenu from '../../components/MegaMenu';

export default function Lead() {
  const leads = [
    {
      date: '01/02/2025',
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      number: '0123456789',
      company: 'Entreprise S.A.',
      position: 'Directeur',
      approachDate: '15/01/2025'
    },
    ...Array(10).fill({
      date: '01/02/2025',
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      number: '0123456789',
      company: 'Entreprise S.A.',
      position: 'Directeur',
      approachDate: '15/01/2025'
    })
  ];

  return (
    <div className="flex">
      <MegaMenu />
      <div className="p-8 ml-[32rem]">
        <h1 className="text-2xl font-bold mb-4">Liste des Leads</h1>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Date du Lead</th>
              <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Nom</th>
              <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Email</th>
              <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Numéro</th>
              <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Entreprise</th>
              <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Poste</th>
              <th className="py-3 px-5 border-b border-gray-200 text-left text-gray-600 font-semibold">Date d'Approche</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="py-3 px-5 border-b border-gray-200">{lead.date}</td>
                <td className="py-3 px-5 border-b border-gray-200">{lead.name}</td>
                <td className="py-3 px-5 border-b border-gray-200">{lead.email}</td>
                <td className="py-3 px-5 border-b border-gray-200">{lead.number}</td>
                <td className="py-3 px-5 border-b border-gray-200">{lead.company}</td>
                <td className="py-3 px-5 border-b border-gray-200">{lead.position}</td>
                <td className="py-3 px-5 border-b border-gray-200">{lead.approachDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
