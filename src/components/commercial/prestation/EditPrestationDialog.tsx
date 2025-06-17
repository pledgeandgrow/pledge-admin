'use client';

import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Prestation } from '@/types/prestation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditPrestationDialogProps {
  prestation: Prestation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (prestationData: Partial<Prestation>) => void;
  onDelete?: () => void;
}

// Define the schema
const formSchema = z.object({
  title: z.string().min(1, 'Veuillez entrer un titre'),
  description: z.string().min(1, 'Veuillez entrer une description'),
  priceMin: z.number().min(0, 'Veuillez entrer un prix minimum valide'),
  priceMax: z.number().min(0, 'Veuillez entrer un prix maximum valide')
    .refine(val => val >= 0, {
      message: 'Le prix maximum doit être positif',
    }),
  duration: z.string().min(1, 'Veuillez entrer une durée'),
  category: z.string().min(1, 'Veuillez sélectionner une catégorie'),
  status: z.string().min(1, 'Veuillez sélectionner un statut'),
  features: z.array(z.string()).min(1, 'Veuillez entrer au moins une caractéristique'),
});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

export function EditPrestationDialog({ open, onOpenChange, prestation, onSave, onDelete }: EditPrestationDialogProps) {

  // Initialize form with default values from prestation or empty values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: prestation?.title || '',
      description: prestation?.description || '',
      priceMin: prestation?.priceMin || 0,
      priceMax: prestation?.priceMax || 0,
      duration: prestation?.duration || '',
      category: prestation?.category || 'Site Web',
      status: prestation?.status || 'Available',
      features: prestation?.features || [],
    },
  });

  // Update form values when prestation changes
  useEffect(() => {
    if (prestation) {
      form.reset({
        title: prestation.title,
        description: prestation.description,
        priceMin: prestation.priceMin,
        priceMax: prestation.priceMax,
        duration: prestation.duration,
        category: prestation.category,
        status: prestation.status,
        features: prestation.features,
      });
    }
  }, [prestation, form]);

  // Watch priceMin to validate priceMax
  const priceMin = form.watch('priceMin');

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    // Convert form values to Prestation type
    const prestationData: Partial<Prestation> = {
      ...values,
      // Explicitly cast string values to their proper types
      category: values.category as Prestation['category'],
      status: values.status as Prestation['status'],
    };
    onSave(prestationData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Modifier le Service
            </span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Modifiez les détails du service. Cliquez sur sauvegarder une fois terminé.
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
                    <Input 
                      placeholder="Développement Web..." 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Service de développement web sur mesure..."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priceMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix minimum (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1500"
                        {...field} 
                        onChange={e => {
                          const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix maximum (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="5000"
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée</FormLabel>
                    <FormControl>
                      <Input placeholder="2 semaines" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Site Web">Site Web</SelectItem>
                        <SelectItem value="SaaS">SaaS</SelectItem>
                        <SelectItem value="Application Mobile">Application Mobile</SelectItem>
                        <SelectItem value="Logiciel">Logiciel</SelectItem>
                        <SelectItem value="Jeux Vidéo">Jeux Vidéo</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="IA & Automatisation">IA & Automatisation</SelectItem>
                        <SelectItem value="Blockchain">Blockchain</SelectItem>
                        <SelectItem value="Cybersécurité">Cybersécurité</SelectItem>
                        <SelectItem value="Cloud / DevOps">Cloud / DevOps</SelectItem>
                        <SelectItem value="Documentation">Documentation</SelectItem>
                        <SelectItem value="Design UX/UI">Design UX/UI</SelectItem>
                        <SelectItem value="Référencement">Référencement</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Conseil / Formation">Conseil / Formation</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Available">Disponible</SelectItem>
                        <SelectItem value="Unavailable">Indisponible</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caractéristiques (une par ligne)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Analyse des besoins&#10;Développement sur mesure&#10;Tests et déploiement"
                      {...field} 
                      value={field.value.join('\n')}
                      onChange={e => field.onChange(e.target.value.split('\n').filter(Boolean))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-between">
              <div>
                {onDelete && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={onDelete}
                    className="mr-2"
                  >
                    Supprimer
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="hover:bg-white/20 dark:hover:bg-gray-800/50"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
                >
                  Sauvegarder
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
