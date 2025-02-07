import React from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function Formation() {
  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-2xl font-bold mb-4">Formation</h1>
        <div className="bg-white p-4 rounded shadow">
          <p>This page is dedicated to formation services.</p>
        </div>
      </div>
    </div>
  );
}
