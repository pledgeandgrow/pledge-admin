'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  Filter, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2,
  Clock
} from 'lucide-react';

interface CustomerReview {
  id: number;
  name: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
  product?: string;
  status: 'Publié' | 'En attente' | 'Signalé';
  helpful: number;
  response?: {
    text: string;
    date: string;
  };
}

const reviews: CustomerReview[] = [
  {
    id: 1,
    name: 'Sophie Martin',
    avatar: '/avatars/sophie.jpg',
    rating: 5,
    comment: 'Service exceptionnel, très satisfaite ! L\'équipe a été très réactive et professionnelle. Je recommande vivement.',
    date: '22 Feb 2025',
    product: 'Service Premium',
    status: 'Publié',
    helpful: 12
  },
  {
    id: 2,
    name: 'Pierre Dubois',
    avatar: '/avatars/pierre.jpg',
    rating: 4,
    comment: 'Bonne expérience globale, quelques améliorations possibles sur les délais de livraison. Sinon, le produit est de qualité.',
    date: '21 Feb 2025',
    product: 'Abonnement Pro',
    status: 'Publié',
    helpful: 5,
    response: {
      text: 'Merci pour votre retour Pierre. Nous travaillons actuellement sur l\'amélioration de nos délais de livraison.',
      date: '22 Feb 2025'
    }
  },
  {
    id: 3,
    name: 'Marie Lambert',
    rating: 5,
    comment: 'Équipe très professionnelle et à l\'écoute. J\'ai particulièrement apprécié la qualité du suivi client.',
    date: '20 Feb 2025',
    product: 'Consultation',
    status: 'Publié',
    helpful: 8
  },
  {
    id: 4,
    name: 'Thomas Leroy',
    avatar: '/avatars/thomas.jpg',
    rating: 3,
    comment: 'Produit correct mais pas exceptionnel. Le rapport qualité-prix pourrait être amélioré.',
    date: '19 Feb 2025',
    product: 'Formation Standard',
    status: 'En attente',
    helpful: 0
  },
  {
    id: 5,
    name: 'Julie Moreau',
    avatar: '/avatars/julie.jpg',
    rating: 2,
    comment: 'Déçue par la qualité du service client. Plusieurs relances nécessaires pour obtenir une réponse.',
    date: '18 Feb 2025',
    product: 'Support Standard',
    status: 'Signalé',
    helpful: 3
  },
  {
    id: 6,
    name: 'Antoine Dupont',
    rating: 5,
    comment: 'Excellente formation, très complète et adaptée à mes besoins. Les formateurs sont compétents et pédagogues.',
    date: '17 Feb 2025',
    product: 'Formation Premium',
    status: 'Publié',
    helpful: 15,
    response: {
      text: 'Merci Antoine pour votre retour positif ! Nous sommes ravis que la formation ait répondu à vos attentes.',
      date: '18 Feb 2025'
    }
  }
];

export function CustomerReviews() {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedReview, setExpandedReview] = useState<number | null>(null);
  
  const toggleExpand = (id: number) => {
    setExpandedReview(expandedReview === id ? null : id);
  };
  
  const filteredReviews = activeTab === 'all' 
    ? reviews 
    : activeTab === 'positive'
    ? reviews.filter(review => review.rating >= 4)
    : activeTab === 'negative'
    ? reviews.filter(review => review.rating < 4)
    : activeTab === 'pending'
    ? reviews.filter(review => review.status === 'En attente')
    : activeTab === 'flagged'
    ? reviews.filter(review => review.status === 'Signalé')
    : reviews;

  return (
    <Card className="border dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-gray-900 dark:text-white">Avis Clients</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Gérez et répondez aux avis de vos clients
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            <span>Filtrer</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Reviews Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">4.6</div>
            <div className="flex justify-center my-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-4 w-4 ${
                    star <= 4.6 
                      ? 'text-yellow-500 fill-yellow-500' 
                      : star <= 5 
                      ? 'text-yellow-500 fill-yellow-500 opacity-50' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Note moyenne</p>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{reviews.length}</div>
            <div className="flex justify-center my-1">
              <MessageSquare className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total des avis</p>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {reviews.filter(r => r.rating >= 4).length}
            </div>
            <div className="flex justify-center my-1">
              <ThumbsUp className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Avis positifs</p>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {reviews.filter(r => r.status === 'En attente').length}
            </div>
            <div className="flex justify-center my-1">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">En attente</p>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {reviews.filter(r => r.response).length}
            </div>
            <div className="flex justify-center my-1">
              <CheckCircle2 className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Réponses</p>
          </div>
        </div>
        
        {/* Reviews List */}
        <div>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="positive">Positifs</TabsTrigger>
              <TabsTrigger value="negative">Négatifs</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="flagged">Signalés</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <div 
                    key={review.id} 
                    className={`border rounded-lg overflow-hidden ${
                      review.status === 'Signalé'
                        ? 'border-red-200 dark:border-red-900'
                        : review.status === 'En attente'
                        ? 'border-amber-200 dark:border-amber-900'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div 
                      className={`p-4 ${
                        review.status === 'Signalé'
                          ? 'bg-red-50 dark:bg-red-900/10'
                          : review.status === 'En attente'
                          ? 'bg-amber-50 dark:bg-amber-900/10'
                          : 'bg-white dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            {review.avatar ? (
                              <AvatarImage src={review.avatar} alt={review.name} />
                            ) : null}
                            <AvatarFallback className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                              {review.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900 dark:text-white">{review.name}</h3>
                              <Badge 
                                variant="outline" 
                                className={
                                  review.status === 'Publié'
                                    ? 'text-green-500 border-green-500/20 bg-green-500/10'
                                    : review.status === 'En attente'
                                    ? 'text-amber-500 border-amber-500/20 bg-amber-500/10'
                                    : 'text-red-500 border-red-500/20 bg-red-500/10'
                                }
                              >
                                {review.status}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-1 mt-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < review.rating 
                                      ? 'text-yellow-500 fill-yellow-500' 
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`} 
                                />
                              ))}
                              
                              {review.product && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                  • {review.product}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {review.date}
                        </div>
                      </div>
                      
                      <div 
                        className={`mt-2 text-gray-700 dark:text-gray-300 ${
                          expandedReview === review.id || review.comment.length < 120
                            ? ''
                            : 'line-clamp-2'
                        }`}
                      >
                        {review.comment}
                      </div>
                      
                      {review.comment.length >= 120 && (
                        <button
                          onClick={() => toggleExpand(review.id)}
                          className="text-sm text-blue-600 dark:text-blue-400 mt-1 hover:underline"
                        >
                          {expandedReview === review.id ? 'Voir moins' : 'Voir plus'}
                        </button>
                      )}
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span>Utile ({review.helpful})</span>
                          </Button>
                          
                          {review.status === 'Publié' && !review.response && (
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span>Répondre</span>
                            </Button>
                          )}
                        </div>
                        
                        {review.status === 'Signalé' && (
                          <Button variant="outline" size="sm" className="h-8 text-red-600 border-red-200 hover:border-red-300">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span>Examiner</span>
                          </Button>
                        )}
                        
                        {review.status === 'En attente' && (
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-8">
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              <span>Approuver</span>
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 text-red-600 border-red-200 hover:border-red-300">
                              <span>Rejeter</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {review.response && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t dark:border-gray-700">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              RP
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                Réponse de l&apos;équipe
                              </h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {review.response.date}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                              {review.response.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {filteredReviews.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      Aucun avis trouvé
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Aucun avis ne correspond aux critères sélectionnés
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 dark:border-gray-700">
        <Button variant="outline" size="sm">
          Paramètres des avis
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          Voir tous les avis
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
