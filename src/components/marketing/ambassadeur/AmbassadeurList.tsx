'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Search, MoreVertical, Mail, Phone, Check, Loader2 } from 'lucide-react';
import { useRealtimeContacts } from '@/hooks/useRealtimeContacts';
import { Contact, NetworkContact } from '@/types/contact';
import { useToast } from '@/components/ui/use-toast';

// Extended NetworkContact interface with additional metadata for ambassadeurs
interface AmbassadeurContact extends NetworkContact {
  metadata: {
    connection_strength?: number;
    category?: string;
    avatar?: string;
    socialMedia?: {
      instagram?: string;
      twitter?: string;
      facebook?: string;
      linkedin?: string;
      followers?: number;
    };
    performance?: {
      conversions?: number;
      engagement?: string;
      reach?: number;
    };
  };
}

export function AmbassadeurList({ initialAmbassadeurs = [] }: { initialAmbassadeurs?: AmbassadeurContact[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  // Use the realtime contacts hook to get network contacts that are ambassadeurs
  const {
    contacts,
    loading,
    error,
    createContact,
  } = useRealtimeContacts({
    type: 'network',
    initialFilters: { tags: ['ambassadeur'] as string[] },
    autoFetch: true
  });

  // Transform contacts to ambassadeurs format
  const [ambassadeurs, setAmbassadeurs] = useState<AmbassadeurContact[]>(initialAmbassadeurs);

  // Update ambassadeurs when contacts change
  useEffect(() => {
    if (contacts && contacts.length > 0) {
      const newAmbassadeurs = contacts.map((contact: Contact) => {
        return contact as AmbassadeurContact;
      });
      setAmbassadeurs(newAmbassadeurs);
    }
  }, [contacts]);

  // Filter ambassadeurs based on search term
  const filteredAmbassadeurs = ambassadeurs.filter(
    (ambassador: AmbassadeurContact) => {
      const fullName = `${ambassador.first_name} ${ambassador.last_name}`.toLowerCase();
      const email = ambassador.email?.toLowerCase() || '';
      const category = ambassador.metadata?.category?.toLowerCase() || '';
      const searchLower = searchTerm.toLowerCase();
      
      return fullName.includes(searchLower) || 
             email.includes(searchLower) || 
             category.includes(searchLower);
    }
  );

  // Handle creating a new ambassadeur
  const handleCreateAmbassadeur = async () => {
    try {
      // This would typically open a modal or form
      // For now, we'll just create a sample ambassadeur
      await createContact({
        first_name: 'Nouveau',
        last_name: 'Ambassadeur',
        email: 'nouveau.ambassadeur@example.com',
        phone: '+33 6 00 00 00 00',
        type: 'network',
        status: 'active',
        tags: ['ambassadeur'],
        position: 'Influenceur',
        company: 'Example Company',
        metadata: {
          connection_strength: 4,
          category: 'Influenceur',
          avatar: '/avatars/default.jpg',
          socialMedia: {
            instagram: '@nouveauambassadeur',
            twitter: '@nouveauambas',
            followers: 5000
          },
          performance: {
            conversions: 0,
            engagement: '0%',
            reach: 0
          }
        }
      } as AmbassadeurContact);
      
      toast({
        title: 'Succès',
        description: 'Nouvel ambassadeur créé',
      });
    } catch (error) {
      console.error('Error creating contact:', error);
      toast({
        title: 'Erreur',
        description: 'Échec de la création du nouvel ambassadeur',
        variant: 'destructive',
      });
    }
  };

  if (error) {
    toast({
      title: 'Erreur',
      description: 'Échec du chargement des ambassadeurs',
      variant: 'destructive',
    });
  }

  return (
    <Card className="border dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-900 dark:text-white">Liste des Ambassadeurs</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-8 bg-white dark:bg-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
              onClick={handleCreateAmbassadeur}
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />} 
              Nouvel Ambassadeur
            </Button>
          </div>
        </div>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Gérez vos ambassadeurs et suivez leurs performances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Ambassadeur</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Catégorie</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Réseaux</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Performance</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Statut</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <span className="mt-2 block text-sm text-muted-foreground">Chargement des ambassadeurs...</span>
                  </td>
                </tr>
              ) : filteredAmbassadeurs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Aucun ambassadeur trouvé
                  </td>
                </tr>
              ) : (
                filteredAmbassadeurs.map((ambassadeur) => (
                <tr key={ambassadeur.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={ambassadeur.metadata?.avatar || `/avatars/${ambassadeur.first_name.toLowerCase()}.jpg`} alt={`${ambassadeur.first_name} ${ambassadeur.last_name}`} />
                        <AvatarFallback>{ambassadeur.first_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{`${ambassadeur.first_name} ${ambassadeur.last_name}`}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                          <Mail className="h-3 w-3" />
                          <span>{ambassadeur.email || 'N/A'}</span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                          <Phone className="h-3 w-3" />
                          <span>{ambassadeur.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                      {ambassadeur.metadata?.category || 'Influenceur'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem>Attribuer une campagne</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 dark:text-red-400">Désactiver</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )))
              }
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
