import React from 'react';
import Image from 'next/image';
import MegaMenu from '../../components/MegaMenu';
import Link from 'next/link';

// Technology card component
const TechCard = ({ title, description, logoSrc, docLink, bgColor, textColor }) => {
  return (
    <Link href={docLink} target="_blank" rel="noopener noreferrer">
      <div className={`
        transform transition-all duration-300 
        hover:scale-105 hover:shadow-2xl 
        rounded-2xl p-6 
        flex flex-col justify-between 
        h-full cursor-pointer 
        ${bgColor} ${textColor}
        relative
      `}>
        {logoSrc && (
          <div className="flex justify-between items-center mb-4">
            <div className="w-16 h-16 relative">
              <Image 
                src={logoSrc} 
                alt={`${title} logo`} 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ 
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
                priority
              />
            </div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 opacity-70" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4v2m0 0v2m0-2h2m-2 2h-2m-4 4h6m2 0l2-2m0 0l2-2m-2 2v6" 
              />
            </svg>
          </div>
        )}
        <div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="opacity-80">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default function Documentation() {
  const technologies = [
    {
      title: 'Next.js',
      description: 'React framework for production-grade applications',
      logoSrc: '/logos/nextjs-logo.svg',
      docLink: 'https://nextjs.org/docs',
      bgColor: 'bg-black',
      textColor: 'text-white'
    },
    {
      title: 'Vercel',
      description: 'Deployment and serverless platform',
      logoSrc: '/logos/vercel-logo.svg',
      docLink: 'https://vercel.com/docs',
      bgColor: 'bg-gray-900',
      textColor: 'text-white'
    },
    {
      title: 'Supabase',
      description: 'Open source Firebase alternative',
      logoSrc: '/logos/supabase-logo.svg',
      docLink: 'https://supabase.com/docs',
      bgColor: 'bg-green-50',
      textColor: 'text-green-900'
    },
    {
      title: 'Node.js',
      description: 'JavaScript runtime for server-side development',
      logoSrc: '/logos/nodejs-logo.svg',
      docLink: 'https://nodejs.org/en/docs/',
      bgColor: 'bg-green-100',
      textColor: 'text-green-900'
    },
    {
      title: 'React',
      description: 'JavaScript library for building user interfaces',
      logoSrc: '/logos/react-logo.svg',
      docLink: 'https://reactjs.org/docs/getting-started.html',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-900'
    },
    {
      title: 'Tailwind CSS',
      description: 'Utility-first CSS framework',
      logoSrc: '/logos/tailwind-logo.svg',
      docLink: 'https://tailwindcss.com/docs',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-900'
    },
    {
      title: 'OVH',
      description: 'Cloud computing and web hosting services',
      logoSrc: '/logos/ovh-logo.svg',
      docLink: 'https://docs.ovh.com/gb/en/',
      bgColor: 'bg-blue-900',
      textColor: 'text-white'
    },
    {
      title: 'GitHub',
      description: 'Version control and collaboration platform',
      logoSrc: '/logos/github-logo.svg',
      docLink: 'https://docs.github.com/en',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-900'
    },
    {
      title: 'Express.js',
      description: 'Minimal and flexible Node.js web application framework',
      logoSrc: null,
      docLink: 'https://expressjs.com/en/4x/api.html',
      bgColor: 'bg-gray-200',
      textColor: 'text-gray-900'
    },
    {
      title: 'Shadcn/UI',
      description: 'Beautifully designed components for building modern interfaces',
      logoSrc: null,
      docLink: 'https://ui.shadcn.com/',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-900'
    },
    {
      title: 'GraphQL',
      description: 'Query language for APIs and runtime for fulfilling those queries',
      logoSrc: null,
      docLink: 'https://graphql.org/learn/',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-900'
    },
    {
      title: 'Django',
      description: 'High-level Python web framework encouraging rapid development',
      logoSrc: null,
      docLink: 'https://docs.djangoproject.com/',
      bgColor: 'bg-green-100',
      textColor: 'text-green-900'
    },
    {
      title: 'Ruby on Rails',
      description: 'Server-side web application framework written in Ruby',
      logoSrc: null,
      docLink: 'https://guides.rubyonrails.org/',
      bgColor: 'bg-red-100',
      textColor: 'text-red-900'
    },
    {
      title: 'PostgreSQL',
      description: 'Advanced open-source relational database',
      logoSrc: null,
      docLink: 'https://www.postgresql.org/docs/',
      bgColor: 'bg-blue-200',
      textColor: 'text-blue-900'
    },
    {
      title: 'REST APIs',
      description: 'Architectural style for designing networked applications',
      logoSrc: null,
      docLink: 'https://restfulapi.net/',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-900'
    },
    {
      title: 'Docker',
      description: 'Platform for developing, shipping, and running applications',
      logoSrc: null,
      docLink: 'https://docs.docker.com/',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-900'
    },
    {
      title: 'WebSockets',
      description: 'Full-duplex communication channels over a single TCP connection',
      logoSrc: null,
      docLink: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-900'
    },
    {
      title: 'React Native',
      description: 'Framework for building native mobile apps using React',
      logoSrc: null,
      docLink: 'https://reactnative.dev/docs/getting-started',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-900'
    },
    {
      title: 'Flutter',
      description: 'Google\'s UI toolkit for building natively compiled applications',
      logoSrc: null,
      docLink: 'https://docs.flutter.dev/',
      bgColor: 'bg-blue-200',
      textColor: 'text-blue-900'
    }
  ];

  return (
    <div className="min-h-screen flex">
      <MegaMenu />
      <div className="flex-grow p-8 ml-[32rem] bg-gray-50">
        <h1 className="text-4xl font-bold mb-12 text-gray-800">Documentation Technique</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {technologies.map((tech, index) => (
            <TechCard key={index} {...tech} />
          ))}
        </div>
      </div>
    </div>
  );
}
