'use client';

import HomeHeader from '@/components/home/HomeHeader';
import HomeIntro from '@/components/home/HomeIntro';
import HomeGuide from '@/components/home/HomeGuide';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeHeader />
      <main className="flex-1">
        <HomeIntro />
        <HomeGuide />
      </main>
    </div>
  );
}
