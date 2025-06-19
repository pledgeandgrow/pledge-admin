'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lightbulb, Target, BookOpen } from 'lucide-react';
import { PostIdeas } from './PostIdeas';
import { ContentStrategies } from './ContentStrategies';
import { BestPractices } from './BestPractices';

export function ContentDashboard() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Gestion de Contenu</h1>
        <p className="text-muted-foreground">
          Gérez vos stratégies, idées et meilleures pratiques de contenu
        </p>
      </div>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-transparent h-auto p-0">
          <TabsTrigger 
            value="posts" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 h-20 border-2 data-[state=active]:border-primary"
          >
            <Lightbulb className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Idées de Posts</div>
              <div className="text-sm text-muted-foreground">Gérez vos idées de contenu</div>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="strategies" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 h-20 border-2 data-[state=active]:border-primary"
          >
            <Target className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Stratégies</div>
              <div className="text-sm text-muted-foreground">Planifiez vos stratégies</div>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="practices" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 h-20 border-2 data-[state=active]:border-primary"
          >
            <BookOpen className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Meilleures Pratiques</div>
              <div className="text-sm text-muted-foreground">Consultez les guides</div>
            </div>
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[calc(100vh-280px)]">
          <TabsContent value="posts" className="m-0">
            <PostIdeas mode="list" />
          </TabsContent>

          <TabsContent value="strategies" className="m-0">
            <ContentStrategies mode="list" />
          </TabsContent>

          <TabsContent value="practices" className="m-0">
            <BestPractices />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
