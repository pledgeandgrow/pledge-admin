'use client';

import { useState } from 'react';
import { useAssets } from '@/hooks/useAssets';
import { AssetHeader } from '@/components/informatique/license-stock/AssetHeader';
import { AssetList } from '@/components/informatique/license-stock/AssetList';
import { AssetForm } from '@/components/informatique/license-stock/AssetForm';
import { Asset } from '@/types/assets';

export default function LicenseStockPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>(undefined);
  
  // Use the useAssets hook to fetch and manage assets
  const { 
    assets, 
    loading, 
    error, 
    createAsset, 
    updateAsset 
  } = useAssets({
    autoFetch: true
  });

  const handleAddAsset = () => {
    setSelectedAsset(undefined);
    setFormOpen(true);
  };

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setFormOpen(true);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <AssetHeader 
        title="Licences et Actifs" 
        subtitle="Gérez vos licences logicielles et actifs informatiques" 
      />
      
      <AssetList 
        assets={assets} 
        isLoading={loading} 
        error={error}
        onAddAsset={handleAddAsset}
        onViewAsset={handleViewAsset}
      />

      <AssetForm 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        initialData={selectedAsset} 
      />
    </div>
  );
}
