'use client';

import { FC } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { BrandIdentity } from '@/components/marketing/branding/BrandIdentity';
import { BrandGuidelines } from '@/components/marketing/branding/BrandGuidelines';
import { BrandAssets } from '@/components/marketing/branding/BrandAssets';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample data
const initialColorScheme = {
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#FF2D55',
  background: '#FFFFFF',
  text: '#000000',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30'
};

const initialTypography = {
  headingFont: 'Inter',
  bodyFont: 'Inter',
  scale: '1.250'
};

const initialLogo = {
  main: '',
  alternative: '',
  favicon: ''
};

const brandGuidelines = {
  sections: [
    {
      id: '1',
      title: 'Notre Mission',
      content: `
        <h3>Vision et Valeurs</h3>
        <p>Notre mission est de révolutionner l'industrie en offrant des solutions innovantes...</p>
        <h3>Ton et Voix</h3>
        <p>Notre communication est professionnelle mais accessible, experte mais pas condescendante...</p>
      `,
      lastUpdated: '15 février 2024'
    },
    {
      id: '2',
      title: 'Utilisation du Logo',
      content: `
        <h3>Règles Générales</h3>
        <p>Le logo doit toujours avoir un espace de protection équivalent à la hauteur du symbole...</p>
        <h3>Versions</h3>
        <p>Utilisez la version principale sur fond clair et la version alternative sur fond sombre...</p>
      `,
      lastUpdated: '10 février 2024'
    },
    {
      id: '3',
      title: 'Style Photographique',
      content: `
        <h3>Direction Artistique</h3>
        <p>Nos images doivent être lumineuses, authentiques et centrées sur l'humain...</p>
        <h3>Traitement</h3>
        <p>Utilisez des filtres subtils qui renforcent la luminosité naturelle...</p>
      `,
      lastUpdated: '5 février 2024'
    }
  ]
};

const brandAssets = {
  assets: [
    {
      id: '1',
      name: 'Logo Principal.svg',
      type: 'image',
      url: '/assets/logo-main.svg',
      size: '245 KB',
      dimensions: '512x512',
      lastModified: 'Il y a 2j'
    },
    {
      id: '2',
      name: 'Logo Alternatif.svg',
      type: 'image',
      url: '/assets/logo-alt.svg',
      size: '220 KB',
      dimensions: '512x512',
      lastModified: 'Il y a 2j'
    },
    {
      id: '3',
      name: 'Présentation Marque.pdf',
      type: 'document',
      url: '/assets/brand-presentation.pdf',
      size: '2.4 MB',
      lastModified: 'Il y a 5j'
    },
    {
      id: '4',
      name: 'Vidéo Promotionnelle.mp4',
      type: 'video',
      url: '/assets/promo-video.mp4',
      thumbnail: '/assets/video-thumb.jpg',
      size: '24.5 MB',
      dimensions: '1920x1080',
      lastModified: 'Il y a 1sem'
    }
  ]
};

const Page: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="identity" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-gray-800 rounded-lg p-1">
              <TabsTrigger value="identity">Identité</TabsTrigger>
              <TabsTrigger value="guidelines">Guide de Marque</TabsTrigger>
              <TabsTrigger value="assets">Ressources</TabsTrigger>
            </TabsList>

            <TabsContent value="identity">
              <BrandIdentity
                colorScheme={initialColorScheme}
                typography={initialTypography}
                logo={initialLogo}
              />
            </TabsContent>

            <TabsContent value="guidelines">
              <BrandGuidelines sections={brandGuidelines.sections} />
            </TabsContent>

            <TabsContent value="assets">
              <BrandAssets assets={brandAssets.assets} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Page;
