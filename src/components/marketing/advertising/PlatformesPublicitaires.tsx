import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Facebook, Instagram, Globe, Twitter, Linkedin, Youtube } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'draft';
  budget: number;
  spent: number;
  results: number;
  cpc: number;
  icon: JSX.Element;
}

const platforms: Platform[] = [
  {
    id: '1',
    name: 'Google Ads',
    type: 'Search',
    status: 'active',
    budget: 5000,
    spent: 3200,
    results: 1250,
    cpc: 2.56,
    icon: <Globe className="h-5 w-5 text-red-500" />
  },
  {
    id: '2',
    name: 'Facebook Ads',
    type: 'Social',
    status: 'active',
    budget: 3000,
    spent: 2100,
    results: 850,
    cpc: 2.47,
    icon: <Facebook className="h-5 w-5 text-blue-500" />
  },
  {
    id: '3',
    name: 'Instagram Ads',
    type: 'Social',
    status: 'active',
    budget: 2500,
    spent: 1800,
    results: 720,
    cpc: 2.50,
    icon: <Instagram className="h-5 w-5 text-pink-500" />
  },
  {
    id: '4',
    name: 'LinkedIn Ads',
    type: 'Social',
    status: 'paused',
    budget: 2000,
    spent: 800,
    results: 120,
    cpc: 6.67,
    icon: <Linkedin className="h-5 w-5 text-blue-700" />
  },
  {
    id: '5',
    name: 'Twitter Ads',
    type: 'Social',
    status: 'draft',
    budget: 1500,
    spent: 0,
    results: 0,
    cpc: 0,
    icon: <Twitter className="h-5 w-5 text-sky-500" />
  },
  {
    id: '6',
    name: 'YouTube Ads',
    type: 'Video',
    status: 'paused',
    budget: 3500,
    spent: 1200,
    results: 450,
    cpc: 2.67,
    icon: <Youtube className="h-5 w-5 text-red-600" />
  }
];

const getStatusBadge = (status: 'active' | 'paused' | 'draft') => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400">Actif</Badge>;
    case 'paused':
      return <Badge className="bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400">En pause</Badge>;
    case 'draft':
      return <Badge className="bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-400">Brouillon</Badge>;
    default:
      return null;
  }
};

const PlatformesPublicitaires: FC = () => {
  return (
    <Card className="border dark:border-gray-700 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-gray-900 dark:text-white">Plateformes Publicitaires</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Gérez vos comptes publicitaires et leur performance
            </CardDescription>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
            Ajouter une plateforme
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 rounded-lg p-1">
            <TabsTrigger value="all" className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white">
              Toutes
            </TabsTrigger>
            <TabsTrigger value="active" className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white">
              Actives
            </TabsTrigger>
            <TabsTrigger value="paused" className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white">
              En pause
            </TabsTrigger>
            <TabsTrigger value="draft" className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white">
              Brouillons
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {platforms.map((platform) => (
              <PlatformCard key={platform.id} platform={platform} />
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {platforms.filter(p => p.status === 'active').map((platform) => (
              <PlatformCard key={platform.id} platform={platform} />
            ))}
          </TabsContent>

          <TabsContent value="paused" className="space-y-4">
            {platforms.filter(p => p.status === 'paused').map((platform) => (
              <PlatformCard key={platform.id} platform={platform} />
            ))}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            {platforms.filter(p => p.status === 'draft').map((platform) => (
              <PlatformCard key={platform.id} platform={platform} />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface PlatformCardProps {
  platform: Platform;
}

const PlatformCard: FC<PlatformCardProps> = ({ platform }) => {
  const spentPercentage = (platform.spent / platform.budget) * 100;
  
  return (
    <div className="p-4 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
            {platform.icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              {platform.name}
              <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">({platform.type})</span>
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(platform.status)}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-gray-700 border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            Modifier
          </Button>
          {platform.status === 'active' ? (
            <Button variant="outline" size="sm" className="text-amber-500 border-amber-200 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-900 dark:hover:bg-amber-900/20">
              Pause
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="text-green-500 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-900 dark:hover:bg-green-900/20">
              Activer
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">{platform.budget.toLocaleString('fr-FR')} €</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Dépensé</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">{platform.spent.toLocaleString('fr-FR')} €</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Résultats</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">{platform.results.toLocaleString('fr-FR')}</p>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">Utilisation du budget</span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{Math.round(spentPercentage)}%</span>
        </div>
        <Progress value={spentPercentage} className="h-2 bg-gray-100 dark:bg-gray-700" />
      </div>
    </div>
  );
};

export default PlatformesPublicitaires;
