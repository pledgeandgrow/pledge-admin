import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Search, Plus, Calendar, DollarSign, Target, BarChart2, Users, Edit, Trash2, Eye } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  objective: 'awareness' | 'consideration' | 'conversion';
}

const campaigns: Campaign[] = [
  {
    id: '1',
    name: 'Lancement Produit Q1',
    platform: 'Google Ads',
    status: 'active',
    startDate: '2025-01-15',
    endDate: '2025-03-15',
    budget: 5000,
    spent: 2800,
    impressions: 120000,
    clicks: 3500,
    conversions: 85,
    objective: 'conversion'
  },
  {
    id: '2',
    name: 'Notoriété de Marque',
    platform: 'Facebook Ads',
    status: 'active',
    startDate: '2025-01-10',
    endDate: '2025-04-10',
    budget: 7500,
    spent: 3200,
    impressions: 250000,
    clicks: 4800,
    conversions: 120,
    objective: 'awareness'
  },
  {
    id: '3',
    name: 'Génération de Leads B2B',
    platform: 'LinkedIn Ads',
    status: 'paused',
    startDate: '2025-02-01',
    endDate: '2025-04-30',
    budget: 6000,
    spent: 1500,
    impressions: 45000,
    clicks: 1200,
    conversions: 35,
    objective: 'consideration'
  },
  {
    id: '4',
    name: 'Promotion Saisonnière',
    platform: 'Instagram Ads',
    status: 'completed',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    budget: 3000,
    spent: 3000,
    impressions: 180000,
    clicks: 5200,
    conversions: 210,
    objective: 'conversion'
  },
  {
    id: '5',
    name: 'Campagne Vidéo',
    platform: 'YouTube Ads',
    status: 'draft',
    startDate: '2025-03-01',
    endDate: '2025-05-31',
    budget: 8000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    objective: 'awareness'
  }
];

const getStatusBadge = (status: 'active' | 'paused' | 'completed' | 'draft') => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400">Active</Badge>;
    case 'paused':
      return <Badge className="bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400">En pause</Badge>;
    case 'completed':
      return <Badge className="bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400">Terminée</Badge>;
    case 'draft':
      return <Badge className="bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-400">Brouillon</Badge>;
    default:
      return null;
  }
};

const getObjectiveIcon = (objective: 'awareness' | 'consideration' | 'conversion') => {
  switch (objective) {
    case 'awareness':
      return <Users className="h-4 w-4 text-purple-500" />;
    case 'consideration':
      return <BarChart2 className="h-4 w-4 text-blue-500" />;
    case 'conversion':
      return <Target className="h-4 w-4 text-green-500" />;
    default:
      return null;
  }
};

const getObjectiveText = (objective: 'awareness' | 'consideration' | 'conversion') => {
  switch (objective) {
    case 'awareness':
      return 'Notoriété';
    case 'consideration':
      return 'Considération';
    case 'conversion':
      return 'Conversion';
    default:
      return '';
  }
};

const CampagnesPublicitaires: FC = () => {
  const [showNewCampaignDialog, setShowNewCampaignDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="border dark:border-gray-700 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-gray-900 dark:text-white">Campagnes Publicitaires</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Gérez vos campagnes publicitaires et suivez leur performance
            </CardDescription>
          </div>
          <Dialog open={showNewCampaignDialog} onOpenChange={setShowNewCampaignDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-2" /> Nouvelle Campagne
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle campagne</DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400">
                  Remplissez les détails pour créer une nouvelle campagne publicitaire
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nom
                  </Label>
                  <Input id="name" className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" placeholder="Nom de la campagne" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="platform" className="text-right">
                    Plateforme
                  </Label>
                  <Select>
                    <SelectTrigger id="platform" className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Sélectionnez une plateforme" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-700">
                      <SelectItem value="google">Google Ads</SelectItem>
                      <SelectItem value="facebook">Facebook Ads</SelectItem>
                      <SelectItem value="instagram">Instagram Ads</SelectItem>
                      <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                      <SelectItem value="twitter">Twitter Ads</SelectItem>
                      <SelectItem value="youtube">YouTube Ads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="objective" className="text-right">
                    Objectif
                  </Label>
                  <Select>
                    <SelectTrigger id="objective" className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Sélectionnez un objectif" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-700">
                      <SelectItem value="awareness">Notoriété</SelectItem>
                      <SelectItem value="consideration">Considération</SelectItem>
                      <SelectItem value="conversion">Conversion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="budget" className="text-right">
                    Budget
                  </Label>
                  <div className="col-span-3 relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input id="budget" type="number" className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" placeholder="Budget total" />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">
                    Date de début
                  </Label>
                  <Input id="startDate" type="date" className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">
                    Date de fin
                  </Label>
                  <Input id="endDate" type="date" className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewCampaignDialog(false)} className="text-gray-700 border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                  Annuler
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
                  Créer la campagne
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input 
              placeholder="Rechercher une campagne..." 
              className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-gray-800 rounded-lg p-1">
            <TabsTrigger value="all" className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white">
              Toutes
            </TabsTrigger>
            <TabsTrigger value="active" className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white">
              Actives
            </TabsTrigger>
            <TabsTrigger value="paused" className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white">
              En pause
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white">
              Terminées
            </TabsTrigger>
            <TabsTrigger value="draft" className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white">
              Brouillons
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {filteredCampaigns.filter(c => c.status === 'active').map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </TabsContent>

          <TabsContent value="paused" className="space-y-4">
            {filteredCampaigns.filter(c => c.status === 'paused').map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filteredCampaigns.filter(c => c.status === 'completed').map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            {filteredCampaigns.filter(c => c.status === 'draft').map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: FC<CampaignCardProps> = ({ campaign }) => {
  const spentPercentage = (campaign.spent / campaign.budget) * 100;
  const conversionRate = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks) * 100 : 0;
  const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0;
  
  return (
    <div className="p-4 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 dark:text-white">{campaign.name}</h3>
            {getStatusBadge(campaign.status)}
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
            <span>{campaign.platform}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              {getObjectiveIcon(campaign.objective)}
              <span>{getObjectiveText(campaign.objective)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {new Date(campaign.startDate).toLocaleDateString('fr-FR')} - {new Date(campaign.endDate).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{campaign.budget.toLocaleString('fr-FR')} €</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Dépensé</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{campaign.spent.toLocaleString('fr-FR')} € ({Math.round(spentPercentage)}%)</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Impressions</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{campaign.impressions.toLocaleString('fr-FR')}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">CTR</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{ctr.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Taux de conversion</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{conversionRate.toFixed(2)}%</p>
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

export default CampagnesPublicitaires;
