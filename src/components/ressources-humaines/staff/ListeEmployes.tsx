'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { 
  Card, 
  CardContent, 
  // CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  // Briefcase, 
  Users, 
  // Award, 
  Edit, 
  Trash2, 
  Filter 
} from 'lucide-react';

export interface Employee {
  id: string;
  nom: string;
  prenom: string;
  photo: string;
  departement: string;
  poste: string;
  dateEmbauche: string;
  email: string;
  telephone: string;
  competences: string[];
  performance: {
    noteAnnuelle: number;
    objectifsAtteints: string;
    progression: string;
  };
}

// Mapping between our Employee interface and Supabase contacts table
const mapContactToEmployee = (contact: any): Employee => ({
  id: contact.id,
  nom: contact.last_name,
  prenom: contact.first_name,
  photo: contact.metadata?.photo || '/placeholder-avatar.jpg',
  departement: contact.metadata?.departement || '',
  poste: contact.position || '',
  dateEmbauche: contact.metadata?.hire_date || '',
  email: contact.email || '',
  telephone: contact.phone || '',
  competences: contact.tags || [],
  performance: contact.metadata?.performance || {
    noteAnnuelle: 0,
    objectifsAtteints: '',
    progression: ''
  }
});

const mapEmployeeToContact = (employee: Omit<Employee, 'id' | 'photo' | 'performance'>) => ({
  first_name: employee.prenom,
  last_name: employee.nom,
  email: employee.email,
  phone: employee.telephone,
  type: 'member',
  status: 'active',
  position: employee.poste,
  tags: employee.competences,
  metadata: {
    departement: employee.departement,
    hire_date: employee.dateEmbauche,
    photo: '/placeholder-avatar.jpg',
    performance: {
      noteAnnuelle: 0,
      objectifsAtteints: '',
      progression: ''
    }
  }
});

interface ListeEmployesProps {
  // These props are kept for backward compatibility but are no longer used
  employes?: Employee[];
  setEmployes?: React.Dispatch<React.SetStateAction<Employee[]>>;
  onAddEmploye?: (nouvelEmploye: Omit<Employee, 'id' | 'photo' | 'performance'>) => void;
}

const ListeEmployes: React.FC<ListeEmployesProps> = ({}) => {
  const [employes, setEmployes] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartement, setSelectedDepartement] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEmploye, setNewEmploye] = useState({
    nom: '',
    prenom: '',
    departement: '',
    poste: '',
    dateEmbauche: '',
    email: '',
    telephone: '',
    competences: ''
  });
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEmploye({
      ...newEmploye,
      [name]: value
    });
  };

  // Fetch employees from Supabase on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('type', 'member');
      
      if (error) {
        throw error;
      }
      
      const mappedEmployees = data.map(mapContactToEmployee);
      setEmployes(mappedEmployees);
    } catch (err) {
      console.error('Error fetching employees:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger la liste des employés',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const competencesArray = newEmploye.competences
        .split(',')
        .map(comp => comp.trim())
        .filter(comp => comp !== '');
      
      const contactData = mapEmployeeToContact({
        ...newEmploye,
        competences: competencesArray
      });
      
      const { data, error } = await supabase
        .from('contacts')
        .insert([contactData])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data && data[0]) {
        const newEmployee = mapContactToEmployee(data[0]);
        setEmployes(prev => [...prev, newEmployee]);
        
        toast({
          title: 'Succès',
          description: 'Nouvel employé ajouté avec succès',
        });
      }
      
      setNewEmploye({
        nom: '',
        prenom: '',
        departement: '',
        poste: '',
        dateEmbauche: '',
        email: '',
        telephone: '',
        competences: ''
      });
      
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error adding employee:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter le nouvel employé',
        variant: 'destructive'
      });
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setEmployes(prev => prev.filter(emp => emp.id !== id));
      
      toast({
        title: 'Succès',
        description: 'Employé supprimé avec succès',
      });
    } catch (err) {
      console.error('Error deleting employee:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'employé',
        variant: 'destructive'
      });
    }
  };

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };

  const filteredEmployes = employes.filter(emp => {
    const matchesSearch = 
      emp.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
      emp.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.poste.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartement = selectedDepartement === 'all' || emp.departement === selectedDepartement;
    
    return matchesSearch && matchesDepartement;
  });

  const departements = [...new Set(employes.map(emp => emp.departement || 'Non spécifié'))].filter(Boolean);

  return (
    <Card className="w-full border dark:border-gray-700">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-gray-900 dark:text-white">Liste des Employés</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter un employé
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">Ajouter un nouvel employé</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input
                      id="nom"
                      name="nom"
                      value={newEmploye.nom}
                      onChange={handleInputChange}
                      required
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input
                      id="prenom"
                      name="prenom"
                      value={newEmploye.prenom}
                      onChange={handleInputChange}
                      required
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="departement">Département</Label>
                  <Select 
                    value={newEmploye.departement} 
                    onValueChange={(value) => setNewEmploye({...newEmploye, departement: value})}
                  >
                    <SelectTrigger id="departement" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Sélectionner un département" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="Technologie">Technologie</SelectItem>
                      <SelectItem value="Produit">Produit</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Ressources humaines">Ressources humaines</SelectItem>
                      <SelectItem value="Discord">Discord</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="poste">Poste</Label>
                  <Input
                    id="poste"
                    name="poste"
                    value={newEmploye.poste}
                    onChange={handleInputChange}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateEmbauche">Date d'embauche</Label>
                  <Input
                    id="dateEmbauche"
                    name="dateEmbauche"
                    type="date"
                    value={newEmploye.dateEmbauche}
                    onChange={handleInputChange}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newEmploye.email}
                    onChange={handleInputChange}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    name="telephone"
                    value={newEmploye.telephone}
                    onChange={handleInputChange}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="competences">Compétences (séparées par des virgules)</Label>
                  <Input
                    id="competences"
                    name="competences"
                    value={newEmploye.competences}
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
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="text"
              placeholder="Rechercher un employé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <Select value={selectedDepartement} onValueChange={setSelectedDepartement}>
            <SelectTrigger className="w-full md:w-48 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Filtrer par département" />
              </div>
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="all">Tous les départements</SelectItem>
              {departements.map((dept, index) => (
                <SelectItem key={index} value={dept || `dept-${index}`}>{dept || 'Non spécifié'}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher un employé..." 
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={selectedDepartement} onValueChange={setSelectedDepartement}>
              <SelectTrigger className="w-full md:w-48 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Filtrer par département" />
                </div>
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all">Tous les départements</SelectItem>
                {departements.map((dept, index) => (
                  <SelectItem key={index} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredEmployes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployes.map(emp => (
              <Card key={emp.id} className="overflow-hidden border dark:border-gray-700">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        {emp.photo ? (
                          <Image 
                            src={emp.photo} 
                            alt={`${emp.prenom} ${emp.nom}`} 
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                            {emp.prenom.charAt(0)}{emp.nom.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{emp.prenom} {emp.nom}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{emp.poste}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                      {emp.departement}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{emp.telephone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Embauché le {new Date(emp.dateEmbauche).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {emp.competences.map((comp, index) => (
                      <Badge key={index} variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                        {comp}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={() => handleView(emp)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-500 hover:text-red-700 dark:border-gray-600 dark:hover:bg-gray-700"
                    onClick={() => handleDelete(emp.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Aucun employé trouvé</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || selectedDepartement !== 'all' 
                ? "Aucun résultat pour votre recherche. Essayez de modifier vos critères."
                : "Commencez par ajouter des employés à votre liste."}
            </p>
            <Button 
              className="mt-4 bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter un employé
            </Button>
          </div>
        )}
      </CardContent>
      
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px] dark:bg-gray-800 dark:border-gray-700">
          {selectedEmployee && (
            <>
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">Détails de l&apos;employé</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Département</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedEmployee.departement}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Poste</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedEmployee.poste}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Date d&apos;embauche</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(selectedEmployee.dateEmbauche).toLocaleDateString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedEmployee.email}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Téléphone</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedEmployee.telephone}</p>
                </div>
                <div className="space-y-2 col-span-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Compétences</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedEmployee.competences.map((comp, idx) => (
                      <Badge key={idx} variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                        {comp}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Performance</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Note annuelle</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedEmployee.performance.noteAnnuelle || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Objectifs atteints</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedEmployee.performance.objectifsAtteints}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Progression</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedEmployee.performance.progression}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ListeEmployes;
