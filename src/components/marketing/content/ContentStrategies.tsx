'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit, Calendar, Target, CheckCircle2 } from 'lucide-react';

interface ContentStrategy {
  id: number;
  title: string;
  description: string;
  objective: string;
  status: 'planned' | 'active' | 'completed';
  date?: string;
}

interface ContentStrategiesProps {
  mode: 'dialog' | 'list';
}

export function ContentStrategies({ mode }: ContentStrategiesProps) {
  const [strategies, setStrategies] = useState<ContentStrategy[]>([
    {
      id: 1,
      title: "Stratégie de contenu Q1 2025",
      description: "Focus sur le contenu éducatif et les études de cas",
      objective: "Augmenter l'engagement de 25%",
      status: "planned",
      date: "2025-03-15"
    },
    {
      id: 2,
      title: "Campagne de marque employeur",
      description: "Mettre en avant notre culture d'entreprise",
      objective: "Attirer 50 nouveaux talents",
      status: "active",
      date: "2025-02-01"
    },
    {
      id: 3,
      title: "Série d'articles techniques",
      description: "Contenu approfondi sur nos solutions techniques",
      objective: "Positionner la marque comme expert",
      status: "completed",
      date: "2025-01-10"
    }
  ]);

  const [newStrategy, setNewStrategy] = useState<{
    title: string;
    description: string;
    objective: string;
    date: string;
    status: 'planned' | 'active' | 'completed';
  }>({
    title: '',
    description: '',
    objective: '',
    date: '',
    status: 'planned'
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      setStrategies(strategies.map(strategy => 
        strategy.id === editingId 
          ? { ...strategy, ...newStrategy }
          : strategy
      ));
      setEditingId(null);
    } else {
      setStrategies([...strategies, {
        id: Math.max(0, ...strategies.map(s => s.id)) + 1,
        ...newStrategy
      }]);
    }
    setNewStrategy({ title: '', description: '', objective: '', date: '', status: 'planned' });
  };

  const handleDelete = (id: number) => {
    setStrategies(strategies.filter(strategy => strategy.id !== id));
  };

  const handleEdit = (strategy: ContentStrategy) => {
    setNewStrategy({
      title: strategy.title,
      description: strategy.description,
      objective: strategy.objective,
      date: strategy.date || '',
      status: strategy.status
    });
    setEditingId(strategy.id);
  };

  const updateStatus = (id: number, status: 'planned' | 'active' | 'completed') => {
    setStrategies(strategies.map(strategy => 
      strategy.id === id 
        ? { ...strategy, status }
        : strategy
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400';
      case 'active':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400';
      case 'completed':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20 dark:bg-green-500/20 dark:text-green-400';
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 dark:bg-gray-500/20 dark:text-gray-400';
    }
  };

  if (mode === 'dialog') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            value={newStrategy.title}
            onChange={(e) => setNewStrategy({ ...newStrategy, title: e.target.value })}
            placeholder="Titre de votre stratégie"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="objective">Objectif</Label>
          <Input
            id="objective"
            value={newStrategy.objective}
            onChange={(e) => setNewStrategy({ ...newStrategy, objective: e.target.value })}
            placeholder="Objectif principal (ex: Augmenter l'engagement de 25%)"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date de début</Label>
          <Input
            id="date"
            type="date"
            value={newStrategy.date}
            onChange={(e) => setNewStrategy({ ...newStrategy, date: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            value={newStrategy.status} 
            onValueChange={(value: 'planned' | 'active' | 'completed') => 
              setNewStrategy({ ...newStrategy, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planifiée</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Terminée</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={newStrategy.description}
            onChange={(e) => setNewStrategy({ ...newStrategy, description: e.target.value })}
            placeholder="Description détaillée de votre stratégie"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          {editingId !== null ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {strategies.map((strategy) => (
          <Card key={strategy.id} className="p-4 border dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{strategy.title}</h3>
                  <Badge variant="secondary" className={getStatusColor(strategy.status)}>
                    {strategy.status === 'planned' ? 'Planifiée' : 
                     strategy.status === 'active' ? 'Active' : 'Terminée'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{strategy.description}</p>
                
                <div className="flex flex-wrap gap-3 mt-2">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span>{strategy.objective}</span>
                  </div>
                  {strategy.date && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <span>{new Date(strategy.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(strategy)}
                    className="h-8 w-8 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(strategy.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {strategy.status !== 'completed' && (
                  <div className="flex justify-end mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateStatus(
                        strategy.id, 
                        strategy.status === 'planned' ? 'active' : 'completed'
                      )}
                      className="text-xs"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {strategy.status === 'planned' ? 'Activer' : 'Terminer'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
