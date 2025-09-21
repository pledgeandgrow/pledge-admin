'use client';

import { useState } from 'react';
import { Data } from '@/types/data';
import { VpnAccessCard } from './VpnAccessCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Plus, Loader2 } from 'lucide-react';

interface VpnAccessListProps {
  vpnAccesses: Data[];
  isLoading: boolean;
  error: Error | null;
  onAddVpnAccess: () => void;
  onViewVpnAccess: (vpnAccess: Data) => void;
}

export function VpnAccessList({ 
  vpnAccesses, 
  isLoading, 
  error, 
  onAddVpnAccess,
  onViewVpnAccess
}: VpnAccessListProps) {
  const [activeTab, setActiveTab] = useState('all');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'expired': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'revoked': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const categories = [
    { value: 'active', label: 'Actifs' },
    { value: 'pending', label: 'En attente' },
    { value: 'expired', label: 'Expirés' },
    { value: 'revoked', label: 'Révoqués' }
  ];

  const filteredVpnAccesses = activeTab === 'all'
    ? vpnAccesses
    : vpnAccesses.filter(item => {
        const status = item.metadata?.status as string || 'pending';
        return status.toLowerCase() === activeTab.toLowerCase();
      });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des accès VPN...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg">
        <p>Une erreur est survenue lors du chargement des données.</p>
      </div>
    );
  }

  if (vpnAccesses.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-medium">Aucun accès VPN disponible</h3>
        <p className="text-muted-foreground mt-2">Ajoutez votre premier accès VPN</p>
        <Button 
          onClick={onAddVpnAccess}
          className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white hover:opacity-90 mt-4"
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter un accès VPN
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.value} value={category.value}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        <Button 
          onClick={onAddVpnAccess}
          className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white hover:opacity-90 ml-4"
        >
          <Plus className="mr-2 h-4 w-4" /> Nouvel accès VPN
        </Button>
      </div>
      
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVpnAccesses.map((vpnAccess) => (
            <VpnAccessCard 
              key={vpnAccess.id} 
              vpnAccess={vpnAccess} 
              getStatusColor={getStatusColor}
              onView={onViewVpnAccess}
            />
          ))}
        </div>
      </div>
    </>
  );
}
