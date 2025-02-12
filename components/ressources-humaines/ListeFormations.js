import React from 'react';
import useForm from '../../hooks/useForm';
import { formatDate } from '../../utils/dataUtils';

export default function ListeFormations({ formations, departements, onAddEmploye }) {
  const { 
    values, 
    errors, 
    handleChange, 
    handleArrayAdd, 
    handleArrayRemove, 
    validate, 
    reset 
  } = useForm({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    departement: '',
    poste: '',
    dateEmbauche: '',
    competences: [],
    nouvelleCompetence: ''
  }, {
    nom: { required: true, minLength: 2 },
    prenom: { required: true, minLength: 2 },
    email: { required: true, email: true },
    telephone: { required: true, phone: true },
    departement: { required: true },
    poste: { required: true, minLength: 3 },
    dateEmbauche: { required: true }
  });

  const handleAddCompetence = () => {
    const competence = values.nouvelleCompetence.trim();
    if (competence) {
      handleArrayAdd('competences', { name: competence });
      handleChange({ 
        target: { 
          name: 'nouvelleCompetence', 
          value: '' 
        } 
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const newEmploye = {
        ...values,
        competences: values.competences.map(c => c.name),
        dateEmbauche: formatDate(values.dateEmbauche)
      };
      
      onAddEmploye(newEmploye);
      reset();
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {formations.map((formation) => (
          <div 
            key={formation.id} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-2xl font-bold mb-4">{formation.titre}</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <strong>Département:</strong>
                <span>{formation.departement}</span>
              </div>
              <div className="flex justify-between">
                <strong>Durée:</strong>
                <span>{formation.duree}</span>
              </div>
              <div className="flex justify-between">
                <strong>Coût:</strong>
                <span>{formation.cout} €</span>
              </div>
              <div className="flex justify-between">
                <strong>Places Disponibles:</strong>
                <span>{formation.placesDisponibles}</span>
              </div>
              <button className="w-full bg-green-500 text-white py-2 rounded mt-4 hover:bg-green-600 transition-colors">
                S'inscrire
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold mb-4">Nouvel Employé</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Nom</label>
              <input 
                type="text"
                name="nom"
                value={values.nom}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${errors.nom ? 'border-red-500' : ''}`}
                placeholder="Nom de famille"
              />
              {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
            </div>
            <div>
              <label className="block mb-2">Prénom</label>
              <input 
                type="text"
                name="prenom"
                value={values.prenom}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${errors.prenom ? 'border-red-500' : ''}`}
                placeholder="Prénom"
              />
              {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Email</label>
              <input 
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
                placeholder="email@entreprise.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block mb-2">Téléphone</label>
              <input 
                type="tel"
                name="telephone"
                value={values.telephone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${errors.telephone ? 'border-red-500' : ''}`}
                placeholder="+33 6 XX XX XX XX"
              />
              {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Département</label>
              <select 
                name="departement"
                value={values.departement}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${errors.departement ? 'border-red-500' : ''}`}
              >
                <option value="">Sélectionnez un département</option>
                {departements.map((dept) => (
                  <option key={dept.nom} value={dept.nom}>{dept.nom}</option>
                ))}
              </select>
              {errors.departement && <p className="text-red-500 text-sm mt-1">{errors.departement}</p>}
            </div>
            <div>
              <label className="block mb-2">Poste</label>
              <input 
                type="text"
                name="poste"
                value={values.poste}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${errors.poste ? 'border-red-500' : ''}`}
                placeholder="Intitulé du poste"
              />
              {errors.poste && <p className="text-red-500 text-sm mt-1">{errors.poste}</p>}
            </div>
          </div>

          <div>
            <label className="block mb-2">Date d'Embauche</label>
            <input 
              type="date"
              name="dateEmbauche"
              value={values.dateEmbauche}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${errors.dateEmbauche ? 'border-red-500' : ''}`}
            />
            {errors.dateEmbauche && <p className="text-red-500 text-sm mt-1">{errors.dateEmbauche}</p>}
          </div>

          <div>
            <label className="block mb-2">Compétences</label>
            <div className="flex">
              <input 
                type="text"
                name="nouvelleCompetence"
                value={values.nouvelleCompetence}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded mr-2"
                placeholder="Ajouter une compétence"
              />
              <button 
                type="button"
                onClick={handleAddCompetence}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                +
              </button>
            </div>
            <div className="mt-2">
              {values.competences.map((competence) => (
                <span 
                  key={competence.id} 
                  className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2"
                >
                  {competence.name}
                  <button 
                    type="button"
                    onClick={() => handleArrayRemove('competences', competence)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
          >
            Ajouter l'Employé
          </button>
        </form>
      </div>
    </div>
  );
}
