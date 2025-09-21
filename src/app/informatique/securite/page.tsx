'use client';

import { useState } from 'react';
import { useData } from '@/hooks/useData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, ShieldAlert, ShieldCheck, Lock, AlertTriangle, FileWarning } from 'lucide-react';

export default function SecuritePage() {
  const [activeTab, setActiveTab] = useState('all');
  // Using 'documentation' type as a placeholder since 'security' is not in DataType
  const { data: securityData = [], loading, error } = useData('documentation');

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      'audit': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'firewall': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'antivirus': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'vpn': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'encryption': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      'backup': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
      'compliance': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
    };
    return colors[tag.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const filteredData = activeTab === 'all' 
    ? securityData 
    : securityData.filter(item => {
        const tags = item.tags || [];
        return tags.includes(activeTab);
      });

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 via-orange-500/20 to-amber-500/20">
          <ShieldAlert className="h-8 w-8 text-red-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Cybersécurité
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Solutions et recommandations pour sécuriser votre infrastructure
          </p>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-amber-500/20 h-0.5 rounded-full" />
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Chargement des solutions de sécurité...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg">
          <p>Une erreur est survenue lors du chargement des données.</p>
        </div>
      ) : securityData.length === 0 ? (
        <div className="text-center py-12">
          <ShieldCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium">Aucune solution de sécurité disponible</h3>
          <p className="text-muted-foreground mt-2">Les solutions seront ajoutées prochainement.</p>
        </div>
      ) : (
        <>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="audit">Audit</TabsTrigger>
              <TabsTrigger value="firewall">Firewall</TabsTrigger>
              <TabsTrigger value="antivirus">Antivirus</TabsTrigger>
              <TabsTrigger value="vpn">VPN</TabsTrigger>
              <TabsTrigger value="encryption">Chiffrement</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((item) => (
                  <Card key={item.id} className="overflow-hidden border border-gray-200 dark:border-gray-800 bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 shadow-lg">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-bold">{item.title}</CardTitle>
                        {item.metadata && typeof item.metadata.icon === 'string' && (
                          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                            {item.metadata.icon === 'shield' && <ShieldCheck className="h-5 w-5 text-red-600 dark:text-red-400" />}
                            {item.metadata.icon === 'lock' && <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />}
                            {item.metadata.icon === 'alert' && <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />}
                            {item.metadata.icon === 'file' && <FileWarning className="h-5 w-5 text-red-600 dark:text-red-400" />}
                          </div>
                        )}
                      </div>
                      <CardDescription className="mt-2 line-clamp-2">
                        {item.summary || item.content}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className={getTagColor(tag)}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {item.metadata && Array.isArray(item.metadata.features) && item.metadata.features.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Fonctionnalités</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {(item.metadata.features as string[]).slice(0, 3).map((feature, index) => (
                              <li key={index} className="text-sm text-muted-foreground">{feature}</li>
                            ))}
                            {(item.metadata.features as string[]).length > 3 && (
                              <li className="text-sm text-muted-foreground">+{(item.metadata.features as string[]).length - 3} autres...</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Voir les détails
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
