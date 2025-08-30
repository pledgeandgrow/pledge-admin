'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, ArrowUpRight, BarChart, DollarSign, Users, Percent } from 'lucide-react';
import { PartnerContact } from '@/types/contact';
// Toast functionality will be used in future implementations
import useContacts from '@/hooks/useContacts';
import { useRouter } from 'next/navigation';
// Date formatting handled by component-specific functions


// Extended PartnerContact interface with additional metadata fields for programs
interface ProgramPartnerContact extends PartnerContact {
  metadata: {
    // Required fields from PartnerContact
    partnership_type: string;
    since: string;
    // Additional program-specific fields
    program_name?: string;
    commission_rate?: string;
    product_categories?: string[];
    total_affiliates?: number;
    total_sales?: number;
    total_commission?: number;
    status?: 'active' | 'paused' | 'discontinued';
    start_date?: string;
    end_date?: string | null;
    terms_url?: string;
    description?: string;
    performance?: {
      conversion_rate?: number;
      average_order_value?: number;
      clicks?: number;
      impressions?: number;
      time_periods?: {
        daily?: Record<string, number>;
        weekly?: Record<string, number>;
        monthly?: Record<string, number>;
      };
    };
  };
}

// Extended PartnerContact interface with additional metadata fields for brands
interface BrandPartnerContact extends PartnerContact {
  metadata: {
    // Required fields from PartnerContact
    partnership_type: string;
    since: string;
    // Additional brand-specific fields
    brand_name?: string;
    website?: string;
    logo_url?: string;
    industry?: string;
    products?: string[];
    programs?: string[];
    status?: 'active' | 'paused' | 'discontinued';
    contact_person?: {
      name?: string;
      email?: string;
      phone?: string;
    };
    performance?: {
      total_sales?: number;
      total_commission?: number;
      conversion_rate?: number;
    };
  };
}

// No props needed for this component currently

export const AffiliationPrograms: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('programs');

  // Use the contacts hook to fetch partner contacts for programs
  const { 
    contacts: programContacts, 
    loading: programsLoading, 
  } = useContacts({
    type: 'partner',
    initialFilters: { tags: ['affiliate_program'] },
    autoFetch: true
  });
  
  // Use the contacts hook to fetch partner contacts for brands
  const { 
    contacts: brandContacts, 
    loading: brandsLoading, 
  } = useContacts({
    type: 'partner',
    initialFilters: { tags: ['brand_partner'] },
    autoFetch: true
  });

  // Filter programs based on search term
  const filteredPrograms = useMemo(() => {
    if (!programContacts || programContacts.length === 0) return [];
    
    return programContacts.filter((program) => {
      // Use type assertion for metadata access
      const metadata = program.metadata as ProgramPartnerContact['metadata'] || {};
      const programName = metadata.program_name || '';
      const description = metadata.description || '';
      
      return (
        programName.toLowerCase().includes('') ||
        description.toLowerCase().includes('')
      );
    }) as ProgramPartnerContact[];
  }, [programContacts]);
  
  // Filter brands based on search term
  const filteredBrands = useMemo(() => {
    if (!brandContacts || brandContacts.length === 0) return [];
    
    return brandContacts.filter((brand) => {
      // Use type assertion for metadata access
      const metadata = brand.metadata as BrandPartnerContact['metadata'] || {};
      const brandName = metadata.brand_name || '';
      const industry = metadata.industry || '';
      
      return (
        brandName.toLowerCase().includes('') ||
        industry.toLowerCase().includes('')
      );
    }) as BrandPartnerContact[];
  }, [brandContacts]);

  // Handle creating a new program
  const handleCreateProgram = () => {
    router.push('/marketing/affiliation/programs/new');
  };
  
  // Handle creating a new brand
  const handleCreateBrand = () => {
    router.push('/marketing/affiliation/brands/new');
  };
  
  // Handle viewing program details
  const handleViewProgram = (programId: string) => {
    router.push(`/marketing/affiliation/programs/${programId}`);
  };
  
  // Handle viewing brand details
  const handleViewBrand = (brandId: string) => {
    router.push(`/marketing/affiliation/brands/${brandId}`);
  };

  // Get status badge color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'discontinued':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Programmes d&#39;Affiliation
          </h2>
          <p className="text-muted-foreground">
            Gérez vos programmes et partenariats d&#39;affiliation
          </p>
        </div>
        {activeTab === 'programs' ? (
          <Button
            onClick={handleCreateProgram}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Programme
          </Button>
        ) : (
          <Button
            onClick={handleCreateBrand}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Marque
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="programs">Programmes</TabsTrigger>
          <TabsTrigger value="brands">Marques</TabsTrigger>
        </TabsList>

        <TabsContent value="programs">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle>Programmes d&#39;Affiliation</CardTitle>
              <CardDescription>Liste des programmes d&#39;affiliation actifs et inactifs</CardDescription>
            </CardHeader>
            <CardContent>
              {programsLoading ? (
                <div className="flex justify-center items-center py-8">
                  {/* <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /> */}
                </div>
              ) : filteredPrograms.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun programme trouvé.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom du Programme</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Affiliés</TableHead>
                      <TableHead>Ventes</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrograms.map((program) => (
                      <TableRow key={program.id}>
                        <TableCell className="font-medium">{(program.metadata as ProgramPartnerContact['metadata'])?.program_name || 'Sans nom'}</TableCell>
                        <TableCell>{(program.metadata as ProgramPartnerContact['metadata'])?.commission_rate || '0%'}</TableCell>
                        <TableCell>{(program.metadata as ProgramPartnerContact['metadata'])?.total_affiliates || 0}</TableCell>
                        <TableCell>{(program.metadata as ProgramPartnerContact['metadata'])?.total_sales || 0}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor((program.metadata as ProgramPartnerContact['metadata'])?.status)}>
                            {(program.metadata as ProgramPartnerContact['metadata'])?.status === 'active' ? 'Actif' : 
                             (program.metadata as ProgramPartnerContact['metadata'])?.status === 'paused' ? 'En pause' : 
                             (program.metadata as ProgramPartnerContact['metadata'])?.status === 'discontinued' ? 'Arrêté' : 'Inconnu'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewProgram(program.id)}
                          >
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            Détails
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brands">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle>Marques Partenaires</CardTitle>
              <CardDescription>Liste des marques partenaires du programme d&#39;affiliation</CardDescription>
            </CardHeader>
            <CardContent>
              {brandsLoading ? (
                <div className="flex justify-center items-center py-8">
                  {/* <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /> */}
                </div>
              ) : filteredBrands.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune marque trouvée.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom de la Marque</TableHead>
                      <TableHead>Industrie</TableHead>
                      <TableHead>Programmes</TableHead>
                      <TableHead>Ventes</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBrands.map((brand) => (
                      <TableRow key={brand.id}>
                        <TableCell className="font-medium">{(brand.metadata as BrandPartnerContact['metadata'])?.brand_name || 'Sans nom'}</TableCell>
                        <TableCell>{(brand.metadata as BrandPartnerContact['metadata'])?.industry || 'Non spécifié'}</TableCell>
                        <TableCell>{((brand.metadata as BrandPartnerContact['metadata'])?.programs?.length || 0)}</TableCell>
                        <TableCell>{(brand.metadata as BrandPartnerContact['metadata'])?.performance?.total_sales || 0}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor((brand.metadata as BrandPartnerContact['metadata'])?.status)}>
                            {(brand.metadata as BrandPartnerContact['metadata'])?.status === 'active' ? 'Actif' : 
                             (brand.metadata as BrandPartnerContact['metadata'])?.status === 'paused' ? 'En pause' : 
                             (brand.metadata as BrandPartnerContact['metadata'])?.status === 'discontinued' ? 'Arrêté' : 'Inconnu'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewBrand(brand.id)}
                          >
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            Détails
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart className="h-4 w-4 mr-2 text-blue-500" />
              Taux de Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pas de description</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-500" />
              Commissions Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450€</div>
            <p className="text-xs text-green-600">+8.3% ce mois</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-purple-500" />
              Affiliés Actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pas d&#39;email</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Percent className="h-4 w-4 mr-2 text-yellow-500" />
              Commission Moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5%</div>
            <p className="text-xs text-green-600">+1.2% ce mois</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AffiliationPrograms;
