'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ClientContact } from '@/types/contact';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { contactService } from '@/services/contactService';

// Form data interface to handle client form fields
interface ClientFormData {
  // Base contact fields
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  status: string;
  type: 'client';
  
  // UI-only fields for form handling
  fullName?: string; // For individual clients
  
  // Metadata fields
  metadata: {
    is_company: boolean;
    address?: string;
    website?: string;
    country?: string;
    company_name?: string;
    contact_person?: string;
    vat_number?: string;
    registration_number?: string;
    notes?: string;
    industry?: string;
  };
}

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: ClientContact | null;
  onSuccess?: () => void;
}

export function ClientForm({ open, onOpenChange, client, onSuccess }: ClientFormProps) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ClientFormData>({
    defaultValues: client ? {
      // Base fields
      first_name: client.first_name || '',
      last_name: client.last_name || '',
      email: client.email || '',
      phone: client.phone || '',
      status: client.status || 'Active',
      type: 'client',
      
      // UI fields
      fullName: client.metadata?.is_company ? '' : `${client.first_name} ${client.last_name}`.trim(),
      
      // Metadata fields
      metadata: {
        is_company: client.metadata?.is_company || false,
        address: client.metadata?.address || '',
        website: client.metadata?.website || '',
        country: client.metadata?.country || '',
        company_name: client.metadata?.company_name || '',
        contact_person: client.metadata?.contact_person || '',
        vat_number: client.metadata?.vat_number || '',
        registration_number: client.metadata?.registration_number || '',
        notes: client.metadata?.notes || '',
        industry: client.metadata?.industry || ''
      }
    } : {
      // Default values for new client
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      status: 'Active',
      type: 'client',
      fullName: '',
      metadata: {
        is_company: false,
        address: '',
        website: '',
        country: '',
        company_name: '',
        contact_person: '',
        vat_number: '',
        registration_number: '',
        notes: '',
        industry: ''
      }
    },
  });

  const isCompany = watch('metadata.is_company');

  useEffect(() => {
    if (client) {
      reset({
        first_name: client.first_name || '',
        last_name: client.last_name || '',
        email: client.email || '',
        phone: client.phone || '',
        status: client.status || 'Active',
        type: 'client',
        fullName: client.metadata?.is_company ? '' : `${client.first_name} ${client.last_name}`.trim(),
        metadata: {
          is_company: client.metadata?.is_company || false,
          address: client.metadata?.address || '',
          website: client.metadata?.website || '',
          country: client.metadata?.country || '',
          company_name: client.metadata?.company_name || '',
          contact_person: client.metadata?.contact_person || '',
          vat_number: client.metadata?.vat_number || '',
          registration_number: client.metadata?.registration_number || '',
          notes: client.metadata?.notes || '',
          industry: client.metadata?.industry || ''
        }
      });
    } else {
      reset({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        status: 'Active',
        type: 'client',
        fullName: '',
        metadata: {
          is_company: false,
          address: '',
          website: '',
          country: '',
          company_name: '',
          contact_person: '',
          vat_number: '',
          registration_number: '',
          notes: '',
          industry: ''
        }
      });
    }
  }, [client, open, reset]);

  const onSubmit = async (formData: ClientFormData) => {
    try {
      let firstName = '';
      let lastName = '';
      
      if (!formData.metadata.is_company && formData.fullName) {
        // Split fullName into first_name and last_name for individuals
        const nameParts = formData.fullName.trim().split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      } else if (formData.metadata.is_company) {
        // For companies, use contact person as first_name and company name as last_name
        firstName = formData.metadata.contact_person || '';
        lastName = formData.metadata.company_name || '';
      } else {
        // Use existing first_name and last_name if available
        firstName = formData.first_name || '';
        lastName = formData.last_name || '';
      }

      // Prepare the data to be saved in the format expected by contactService
      const contactData = {
        first_name: firstName,
        last_name: lastName,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        type: 'client' as const,
        status: formData.status || 'Active',
        // Store all client-specific fields in metadata
        metadata: {
          is_company: formData.metadata.is_company,
          address: formData.metadata.address,
          website: formData.metadata.website,
          country: formData.metadata.country,
          company_name: formData.metadata.company_name,
          contact_person: formData.metadata.contact_person,
          vat_number: formData.metadata.vat_number,
          registration_number: formData.metadata.registration_number,
          notes: formData.metadata.notes,
          industry: formData.metadata.industry
        }
      };

      console.log('Submitting client data:', contactData);

      if (client?.id) {
        await contactService.updateContact(client.id, contactData);
        toast({
          title: 'Succès',
          description: 'Client mis à jour avec succès',
        });
      } else {
        await contactService.addContact(contactData);
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