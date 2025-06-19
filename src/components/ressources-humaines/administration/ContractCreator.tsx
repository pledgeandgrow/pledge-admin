'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Save, CheckCircle } from 'lucide-react';

export function ContractCreator() {
  const [contractType, setContractType] = useState('cdi');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Créateur de Contrats
          </CardTitle>
          <CardDescription>
            Créez et personnalisez des contrats pour vos employés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="new" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new">Nouveau Contrat</TabsTrigger>
              <TabsTrigger value="template">Modèles</TabsTrigger>
            </TabsList>
            <TabsContent value="new" className="pt-6">
              <form onSubmit={handleSubmit}>
                {isSubmitted && isSuccess ? (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/20 mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <h3 className="font-medium text-green-800 dark:text-green-300">Contrat créé avec succès</h3>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          Le contrat a été créé et envoyé pour approbation.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : isSubmitted ? (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/20 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full dark:border-blue-400 dark:border-t-transparent" />
                      <div>
                        <h3 className="font-medium text-blue-800 dark:text-blue-300">Création en cours</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-400">
                          Veuillez patienter pendant que nous créons votre contrat...
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="contract-type">Type de contrat</Label>
                    <Select 
                      value={contractType} 
                      onValueChange={setContractType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type de contrat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cdi">CDI - Contrat à Durée Indéterminée</SelectItem>
                        <SelectItem value="cdd">CDD - Contrat à Durée Déterminée</SelectItem>
                        <SelectItem value="stage">Stage</SelectItem>
                        <SelectItem value="alternance">Alternance</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="employee">Employé</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un employé" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Alexandre Dubois</SelectItem>
                          <SelectItem value="2">Sophie Martin</SelectItem>
                          <SelectItem value="3">Thomas Bernard</SelectItem>
                          <SelectItem value="4">Émilie Petit</SelectItem>
                          <SelectItem value="5">Lucas Moreau</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department">Département</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un département" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="it">IT</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="rh">Ressources Humaines</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Date de début</Label>
                      <Input 
                        id="start-date" 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    
                    {contractType !== 'cdi' && (
                      <div className="space-y-2">
                        <Label htmlFor="end-date">Date de fin</Label>
                        <Input 
                          id="end-date" 
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position">Poste</Label>
                    <Input id="position" placeholder="Ex: Développeur Full Stack" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="salary">Salaire annuel brut (€)</Label>
                      <Input id="salary" type="number" placeholder="Ex: 45000" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="working-hours">Heures hebdomadaires</Label>
                      <Input id="working-hours" type="number" placeholder="Ex: 35" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="additional-clauses">Clauses additionnelles</Label>
                    <Textarea 
                      id="additional-clauses" 
                      placeholder="Ajoutez des clauses spécifiques ou des conditions particulières..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Documents complémentaires</Label>
                    <div className="border border-dashed rounded-md p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Glissez-déposez des fichiers ici ou
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Parcourir les fichiers
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-4 mt-8">
                  <Button variant="outline" type="button">
                    Enregistrer comme brouillon
                  </Button>
                  <Button type="submit" disabled={isSubmitted}>
                    {isSubmitted ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                        Création en cours...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Créer le contrat
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="template" className="pt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['CDI Standard', 'CDD 6 mois', 'Stage 3 mois', 'Alternance', 'Freelance'].map((template, index) => (
                    <Card key={index} className="cursor-pointer hover:border-blue-500 transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{template}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground">
                          Modèle de contrat {template.toLowerCase()} avec clauses standards.
                        </p>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button variant="ghost" size="sm" className="w-full">
                          <FileText className="h-4 w-4 mr-2" />
                          Utiliser ce modèle
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  <Card className="border-dashed cursor-pointer hover:border-blue-500 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Créer un modèle</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">
                        Créez un nouveau modèle de contrat personnalisé.
                      </p>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button variant="ghost" size="sm" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Créer un modèle
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
