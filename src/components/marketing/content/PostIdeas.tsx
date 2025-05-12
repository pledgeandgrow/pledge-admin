'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit, Calendar, Tag, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';

interface PostIdea {
  id: number;
  title: string;
  description: string;
  category: string;
  status: 'draft' | 'in-progress' | 'published';
  date?: string;
}

interface PostIdeasProps {
  mode: 'dialog' | 'list';
}

export function PostIdeas({ mode }: PostIdeasProps) {
  const [ideas, setIdeas] = useState<PostIdea[]>([
    {
      id: 1,
      title: "10 astuces pour améliorer votre SEO",
      description: "Un article détaillant les meilleures pratiques SEO en 2025",
      category: "Marketing Digital",
      status: "draft",
      date: "2025-03-20"
    },
    {
      id: 2,
      title: "Étude de cas: Transformation digitale",
      description: "Comment notre client a augmenté ses ventes de 45% grâce à notre stratégie",
      category: "Études de cas",
      status: "in-progress",
      date: "2025-02-28"
    },
    {
      id: 3,
      title: "Guide complet des médias sociaux B2B",
      description: "Stratégies efficaces pour les entreprises B2B sur LinkedIn, Twitter et autres plateformes",
      category: "Réseaux Sociaux",
      status: "published",
      date: "2025-01-15"
    }
  ]);

  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    status: 'draft' as const
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      setIdeas(ideas.map(idea => 
        idea.id === editingId 
          ? { ...idea, ...newIdea }
          : idea
      ));
      setEditingId(null);
    } else {
      setIdeas([...ideas, {
        id: Math.max(0, ...ideas.map(s => s.id)) + 1,
        ...newIdea
      }]);
    }
    setNewIdea({ title: '', description: '', category: '', date: '', status: 'draft' });
  };

  const handleDelete = (id: number) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
  };

  const handleEdit = (idea: PostIdea) => {
    setNewIdea({
      title: idea.title,
      description: idea.description,
      category: idea.category,
      date: idea.date || '',
      status: idea.status
    });
    setEditingId(idea.id);
  };

  const updateStatus = (id: number, status: 'draft' | 'in-progress' | 'published') => {
    setIdeas(ideas.map(idea => 
      idea.id === id 
        ? { ...idea, status }
        : idea
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400';
      case 'published':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20 dark:bg-green-500/20 dark:text-green-400';
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 dark:bg-gray-500/20 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'marketing digital':
        return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400';
      case 'études de cas':
        return 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-400';
      case 'réseaux sociaux':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400';
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
            value={newIdea.title}
            onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
            placeholder="Titre de votre idée de post"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select 
            value={newIdea.category} 
            onValueChange={(value) => setNewIdea({ ...newIdea, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Marketing Digital">Marketing Digital</SelectItem>
              <SelectItem value="Études de cas">Études de cas</SelectItem>
              <SelectItem value="Réseaux Sociaux">Réseaux Sociaux</SelectItem>
              <SelectItem value="Technologie">Technologie</SelectItem>
              <SelectItem value="Tendances">Tendances</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date de publication prévue</Label>
          <Input
            id="date"
            type="date"
            value={newIdea.date}
            onChange={(e) => setNewIdea({ ...newIdea, date: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            value={newIdea.status} 
            onValueChange={(value: 'draft' | 'in-progress' | 'published') => 
              setNewIdea({ ...newIdea, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="in-progress">En cours</SelectItem>
              <SelectItem value="published">Publié</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={newIdea.description}
            onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
            placeholder="Description détaillée de votre idée"
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
        {ideas.map((idea) => (
          <Card key={idea.id} className="p-4 border dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{idea.title}</h3>
                  <Badge variant="secondary" className={getStatusColor(idea.status)}>
                    {idea.status === 'draft' ? 'Brouillon' : 
                     idea.status === 'in-progress' ? 'En cours' : 'Publié'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{idea.description}</p>
                
                <div className="flex flex-wrap gap-3 mt-2">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Tag className="h-4 w-4 text-indigo-500" />
                    <Badge variant="outline" className={getCategoryColor(idea.category)}>
                      {idea.category}
                    </Badge>
                  </div>
                  {idea.date && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <span>{new Date(idea.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(idea)}
                    className="h-8 w-8 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(idea.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {idea.status !== 'published' && (
                  <div className="flex justify-end mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateStatus(
                        idea.id, 
                        idea.status === 'draft' ? 'in-progress' : 'published'
                      )}
                      className="text-xs"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {idea.status === 'draft' ? 'Démarrer' : 'Publier'}
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
