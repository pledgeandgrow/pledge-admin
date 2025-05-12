'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeProvider } from 'next-themes';
import MegaMenu from '@/components/layout/MegaMenu';

interface Engagement {
  likes: number;
  partages: number;
  commentaires: number;
}

interface Action {
  type: string;
  date: string;
  statut: string;
  responsable: string;
}

interface Mention {
  id: string;
  source: string;
  titre: string;
  contenu: string;
  auteur: string;
  date: string;
  sentiment: 'Positif' | 'Neutre' | 'Négatif';
  impact: 'Faible' | 'Moyen' | 'Fort';
  engagement: Engagement;
  url: string;
  tags: string[];
  actions: Action[];
}

export default function VeilleEReputationPage() {
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');

  useEffect(() => {
    // Initialize with sample data
    setMentions([
      {
        id: '1',
        source: 'Twitter',
        titre: 'Discussion produit',
        contenu: 'Le nouveau service client est vraiment efficace !',
        auteur: '@ClientSatisfait',
        date: '2025-02-23',
        sentiment: 'Positif',
        impact: 'Moyen',
        engagement: { likes: 45, partages: 12, commentaires: 8 },
        url: 'https://twitter.com/status/123456789',
        tags: ['Service Client', 'Satisfaction'],
        actions: [{ type: 'Réponse', date: '2025-02-23', statut: 'Complété', responsable: 'Marie L.' }]
      }
    ]);
  }, []);

  const filteredMentions = mentions.filter(mention => {
    const matchesSearch = mention.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mention.auteur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = filterSource === 'all' || mention.source === filterSource;
    return matchesSearch && matchesSource;
  });

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <MegaMenu />
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold tracking-tight">Veille E-reputation</h1>
              <Button variant="outline">Nouvelle Mention</Button>
            </div>

            <div className="flex gap-4 items-center">
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les sources</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="positive">Positives</TabsTrigger>
                <TabsTrigger value="neutral">Neutres</TabsTrigger>
                <TabsTrigger value="negative">Négatives</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {filteredMentions.map((mention) => (
                  <Card key={mention.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{mention.titre}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Par {mention.auteur} • {mention.date}
                          </p>
                        </div>
                        <Badge variant={mention.sentiment === 'Positif' ? 'default' : 'destructive'}>
                          {mention.sentiment}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{mention.contenu}</p>
                      <div className="flex gap-2 flex-wrap">
                        {mention.tags.map((tag) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                        <span>👍 {mention.engagement.likes}</span>
                        <span>🔄 {mention.engagement.partages}</span>
                        <span>💬 {mention.engagement.commentaires}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
