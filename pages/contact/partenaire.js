import React, { useState } from 'react';
import MegaMenu from '../../components/MegaMenu';
import Exclusive from '../../components/Exclusive';
import Patriote from '../../components/Patriote';
import Technique from '../../components/Technique';
import Commercial from '../../components/Commercial';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function Partenaire() {
  const [activeComponent, setActiveComponent] = useState(null);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'exclusive':
        return <Exclusive />;
      case 'patriote':
        return <Patriote />;
      case 'technique':
        return <Technique />;
      case 'commercial':
        return <Commercial />;
      default:
        return (
          <Carousel showThumbs={false} showStatus={false} infiniteLoop={true} autoPlay={true} interval={3000} centerMode={true} centerSlidePercentage={25}>
            <div className="bg-white shadow-md rounded-md overflow-hidden">
              <img src="/images/sharka-ugc.jpg" alt="Sharka UGC" className="w-full h-24 sm:h-32 object-cover" />
              <div className="p-2">
                <h3 className="text-md font-semibold">Sharka UGC</h3>
                <p className="text-gray-500 text-sm">Agency Content creation agency</p>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-md overflow-hidden">
              <img src="/images/cordunit.jpg" alt="Cordunit" className="w-full h-24 sm:h-32 object-cover" />
              <div className="p-2">
                <h3 className="text-md font-semibold">Cordunit</h3>
                <p className="text-gray-500 text-sm">Discord server creation</p>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-md overflow-hidden">
              <img src="/images/cabinet-edc.jpg" alt="Cabinet EDC" className="w-full h-24 sm:h-32 object-cover" />
              <div className="p-2">
                <h3 className="text-md font-semibold">Cabinet EDC</h3>
                <p className="text-gray-500 text-sm">Cabinet expert comptable pour declaration restructuration, optimisation</p>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-md overflow-hidden">
              <img src="/images/pepite-france.jpg" alt="Pepite France" className="w-full h-24 sm:h-32 object-cover" />
              <div className="p-2">
                <h3 className="text-md font-semibold">Pepite France</h3>
                <p className="text-gray-500 text-sm">Patriote</p>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-md overflow-hidden">
              <img src="/images/new-partner-5.jpg" alt="New Partner 5" className="w-full h-24 sm:h-32 object-cover" />
              <div className="p-2">
                <h3 className="text-md font-semibold">New Partner 5</h3>
                <p className="text-gray-500 text-sm">Description for new partner 5</p>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-md overflow-hidden">
              <img src="/images/new-partner-6.jpg" alt="New Partner 6" className="w-full h-24 sm:h-32 object-cover" />
              <div className="p-2">
                <h3 className="text-md font-semibold">New Partner 6</h3>
                <p className="text-gray-500 text-sm">Description for new partner 6</p>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-md overflow-hidden">
              <img src="/images/new-partner-7.jpg" alt="New Partner 7" className="w-full h-24 sm:h-32 object-cover" />
              <div className="p-2">
                <h3 className="text-md font-semibold">New Partner 7</h3>
                <p className="text-gray-500 text-sm">Description for new partner 7</p>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-md overflow-hidden">
              <img src="/images/new-partner-8.jpg" alt="New Partner 8" className="w-full h-24 sm:h-32 object-cover" />
              <div className="p-2">
                <h3 className="text-md font-semibold">New Partner 8</h3>
                <p className="text-gray-500 text-sm">Description for new partner 8</p>
              </div>
            </div>
          </Carousel>
        );
    }
  };

  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[24rem]">
        <h1 className="text-3xl font-bold mb-6">Our Partners</h1>
        <div className="flex space-x-4 mb-8">
          <button onClick={() => setActiveComponent('exclusive')} className="bg-blue-500 text-white px-4 py-2 rounded">Exclusive</button>
          <button onClick={() => setActiveComponent('patriote')} className="bg-green-500 text-white px-4 py-2 rounded">Patriote</button>
          <button onClick={() => setActiveComponent('technique')} className="bg-purple-500 text-white px-4 py-2 rounded">Technique</button>
          <button onClick={() => setActiveComponent('commercial')} className="bg-red-500 text-white px-4 py-2 rounded">Commercial</button>
        </div>
        {renderComponent()}
      </div>
    </div>
  );
}
