'use client';

import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
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

const formSchema = z.object({
  title: z.string().min(1, 'Veuillez entrer un titre'),
  description: z.string().min(1, 'Veuillez entrer une description'),
  price: z.number().min(0, 'Veuillez entrer un prix valide'),
  duration: z.string().min(1, 'Veuillez entrer une durée'),
  category: z.string().min(1, 'Veuillez sélectionner une catégorie'),
  status: z.string().min(1, 'Veuillez sélectionner un statut'),
  features: z.array(z.string()).min(1, 'Veuillez entrer au moins une caractéristique'),
});

interface EditPrestationDialogProps {
  prestation: Prestation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPrestationDialog({ open, onOpenChange, prestation }: EditPrestationDialogProps) {
  const [formData, setFormData] = useState<Partial<Prestation>>(
    prestation || {
      title: '',
      description: '',
      price: 0,
      duration: '',
      category: 'Consulting',
      status: 'Available',
      features: []
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement prestation update
    console.log(values);
    onOpenChange(false);
  }

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
                      value={formData.title}
                      onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
                        <SelectItem value="Développement Web">Développement Web</SelectItem>
                        <SelectItem value="Maintenance Applicative">Maintenance Applicative</SelectItem>
                        <SelectItem value="Cloud & DevOps">Cloud & DevOps</SelectItem>
                        <SelectItem value="Sécurité IT">Sécurité IT</SelectItem>
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

            <DialogFooter>
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
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
