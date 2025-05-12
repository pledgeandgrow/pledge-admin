'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  MapPin, 
  Target, 
  Users, 
  Megaphone, 
  PlusCircle, 
  Trash2, 
  Save, 
  Undo2, 
  Map
} from 'lucide-react';

interface TargetingCriteria {
  id: number;
  region: string;
  age: string;
  income: string;
  interests: string[];
  radius: number;
  isActive: boolean;
}

const initialCriteria: TargetingCriteria[] = [
  {
    id: 1,
    region: 'Île-de-France',
    age: '25-34',
    income: 'Élevé',
    interests: ['Technologie', 'Finance', 'Luxe'],
    radius: 25,
    isActive: true
  },
  {
    id: 2,
    region: 'Auvergne-Rhône-Alpes',
    age: '35-44',
    income: 'Moyen-Élevé',
    interests: ['Sport', 'Gastronomie', 'Voyage'],
    radius: 40,
    isActive: true
  },
  {
    id: 3,
    region: 'Provence-Alpes-Côte d\'Azur',
    age: '45-54',
    income: 'Élevé',
    interests: ['Art', 'Gastronomie', 'Immobilier'],
    radius: 30,
    isActive: false
  }
];

const regions = [
  'Île-de-France',
  'Auvergne-Rhône-Alpes',
  'Provence-Alpes-Côte d\'Azur',
  'Nouvelle-Aquitaine',
  'Hauts-de-France',
  'Grand Est',
  'Occitanie',
  'Bretagne',
  'Normandie',
  'Pays de la Loire',
  'Bourgogne-Franche-Comté',
  'Centre-Val de Loire',
  'Corse'
];

const ageRanges = [
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65+'
];

const incomeRanges = [
  'Faible',
  'Moyen',
  'Moyen-Élevé',
  'Élevé'
];

const interestOptions = [
  'Technologie',
  'Finance',
  'Luxe',
  'Sport',
  'Gastronomie',
  'Voyage',
  'Art',
  'Immobilier',
  'Mode',
  'Santé',
  'Éducation',
  'Environnement'
];

export function GeoTargeting() {
  const [criteria, setCriteria] = useState<TargetingCriteria[]>(initialCriteria);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<TargetingCriteria | null>(null);
  const [showMap, setShowMap] = useState(false);
  
  const handleEdit = (id: number) => {
    const criteriaToEdit = criteria.find(c => c.id === id);
    if (criteriaToEdit) {
      setEditForm({...criteriaToEdit});
      setEditingId(id);
    }
  };
  
  const handleSave = () => {
    if (editForm) {
      setCriteria(criteria.map(c => c.id === editingId ? editForm : c));
      setEditingId(null);
      setEditForm(null);
    }
  };
  
  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };
  
  const handleDelete = (id: number) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };
  
  const handleAddNew = () => {
    const newId = Math.max(...criteria.map(c => c.id), 0) + 1;
    const newCriteria: TargetingCriteria = {
      id: newId,
      region: regions[0],
      age: ageRanges[1],
      income: incomeRanges[1],
      interests: [interestOptions[0]],
      radius: 30,
      isActive: false
    };
    
    setCriteria([...criteria, newCriteria]);
    setEditForm({...newCriteria});
    setEditingId(newId);
  };
  
  const handleToggleActive = (id: number) => {
    setCriteria(criteria.map(c => 
      c.id === id ? {...c, isActive: !c.isActive} : c
    ));
  };
  
  const handleInterestToggle = (interest: string) => {
    if (!editForm) return;
    
    const updatedInterests = editForm.interests.includes(interest)
      ? editForm.interests.filter(i => i !== interest)
      : [...editForm.interests, interest];
      
    setEditForm({...editForm, interests: updatedInterests});
  };
  
  const handleFormChange = (field: keyof TargetingCriteria, value: any) => {
    if (!editForm) return;
    setEditForm({...editForm, [field]: value});
  };

  return (
    <Card className="border dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-gray-900 dark:text-white">Ciblage Géographique</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Définissez vos critères de ciblage par région
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 gap-1"
              onClick={() => setShowMap(!showMap)}
            >
              <Map className="h-4 w-4" />
              <span>{showMap ? 'Masquer la carte' : 'Afficher la carte'}</span>
            </Button>
            <Button 
              size="sm" 
              className="h-9 gap-1"
              onClick={handleAddNew}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Nouveau Ciblage</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showMap && (
          <div className="mb-6 aspect-[16/9] bg-gray-100 dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden relative">
            {/* Placeholder for map - in a real app, use a map library */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Map className="h-16 w-16 text-gray-300 dark:text-gray-600" />
              <span className="absolute text-sm text-gray-500 dark:text-gray-400">Carte de ciblage</span>
            </div>
            
            {/* Sample map markers for active targeting */}
            {criteria.filter(c => c.isActive).map((c, i) => {
              // Pseudo-random positions for demo
              const top = 20 + (i * 15) + (c.id * 7) % 60;
              const left = 20 + (i * 20) + (c.id * 11) % 60;
              
              return (
                <div key={c.id} className="absolute" style={{ top: `${top}%`, left: `${left}%` }}>
                  <div className="relative">
                    <div className={`h-5 w-5 bg-blue-500 rounded-full animate-pulse`}></div>
                    <div 
                      className="absolute -top-1 -left-1 rounded-full border-2 border-blue-500 opacity-30"
                      style={{ 
                        width: `${c.radius * 2}px`, 
                        height: `${c.radius * 2}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    ></div>
                    <div className="absolute top-6 left-0 bg-white dark:bg-gray-800 shadow-md rounded px-2 py-1 text-xs whitespace-nowrap">
                      {c.region}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="space-y-4">
          {criteria.map(item => (
            <div 
              key={item.id} 
              className={`p-4 border rounded-lg ${
                item.isActive 
                  ? 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/10' 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              {editingId === item.id ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      Modifier le ciblage
                    </h3>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleCancel}
                      >
                        <Undo2 className="h-4 w-4 mr-1" />
                        Annuler
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleSave}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Enregistrer
                      </Button>
                    </div>
                  </div>
                  
                  {editForm && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="region">Région</Label>
                          <Select 
                            value={editForm.region} 
                            onValueChange={(value) => handleFormChange('region', value)}
                          >
                            <SelectTrigger id="region">
                              <SelectValue placeholder="Sélectionner une région" />
                            </SelectTrigger>
                            <SelectContent>
                              {regions.map((region) => (
                                <SelectItem key={region} value={region}>
                                  {region}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="age">Tranche d'âge</Label>
                          <Select 
                            value={editForm.age} 
                            onValueChange={(value) => handleFormChange('age', value)}
                          >
                            <SelectTrigger id="age">
                              <SelectValue placeholder="Sélectionner une tranche d'âge" />
                            </SelectTrigger>
                            <SelectContent>
                              {ageRanges.map((age) => (
                                <SelectItem key={age} value={age}>
                                  {age}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="income">Niveau de revenu</Label>
                          <Select 
                            value={editForm.income} 
                            onValueChange={(value) => handleFormChange('income', value)}
                          >
                            <SelectTrigger id="income">
                              <SelectValue placeholder="Sélectionner un niveau de revenu" />
                            </SelectTrigger>
                            <SelectContent>
                              {incomeRanges.map((income) => (
                                <SelectItem key={income} value={income}>
                                  {income}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Rayon de ciblage (km)</Label>
                          <div className="flex items-center gap-4">
                            <Slider
                              value={[editForm.radius]}
                              min={5}
                              max={100}
                              step={5}
                              onValueChange={(value) => handleFormChange('radius', value[0])}
                              className="flex-1"
                            />
                            <span className="w-12 text-center">{editForm.radius}km</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="active-status"
                            checked={editForm.isActive}
                            onCheckedChange={(checked) => handleFormChange('isActive', checked)}
                          />
                          <Label htmlFor="active-status">Activer ce ciblage</Label>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Centres d'intérêt</Label>
                        <div className="border rounded-md p-3 dark:border-gray-700 h-[220px] overflow-y-auto">
                          <div className="grid grid-cols-2 gap-2">
                            {interestOptions.map((interest) => (
                              <div key={interest} className="flex items-center">
                                <Button
                                  type="button"
                                  variant={editForm.interests.includes(interest) ? "default" : "outline"}
                                  size="sm"
                                  className="w-full justify-start text-xs h-8"
                                  onClick={() => handleInterestToggle(interest)}
                                >
                                  {interest}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Sélectionnez les centres d'intérêt pour affiner votre ciblage
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{item.region}</h3>
                        {item.isActive ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            Actif
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500 dark:text-gray-400">
                            Inactif
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Âge: {item.age}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Revenu: {item.income}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Rayon: {item.radius}km
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-8 ${item.isActive ? 'border-red-200 hover:border-red-300 text-red-600' : 'border-green-200 hover:border-green-300 text-green-600'}`}
                        onClick={() => handleToggleActive(item.id)}
                      >
                        {item.isActive ? 'Désactiver' : 'Activer'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => handleEdit(item.id)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Centres d'intérêt</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {item.interests.map((interest, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {criteria.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Target className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Aucun ciblage défini</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-4">
                Créez votre premier ciblage géographique pour atteindre votre audience dans des zones spécifiques
              </p>
              <Button onClick={handleAddNew}>
                <PlusCircle className="h-4 w-4 mr-1" />
                Nouveau Ciblage
              </Button>
            </div>
          )}
        </div>
        
        {criteria.length > 0 && (
          <div className="mt-6 pt-4 border-t dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Résumé du ciblage</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {criteria.filter(c => c.isActive).length} ciblage(s) actif(s) sur {criteria.length} total
                </p>
              </div>
              <Button>
                <Megaphone className="h-4 w-4 mr-1" />
                Lancer une campagne
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
