'use client';

import { FC, useEffect, useState } from 'react';
import type { Asset } from '@/components/marketing/branding/BrandAssets';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { BrandIdentity } from '@/components/marketing/branding/BrandIdentity';
import { BrandGuidelines } from '@/components/marketing/branding/BrandGuidelines';
import { BrandAssets } from '@/components/marketing/branding/BrandAssets';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createClient } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
// import { toast } from '@/components/ui/use-toast';

// Types for brand data
// Used for type checking in the BrandIdentity component
// Commented out as it's defined in the BrandIdentity component
/* interface BrandSettings {
  id: string;
  color_scheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    scale: string;
  };
  logo: {
    main: string;
    alternative: string;
    favicon: string;
  };
  updated_at: string;
}

// Used for type checking in the BrandGuidelines component
// Commented out as it's defined in the BrandGuidelines component
/* interface GuidelineSection {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
}
*/

// Default values in case there's no data in Supabase yet
const defaultColorScheme = {
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#FF2D55',
  background: '#FFFFFF',
  text: '#000000',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30'
};

const defaultTypography = {
  headingFont: 'Inter',
  bodyFont: 'Inter',
  scale: '1.250'
};

const defaultLogo = {
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

const Page: FC = () => {
  const [brandAssets, setBrandAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchBrandAssets() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch digital assets with type 'branding' in metadata
        const { data, error } = await supabase
          .from('assets')
          .select('*')
          .eq('type', 'digital')
          .contains('metadata', { asset_category: 'branding' });

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          // Transform Supabase data to match Asset type
          const formattedAssets: Asset[] = data.map(asset => ({
            id: asset.id,
            name: asset.name,
            type: determineAssetType(asset.file_path, asset.metadata?.asset_type),
            url: asset.file_path,
            thumbnail: asset.metadata?.thumbnail || undefined,
            size: asset.metadata?.size || 'Unknown',
            dimensions: asset.metadata?.dimensions || undefined,
            lastModified: formatDate(asset.updated_at)
          }));

          setBrandAssets(formattedAssets);
        }
      } catch (err) {
        console.error('Error fetching brand assets:', err);
        setError('Failed to load brand assets. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBrandAssets();
  }, [supabase]);

  // Helper function to determine asset type based on file extension or metadata
  function determineAssetType(filePath: string, metadataType?: string): 'image' | 'video' | 'document' {
    if (metadataType) {
      if (['image', 'video', 'document'].includes(metadataType)) {
        return metadataType as 'image' | 'video' | 'document';
      }
    }

    // Fallback to extension detection
    const extension = filePath.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')) {
      return 'image';
    } else if (['mp4', 'webm', 'mov', 'avi'].includes(extension || '')) {
      return 'video';
    } else {
      return 'document';
    }
  }

  // Helper function to format dates
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)}sem`;
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)}mois`;
    return `Il y a ${Math.floor(diffDays / 365)}ans`;
  }

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
                colorScheme={defaultColorScheme}
                typography={defaultTypography}
                logo={defaultLogo}
              />
            </TabsContent>

            <TabsContent value="guidelines">
              <BrandGuidelines sections={brandGuidelines.sections} />
            </TabsContent>

            <TabsContent value="assets">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Chargement des ressources...</span>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-64 text-red-500">
                  {error}
                </div>
              ) : (
                <BrandAssets assets={brandAssets} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Page;
