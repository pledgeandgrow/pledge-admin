import React from 'react';
import MegaMenu from './MegaMenu';

export default function Patriote() {
  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[-2rem]">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <img src="/images/new-tech-partner-1.jpg" alt="New Tech Partner 1" className="w-full h-24 sm:h-32 object-cover" />
            <div className="p-2">
              <h3 className="text-md font-semibold">Pepite France</h3>
              <p className="text-gray-500 text-sm">Description for new tech partner 1</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <img src="/images/new-tech-partner-2.jpg" alt="New Tech Partner 2" className="w-full h-24 sm:h-32 object-cover" />
            <div className="p-2">
              <h3 className="text-md font-semibold">New Tech Partner 2</h3>
              <p className="text-gray-500 text-sm">Description for new tech partner 2</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <img src="/images/new-tech-partner-3.jpg" alt="New Tech Partner 3" className="w-full h-24 sm:h-32 object-cover" />
            <div className="p-2">
              <h3 className="text-md font-semibold">New Tech Partner 3</h3>
              <p className="text-gray-500 text-sm">Description for new tech partner 3</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <img src="/images/new-tech-partner-4.jpg" alt="New Tech Partner 4" className="w-full h-24 sm:h-32 object-cover" />
            <div className="p-2">
              <h3 className="text-md font-semibold">New Tech Partner 4</h3>
              <p className="text-gray-500 text-sm">Description for new tech partner 4</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
