'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Client } from '@/types/commercial';
import { useClientStore } from '@/stores/commercial/clientStore';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client | null;
  onSuccess?: () => void;
}

export function ClientForm({ open, onOpenChange, client, onSuccess }: ClientFormProps) {
  const { addClient, updateClient } = useClientStore();
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<Client>({
    defaultValues: client || {
      is_company: false,
      name: '',
      email: '',
      phone: '',
      country: '',
      company_name: '',
      contact_person: '',
      vat_number: '',
      registration_number: '',
      website: '',
      address: '',
      status: 'Active',
    },
  });

  const isCompany = watch('is_company');

  useEffect(() => {
    if (client) {
      reset(client);
    } else {
      reset({
        is_company: false,
        name: '',
        email: '',
        phone: '',
        country: '',
        company_name: '',
        contact_person: '',
        vat_number: '',
        registration_number: '',
        website: '',
        address: '',
        status: 'Active',
      });
    }
  }, [client, open, reset]);

  const onSubmit = async (formData: Client) => {
    try {
      // Prepare the data to be saved
      const dataToSave = {
        ...formData,
        // Ensure name is set based on company status
        name: formData.is_company ? formData.company_name || '' : formData.name || '',
      };

      console.log('Submitting form data:', dataToSave);

      if (client?.id) {
        await updateClient(client.id, dataToSave);
        toast({
          title: 'Succès',
          description: 'Client mis à jour avec succès',
        });
      } else {
        await addClient(dataToSave);
        toast({
          title: 'Succès',
          description: 'Client créé avec succès',
        });
      }
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving client:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde du client',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client ? 'Modifier le client' : 'Nouveau client'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Label>Entreprise</Label>
            <Switch
              checked={isCompany}
              onCheckedChange={(checked) => setValue('is_company', checked)}
              className="bg-white data-[state=checked]:bg-primary"
            />
          </div>

          {isCompany ? (
            <div>
              <Label>Nom de l&apos;entreprise *</Label>
              <Input 
                {...register('company_name', { required: 'Le nom de l&apos;entreprise est requis' })}
                placeholder="John&apos;s Company"
              />
              {errors.company_name && (
                <p className="text-sm text-red-500">{errors.company_name.message}</p>
              )}
            </div>
          ) : (
            <div>
              <Label>Nom complet *</Label>
              <Input 
                {...register('name', { required: 'Le nom est requis' })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
          )}

          {isCompany && (
            <>
              <div>
                <Label>Personne à contacter</Label>
                <Input 
                  {...register('contact_person')} 
                  placeholder="john@example.com"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>N° de TVA</Label>
                  <Input {...register('vat_number')} />
                </div>
                <div>
                  <Label>N° d&apos;entreprise</Label>
                  <Input {...register('registration_number')} />
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input type="email" {...register('email')} />
            </div>
            <div>
              <Label>Téléphone</Label>
              <Input type="tel" {...register('phone')} />
            </div>
          </div>

          <div>
            <Label>Adresse</Label>
            <Textarea {...register('address')} rows={2} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Pays</Label>
              <Input {...register('country')} />
            </div>
            <div>
              <Label>Site web</Label>
              <Input type="url" {...register('website')} />
            </div>
          </div>

          {/* Status field removed as requested */}

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}