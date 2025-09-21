'use client';

import { useState } from 'react';
import { Asset, AssetType, AssetStatus } from '@/types/assets';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Save, X, CalendarIcon, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Define form schema
const assetFormSchema = z.object({
  name: z.string().min(3, { message: 'Le nom doit contenir au moins 3 caractères' }),
  type: z.enum(['physical', 'digital']),
  description: z.string().optional(),
  acquisition_date: z.date().optional(),
  expiration_date: z.date().optional(),
  status: z.enum(['active', 'expired', 'pending', 'archived']),
  value: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  currency: z.string().optional(),
  location: z.string().optional(),
  tags: z.string().optional(),
  file_path: z.string().optional(),
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

interface AssetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Asset;
}

export function AssetForm({ open, onOpenChange, initialData }: AssetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isEditing = !!initialData?.id;

  // Initialize form with default values or existing data
  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || 'digital',
      description: initialData?.description || '',
      acquisition_date: initialData?.acquisition_date ? new Date(initialData.acquisition_date) : undefined,
      expiration_date: initialData?.expiration_date ? new Date(initialData.expiration_date) : undefined,
      status: initialData?.status || 'active',
      value: initialData?.value !== undefined ? String(initialData.value) : '',
      currency: initialData?.currency || '€',
      location: initialData?.location || '',
      tags: initialData?.tags ? initialData.tags.join(', ') : '',
      file_path: initialData?.file_path || '',
    },
  });

  const onSubmit: SubmitHandler<AssetFormValues> = async (values) => {
    try {
      setIsSubmitting(true);

      // Process tags
      const tags = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];

      // Prepare asset object
      const assetData: Partial<Asset> = {
        name: values.name,
        type: values.type,
        description: values.description,
        acquisition_date: values.acquisition_date?.toISOString(),
        expiration_date: values.expiration_date?.toISOString(),
        status: values.status,
        value: values.value !== undefined ? Number(values.value) : undefined,
        currency: values.currency,
        location: values.location,
        tags,
        file_path: values.file_path,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: isEditing ? "Licence mise à jour" : "Licence créée",
        description: isEditing 
          ? `La licence ${values.name} a été mise à jour avec succès` 
          : `La licence ${values.name} a été créée avec succès`,
      });

      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving asset:', error);
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
            {isEditing ? 'Modifier la licence' : 'Nouvelle licence'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifiez les détails de la licence ou de l\'actif.' 
              : 'Ajoutez une nouvelle licence ou un nouvel actif à votre inventaire.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de la licence ou de l'actif" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="digital">Licence Digitale</SelectItem>
                        <SelectItem value="physical">Actif Physique</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description de la licence ou de l'actif" 
                      className="resize-none" 
                      rows={3}
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
                name="acquisition_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date d'acquisition</FormLabel>
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
                        <SelectItem value="archived">Archivé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valeur</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Devise</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="€" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="€">€ (EUR)</SelectItem>
                          <SelectItem value="$">$ (USD)</SelectItem>
                          <SelectItem value="£">£ (GBP)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emplacement</FormLabel>
                  <FormControl>
                    <Input placeholder="Emplacement physique ou serveur" {...field} />
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
                    <Input placeholder="logiciel, design, développement, serveur" {...field} />
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
              name="file_path"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fichier ou lien</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="Chemin du fichier ou URL" {...field} />
                    </FormControl>
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormDescription>
                    Chemin vers le fichier de licence ou URL de téléchargement
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
