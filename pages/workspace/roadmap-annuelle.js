import React from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function RoadmapAnnuelle() {
  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-2xl font-bold mb-4">Roadmap Annuelle</h1>
        <div className="bg-white p-4 rounded shadow">
          <p>This page contains the annual roadmap.</p>
        </div>
      </div>
    </div>
  );
}
