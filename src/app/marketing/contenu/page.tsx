'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PostIdeas } from '@/components/marketing/content/PostIdeas';
import { ContentStrategies } from '@/components/marketing/content/ContentStrategies';
import { BestPractices } from '@/components/marketing/content/BestPractices';
import { FileText, Calendar, Eye, Lightbulb, Target, BookOpen, Plus } from 'lucide-react';
import { MegaMenu } from '@/components/layout/MegaMenu';

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState('posts');


  const getDialogTitle = () => {
    switch (activeTab) {
      case 'posts':
        return 'Nouvelle Idée de Post';
      case 'strategies':
        return 'Nouvelle Stratégie de Contenu';
      default:
        return 'Nouveau Contenu';
    }
  };

  const getDialogDescription = () => {
    switch (activeTab) {
      case 'posts':
        return 'Ajoutez une nouvelle idée de post à votre collection.';
      case 'strategies':
        return 'Définissez une nouvelle stratégie de contenu.';
      default:
        return 'Ajoutez un nouveau contenu.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Gestion de Contenu
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Créez, gérez et analysez votre stratégie de contenu
              </p>
            </div>
          </div>

          {/* Analytics Overview */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Articles Publiés
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Nombre total de publications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">24</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">+4</span> ce mois-ci
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Blog</span>
                    <Badge className="bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400">16</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Études de cas</span>
                    <Badge className="bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400">5</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Livres blancs</span>
                    <Badge className="bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400">3</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Eye className="h-5 w-5 text-green-500" />
                  Vues Totales
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Engagement avec votre contenu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">12,450</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">+18%</span> vs mois dernier
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Temps moyen</span>
                    <Badge className="bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400">3m 24s</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Taux de rebond</span>
                    <Badge className="bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400">32%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Conversions</span>
                    <Badge className="bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400">+5%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  Calendrier Editorial
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Planification de contenu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">8</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">+2</span> articles planifiés
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Cette semaine</span>
                    <Badge className="bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400">3</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Ce mois</span>
                    <Badge className="bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400">5</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Prochain trimestre</span>
                    <Badge className="bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400">12</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Management */}
          <Tabs defaultValue="posts" className="space-y-6" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-gray-800 rounded-lg p-1">
              <TabsTrigger 
                value="posts" 
                className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white"
              >
                Idées de Posts
              </TabsTrigger>
              <TabsTrigger 
                value="strategies" 
                className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white"
              >
                Stratégies
              </TabsTrigger>
              <TabsTrigger 
                value="practices" 
                className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white"
              >
                Meilleures Pratiques
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" /> Idées de Posts
                </h3>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Nouvelle Idée
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{getDialogTitle()}</DialogTitle>
                      <DialogDescription>{getDialogDescription()}</DialogDescription>
                    </DialogHeader>
                    <PostIdeas mode="dialog" />
                  </DialogContent>
                </Dialog>
              </div>
              
              <Card className="border dark:border-gray-700">
                <CardContent className="p-6">
                  <PostIdeas mode="list" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strategies" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" /> Stratégies de Contenu
                </h3>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Nouvelle Stratégie
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{getDialogTitle()}</DialogTitle>
                      <DialogDescription>{getDialogDescription()}</DialogDescription>
                    </DialogHeader>
                    <ContentStrategies mode="dialog" />
                  </DialogContent>
                </Dialog>
              </div>
              
              <Card className="border dark:border-gray-700">
                <CardContent className="p-6">
                  <ContentStrategies mode="list" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="practices" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-500" /> Meilleures Pratiques
                </h3>
              </div>
              
              <Card className="border dark:border-gray-700">
                <CardContent className="p-6">
                  <BestPractices />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
