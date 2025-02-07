import React from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function Organigram() {
  const hierarchy = [
    { id: 1, name: 'CEO', subordinates: [
      { id: 2, name: 'COO', subordinates: [] },
      { id: 3, name: 'CTO', subordinates: [] },
      { id: 4, name: 'CFO', subordinates: [] }
    ]},
    { id: 5, name: 'VP', subordinates: [
      { id: 6, name: 'CCO', subordinates: [] },
      { id: 7, name: 'CLO', subordinates: [] },
      { id: 8, name: 'CSMO', subordinates: [] },
      { id: 9, name: 'CSO', subordinates: [] },
      { id: 10, name: 'CMO', subordinates: [] }
    ]}
  ];

  const renderHierarchy = (node) => (
    <div key={node.id} className="flex flex-col items-center mb-8">
      <div className="bg-black text-white p-4 rounded-full shadow-lg mb-4">
        <h2 className="font-bold">{node.name}</h2>
      </div>
      <div className="flex space-x-8">
        {node.subordinates.map(sub => (
          <div key={sub.id} className="flex flex-col items-center">
            <div className="h-1 w-16 bg-black mb-4"></div>
            {renderHierarchy(sub)}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-2xl font-bold mb-4">Organigram</h1>
        <div className="flex justify-center items-center">
          {hierarchy.map(node => renderHierarchy(node))}
        </div>
      </div>
    </div>
  );
}
