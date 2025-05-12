'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Star, 
  Trophy, 
  Heart, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Repeat,
  UserPlus,
  ShoppingBag
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  description?: string;
}

const MetricCard = ({ title, value, change, icon, description }: MetricCardProps) => (
  <Card className="bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl">
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2 text-base">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center gap-1 mt-1">
        {change > 0 ? (
          <span className="flex items-center text-xs text-green-500">
            <ArrowUpRight className="h-3 w-3" />
            +{change}%
          </span>
        ) : (
          <span className="flex items-center text-xs text-red-500">
            <ArrowDownRight className="h-3 w-3" />
            {change}%
          </span>
        )}
        <p className="text-xs text-muted-foreground">{description || 'vs mois précédent'}</p>
      </div>
    </CardContent>
  </Card>
);

export function LoyaltyMetrics() {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="engagement">Engagement</TabsTrigger>
        <TabsTrigger value="retention">Rétention</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <MetricCard
            title="Clients Fidèles"
            value="1,234"
            change={5.2}
            icon={<Users className="h-5 w-5 text-blue-500" />}
            description="+45 ce mois"
          />
          
          <MetricCard
            title="Note Moyenne"
            value="4.8/5"
            change={0.3}
            icon={<Star className="h-5 w-5 text-yellow-500" />}
            description="Basé sur 856 avis"
          />
          
          <MetricCard
            title="Points Distribués"
            value="45,670"
            change={12.8}
            icon={<Trophy className="h-5 w-5 text-purple-500" />}
          />
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <MetricCard
            title="Taux de Conversion"
            value="24.8%"
            change={3.5}
            icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          />
          
          <MetricCard
            title="Récompenses Échangées"
            value="342"
            change={8.7}
            icon={<Heart className="h-5 w-5 text-pink-500" />}
          />
          
          <MetricCard
            title="Valeur Client (LTV)"
            value="€1,250"
            change={15.2}
            icon={<ShoppingBag className="h-5 w-5 text-indigo-500" />}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="engagement" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <MetricCard
            title="Taux d'Engagement"
            value="68.4%"
            change={7.2}
            icon={<Heart className="h-5 w-5 text-pink-500" />}
          />
          
          <MetricCard
            title="Visites Répétées"
            value="3.5"
            change={12.3}
            icon={<Repeat className="h-5 w-5 text-blue-500" />}
            description="par mois/client"
          />
          
          <MetricCard
            title="Interactions App"
            value="12,456"
            change={18.7}
            icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          />
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <MetricCard
            title="Taux de Participation"
            value="42.7%"
            change={5.8}
            icon={<Trophy className="h-5 w-5 text-purple-500" />}
            description="aux programmes"
          />
          
          <MetricCard
            title="Avis Soumis"
            value="856"
            change={9.3}
            icon={<Star className="h-5 w-5 text-yellow-500" />}
          />
          
          <MetricCard
            title="Partages Sociaux"
            value="1,245"
            change={24.5}
            icon={<Users className="h-5 w-5 text-blue-500" />}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="retention" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <MetricCard
            title="Taux de Rétention"
            value="78.3%"
            change={3.2}
            icon={<Users className="h-5 w-5 text-blue-500" />}
          />
          
          <MetricCard
            title="Churn Rate"
            value="5.7%"
            change={-2.1}
            icon={<ArrowDownRight className="h-5 w-5 text-green-500" />}
            description="Diminution positive"
          />
          
          <MetricCard
            title="Durée Moyenne"
            value="14.2"
            change={8.5}
            icon={<Repeat className="h-5 w-5 text-purple-500" />}
            description="mois par client"
          />
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <MetricCard
            title="Réactivation"
            value="124"
            change={15.8}
            icon={<UserPlus className="h-5 w-5 text-green-500" />}
            description="clients réactivés"
          />
          
          <MetricCard
            title="Taux de Recommandation"
            value="68%"
            change={7.3}
            icon={<Heart className="h-5 w-5 text-pink-500" />}
          />
          
          <MetricCard
            title="Valeur Client (LTV)"
            value="€1,250"
            change={15.2}
            icon={<ShoppingBag className="h-5 w-5 text-indigo-500" />}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
