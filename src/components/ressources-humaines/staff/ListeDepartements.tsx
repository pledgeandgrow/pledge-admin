'use client';

import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Building2, 
  Users, 
  Wallet, 
  FolderKanban, 
  Search,
  PlusCircle
} from 'lucide-react';

export interface Departement {
  nom: string;
  effectif: number;
  responsable: string;
  budgetFormation: number;
  projetsEnCours: number;
}

interface ListeDepartementsProps {
  departements: Departement[];
}

const ListeDepartements: React.FC<ListeDepartementsProps> = ({ departements }) => {
  // Calculate total employees across all departments
  const totalEmployees = departements.reduce((acc, dept) => acc + dept.effectif, 0);
  
  // Calculate total budget across all departments
  const totalBudget = departements.reduce((acc, dept) => acc + dept.budgetFormation, 0);
  
  // Calculate total projects across all departments
  const totalProjects = departements.reduce((acc, dept) => acc + dept.projetsEnCours, 0);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDepartement, setNewDepartement] = useState({
    nom: '',
    responsable: '',
    budgetFormation: 0,
    projetsEnCours: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDepartement({
      ...newDepartement,
      [name]: name === 'budgetFormation' || name === 'projetsEnCours' 
        ? parseInt(value) || 0 
        : value
    });
  };

  const filteredDepartements = departements.filter(dept => 
    dept.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.responsable.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full border dark:border-gray-700">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-gray-900 dark:text-white">Départements</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter un département
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">Ajouter un nouveau département</DialogTitle>
              </DialogHeader>
              <form className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="nom" className="text-gray-900 dark:text-white">Nom du département</Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={newDepartement.nom}
                    onChange={handleInputChange}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="responsable" className="text-gray-900 dark:text-white">Responsable</Label>
                  <Input
                    id="responsable"
                    name="responsable"
                    value={newDepartement.responsable}
                    onChange={handleInputChange}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budgetFormation" className="text-gray-900 dark:text-white">Budget Formation (€)</Label>
                  <Input
                    id="budgetFormation"
                    name="budgetFormation"
                    type="number"
                    min="0"
                    value={newDepartement.budgetFormation}
                    onChange={handleInputChange}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projetsEnCours" className="text-gray-900 dark:text-white">Projets en cours</Label>
                  <Input
                    id="projetsEnCours"
                    name="projetsEnCours"
                    type="number"
                    min="0"
                    value={newDepartement.projetsEnCours}
                    onChange={handleInputChange}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="dark:border-gray-600 dark:text-gray-300">
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Ajouter
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un département..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Effectif Total</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalEmployees}</div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">
                  Répartis sur {departements.filter(d => d.effectif > 0).length} départements
                </p>
              </CardContent>
            </Card>
            
            <Card className="border dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Budget Formation</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalBudget.toLocaleString()}€</div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">
                  Budget annuel total
                </p>
              </CardContent>
            </Card>
            
            <Card className="border dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Projets en Cours</CardTitle>
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalProjects}</div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">
                  À travers tous les départements
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="border dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Répartition des Effectifs</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Distribution des employés par département</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departements.map((dept, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center text-gray-900 dark:text-white">
                        <Building2 className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        {dept.nom}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{dept.effectif} employés</span>
                    </div>
                    <Progress 
                      value={totalEmployees > 0 ? (dept.effectif / totalEmployees) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Liste des Départements</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Détails de tous les départements de l&apos;entreprise</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-b dark:border-gray-700">
                    <TableHead className="text-gray-900 dark:text-gray-200">Département</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-200">Responsable</TableHead>
                    <TableHead className="text-right text-gray-900 dark:text-gray-200">Effectif</TableHead>
                    <TableHead className="text-right text-gray-900 dark:text-gray-200">Budget Formation</TableHead>
                    <TableHead className="text-right text-gray-900 dark:text-gray-200">Projets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartements.map((dept, index) => (
                    <TableRow key={index} className="border-b dark:border-gray-700">
                      <TableCell className="font-medium text-gray-900 dark:text-white">{dept.nom}</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">{dept.responsable || 'Non assigné'}</TableCell>
                      <TableCell className="text-right">
                        {dept.effectif > 0 ? (
                          <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">{dept.effectif}</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">0</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-gray-700 dark:text-gray-300">
                        {dept.budgetFormation > 0 ? (
                          <span>{dept.budgetFormation.toLocaleString()}€</span>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {dept.projetsEnCours > 0 ? (
                          <Badge className="dark:bg-gray-700 dark:text-gray-200">{dept.projetsEnCours}</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">0</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListeDepartements;
