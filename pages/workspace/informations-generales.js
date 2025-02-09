import React from 'react';
import MegaMenu from '../../components/MegaMenu';
import Calendar from '../../components/Calendar';

export default function InformationsGenerales() {
  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem]">
        <h1 className="text-2xl font-bold mb-4 whitespace-nowrap">Informations Générales</h1>
        <div className="ml-[-13rem]">
          <Calendar />
        </div>
      </div>
    </div>
  );
}
