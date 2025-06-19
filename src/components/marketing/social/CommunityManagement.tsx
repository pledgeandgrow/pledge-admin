'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Edit, Trash2, Plus, AlertCircle } from 'lucide-react';

interface Comment {
  id: number;
  platform: string;
  author: string;
  content: string;
  date: string;
  status: 'pending' | 'responded' | 'flagged';
}

interface PostIdea {
  id: number;
  title: string;
  content: string;
  platform: string;
  category: string;
  status: 'draft' | 'scheduled' | 'published';
}

export function CommunityManagement() {
  // Comments Management
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      platform: 'LinkedIn',
      author: 'Jean Dupont',
      content: 'Super article ! J\'aimerais en savoir plus sur vos services.',
      date: '25 Feb 2025',
      status: 'pending'
    },
    {
      id: 2,
      platform: 'Twitter',
      author: 'Marie Martin',
      content: 'Est-ce que vous proposez des formations sur ce sujet ?',
      date: '24 Feb 2025',
      status: 'pending'
    },
    {
      id: 3,
      platform: 'Facebook',
      author: 'Pierre Leroy',
      content: 'Quand est prévue votre prochaine conférence ?',
      date: '23 Feb 2025',
      status: 'responded'
    },
    {
      id: 4,
      platform: 'Instagram',
      author: 'Sophie Bernard',
      content: 'Ce contenu est inapproprié et ne respecte pas vos valeurs.',
      date: '22 Feb 2025',
      status: 'flagged'
    }
  ]);

  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [responseText, setResponseText] = useState('');
  const [showResponseDialog, setShowResponseDialog] = useState(false);

  // Post Ideas Management
  const [postIdeas, setPostIdeas] = useState<PostIdea[]>([
    {
      id: 1,
      title: 'Tendances Marketing 2025',
      content: 'Analyse des tendances marketing à surveiller en 2025, avec focus sur l\'IA et la personnalisation.',
      platform: 'LinkedIn',
      category: 'Tendances',
      status: 'draft'
    },
    {
      id: 2,
      title: 'Comment optimiser votre SEO',
      content: 'Guide pratique pour améliorer votre référencement naturel et augmenter votre visibilité.',
      platform: 'Twitter',
      category: 'Guide',
      status: 'scheduled'
    },
    {
      id: 3,
      title: 'Étude de cas : Transformation digitale',
      content: 'Comment nous avons aidé une entreprise à réussir sa transformation digitale en 6 mois.',
      platform: 'LinkedIn',
      category: 'Étude de cas',
      status: 'published'
    }
  ]);

  const [newPostIdea, setNewPostIdea] = useState({
    title: '',
    content: '',
    platform: '',
    category: '',
    status: 'draft'
  });

  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [showPostDialog, setShowPostDialog] = useState(false);

  // Comment Management Functions
  const handleResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedComment) {
      setComments(comments.map(comment => 
        comment.id === selectedComment.id 
          ? { ...comment, status: 'responded' } 
          : comment
      ));
      setShowResponseDialog(false);
      setResponseText('');
    }
  };

  const handleFlagComment = (id: number) => {
    setComments(comments.map(comment => 
      comment.id === id 
        ? { ...comment, status: 'flagged' } 
        : comment
    ));
  };

  const handleDeleteComment = (id: number) => {
    setComments(comments.filter(comment => comment.id !== id));
  };

  // Post Ideas Functions
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPostId) {
      setPostIdeas(postIdeas.map(post => 
        post.id === editingPostId 
          ? { 
              ...post, 
              title: newPostIdea.title,
              content: newPostIdea.content,
              platform: newPostIdea.platform,
              category: newPostIdea.category,
              status: newPostIdea.status as 'draft' | 'scheduled' | 'published'
            } 
          : post
      ));
    } else {
      setPostIdeas([...postIdeas, {
        id: Math.max(0, ...postIdeas.map(p => p.id)) + 1,
        title: newPostIdea.title,
        content: newPostIdea.content,
        platform: newPostIdea.platform,
        category: newPostIdea.category,
        status: newPostIdea.status as 'draft' | 'scheduled' | 'published'
      }]);
    }
    
    setNewPostIdea({
      title: '',
      content: '',
      platform: '',
      category: '',
      status: 'draft'
    });
    setEditingPostId(null);
    setShowPostDialog(false);
  };

  const handleEditPost = (post: PostIdea) => {
    setNewPostIdea({
      title: post.title,
      content: post.content,
      platform: post.platform,
      category: post.category,
      status: post.status
    });
    setEditingPostId(post.id);
    setShowPostDialog(true);
  };

  const handleDeletePost = (id: number) => {
    setPostIdeas(postIdeas.filter(post => post.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">En attente</Badge>;
      case 'responded':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Répondu</Badge>;
      case 'flagged':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Signalé</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Brouillon</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Planifié</Badge>;
      case 'published':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Publié</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'LinkedIn':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">{platform}</Badge>;
      case 'Twitter':
        return <Badge variant="outline" className="bg-sky-500/10 text-sky-500 border-sky-500/20">{platform}</Badge>;
      case 'Facebook':
        return <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">{platform}</Badge>;
      case 'Instagram':
        return <Badge variant="outline" className="bg-pink-500/10 text-pink-500 border-pink-500/20">{platform}</Badge>;
      default:
        return <Badge variant="outline">{platform}</Badge>;
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm border">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Community Management</CardTitle>
            <CardDescription>
              Gérez les interactions avec votre communauté et planifiez votre contenu
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="mr-2 h-4 w-4" /> Nouvelle Idée de Post
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingPostId ? 'Modifier l\'Idée de Post' : 'Nouvelle Idée de Post'}</DialogTitle>
                  <DialogDescription>
                    {editingPostId 
                      ? 'Modifiez les détails de votre idée de post' 
                      : 'Ajoutez une nouvelle idée de post à votre calendrier'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePostSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      value={newPostIdea.title}
                      onChange={(e) => setNewPostIdea({ ...newPostIdea, title: e.target.value })}
                      placeholder="Titre de votre post"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Contenu</Label>
                    <Textarea
                      id="content"
                      value={newPostIdea.content}
                      onChange={(e) => setNewPostIdea({ ...newPostIdea, content: e.target.value })}
                      placeholder="Contenu de votre post"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="platform">Plateforme</Label>
                      <Select 
                        value={newPostIdea.platform} 
                        onValueChange={(value) => setNewPostIdea({ ...newPostIdea, platform: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                          <SelectItem value="Twitter">Twitter</SelectItem>
                          <SelectItem value="Facebook">Facebook</SelectItem>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Catégorie</Label>
                      <Select 
                        value={newPostIdea.category} 
                        onValueChange={(value) => setNewPostIdea({ ...newPostIdea, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tendances">Tendances</SelectItem>
                          <SelectItem value="Guide">Guide</SelectItem>
                          <SelectItem value="Étude de cas">Étude de cas</SelectItem>
                          <SelectItem value="Actualité">Actualité</SelectItem>
                          <SelectItem value="Événement">Événement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select 
                      value={newPostIdea.status} 
                      onValueChange={(value) => setNewPostIdea({ ...newPostIdea, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Brouillon</SelectItem>
                        <SelectItem value="scheduled">Planifié</SelectItem>
                        <SelectItem value="published">Publié</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
                      {editingPostId ? 'Mettre à jour' : 'Ajouter'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="comments" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
            <TabsTrigger value="comments">Commentaires</TabsTrigger>
            <TabsTrigger value="ideas">Idées de Posts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="comments" className="space-y-4">
            <div className="rounded-lg border overflow-hidden">
              <div className="grid grid-cols-6 gap-4 p-4 bg-muted/50 font-medium">
                <div className="col-span-2">Commentaire</div>
                <div>Auteur</div>
                <div>Plateforme</div>
                <div>Statut</div>
                <div className="text-right">Actions</div>
              </div>
              
              {comments.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Aucun commentaire à afficher
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="grid grid-cols-6 gap-4 p-4 border-t items-center">
                    <div className="col-span-2 truncate">
                      <p className="font-medium">{comment.content}</p>
                      <p className="text-xs text-muted-foreground">{comment.date}</p>
                    </div>
                    <div>{comment.author}</div>
                    <div>{getPlatformBadge(comment.platform)}</div>
                    <div>{getStatusBadge(comment.status)}</div>
                    <div className="flex justify-end gap-1">
                      {comment.status !== 'responded' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedComment(comment);
                            setShowResponseDialog(true);
                          }}
                          className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-100"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {comment.status !== 'flagged' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleFlagComment(comment.id)}
                          className="h-8 w-8 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-100"
                        >
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Répondre au Commentaire</DialogTitle>
                  <DialogDescription>
                    Rédigez votre réponse au commentaire de {selectedComment?.author}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleResponseSubmit} className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/20">
                    <p className="font-medium">{selectedComment?.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-muted-foreground">{selectedComment?.author}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{selectedComment?.date}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="response">Votre Réponse</Label>
                    <Textarea
                      id="response"
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Écrivez votre réponse ici..."
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
                      Envoyer la Réponse
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="ideas" className="space-y-4">
            <div className="rounded-lg border overflow-hidden">
              <div className="grid grid-cols-6 gap-4 p-4 bg-muted/50 font-medium">
                <div className="col-span-2">Titre & Contenu</div>
                <div>Plateforme</div>
                <div>Catégorie</div>
                <div>Statut</div>
                <div className="text-right">Actions</div>
              </div>
              
              {postIdeas.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Aucune idée de post à afficher
                </div>
              ) : (
                postIdeas.map((post) => (
                  <div key={post.id} className="grid grid-cols-6 gap-4 p-4 border-t items-center">
                    <div className="col-span-2">
                      <p className="font-medium">{post.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{post.content}</p>
                    </div>
                    <div>{getPlatformBadge(post.platform)}</div>
                    <div>
                      <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
                        {post.category}
                      </Badge>
                    </div>
                    <div>{getStatusBadge(post.status)}</div>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditPost(post)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePost(post.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
