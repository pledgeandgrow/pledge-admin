'use client';

import { useState } from 'react';
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
import { Loader2, Save, X, Upload, PaperclipIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Define form schema
const ticketFormSchema = z.object({
  title: z.string().min(3, { message: 'Le titre doit contenir au moins 3 caractères' }),
  summary: z.string().min(10, { message: 'Le résumé doit contenir au moins 10 caractères' }),
  content: z.string().min(20, { message: 'La description doit contenir au moins 20 caractères' }),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  category: z.string().min(1, { message: 'Veuillez sélectionner une catégorie' }),
  requester: z.string().min(3, { message: 'Le nom du demandeur est requis' }),
  requester_email: z.string().email({ message: 'Veuillez entrer une adresse email valide' }),
  tags: z.string().optional(),
  attachments: z.string().optional(),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

interface TicketFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Data;
}

export function TicketForm({ open, onOpenChange, initialData }: TicketFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isEditing = !!initialData?.id;

  // Initialize form with default values or existing data
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      summary: initialData?.summary || '',
      content: initialData?.content || '',
      priority: (initialData?.metadata?.priority as 'low' | 'medium' | 'high' | 'critical') || 'medium',
      category: initialData?.metadata?.category as string || '',
      requester: initialData?.metadata?.requester as string || '',
      requester_email: initialData?.metadata?.requester_email as string || '',
      tags: initialData?.tags ? initialData.tags.join(', ') : '',
      attachments: initialData?.metadata?.attachments as string || '',
    },
  });

  const onSubmit = async (values: TicketFormValues) => {
    try {
      setIsSubmitting(true);

      // Process tags
      const tags = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];

      // Prepare ticket data
      const ticketData: Partial<Data> = {
        title: values.title,
        summary: values.summary,
        content: values.content,
        data_type: 'documentation', // Using documentation as placeholder
        status: 'published',
        tags,
        metadata: {
          priority: values.priority,
          category: values.category,
          requester: values.requester,
          requester_email: values.requester_email,
          status: isEditing ? initialData?.metadata?.status || 'open' : 'new',
          created_at: isEditing ? initialData?.metadata?.created_at : new Date().toISOString(),
          updated_at: new Date().toISOString(),
          message_count: isEditing ? initialData?.metadata?.message_count || 0 : 0,
          attachments: values.attachments || '',
        }
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: isEditing ? "Ticket mis à jour" : "Ticket créé",
        description: isEditing 
          ? `Le ticket ${values.title} a été mis à jour avec succès` 
          : `Le ticket ${values.title} a été créé avec succès`,
      });

      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving ticket:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier le ticket' : 'Nouveau ticket'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifiez les détails du ticket de support.' 
              : 'Créez un nouveau ticket de support.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre du ticket" {...field} />
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
                      placeholder="Brève description du problème" 
                      className="resize-none" 
                      rows={2}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorité</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une priorité" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Basse</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Haute</SelectItem>
                        <SelectItem value="critical">Critique</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hardware">Matériel</SelectItem>
                        <SelectItem value="software">Logiciel</SelectItem>
                        <SelectItem value="network">Réseau</SelectItem>
                        <SelectItem value="access">Accès</SelectItem>
                        <SelectItem value="security">Sécurité</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description détaillée</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description détaillée du problème" 
                      className="resize-none" 
                      rows={6}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="requester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demandeur</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du demandeur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requester_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email du demandeur</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="bug, imprimante, urgent" {...field} />
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
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pièces jointes</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="Aucun fichier sélectionné" {...field} disabled />
                    </FormControl>
                    <Button type="button" variant="outline">
                      <PaperclipIcon className="mr-2 h-4 w-4" />
                      Joindre
                    </Button>
                  </div>
                  <FormDescription>
                    Ajoutez des captures d'écran ou des documents pertinents
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
                    {isEditing ? 'Mettre à jour' : 'Soumettre'}
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
