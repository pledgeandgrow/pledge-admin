import React from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function AnalyseOptimisation() {
  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-2xl font-bold mb-4">Analyse & Optimisation</h1>
        <div className="bg-white p-4 rounded shadow">
          <p>This page is dedicated to analysis and optimization techniques.</p>
        </div>
      </div>
    </div>
  );
}
