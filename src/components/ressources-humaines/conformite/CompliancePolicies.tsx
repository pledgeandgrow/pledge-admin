'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Filter, Plus, FileText, Download, Eye, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

interface CompliancePolicy {
  id: number;
  title: string;
  category: string;
  status: 'active' | 'draft' | 'archived' | 'pending_review';
  version: string;
  lastUpdated: string;
  reviewDate: string;
  owner: string;
  description: string;
}

export function CompliancePolicies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPolicy, setSelectedPolicy] = useState<CompliancePolicy | null>(null);
  const [isPolicyDetailOpen, setIsPolicyDetailOpen] = useState(false);

  // Sample data
  const policies: CompliancePolicy[] = [
    {
      id: 1,
      title: 'Politique de Protection des Données',
      category: 'RGPD',
      status: 'active',
      version: '2.3',
      lastUpdated: '2025-01-15',
      reviewDate: '2025-07-15',
      owner: 'Département Juridique',
      description: 'Cette politique définit les règles et procédures pour la collecte, le traitement et la protection des données personnelles conformément au RGPD.'
    },
    {
      id: 2,
      title: 'Politique de Sécurité Informatique',
      category: 'Sécurité',
      status: 'active',
      version: '3.1',
      lastUpdated: '2024-11-20',
      reviewDate: '2025-05-20',
      owner: 'Département IT',
      description: 'Définit les mesures de sécurité à mettre en œuvre pour protéger les systèmes d\'information et les données de l\'entreprise.'
    },
    {
      id: 3,
      title: 'Code de Conduite',
      category: 'Éthique',
      status: 'active',
      version: '1.5',
      lastUpdated: '2024-09-10',
      reviewDate: '2025-09-10',
      owner: 'Ressources Humaines',
      description: 'Établit les principes éthiques et les comportements attendus de tous les employés dans l\'exercice de leurs fonctions.'
    },
    {
      id: 4,
      title: 'Politique Anti-corruption',
      category: 'Éthique',
      status: 'active',
      version: '2.0',
      lastUpdated: '2024-10-05',
      reviewDate: '2025-10-05',
      owner: 'Département Juridique',
      description: 'Définit les mesures préventives et les procédures à suivre pour prévenir et détecter les actes de corruption.'
    },
    {
      id: 5,
      title: 'Politique de Télétravail',
      category: 'RH',
      status: 'draft',
      version: '1.2',
      lastUpdated: '2025-02-10',
      reviewDate: '2025-03-10',
      owner: 'Ressources Humaines',
      description: 'Définit les conditions et modalités du télétravail pour les employés de l\'entreprise.'
    },
    {
      id: 6,
      title: 'Politique de Gestion des Risques',
      category: 'Gouvernance',
      status: 'pending_review',
      version: '1.0',
      lastUpdated: '2024-12-18',
      reviewDate: '2025-03-18',
      owner: 'Direction Générale',
      description: 'Établit le cadre de gestion des risques au sein de l\'entreprise, y compris l\'identification, l\'évaluation et le traitement des risques.'
    },
    {
      id: 7,
      title: 'Politique de Conservation des Documents',
      category: 'Juridique',
      status: 'active',
      version: '1.3',
      lastUpdated: '2024-08-22',
      reviewDate: '2025-08-22',
      owner: 'Département Juridique',
      description: 'Définit les durées de conservation des différents types de documents et les procédures d\'archivage et de destruction.'
    },
    {
      id: 8,
      title: 'Politique de Confidentialité',
      category: 'RGPD',
      status: 'archived',
      version: '1.0',
      lastUpdated: '2023-05-15',
      reviewDate: '2024-05-15',
      owner: 'Département Juridique',
      description: 'Ancienne version de la politique de confidentialité, remplacée par la Politique de Protection des Données.'
    }
  ];

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Actif</Badge>;
      case 'draft':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Brouillon</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">Archivé</Badge>;
      case 'pending_review':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">En revue</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  // Filter policies based on search term, category and status
  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || policy.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || policy.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(policies.map(policy => policy.category)));

  return (
    <div className="space-y-8">
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Politiques et Procédures
          </CardTitle>
          <CardDescription>
            Gérez les politiques et procédures de conformité de l&apos;entreprise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Rechercher une politique..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>{filterCategory === 'all' ? 'Toutes les catégories' : filterCategory}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>
                      {filterStatus === 'all' && 'Tous les statuts'}
                      {filterStatus === 'active' && 'Actif'}
                      {filterStatus === 'draft' && 'Brouillon'}
                      {filterStatus === 'archived' && 'Archivé'}
                      {filterStatus === 'pending_review' && 'En revue'}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                  <SelectItem value="pending_review">En revue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle politique
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière mise à jour</TableHead>
                <TableHead>Prochaine revue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPolicies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">{policy.title}</TableCell>
                  <TableCell>{policy.category}</TableCell>
                  <TableCell>{policy.version}</TableCell>
                  <TableCell>{getStatusBadge(policy.status)}</TableCell>
                  <TableCell>{new Date(policy.lastUpdated).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{new Date(policy.reviewDate).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedPolicy(policy);
                          setIsPolicyDetailOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredPolicies.length === 0 && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              Aucune politique ne correspond à votre recherche.
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t dark:border-gray-700 px-6 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Affichage de {filteredPolicies.length} politiques sur {policies.length}
          </div>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Exporter la liste
          </Button>
        </CardFooter>
      </Card>

      {/* Policy Detail Dialog */}
      <Dialog open={isPolicyDetailOpen} onOpenChange={setIsPolicyDetailOpen}>
        <DialogContent className="sm:max-w-3xl">
          {selectedPolicy && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle>{selectedPolicy.title}</DialogTitle>
                  {getStatusBadge(selectedPolicy.status)}
                </div>
                <DialogDescription>
                  Version {selectedPolicy.version} • {selectedPolicy.category}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Propriétaire</p>
                    <p className="font-medium">{selectedPolicy.owner}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                    <p className="font-medium">{new Date(selectedPolicy.lastUpdated).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prochaine revue</p>
                    <p className="font-medium">{new Date(selectedPolicy.reviewDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Statut</p>
                    <p className="font-medium">{getStatusBadge(selectedPolicy.status)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm">{selectedPolicy.description}</p>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <p className="font-medium">Contenu de la politique</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Le contenu complet de la politique serait affiché ici. Cliquez sur le bouton ci-dessous pour télécharger le document.
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Calendrier de conformité</p>
                    <p className="text-sm text-muted-foreground">
                      Formation obligatoire pour tous les employés d&apos;ici le 31/03/2025
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Taux de conformité</p>
                    <p className="text-sm text-muted-foreground">
                      87% des employés ont complété la formation associée à cette politique
                    </p>
                  </div>
                </div>
                
                {selectedPolicy.status === 'pending_review' && (
                  <div className="flex items-center gap-4">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium">Action requise</p>
                      <p className="text-sm text-muted-foreground">
                        Cette politique est en attente de révision. Veuillez la mettre à jour avant la date d&apos;échéance.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                {selectedPolicy.status === 'draft' || selectedPolicy.status === 'pending_review' ? (
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                ) : null}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
