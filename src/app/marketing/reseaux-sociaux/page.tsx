'use client';

import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, MessageCircle, Heart, BarChart } from 'lucide-react';
import { SocialPlatforms } from '@/components/marketing/social/SocialPlatforms';
import { CommunityManagement } from '@/components/marketing/social/CommunityManagement';
import { PublicationCalendar } from '@/components/marketing/social/PublicationCalendar';
import { MegaMenu } from '@/components/layout/MegaMenu';

const Page: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Réseaux Sociaux
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez votre présence sur les réseaux sociaux et votre stratégie de contenu
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
            >
              Exporter les Statistiques
            </Button>
          </div>

          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 rounded-lg p-1">
              <TabsTrigger value="analytics" className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white">Analytics</TabsTrigger>
              <TabsTrigger value="platforms" className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white">Plateformes</TabsTrigger>
              <TabsTrigger value="community" className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white">Community Management</TabsTrigger>
              <TabsTrigger value="calendar" className="text-gray-700 data-[state=active]:text-gray-900 dark:text-gray-300 dark:data-[state=active]:text-white">Calendrier</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <Heart className="h-5 w-5 text-red-500" />
                      Engagement
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Suivi des interactions avec vos contenus
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">+27%</div>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">+2% par rapport au mois dernier</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Likes</span>
                        <Badge className="bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400">+12%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Commentaires</span>
                        <Badge className="bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400">+8%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Partages</span>
                        <Badge className="bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400">+7%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <Share2 className="h-5 w-5 text-blue-500" />
                      Portée
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Nombre de personnes touchées par vos publications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">15.2K</div>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">+5% par rapport au mois dernier</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">LinkedIn</span>
                        <Badge className="bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400">7.5K</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Twitter</span>
                        <Badge className="bg-sky-500/10 text-sky-500 dark:bg-sky-500/20 dark:text-sky-400">4.2K</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Facebook</span>
                        <Badge className="bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400">3.5K</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <MessageCircle className="h-5 w-5 text-green-500" />
                      Conversations
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Suivi des conversations et mentions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">48</div>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">+12 depuis la semaine dernière</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Messages directs</span>
                        <Badge className="bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400">18</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Mentions</span>
                        <Badge className="bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20 dark:text-yellow-400">22</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Commentaires</span>
                        <Badge className="bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 dark:text-orange-400">8</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-gray-100">Performance par Plateforme</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Comparaison des performances sur différentes plateformes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400">LinkedIn</Badge>
                            <span className="text-sm text-gray-600 dark:text-gray-300">Professionnel</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">85%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-sky-500/10 text-sky-500 dark:bg-sky-500/20 dark:text-sky-400">Twitter</Badge>
                            <span className="text-sm text-gray-600 dark:text-gray-300">Actualités</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">72%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-sky-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400">Facebook</Badge>
                            <span className="text-sm text-gray-600 dark:text-gray-300">Communauté</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">65%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-pink-500/10 text-pink-500 dark:bg-pink-500/20 dark:text-pink-400">Instagram</Badge>
                            <span className="text-sm text-gray-600 dark:text-gray-300">Visuel</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">78%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-pink-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-gray-100">Tendances de Croissance</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Évolution de votre audience sur les 6 derniers mois
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <BarChart className="h-32 w-32 text-blue-500 mx-auto" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">+42%</div>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">Croissance globale</p>
                      </div>
                      <div className="flex justify-center gap-4">
                        <div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">1.2K</div>
                          <p className="text-xs text-muted-foreground dark:text-gray-400">Nouveaux abonnés</p>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">3.8K</div>
                          <p className="text-xs text-muted-foreground dark:text-gray-400">Total abonnés</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="platforms">
              <SocialPlatforms />
            </TabsContent>
            
            <TabsContent value="community">
              <CommunityManagement />
            </TabsContent>
            
            <TabsContent value="calendar">
              <PublicationCalendar />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Page;
