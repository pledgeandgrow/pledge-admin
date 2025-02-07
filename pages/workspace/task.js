import React from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function Task() {
  const tasks = [
    { id: 1, title: 'Design new homepage', status: 'To Do' },
    { id: 2, title: 'Develop login feature', status: 'In Progress' },
    { id: 3, title: 'Test payment gateway', status: 'To Do' },
    { id: 4, title: 'Launch marketing campaign', status: 'Completed' },
  ];

  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-2xl font-bold mb-4">Task Board</h1>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div>
            <h2 className="text-lg font-bold mb-4">To Do</h2>
            {tasks.filter(task => task.status === 'To Do').map(task => (
              <div key={task.id} className="bg-white p-4 mb-2 rounded shadow">
                {task.title}
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-lg font-bold mb-4">In Progress</h2>
            {tasks.filter(task => task.status === 'In Progress').map(task => (
              <div key={task.id} className="bg-white p-4 mb-2 rounded shadow">
                {task.title}
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-lg font-bold mb-4">Completed</h2>
            {tasks.filter(task => task.status === 'Completed').map(task => (
              <div key={task.id} className="bg-white p-4 mb-2 rounded shadow">
                {task.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
