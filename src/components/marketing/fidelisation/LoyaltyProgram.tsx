'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Gift, 
  Award, 
  Star, 
  Clock, 
  ChevronRight, 
  Plus, 
  Sparkles, 
  Zap, 
  Crown
} from 'lucide-react';

interface LoyaltyReward {
  id: number;
  name: string;
  description: string;
  points: number;
  status: 'Disponible' | 'Populaire' | 'Exclusif' | 'Nouveau' | 'Limité';
  claimed: number;
  category: 'Remises' | 'Services' | 'Produits' | 'Expériences';
  image?: string;
}

interface LoyaltyTier {
  name: string;
  icon: React.ReactNode;
  pointsRequired: number;
  color: string;
  benefits: string[];
}

const rewards: LoyaltyReward[] = [
  {
    id: 1,
    name: 'Remise 10%',
    description: 'Obtenez une remise de 10% sur votre prochain achat',
    points: 1000,
    status: 'Disponible',
    claimed: 234,
    category: 'Remises'
  },
  {
    id: 2,
    name: 'Consultation Gratuite',
    description: 'Profitez d\'une consultation personnalisée avec nos experts',
    points: 2500,
    status: 'Populaire',
    claimed: 156,
    category: 'Services'
  },
  {
    id: 3,
    name: 'Formation Premium',
    description: 'Accès à notre formation premium exclusive',
    points: 5000,
    status: 'Exclusif',
    claimed: 45,
    category: 'Services'
  },
  {
    id: 4,
    name: 'Produit Exclusif',
    description: 'Recevez un produit exclusif réservé aux membres fidèles',
    points: 7500,
    status: 'Limité',
    claimed: 12,
    category: 'Produits'
  },
  {
    id: 5,
    name: 'Accès VIP Événement',
    description: 'Accès VIP à notre prochain événement',
    points: 10000,
    status: 'Exclusif',
    claimed: 8,
    category: 'Expériences'
  },
  {
    id: 6,
    name: 'Remise 25%',
    description: 'Obtenez une remise de 25% sur un service premium',
    points: 3500,
    status: 'Nouveau',
    claimed: 27,
    category: 'Remises'
  }
];

const loyaltyTiers: LoyaltyTier[] = [
  {
    name: 'Bronze',
    icon: <Trophy className="h-5 w-5" />,
    pointsRequired: 0,
    color: 'text-amber-700 dark:text-amber-600',
    benefits: [
      'Accès au programme de fidélité',
      'Cumul de points sur chaque achat',
      'Accès aux récompenses de base'
    ]
  },
  {
    name: 'Argent',
    icon: <Award className="h-5 w-5" />,
    pointsRequired: 5000,
    color: 'text-slate-400',
    benefits: [
      'Tous les avantages Bronze',
      '+10% de points bonus',
      'Accès aux offres spéciales',
      'Support prioritaire'
    ]
  },
  {
    name: 'Or',
    icon: <Star className="h-5 w-5" />,
    pointsRequired: 15000,
    color: 'text-yellow-500',
    benefits: [
      'Tous les avantages Argent',
      '+25% de points bonus',
      'Accès aux récompenses exclusives',
      'Invitations aux événements VIP',
      'Conseiller personnel dédié'
    ]
  },
  {
    name: 'Platine',
    icon: <Crown className="h-5 w-5" />,
    pointsRequired: 30000,
    color: 'text-blue-400',
    benefits: [
      'Tous les avantages Or',
      '+50% de points bonus',
      'Accès à toutes les récompenses',
      'Expériences sur mesure',
      'Statut VIP à vie après 1 an',
      'Avantages partenaires exclusifs'
    ]
  }
];

export function LoyaltyProgram() {
  const [activeTab, setActiveTab] = useState('all');
  const [userPoints, setUserPoints] = useState(7800);
  const [currentTier, setCurrentTier] = useState(1); // 0-based index: 0=Bronze, 1=Argent, 2=Or, 3=Platine
  
  const nextTier = loyaltyTiers[currentTier + 1];
  const pointsToNextTier = nextTier ? nextTier.pointsRequired - userPoints : 0;
  const progressToNextTier = nextTier ? (userPoints / nextTier.pointsRequired) * 100 : 100;
  
  const filteredRewards = activeTab === 'all' 
    ? rewards 
    : rewards.filter(reward => {
        if (activeTab === 'affordable') return reward.points <= userPoints;
        if (activeTab === 'remises') return reward.category === 'Remises';
        if (activeTab === 'services') return reward.category === 'Services';
        if (activeTab === 'experiences') return reward.category === 'Expériences' || reward.category === 'Produits';
        return true;
      });

  return (
    <Card className="border dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-gray-900 dark:text-white">Programme de Fidélité</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Gérez vos points et récompenses
            </CardDescription>
          </div>
          <Button
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" /> Nouvelle Récompense
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Points & Tier Status */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Vos Points</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{userPoints}</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  <Zap className="h-3 w-3 mr-1" />
                  +250 ce mois
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Niveau Actuel</h3>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-full ${loyaltyTiers[currentTier].color} bg-opacity-20`}>
                  {loyaltyTiers[currentTier].icon}
                </div>
                <span className={`text-lg font-bold ${loyaltyTiers[currentTier].color}`}>
                  {loyaltyTiers[currentTier].name}
                </span>
              </div>
            </div>
            
            {nextTier && (
              <div className="space-y-1 md:text-right">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Prochain Niveau</h3>
                <div className="flex items-center gap-2 md:justify-end">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {pointsToNextTier} points pour {nextTier.name}
                  </span>
                  <div className={`p-1 rounded-full ${nextTier.color} bg-opacity-20`}>
                    {nextTier.icon}
                  </div>
                </div>
                <Progress value={progressToNextTier} className="h-1.5 w-full md:w-32" />
              </div>
            )}
          </div>
        </div>
        
        {/* Loyalty Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {loyaltyTiers.map((tier, index) => (
            <div 
              key={tier.name}
              className={`p-4 rounded-lg border ${
                index === currentTier
                  ? 'border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-900/20'
                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1 rounded-full ${tier.color} bg-opacity-20`}>
                  {tier.icon}
                </div>
                <h3 className={`font-medium ${tier.color}`}>{tier.name}</h3>
                {index === currentTier && (
                  <Badge className="ml-auto bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                    Actuel
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {tier.pointsRequired > 0 ? `${tier.pointsRequired} points requis` : 'Niveau de départ'}
              </p>
              <ul className="text-xs space-y-1">
                {tier.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Sparkles className="h-3 w-3 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Rewards */}
        <div>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="affordable">Disponibles ({rewards.filter(r => r.points <= userPoints).length})</TabsTrigger>
              <TabsTrigger value="remises">Remises</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="experiences">Expériences</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRewards.map((reward) => (
                  <div 
                    key={reward.id} 
                    className={`p-4 border rounded-lg ${
                      reward.points <= userPoints
                        ? 'border-green-100 dark:border-green-900'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{reward.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{reward.description}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          reward.status === 'Disponible'
                            ? 'text-green-500 border-green-500/20 bg-green-500/10'
                            : reward.status === 'Populaire'
                            ? 'text-blue-500 border-blue-500/20 bg-blue-500/10'
                            : reward.status === 'Nouveau'
                            ? 'text-purple-500 border-purple-500/20 bg-purple-500/10'
                            : reward.status === 'Limité'
                            ? 'text-amber-500 border-amber-500/20 bg-amber-500/10'
                            : 'text-indigo-500 border-indigo-500/20 bg-indigo-500/10'
                        }
                      >
                        {reward.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        <span className="font-medium text-gray-900 dark:text-white">{reward.points} points</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant={reward.points <= userPoints ? "default" : "outline"}
                        disabled={reward.points > userPoints}
                      >
                        {reward.points <= userPoints ? 'Échanger' : `${reward.points - userPoints} points manquants`}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Gift className="h-3 w-3" />
                        <span>{reward.claimed} réclamés</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>Expire dans 90 jours</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 dark:border-gray-700">
        <Button variant="outline" size="sm">
          Historique des points
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          Voir toutes les récompenses
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
