'use client';

import { useState } from 'react';
import { useData } from '@/hooks/useData';
import { VpnAccessHeader } from '@/components/informatique/vpn-acces/VpnAccessHeader';
import { VpnAccessList } from '@/components/informatique/vpn-acces/VpnAccessList';
import { VpnAccessForm } from '@/components/informatique/vpn-acces/VpnAccessForm';
import { Data } from '@/types/data';

export default function VpnAccesPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedVpnAccess, setSelectedVpnAccess] = useState<Data | undefined>(undefined);
  // Using 'documentation' type as a placeholder since 'vpn-access' is not in DataType
  const { data: vpnAccesses = [], loading, error } = useData('documentation');

  const handleAddVpnAccess = () => {
    setSelectedVpnAccess(undefined);
    setFormOpen(true);
  };

  const handleViewVpnAccess = (vpnAccess: Data) => {
    setSelectedVpnAccess(vpnAccess);
    setFormOpen(true);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <VpnAccessHeader 
        title="Accès VPN" 
        subtitle="Gérez les accès VPN pour votre équipe et vos clients" 
      />
      
      <VpnAccessList 
        vpnAccesses={vpnAccesses} 
        isLoading={loading} 
        error={error}
        onAddVpnAccess={handleAddVpnAccess}
        onViewVpnAccess={handleViewVpnAccess}
      />

      <VpnAccessForm 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        initialData={selectedVpnAccess} 
      />
    </div>
  );
}
