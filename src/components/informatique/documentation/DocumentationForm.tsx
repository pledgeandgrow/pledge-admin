'use client';

import { useState } from 'react';
import { useData } from '@/hooks/useData';
import { Data } from '@/types/data';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Save, X, BookOpen, FileText, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Define form schema
const documentationFormSchema = z.object({
  title: z.string().min(3, { message: 'Le titre doit contenir au moins 3 caractères' }),
  summary: z.string().min(10, { message: 'Le résumé doit contenir au moins 10 caractères' }),
  content: z.string().min(20, { message: 'Le contenu doit contenir au moins 20 caractères' }),
  tags: z.string().optional(),
  documentType: z.enum(['guide', 'manuel', 'procedure', 'reference', 'technique', 'formation']),
  subject: z.string().min(3, { message: 'Le sujet doit contenir au moins 3 caractères' }),
  externalLink: z.string().url({ message: 'Veuillez entrer une URL valide' }).optional().or(z.literal('')),
  sections: z.string().optional(),
});

type DocumentationFormValues = z.infer<typeof documentationFormSchema>;

interface DocumentationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Data;
}

export function DocumentationForm({ open, onOpenChange, initialData }: DocumentationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createData, updateData } = useData();
  const { toast } = useToast();
  const isEditing = !!initialData?.id;

  // Initialize form with default values or existing data
  const form = useForm<DocumentationFormValues>({
    resolver: zodResolver(documentationFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      summary: initialData?.summary || '',
      content: initialData?.content || '',
      tags: initialData?.tags ? initialData.tags.join(', ') : '',
      documentType: (initialData?.metadata?.documentType as 'guide' | 'manuel' | 'procedure' | 'reference' | 'technique' | 'formation') || 'guide',
      subject: initialData?.metadata?.subject as string || '',
      externalLink: initialData?.metadata?.externalLink as string || '',
      sections: initialData?.metadata?.sections ? (initialData.metadata.sections as string[]).join('\n') : '',
    },
  });

  const onSubmit = async (values: DocumentationFormValues) => {
    try {
      setIsSubmitting(true);

      // Process tags
      const tags = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];
      
      // Process sections
      const sections = values.sections 
        ? values.sections.split('\n').filter(section => section.trim().length > 0) 
        : [];

      // Prepare data object
      const documentationData: Partial<Data> = {
        title: values.title,
        summary: values.summary,
        content: values.content,
        tags,
        category: values.subject,
        data_type: 'documentation',
        status: 'published',
        metadata: {
          documentType: values.documentType,
          subject: values.subject,
          externalLink: values.externalLink || undefined,
          sections,
          icon: getIconForDocumentType(values.documentType),
          lastUpdated: new Date().toISOString(),
        }
      };

      // Create or update data
      if (isEditing && initialData?.id) {
        await updateData(initialData.id, documentationData);
        toast({
          title: "Documentation mise à jour",
          description: "La documentation a été modifiée avec succès",
        });
      } else {
        await createData(documentationData as Data);
        toast({
          title: "Documentation créée",
          description: "La documentation a été créée avec succès",
        });
      }

      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving documentation:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIconForDocumentType = (documentType: string): string => {
    switch (documentType) {
      case 'guide':
        return 'book';
      case 'manuel':
        return 'file';
      case 'procedure':
        return 'file';
      case 'reference':
        return 'bookmark';
      case 'formation':
        return 'book';
      default:
        return 'file';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier la documentation' : 'Nouvelle documentation'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifiez les détails de la documentation.' 
              : 'Créez une nouvelle documentation avec contenu, liens et sujet.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input placeholder="Titre de la documentation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de document</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="guide">Guide</SelectItem>
                        <SelectItem value="manuel">Manuel</SelectItem>
                        <SelectItem value="procedure">Procédure</SelectItem>
                        <SelectItem value="reference">Référence</SelectItem>
                        <SelectItem value="technique">Technique</SelectItem>
                        <SelectItem value="formation">Formation</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sujet</FormLabel>
                  <FormControl>
                    <Input placeholder="Sujet principal de la documentation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Résumé</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brève description de la documentation" 
                      className="resize-none" 
                      rows={2}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="guide, manuel, procedure, reference, technique" {...field} />
                  </FormControl>
                  <FormDescription>
                    Séparez les tags par des virgules
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="externalLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lien externe</FormLabel>
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="https://example.com/documentation" {...field} />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Lien vers une documentation externe (optionnel)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenu</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Contenu détaillé de la documentation" 
                      className="resize-none" 
                      rows={8}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sections"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sections</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Une section par ligne" 
                      className="resize-none" 
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Entrez une section par ligne (ex: Introduction, Installation, Configuration)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                <X className="mr-2 h-4 w-4" />
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? 'Mettre à jour' : 'Enregistrer'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
