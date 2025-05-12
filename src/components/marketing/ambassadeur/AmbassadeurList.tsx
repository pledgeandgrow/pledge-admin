'use client';

import { useState } from 'react';
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
import { Search, MoreVertical, Mail, Phone, Instagram, Twitter, Facebook, Linkedin, Check, X } from 'lucide-react';

const ambassadeurs = [
  {
    id: 1,
    name: 'Sophie Martin',
    email: 'sophie.martin@example.com',
    phone: '+33 6 12 34 56 78',
    avatar: '/avatars/sophie.jpg',
    status: 'Actif',
    category: 'Influenceur',
    socialMedia: {
      instagram: '@sophiemartin',
      twitter: '@sophiem',
      followers: 15600
    },
    performance: {
      conversions: 42,
      engagement: '4.8%',
      reach: 8500
    }
  },
  {
    id: 2,
    name: 'Thomas Dubois',
    email: 'thomas.dubois@example.com',
    phone: '+33 6 23 45 67 89',
    avatar: '/avatars/thomas.jpg',
    status: 'Actif',
    category: 'Client Fidèle',
    socialMedia: {
      linkedin: 'thomas-dubois',
      facebook: 'thomasdubois',
      followers: 3200
    },
    performance: {
      conversions: 18,
      engagement: '3.2%',
      reach: 2800
    }
  },
  {
    id: 3,
    name: 'Emma Bernard',
    email: 'emma.bernard@example.com',
    phone: '+33 6 34 56 78 90',
    avatar: '/avatars/emma.jpg',
    status: 'En Pause',
    category: 'Expert Métier',
    socialMedia: {
      linkedin: 'emma-bernard',
      twitter: '@emmab',
      instagram: '@emmabernard',
      followers: 9800
    },
    performance: {
      conversions: 36,
      engagement: '5.1%',
      reach: 7200
    }
  },
  {
    id: 4,
    name: 'Lucas Moreau',
    email: 'lucas.moreau@example.com',
    phone: '+33 6 45 67 89 01',
    avatar: '/avatars/lucas.jpg',
    status: 'Actif',
    category: 'Partenaire',
    socialMedia: {
      linkedin: 'lucas-moreau',
      facebook: 'lucasmoreau',
      followers: 5400
    },
    performance: {
      conversions: 28,
      engagement: '3.9%',
      reach: 4600
    }
  },
  {
    id: 5,
    name: 'Camille Petit',
    email: 'camille.petit@example.com',
    phone: '+33 6 56 78 90 12',
    avatar: '/avatars/camille.jpg',
    status: 'Inactif',
    category: 'Influenceur',
    socialMedia: {
      instagram: '@camillepetit',
      twitter: '@camillep',
      followers: 22000
    },
    performance: {
      conversions: 0,
      engagement: '0%',
      reach: 0
    }
  }
];

export function AmbassadeurList() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredAmbassadeurs = ambassadeurs.filter(
    ambassador => ambassador.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  ambassador.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  ambassador.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-900 dark:text-white">Liste des Ambassadeurs</CardTitle>
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
        </div>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Gérez vos ambassadeurs et suivez leurs performances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Ambassadeur</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Réseaux Sociaux</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Performance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Statut</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAmbassadeurs.map((ambassador) => (
                <tr key={ambassador.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={ambassador.avatar} alt={ambassador.name} />
                        <AvatarFallback>{ambassador.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{ambassador.name}</p>
                        <Badge variant="outline" className="mt-1 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                          {ambassador.category}
                        </Badge>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{ambassador.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{ambassador.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {ambassador.socialMedia.instagram && (
                        <div className="p-1.5 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full text-white">
                          <Instagram className="h-3.5 w-3.5" />
                        </div>
                      )}
                      {ambassador.socialMedia.twitter && (
                        <div className="p-1.5 bg-blue-500 rounded-full text-white">
                          <Twitter className="h-3.5 w-3.5" />
                        </div>
                      )}
                      {ambassador.socialMedia.facebook && (
                        <div className="p-1.5 bg-blue-700 rounded-full text-white">
                          <Facebook className="h-3.5 w-3.5" />
                        </div>
                      )}
                      {ambassador.socialMedia.linkedin && (
                        <div className="p-1.5 bg-blue-800 rounded-full text-white">
                          <Linkedin className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {ambassador.socialMedia.followers.toLocaleString()} abonnés
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Conversions</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{ambassador.performance.conversions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Engagement</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{ambassador.performance.engagement}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Portée</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{ambassador.performance.reach.toLocaleString()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={
                      ambassador.status === 'Actif' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : ambassador.status === 'En Pause'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }>
                      {ambassador.status === 'Actif' && <Check className="h-3.5 w-3.5 mr-1" />}
                      {ambassador.status === 'Inactif' && <X className="h-3.5 w-3.5 mr-1" />}
                      {ambassador.status}
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
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
