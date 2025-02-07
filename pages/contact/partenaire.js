import React from 'react';
import MegaMenu from '../../components/MegaMenu';

export default function Partenaire() {
  return (
    <div className="flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-64">
        <h1 className="text-3xl font-bold mb-6">Our Partners</h1>
        <div className="flex space-x-4 mb-8">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Exclusive</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded">Patriote</button>
          <button className="bg-purple-500 text-white px-4 py-2 rounded">Technique</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded">Commercial</button>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src="/images/sharka-ugc.jpg" alt="Sharka UGC" className="w-full h-32 sm:h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-bold">Sharka UGC</h3>
              <p className="text-gray-600">Agency Content creation agency</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src="/images/cordunit.jpg" alt="Cordunit" className="w-full h-32 sm:h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-bold">Cordunit</h3>
              <p className="text-gray-600">Discord server creation</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src="/images/cabinet-edc.jpg" alt="Cabinet EDC" className="w-full h-32 sm:h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-bold">Cabinet EDC</h3>
              <p className="text-gray-600">Cabinet expert comptable pour declaration restructuration, optimisation</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src="/images/pepite-france.jpg" alt="Pepite France" className="w-full h-32 sm:h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-bold">Pepite France</h3>
              <p className="text-gray-600">Patriote</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src="/images/vercel.jpg" alt="Vercel" className="w-full h-32 sm:h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-bold">Vercel</h3>
              <p className="text-gray-600">Technique</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src="/images/ovh.jpg" alt="OVH" className="w-full h-32 sm:h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-bold">OVH</h3>
              <p className="text-gray-600">Technique</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
