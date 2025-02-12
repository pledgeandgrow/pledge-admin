import React from 'react';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function PublicationCalendar({ 
  selectedWeek, 
  onPreviousWeek, 
  onNextWeek 
}) {
  const generateWeeklyCalendar = () => {
    const startOfCurrentWeek = startOfWeek(selectedWeek, { locale: fr });
    const endOfCurrentWeek = endOfWeek(selectedWeek, { locale: fr });
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = addDays(startOfCurrentWeek, i);
      weekDays.push({
        date: currentDay,
        formattedDate: format(currentDay, 'dd MMM', { locale: fr }),
        posts: [
          { 
            plateforme: 'LinkedIn', 
            contenu: 'Retour sur notre dernier projet client',
            heure: '10:00'
          },
          { 
            plateforme: 'Instagram', 
            contenu: 'Photo de l\'équipe en réunion',
            heure: '14:30'
          }
        ]
      });
    }

    return weekDays;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onPreviousWeek}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Semaine Précédente
        </button>
        <h2 className="text-2xl font-bold">
          {format(selectedWeek, 'MMMM yyyy', { locale: fr })}
        </h2>
        <button 
          onClick={onNextWeek}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Semaine Suivante
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {generateWeeklyCalendar().map((day, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-md p-4"
          >
            <h3 className="font-bold mb-2">{day.formattedDate}</h3>
            {day.posts.map((post, postIndex) => (
              <div 
                key={postIndex} 
                className="bg-gray-100 rounded p-2 mb-2"
              >
                <p className="font-semibold text-sm">{post.plateforme}</p>
                <p className="text-xs">{post.heure}</p>
                <p className="text-xs text-gray-600">{post.contenu}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
