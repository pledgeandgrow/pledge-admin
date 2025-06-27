import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HomeHeader() {
  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-sm transition-colors duration-200 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative w-10 h-10 md:w-12 md:h-12">
            <Image 
              src="/logo/logo-black.png" 
              alt="Pledge Admin Logo"
              fill
              className="dark:invert"
              style={{ objectFit: 'contain' }}
              priority
              sizes="(max-width: 768px) 2.5rem, 3rem"
            />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Pledge Admin
          </span>
        </div>
        <Link 
          href="/dashboard"
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center"
        >
          <span>Go to portal</span>
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}
