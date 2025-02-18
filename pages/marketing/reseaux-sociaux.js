import React, { useState } from 'react';
import MegaMenu from '../../components/MegaMenu';
import SocialPlatforms from '../../components/marketing/SocialPlatforms';
import PostIdeas from '../../components/marketing/PostIdeas';
import PublicationCalendar from '../../components/marketing/PublicationCalendar';
import { addDays } from 'date-fns';

export default function ReseauxSociaux() {
  const [activeSection, setActiveSection] = useState('plateformes');
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [scheduledPosts, setScheduledPosts] = useState([]);

  const plateformesSociales = [
    {
      nom: 'LinkedIn',
      logo: '/images/social/linkedin.png',
      description: 'Réseau professionnel B2B',
      followers: 5000,
      engagement: 3.5,
      typeContenu: ['Articles professionnels', 'Offres d\'emploi', 'Témoignages']
    },
    {
      nom: 'Instagram',
      logo: '/images/social/instagram.png',
      description: 'Contenu visuel et storytelling',
      followers: 3500,
      engagement: 4.2,
      typeContenu: ['Photos d\'équipe', 'Coulisses', 'Infographies']
    },
    {
      nom: 'Twitter',
      logo: '/images/social/twitter.png',
      description: 'Communication rapide et actualités',
      followers: 2800,
      engagement: 2.7,
      typeContenu: ['Annonces', 'Actualités', 'Citations']
    },
    {
      nom: 'Facebook',
      logo: '/images/social/facebook.png',
      description: 'Communauté et événements',
      followers: 4200,
      engagement: 3.1,
      typeContenu: ['Événements', 'Vidéos', 'Publications communautaires']
    }
  ];

  const ideesPosts = [
    {
      type: 'Professionnel',
      exemples: [
        'Présentation d\'un nouveau membre de l\'équipe',
        'Retour sur un projet réussi',
        'Conseils et bonnes pratiques de l\'industrie'
      ]
    },
    {
      type: 'Créatif',
      exemples: [
        'Coulisses de notre entreprise',
        'Défis et moments amusants de l\'équipe',
        'Transformation de nos locaux'
      ]
    },
    {
      type: 'Recrutement',
      exemples: [
        'Offres d\'emploi actuelles',
        'Témoignages d\'employés',
        'Culture d\'entreprise'
      ]
    }
  ];

  const handlePostCreate = (newPost) => {
    setScheduledPosts([...scheduledPosts, newPost]);
  };

  const sections = {
    plateformes: {
      title: 'Plateformes Sociales',
      content: <SocialPlatforms platforms={plateformesSociales} />
    },
    ideesPosts: {
      title: 'Community Management',
      content: (
        <PostIdeas 
          ideas={ideesPosts} 
          platforms={plateformesSociales}
          onPostCreate={handlePostCreate}
        />
      )
    },
    calendrier: {
      title: 'Calendrier de Publication',
      content: (
        <PublicationCalendar 
          selectedWeek={selectedWeek}
          onPreviousWeek={() => setSelectedWeek(prev => addDays(prev, -7))}
          onNextWeek={() => setSelectedWeek(prev => addDays(prev, 7))}
        />
      )
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Gestion des Réseaux Sociaux</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.keys(sections).map((key) => (
            <button
              key={key}
              className={`
                px-4 py-2 rounded-lg transition-all duration-300
                ${activeSection === key 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
              `}
              onClick={() => setActiveSection(key)}
            >
              {sections[key].title}
            </button>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {sections[activeSection].title}
          </h2>
          {sections[activeSection].content}
        </div>
      </div>
    </div>
  );
}
