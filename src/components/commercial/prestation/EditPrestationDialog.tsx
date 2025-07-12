'use client';

import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Product, ProductStatus } from '@/types/products';
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
  prestation: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (prestationData: Partial<Product>) => void;
  onDelete?: () => void;
}

// Define the schema
const formSchema = z.object({
  name: z.string().min(1, 'Veuillez entrer un nom'),
  description: z.string().min(1, 'Veuillez entrer une description'),
  price: z.number().min(0, 'Veuillez entrer un prix valide'),
  type: z.literal('service'),
  status: z.enum(['active', 'draft', 'discontinued', 'archived']),
  metadata: z.object({
    duration: z.string().min(1, 'Veuillez entrer une durée'),
    category: z.string().min(1, 'Veuillez sélectionner une catégorie'),
    features: z.array(z.string()).min(1, 'Veuillez entrer au moins une caractéristique'),
  }),
});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

export function EditPrestationDialog({ open, onOpenChange, prestation, onSave, onDelete }: EditPrestationDialogProps) {

  // Initialize form with default values from prestation or empty values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: prestation?.name || '',
      description: prestation?.description || '',
      price: prestation?.price || 0,
      type: 'service',
      status: prestation?.status || 'active',
      metadata: {
        duration: prestation?.metadata?.duration || '',
        category: prestation?.metadata?.category || 'Site Web',
        features: prestation?.metadata?.features || [],
      },
    },
  });

  // Update form values when prestation changes
  useEffect(() => {
    if (prestation) {
      form.reset({
        name: prestation.name,
        description: prestation.description,
        price: prestation.price,
        type: 'service',
        status: prestation.status,
        metadata: {
          duration: prestation.metadata?.duration || '',
          category: prestation.metadata?.category || '',
          features: prestation.metadata?.features || [],
        },
      });
    }
  }, [prestation, form]);

  // priceMin watch removed as it's unused

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    // Convert form values to Product type
    const prestationData: Partial<Product> = {
      ...values,
      type: 'service',
      status: values.status as ProductStatus,
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (€)</FormLabel>
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
                name="metadata.duration"
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
                name="metadata.category"
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
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="draft">Brouillon</SelectItem>
                        <SelectItem value="discontinued">Discontinué</SelectItem>
                        <SelectItem value="archived">Archivé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="metadata.features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caractéristiques (une par ligne)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Analyse des besoins&#10;Développement sur mesure&#10;Tests et déploiement"
                      {...field} 
                      value={Array.isArray(field.value) ? field.value.join('\n') : ''}
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
