'use client';

import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Plus, ArrowUpRight } from 'lucide-react';

interface Program {
  name: string;
  commission: string;
  affiliates: number;
  revenue: string;
  performance: string;
  status: string;
}

interface Brand {
  name: string;
  type: string;
  commission: string;
  earnings: string;
  status: string;
}

interface AffiliationProgramsProps {
  programs: Program[];
  brands: Brand[];
}

export const AffiliationPrograms: FC<AffiliationProgramsProps> = ({
  programs,
  brands
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Nos Programmes d&apos;Affiliation
          </h2>
          <p className="text-muted-foreground">
            Gérez vos programmes d&apos;affiliation et marques partenaires
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Nouveau Programme
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher un programme ou une marque..."
            className="pl-9 bg-white dark:bg-gray-800"
          />
        </div>
        <Button variant="outline">Filtres</Button>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Programmes Actifs</TabsTrigger>
          <TabsTrigger value="pending">En Attente</TabsTrigger>
          <TabsTrigger value="archived">Archivés</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader className="pb-0">
              <CardTitle>Programmes Actifs</CardTitle>
              <CardDescription>Liste des programmes d&apos;affiliation actifs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Programme</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Affiliés</TableHead>
                    <TableHead>Revenus</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programs.map((program) => (
                    <TableRow key={program.name}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-medium">{program.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Commission: {program.commission}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{program.commission}</TableCell>
                      <TableCell>{program.affiliates}</TableCell>
                      <TableCell>{program.revenue}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            program.status === 'Excellent'
                              ? 'text-green-600 border-green-600/20 bg-green-600/10'
                              : 'text-blue-600 border-blue-600/20 bg-blue-600/10'
                          }
                        >
                          {program.performance}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader className="pb-0">
              <CardTitle>Marques Partenaires</CardTitle>
              <CardDescription>Marques que nous promouvons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {brands.map((brand) => (
                  <Card key={brand.name} className="bg-gray-50 dark:bg-gray-900">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{brand.name}</span>
                        <Badge variant="outline">{brand.type}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Commission</span>
                          <span className="font-medium">{brand.commission}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Gains</span>
                          <span className="font-medium">{brand.earnings}</span>
                        </div>
                        <Button variant="ghost" className="w-full mt-2">
                          Voir les détails <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle>Programmes en Attente</CardTitle>
              <CardDescription>Programmes en cours de validation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Aucun programme en attente
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archived">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle>Programmes Archivés</CardTitle>
              <CardDescription>Historique des anciens programmes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Aucun programme archivé
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AffiliationPrograms;
