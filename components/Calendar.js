import React from 'react';

const Calendar = () => {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const meetings = {
    'Lundi': '21h : Réunion générale',
    'Mardi': '21h : Réunion informatique',
    'Mercredi': '19h : Réunion commercial',
    'Jeudi': '21h : Réunion Marketing',
    'Vendredi': '(occasionnel) : R&D research'
  };

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-8 gap-1">
        <div className=""></div>
        {days.map((day) => (
          <div key={day} className="font-bold text-center p-1 bg-gray-200 text-sm">
            {day}
          </div>
        ))}
        {[...Array(18)].map((_, index) => {
          const hour = 6 + index;
          return (
            <React.Fragment key={hour}>
              <div className="text-right pr-1 font-semibold text-sm">{hour}:00</div>
              {days.map((day) => (
                <div key={`${day}-${hour}`} className="h-10 border border-gray-300 flex items-center justify-center">
                  {meetings[day] && meetings[day].includes(`${hour}h`) && (
                    <div className="bg-teal-100 p-1 rounded-md text-xs">
                      {meetings[day]}
                    </div>
                  )}
                </div>
              ))}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
