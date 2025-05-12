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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Edit, Trash2, Plus, Clock } from 'lucide-react';

interface ScheduledPost {
  id: number;
  title: string;
  content: string;
  platform: string;
  date: string;
  time: string;
  status: 'draft' | 'scheduled' | 'published';
}

export function PublicationCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [showPostDetails, setShowPostDetails] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    {
      id: 1,
      title: 'Lancement Nouvelle Fonctionnalité',
      content: 'Découvrez notre nouvelle fonctionnalité qui va révolutionner votre expérience utilisateur !',
      platform: 'LinkedIn',
      date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      time: '09:00',
      status: 'scheduled'
    },
    {
      id: 2,
      title: 'Témoignage Client',
      content: 'Découvrez comment notre solution a permis à Entreprise XYZ d\'augmenter ses conversions de 35% en 3 mois.',
      platform: 'Facebook',
      date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      time: '14:30',
      status: 'scheduled'
    },
    {
      id: 3,
      title: 'Webinaire Gratuit',
      content: 'Rejoignez notre webinaire gratuit sur l\'optimisation de votre présence digitale. Places limitées !',
      platform: 'Twitter',
      date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
      time: '11:00',
      status: 'draft'
    }
  ]);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    platform: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '12:00',
    status: 'scheduled'
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setScheduledPosts(scheduledPosts.map(post => 
        post.id === editingId 
          ? { 
              ...post, 
              title: newPost.title,
              content: newPost.content,
              platform: newPost.platform,
              date: newPost.date,
              time: newPost.time,
              status: newPost.status as 'draft' | 'scheduled' | 'published'
            } 
          : post
      ));
    } else {
      setScheduledPosts([...scheduledPosts, {
        id: Math.max(0, ...scheduledPosts.map(p => p.id)) + 1,
        title: newPost.title,
        content: newPost.content,
        platform: newPost.platform,
        date: newPost.date,
        time: newPost.time,
        status: newPost.status as 'draft' | 'scheduled' | 'published'
      }]);
    }
    
    setNewPost({
      title: '',
      content: '',
      platform: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '12:00',
      status: 'scheduled'
    });
    setEditingId(null);
    setShowPostDialog(false);
  };

  const handleEdit = (post: ScheduledPost) => {
    setNewPost({
      title: post.title,
      content: post.content,
      platform: post.platform,
      date: post.date,
      time: post.time,
      status: post.status
    });
    setEditingId(post.id);
    setShowPostDialog(true);
  };

  const handleDelete = (id: number) => {
    setScheduledPosts(scheduledPosts.filter(post => post.id !== id));
  };

  const handleViewPost = (post: ScheduledPost) => {
    setSelectedPost(post);
    setShowPostDetails(true);
  };

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter(post => 
      isSameDay(parseISO(post.date), date)
    );
  };

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'LinkedIn':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-500 dark:border-blue-500/20">{platform}</Badge>;
      case 'Twitter':
        return <Badge variant="outline" className="bg-sky-500/10 text-sky-500 border-sky-500/20 dark:bg-sky-500/20 dark:text-sky-500 dark:border-sky-500/20">{platform}</Badge>;
      case 'Facebook':
        return <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-500 dark:border-indigo-500/20">{platform}</Badge>;
      case 'Instagram':
        return <Badge variant="outline" className="bg-pink-500/10 text-pink-500 border-pink-500/20 dark:bg-pink-500/20 dark:text-pink-500 dark:border-pink-500/20">{platform}</Badge>;
      default:
        return <Badge variant="outline">{platform}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 dark:bg-yellow-500/20 dark:text-yellow-500 dark:border-yellow-500/20">Brouillon</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-500 dark:border-blue-500/20">Planifié</Badge>;
      case 'published':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 dark:bg-green-500/20 dark:text-green-500 dark:border-green-500/20">Publié</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Calendrier de Publication</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Planifiez et gérez vos publications sur les réseaux sociaux
            </CardDescription>
          </div>
          <Button 
            onClick={() => {
              setEditingId(null);
              setNewPost({
                title: '',
                content: '',
                platform: '',
                date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
                time: '12:00',
                status: 'scheduled'
              });
              setShowPostDialog(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Nouvelle Publication
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {/* Large Calendar */}
          <div className="lg:col-span-4">
            <Card className="border dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="w-full"
                  locale={fr}
                  modifiers={{
                    hasPost: scheduledPosts.map(post => parseISO(post.date))
                  }}
                  modifiersStyles={{
                    hasPost: { 
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      fontWeight: 'bold',
                      borderRadius: '0.25rem'
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Posts for Selected Date */}
          <div className="lg:col-span-3">
            <Card className="border dark:border-gray-700 shadow-sm h-full bg-white dark:bg-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                  Publications du {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: fr }) : ''}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {getPostsForDate(selectedDate || new Date()).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground dark:text-gray-400">
                    Aucune publication prévue pour cette date
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getPostsForDate(selectedDate || new Date()).map((post) => (
                      <Card key={post.id} className="border dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <h3 className="font-medium text-gray-900 dark:text-gray-100">{post.title}</h3>
                              <div className="flex items-center gap-2">
                                {getPlatformBadge(post.platform)}
                                <div className="flex items-center text-sm text-muted-foreground dark:text-gray-400">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {post.time}
                                </div>
                                {getStatusBadge(post.status)}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewPost(post)}
                                className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(post)}
                                className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(post.id)}
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* List of All Posts */}
        <div className="mt-8">
          <Card className="border dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                  Historique des Publications
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="text-blue-500 border-blue-500/20 hover:bg-blue-500/10 dark:text-blue-400 dark:border-blue-400/20 dark:hover:bg-blue-900/20">
                      Voir tout
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <DialogHeader>
                      <DialogTitle>Historique Complet des Publications</DialogTitle>
                      <DialogDescription className="text-gray-500 dark:text-gray-400">
                        Liste de toutes vos publications planifiées et publiées
                      </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[500px] overflow-y-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left p-3 text-gray-600 dark:text-gray-400 font-medium">Titre</th>
                            <th className="text-left p-3 text-gray-600 dark:text-gray-400 font-medium">Plateforme</th>
                            <th className="text-left p-3 text-gray-600 dark:text-gray-400 font-medium">Date</th>
                            <th className="text-left p-3 text-gray-600 dark:text-gray-400 font-medium">Statut</th>
                            <th className="text-right p-3 text-gray-600 dark:text-gray-400 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scheduledPosts.map((post) => (
                            <tr key={post.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                              <td className="p-3">
                                <div className="font-medium text-gray-900 dark:text-gray-100">{post.title}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{post.content}</div>
                              </td>
                              <td className="p-3">{getPlatformBadge(post.platform)}</td>
                              <td className="p-3">
                                <div className="text-gray-700 dark:text-gray-300">
                                  {format(parseISO(post.date), 'dd MMM yyyy', { locale: fr })}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{post.time}</div>
                              </td>
                              <td className="p-3">{getStatusBadge(post.status)}</td>
                              <td className="p-3 text-right">
                                <div className="flex justify-end gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleViewPost(post)}
                                    className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEdit(post)}
                                    className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(post.id)}
                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left p-2 text-gray-600 dark:text-gray-400 font-medium">Titre</th>
                      <th className="text-left p-2 text-gray-600 dark:text-gray-400 font-medium">Plateforme</th>
                      <th className="text-left p-2 text-gray-600 dark:text-gray-400 font-medium">Date</th>
                      <th className="text-left p-2 text-gray-600 dark:text-gray-400 font-medium">Statut</th>
                      <th className="text-right p-2 text-gray-600 dark:text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduledPosts.slice(0, 5).map((post) => (
                      <tr key={post.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="p-2">
                          <div className="font-medium text-gray-900 dark:text-gray-100">{post.title}</div>
                        </td>
                        <td className="p-2">{getPlatformBadge(post.platform)}</td>
                        <td className="p-2">
                          <div className="text-gray-700 dark:text-gray-300">
                            {format(parseISO(post.date), 'dd MMM yyyy', { locale: fr })}
                          </div>
                        </td>
                        <td className="p-2">{getStatusBadge(post.status)}</td>
                        <td className="p-2 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewPost(post)}
                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            Détails
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New/Edit Post Dialog */}
        <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
          <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Modifier la Publication' : 'Nouvelle Publication'}</DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400">
                {editingId 
                  ? 'Modifiez les détails de votre publication' 
                  : 'Créez une nouvelle publication pour vos réseaux sociaux'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">Titre</Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Titre de votre publication"
                  required
                  className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="text-gray-700 dark:text-gray-300">Contenu</Label>
                <Textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Contenu de votre publication"
                  required
                  className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform" className="text-gray-700 dark:text-gray-300">Plateforme</Label>
                  <Select 
                    value={newPost.platform} 
                    onValueChange={(value) => setNewPost({ ...newPost, platform: value })}
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-900">
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Twitter">Twitter</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">Statut</Label>
                  <Select 
                    value={newPost.status} 
                    onValueChange={(value) => setNewPost({ ...newPost, status: value })}
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-900">
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="scheduled">Planifié</SelectItem>
                      <SelectItem value="published">Publié</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newPost.date ? format(parseISO(newPost.date), 'PP', { locale: fr }) : <span>Sélectionner une date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-900">
                      <Calendar
                        mode="single"
                        selected={newPost.date ? parseISO(newPost.date) : undefined}
                        onSelect={(date) => date && setNewPost({ ...newPost, date: format(date, 'yyyy-MM-dd') })}
                        initialFocus
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-gray-700 dark:text-gray-300">Heure</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newPost.time}
                    onChange={(e) => setNewPost({ ...newPost, time: e.target.value })}
                    required
                    className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
                  {editingId ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Post Details Dialog */}
        <Dialog open={showPostDetails} onOpenChange={setShowPostDetails}>
          <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <DialogHeader>
              <DialogTitle>Détails de la Publication</DialogTitle>
            </DialogHeader>
            {selectedPost && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{selectedPost.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {getPlatformBadge(selectedPost.platform)}
                    {getStatusBadge(selectedPost.status)}
                    <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20 dark:bg-gray-400/10 dark:text-gray-400 dark:border-gray-400/20">
                      {format(parseISO(selectedPost.date), 'PP', { locale: fr })} à {selectedPost.time}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-muted/20 dark:bg-gray-700/20 border-gray-200 dark:border-gray-700">
                  <p>{selectedPost.content}</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowPostDetails(false);
                      handleEdit(selectedPost);
                    }}
                    className="border-gray-300 dark:border-gray-600"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-red-500 border-red-500/20 hover:bg-red-500/10 dark:text-red-400 dark:border-red-400/20 dark:hover:bg-red-900/20"
                    onClick={() => {
                      handleDelete(selectedPost.id);
                      setShowPostDetails(false);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
