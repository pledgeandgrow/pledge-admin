import React from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function OutilEtLogiciel() {
  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-2xl font-bold mb-4">Outil et Logiciel</h1>
        <div className="bg-white p-4 rounded shadow">
          <p>This page contains tools and software information.</p>
        </div>
      </div>
    </div>
  );
}
