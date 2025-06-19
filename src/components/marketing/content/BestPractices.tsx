'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, Lightbulb, BookMarked, Star, TrendingUp, Bookmark } from 'lucide-react';

const bestPractices = [
  {
    category: "Planification",
    icon: <BookMarked className="h-5 w-5 text-blue-500" />,
    practices: [
      {
        title: "Définir des Objectifs SMART",
        description: "Vos objectifs doivent être Spécifiques, Mesurables, Atteignables, Réalistes et Temporellement définis.",
        tips: [
          "Fixez des objectifs chiffrés",
          "Établissez un calendrier réaliste",
          "Alignez les objectifs avec votre stratégie globale"
        ]
      },
      {
        title: "Connaître son Audience",
        description: "Une compréhension approfondie de votre audience est essentielle pour créer du contenu pertinent.",
        tips: [
          "Créez des personas détaillés",
          "Analysez les données démographiques",
          "Suivez les tendances de votre secteur"
        ]
      }
    ]
  },
  {
    category: "Création de Contenu",
    icon: <Star className="h-5 w-5 text-amber-500" />,
    practices: [
      {
        title: "Qualité et Cohérence",
        description: "Maintenez un niveau de qualité constant dans votre contenu.",
        tips: [
          "Établissez un guide de style",
          "Créez un calendrier éditorial",
          "Vérifiez la qualité avant publication"
        ]
      },
      {
        title: "Optimisation SEO",
        description: "Optimisez votre contenu pour les moteurs de recherche sans compromettre la qualité.",
        tips: [
          "Recherchez les mots-clés pertinents",
          "Structurez votre contenu avec des H1, H2, etc.",
          "Incluez des méta-descriptions"
        ]
      }
    ]
  },
  {
    category: "Distribution et Promotion",
    icon: <TrendingUp className="h-5 w-5 text-green-500" />,
    practices: [
      {
        title: "Multi-canal",
        description: "Adaptez votre contenu pour différents canaux de distribution.",
        tips: [
          "Adaptez le format selon la plateforme",
          "Planifiez les horaires de publication",
          "Mesurez les performances par canal"
        ]
      },
      {
        title: "Engagement",
        description: "Encouragez et gérez l'engagement de votre audience.",
        tips: [
          "Répondez aux commentaires",
          "Créez du contenu interactif",
          "Organisez des événements en ligne"
        ]
      }
    ]
  }
];

export function BestPractices() {
  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
        <Lightbulb className="h-4 w-4 text-blue-500 dark:text-blue-400" />
        <AlertTitle className="text-blue-700 dark:text-blue-300">Conseil Pro</AlertTitle>
        <AlertDescription className="text-blue-600 dark:text-blue-400">
          Utilisez ces meilleures pratiques comme guide, mais n&apos;hésitez pas à les adapter à votre contexte spécifique.
        </AlertDescription>
      </Alert>

      <Accordion type="single" collapsible className="w-full">
        {bestPractices.map((category, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="border dark:border-gray-700 rounded-lg mb-4 overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-lg font-semibold text-gray-900 dark:text-white">
              <div className="flex items-center gap-2">
                {category.icon}
                <span>{category.category}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 bg-gray-50 dark:bg-gray-850">
              <div className="space-y-4">
                {category.practices.map((practice, practiceIndex) => (
                  <Card key={practiceIndex} className="border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-white">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        {practice.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">{practice.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Bookmark className="h-4 w-4 text-indigo-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Conseils clés:</span>
                        </div>
                        <ul className="space-y-2 pl-6">
                          {practice.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
