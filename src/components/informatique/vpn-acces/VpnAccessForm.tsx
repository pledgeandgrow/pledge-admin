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
import { Loader2, Save, X, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Define form schema
const vpnAccessFormSchema = z.object({
  title: z.string().min(3, { message: 'Le titre doit contenir au moins 3 caractères' }),
  summary: z.string().min(10, { message: 'Le résumé doit contenir au moins 10 caractères' }),
  content: z.string().optional(),
  username: z.string().min(3, { message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' }),
  server: z.string().min(3, { message: 'Le serveur doit être spécifié' }),
  access_level: z.enum(['basic', 'standard', 'admin', 'full']),
  status: z.enum(['active', 'pending', 'expired', 'revoked']),
  expiration_date: z.date().optional(),
  notes: z.string().optional(),
});

type VpnAccessFormValues = z.infer<typeof vpnAccessFormSchema>;

interface VpnAccessFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Data;
}

export function VpnAccessForm({ open, onOpenChange, initialData }: VpnAccessFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createData, updateData } = useData();
  const { toast } = useToast();
  const isEditing = !!initialData?.id;

  // Initialize form with default values or existing data
  const form = useForm<VpnAccessFormValues>({
    resolver: zodResolver(vpnAccessFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      summary: initialData?.summary || '',
      content: initialData?.content || '',
      username: initialData?.metadata?.username as string || '',
      server: initialData?.metadata?.server as string || '',
      access_level: (initialData?.metadata?.access_level as 'basic' | 'standard' | 'admin' | 'full') || 'basic',
      status: (initialData?.metadata?.status as 'active' | 'pending' | 'expired' | 'revoked') || 'pending',
      expiration_date: initialData?.metadata?.expiration_date ? new Date(initialData.metadata.expiration_date as string) : undefined,
      notes: initialData?.metadata?.notes as string || '',
    },
  });

  const onSubmit = async (values: VpnAccessFormValues) => {
    try {
      setIsSubmitting(true);

      // Prepare data object
      const vpnAccessData: Partial<Data> = {
        title: values.title,
        summary: values.summary,
        content: values.content,
        data_type: 'documentation', // Using documentation as placeholder
        status: 'published',
        metadata: {
          username: values.username,
          server: values.server,
          access_level: values.access_level,
          status: values.status,
          expiration_date: values.expiration_date ? values.expiration_date.toISOString() : undefined,
          notes: values.notes,
          lastUpdated: new Date().toISOString(),
        }
      };

      // Create or update data
      if (isEditing && initialData?.id) {
        await updateData(initialData.id, vpnAccessData);
        toast({
          title: "Accès VPN mis à jour",
          description: "L'accès VPN a été modifié avec succès",
        });
      } else {
        await createData(vpnAccessData as Data);
        toast({
          title: "Accès VPN créé",
          description: "L'accès VPN a été créé avec succès",
        });
      }

      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving VPN access:', error);
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
            {isEditing ? 'Modifier l\'accès VPN' : 'Nouvel accès VPN'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifiez les détails de l\'accès VPN.' 
              : 'Créez un nouvel accès VPN pour un utilisateur.'}
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
                      <Input placeholder="Titre de l'accès VPN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d'utilisateur</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom d'utilisateur" {...field} />
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
                      placeholder="Brève description de l'accès VPN" 
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
                name="server"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serveur</FormLabel>
                    <FormControl>
                      <Input placeholder="Adresse du serveur VPN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="access_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau d'accès</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un niveau d'accès" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basic">Basique</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="full">Complet</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="expired">Expiré</SelectItem>
                        <SelectItem value="revoked">Révoqué</SelectItem>
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
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Date d'expiration de l'accès VPN
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
