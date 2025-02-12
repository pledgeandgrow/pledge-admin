import React, { useState } from 'react';

export default function PostIdeas({ ideas, platforms, onPostCreate }) {
  const [newPost, setNewPost] = useState({
    plateforme: '',
    type: '',
    date: '',
    contenu: ''
  });

  const handleSubmit = () => {
    if (onPostCreate) {
      onPostCreate(newPost);
      // Reset form
      setNewPost({
        plateforme: '',
        type: '',
        date: '',
        contenu: ''
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {ideas.map((categorie, index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-2xl font-bold mb-4">{categorie.type}</h3>
          <ul className="space-y-3 list-disc list-inside">
            {categorie.exemples.map((exemple, i) => (
              <li key={i} className="text-gray-700">{exemple}</li>
            ))}
          </ul>
        </div>
      ))}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold mb-4">Créer un Nouveau Post</h3>
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>
          <div>
            <label className="block mb-2">Plateforme</label>
            <select 
              value={newPost.plateforme}
              onChange={(e) => setNewPost({...newPost, plateforme: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Sélectionnez une plateforme</option>
              {platforms.map((p) => (
                <option key={p.nom} value={p.nom}>{p.nom}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Type de Contenu</label>
            <select 
              value={newPost.type}
              onChange={(e) => setNewPost({...newPost, type: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Sélectionnez un type</option>
              {ideas.map((cat) => (
                <option key={cat.type} value={cat.type}>{cat.type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Date de Publication</label>
            <input 
              type="date"
              value={newPost.date}
              onChange={(e) => setNewPost({...newPost, date: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Contenu</label>
            <textarea 
              value={newPost.contenu}
              onChange={(e) => setNewPost({...newPost, contenu: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              rows="4"
              placeholder="Rédigez votre post ici..."
              required
            ></textarea>
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Planifier le Post
          </button>
        </form>
      </div>
    </div>
  );
}
