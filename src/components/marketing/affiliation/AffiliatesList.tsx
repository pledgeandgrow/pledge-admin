'use client';

import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Plus, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface Affiliate {
  id: string;
  name: string;
  code: string;
  referrals: number;
  earnings: string;
  status: string;
  lastActive: string;
}

interface AffiliatesListProps {
  affiliates: Affiliate[];
}

export const AffiliatesList: FC<AffiliatesListProps> = ({
  affiliates
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Nos Affiliés
          </h2>
          <p className="text-muted-foreground">
            Liste des affiliés et leurs codes de parrainage
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Nouvel Affilié
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher un affilié..."
            className="pl-9 bg-white dark:bg-gray-800"
          />
        </div>
        <Button variant="outline">Filtres</Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle>Affiliés Actifs</CardTitle>
          <CardDescription>Liste des affiliés et leurs performances</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Affilié</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Parrainages</TableHead>
                <TableHead>Gains</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière Activité</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {affiliates.map((affiliate) => (
                <TableRow key={affiliate.id}>
                  <TableCell>
                    <div className="font-medium">{affiliate.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                        {affiliate.code}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(affiliate.code)}
                      >
                        {copiedCode === affiliate.code ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{affiliate.referrals}</TableCell>
                  <TableCell>{affiliate.earnings}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        affiliate.status === 'Actif'
                          ? 'text-green-600 border-green-600/20 bg-green-600/10'
                          : affiliate.status === 'En pause'
                          ? 'text-yellow-600 border-yellow-600/20 bg-yellow-600/10'
                          : 'text-red-600 border-red-600/20 bg-red-600/10'
                      }
                    >
                      {affiliate.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {affiliate.lastActive}
                    </span>
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
    </div>
  );
};

export default AffiliatesList;
