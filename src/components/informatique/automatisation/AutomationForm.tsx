'use client';

import { useState } from 'react';
import { useData } from '@/hooks/useData';
import { Data, DataType } from '@/types/data';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Save, X, Code, FileCode } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

// Define form schema
const automationFormSchema = z.object({
  title: z.string().min(3, { message: 'Le titre doit contenir au moins 3 caractères' }),
  summary: z.string().min(10, { message: 'Le résumé doit contenir au moins 10 caractères' }),
  content: z.string().optional(),
  tags: z.string().optional(),
  scriptType: z.enum(['bash', 'python', 'javascript', 'powershell', 'other']),
  scriptContent: z.string().min(1, { message: 'Le script ne peut pas être vide' }),
  category: z.string().optional(),
  features: z.string().optional(),
});

type AutomationFormValues = z.infer<typeof automationFormSchema>;

interface AutomationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Data;
}

export function AutomationForm({ open, onOpenChange, initialData }: AutomationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createData, updateData } = useData();
  const { toast } = useToast();
  const isEditing = !!initialData?.id;

  // Initialize form with default values or existing data
  const form = useForm<AutomationFormValues>({
    resolver: zodResolver(automationFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      summary: initialData?.summary || '',
      content: initialData?.content || '',
      tags: initialData?.tags ? initialData.tags.join(', ') : '',
      scriptType: (initialData?.metadata?.scriptType as 'bash' | 'python' | 'javascript' | 'powershell' | 'other') || 'bash',
      scriptContent: initialData?.metadata?.scriptContent as string || '',
      category: initialData?.category || '',
      features: initialData?.metadata?.features ? (initialData.metadata.features as string[]).join('\n') : '',
    },
  });

  const onSubmit = async (values: AutomationFormValues) => {
    try {
      setIsSubmitting(true);

      // Process tags
      const tags = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];
      
      // Process features
      const features = values.features 
        ? values.features.split('\n').filter(feature => feature.trim().length > 0) 
        : [];

      // Prepare data object
      const automationData: Partial<Data> = {
        title: values.title,
        summary: values.summary,
        content: values.content,
        tags,
        category: values.category || undefined,
        data_type: 'documentation', // Using documentation as placeholder since automation is not in DataType
        status: 'published',
        metadata: {
          scriptType: values.scriptType,
          scriptContent: values.scriptContent,
          features,
          icon: getIconForScriptType(values.scriptType),
          lastUpdated: new Date().toISOString(),
        }
      };

      // Create or update data
      if (isEditing && initialData?.id) {
        await updateData(initialData.id, automationData);
        toast({
          title: "Automatisation mise à jour",
          description: "L'automatisation a été modifiée avec succès",
        });
      } else {
        await createData(automationData as Data);
        toast({
          title: "Automatisation créée",
          description: "L'automatisation a été créée avec succès",
        });
      }

      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving automation:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIconForScriptType = (scriptType: string): string => {
    switch (scriptType) {
      case 'bash':
      case 'powershell':
        return 'terminal';
      case 'javascript':
        return 'code';
      case 'python':
        return 'file';
      default:
        return 'code';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier l\'automatisation' : 'Nouvelle automatisation'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifiez les détails de l\'automatisation et le script associé.' 
              : 'Créez une nouvelle automatisation avec un script associé.'}
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
                      <Input placeholder="Titre de l'automatisation" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input placeholder="Catégorie" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Résumé</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brève description de l'automatisation" 
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
                    <Input placeholder="ci-cd, scripts, workflow, devops, testing, monitoring" {...field} />
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
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description détaillée</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description détaillée de l'automatisation" 
                      className="resize-none" 
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fonctionnalités</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Une fonctionnalité par ligne" 
                      className="resize-none" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Entrez une fonctionnalité par ligne
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Script</CardTitle>
                  <FileCode className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  Ajoutez le code du script d'automatisation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="scriptType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de script</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un type de script" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bash">Bash</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="powershell">PowerShell</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scriptContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contenu du script</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="#!/bin/bash\necho 'Hello World'" 
                          className="font-mono resize-none" 
                          rows={10}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

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
