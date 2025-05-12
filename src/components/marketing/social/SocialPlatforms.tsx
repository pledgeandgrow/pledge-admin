'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Facebook, Instagram, Linkedin, Twitter, Users, BarChart2, TrendingUp, Edit, Trash2, Plus } from 'lucide-react';

interface SocialPlatform {
  id: number;
  name: string;
  followers: string;
  engagement: string;
  posts: number;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export function SocialPlatforms() {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([
    {
      id: 1,
      name: 'LinkedIn',
      followers: '12.5K',
      engagement: '4.2%',
      posts: 45,
      description: 'Réseau professionnel B2B, idéal pour le contenu de marque et le recrutement',
      icon: <Linkedin className="h-5 w-5" />,
      color: 'blue'
    },
    {
      id: 2,
      name: 'Twitter',
      followers: '8.3K',
      engagement: '3.8%',
      posts: 78,
      description: 'Communication rapide et actualités, parfait pour les annonces et tendances',
      icon: <Twitter className="h-5 w-5" />,
      color: 'sky'
    },
    {
      id: 3,
      name: 'Facebook',
      followers: '15.2K',
      engagement: '2.9%',
      posts: 36,
      description: 'Communauté et événements, idéal pour l\'engagement communautaire',
      icon: <Facebook className="h-5 w-5" />,
      color: 'indigo'
    },
    {
      id: 4,
      name: 'Instagram',
      followers: '10.1K',
      engagement: '5.1%',
      posts: 62,
      description: 'Contenu visuel et storytelling, parfait pour le branding et la culture d\'entreprise',
      icon: <Instagram className="h-5 w-5" />,
      color: 'pink'
    }
  ]);

  const [newPlatform, setNewPlatform] = useState({
    name: '',
    followers: '',
    engagement: '',
    posts: '',
    description: ''
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setPlatforms(platforms.map(platform => 
        platform.id === editingId 
          ? { 
              ...platform, 
              name: newPlatform.name,
              followers: newPlatform.followers,
              engagement: newPlatform.engagement,
              posts: parseInt(newPlatform.posts),
              description: newPlatform.description
            } 
          : platform
      ));
    } else {
      // Determine icon and color based on platform name
      let icon = <Users className="h-5 w-5" />;
      let color = 'gray';
      
      if (newPlatform.name.toLowerCase().includes('linkedin')) {
        icon = <Linkedin className="h-5 w-5" />;
        color = 'blue';
      } else if (newPlatform.name.toLowerCase().includes('twitter')) {
        icon = <Twitter className="h-5 w-5" />;
        color = 'sky';
      } else if (newPlatform.name.toLowerCase().includes('facebook')) {
        icon = <Facebook className="h-5 w-5" />;
        color = 'indigo';
      } else if (newPlatform.name.toLowerCase().includes('instagram')) {
        icon = <Instagram className="h-5 w-5" />;
        color = 'pink';
      }
      
      setPlatforms([...platforms, {
        id: Math.max(0, ...platforms.map(p => p.id)) + 1,
        name: newPlatform.name,
        followers: newPlatform.followers,
        engagement: newPlatform.engagement,
        posts: parseInt(newPlatform.posts),
        description: newPlatform.description,
        icon,
        color
      }]);
    }
    
    setNewPlatform({
      name: '',
      followers: '',
      engagement: '',
      posts: '',
      description: ''
    });
    setEditingId(null);
    setShowDialog(false);
  };

  const handleEdit = (platform: SocialPlatform) => {
    setNewPlatform({
      name: platform.name,
      followers: platform.followers,
      engagement: platform.engagement,
      posts: platform.posts.toString(),
      description: platform.description
    });
    setEditingId(platform.id);
    setShowDialog(true);
  };

  const handleDelete = (id: number) => {
    setPlatforms(platforms.filter(platform => platform.id !== id));
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'sky':
        return 'bg-sky-500/10 text-sky-500 border-sky-500/20';
      case 'indigo':
        return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'pink':
        return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm border">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Plateformes Sociales</CardTitle>
            <CardDescription>
              Gérez vos plateformes sociales et suivez leurs performances
            </CardDescription>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Ajouter une Plateforme
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Modifier la Plateforme' : 'Ajouter une Plateforme'}</DialogTitle>
                <DialogDescription>
                  {editingId 
                    ? 'Modifiez les détails de votre plateforme sociale' 
                    : 'Ajoutez une nouvelle plateforme sociale à votre stratégie'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la Plateforme</Label>
                  <Input
                    id="name"
                    value={newPlatform.name}
                    onChange={(e) => setNewPlatform({ ...newPlatform, name: e.target.value })}
                    placeholder="Ex: LinkedIn, Twitter, etc."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="followers">Abonnés</Label>
                    <Input
                      id="followers"
                      value={newPlatform.followers}
                      onChange={(e) => setNewPlatform({ ...newPlatform, followers: e.target.value })}
                      placeholder="Ex: 5K, 10K, etc."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engagement">Taux d'Engagement</Label>
                    <Input
                      id="engagement"
                      value={newPlatform.engagement}
                      onChange={(e) => setNewPlatform({ ...newPlatform, engagement: e.target.value })}
                      placeholder="Ex: 3.5%, 4.2%, etc."
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="posts">Nombre de Publications</Label>
                  <Input
                    id="posts"
                    type="number"
                    value={newPlatform.posts}
                    onChange={(e) => setNewPlatform({ ...newPlatform, posts: e.target.value })}
                    placeholder="Ex: 45"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newPlatform.description}
                    onChange={(e) => setNewPlatform({ ...newPlatform, description: e.target.value })}
                    placeholder="Description de la plateforme et de son utilisation"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
                    {editingId ? 'Mettre à jour' : 'Ajouter'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
            <TabsTrigger value="grid">Grille</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>
          
          <TabsContent value="grid" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platforms.map((platform) => (
                <Card key={platform.id} className="overflow-hidden border hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-full ${getColorClasses(platform.color)}`}>
                          {platform.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{platform.name}</h3>
                          <p className="text-sm text-muted-foreground">{platform.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(platform)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(platform.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="p-3 rounded-lg bg-background border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Users className="h-4 w-4" />
                          <span>Abonnés</span>
                        </div>
                        <div className="font-semibold">{platform.followers}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-background border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <BarChart2 className="h-4 w-4" />
                          <span>Engagement</span>
                        </div>
                        <div className="font-semibold">{platform.engagement}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-background border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>Publications</span>
                        </div>
                        <div className="font-semibold">{platform.posts}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <div className="rounded-lg border overflow-hidden">
              <div className="grid grid-cols-5 gap-4 p-4 bg-muted/50 font-medium">
                <div>Plateforme</div>
                <div>Abonnés</div>
                <div>Engagement</div>
                <div>Publications</div>
                <div className="text-right">Actions</div>
              </div>
              {platforms.map((platform) => (
                <div key={platform.id} className="grid grid-cols-5 gap-4 p-4 border-t items-center">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${getColorClasses(platform.color)}`}>
                      {platform.icon}
                    </div>
                    <span>{platform.name}</span>
                  </div>
                  <div>{platform.followers}</div>
                  <div>{platform.engagement}</div>
                  <div>{platform.posts}</div>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(platform)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(platform.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
