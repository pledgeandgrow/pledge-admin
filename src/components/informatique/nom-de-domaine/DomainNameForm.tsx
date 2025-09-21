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
import { Loader2, Save, X, Globe } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Switch } from '@/components/ui/switch';

// Define form schema
const domainNameFormSchema = z.object({
  title: z.string().min(3, { message: 'Le nom de domaine doit contenir au moins 3 caractères' }),
  summary: z.string().min(10, { message: 'Le résumé doit contenir au moins 10 caractères' }),
  content: z.string().optional(),
  registrar: z.string().min(3, { message: 'Le registrar doit être spécifié' }),
  status: z.enum(['active', 'expiring', 'expired', 'transferred', 'locked']),
  expiration_date: z.date().optional(),
  auto_renew: z.boolean().default(true),
  nameservers: z.string().optional(),
  notes: z.string().optional(),
});

type DomainNameFormValues = z.infer<typeof domainNameFormSchema>;

interface DomainNameFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Data;
}

export function DomainNameForm({ open, onOpenChange, initialData }: DomainNameFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createData, updateData } = useData();
  const { toast } = useToast();
  const isEditing = !!initialData?.id;

  // Initialize form with default values or existing data
  const form = useForm<DomainNameFormValues>({
    resolver: zodResolver(domainNameFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      summary: initialData?.summary || '',
      content: initialData?.content || '',
      registrar: initialData?.metadata?.registrar as string || '',
      status: (initialData?.metadata?.status as 'active' | 'expiring' | 'expired' | 'transferred' | 'locked') || 'active',
      expiration_date: initialData?.metadata?.expiration_date ? new Date(initialData.metadata.expiration_date as string) : undefined,
      auto_renew: initialData?.metadata?.auto_renew as boolean ?? true,
      nameservers: Array.isArray(initialData?.metadata?.nameservers) 
        ? (initialData.metadata.nameservers as string[]).join('\n') 
        : '',
      notes: initialData?.metadata?.notes as string || '',
    },
  });

  const onSubmit = async (values: DomainNameFormValues) => {
    try {
      setIsSubmitting(true);

      // Process nameservers
      const nameservers = values.nameservers 
        ? values.nameservers.split('\n').filter(ns => ns.trim().length > 0) 
        : [];

      // Prepare data object
      const domainData: Partial<Data> = {
        title: values.title,
        summary: values.summary,
        content: values.content,
        data_type: 'documentation', // Using documentation as placeholder
        status: 'published',
        metadata: {
          registrar: values.registrar,
          status: values.status,
          expiration_date: values.expiration_date ? values.expiration_date.toISOString() : undefined,
          auto_renew: values.auto_renew,
          nameservers,
          notes: values.notes,
          lastUpdated: new Date().toISOString(),
        }
      };

      // Create or update data
      if (isEditing && initialData?.id) {
        await updateData(initialData.id, domainData);
        toast({
          title: "Nom de domaine mis à jour",
          description: "Le nom de domaine a été modifié avec succès",
        });
      } else {
        await createData(domainData as Data);
        toast({
          title: "Nom de domaine créé",
          description: "Le nom de domaine a été créé avec succès",
        });
      }

      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving domain name:', error);
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
            {isEditing ? 'Modifier le nom de domaine' : 'Nouveau nom de domaine'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifiez les détails du nom de domaine.' 
              : 'Ajoutez un nouveau nom de domaine à gérer.'}
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
                    <FormLabel>Nom de domaine</FormLabel>
                    <FormControl>
                      <Input placeholder="exemple.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registrar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registrar</FormLabel>
                    <FormControl>
                      <Input placeholder="OVH, Gandi, etc." {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brève description du nom de domaine" 
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="expiring">Expirant bientôt</SelectItem>
                        <SelectItem value="expired">Expiré</SelectItem>
                        <SelectItem value="transferred">Transféré</SelectItem>
                        <SelectItem value="locked">Verrouillé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiration_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date d'expiration</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Sélectionnez une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Date d'expiration du nom de domaine
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="auto_renew"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Renouvellement automatique</FormLabel>
                    <FormDescription>
                      Activer le renouvellement automatique du nom de domaine
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nameservers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serveurs DNS</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="ns1.example.com&#10;ns2.example.com" 
                      className="resize-none font-mono" 
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Un serveur DNS par ligne
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Notes supplémentaires" 
                      className="resize-none" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
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
