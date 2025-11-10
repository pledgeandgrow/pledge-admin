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
import { useContacts } from '@/hooks/useContacts';

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
  console.log('🔵 ClientForm opened:', { open, hasClient: !!client, clientId: client?.id });
  
  const { createContact, updateContact } = useContacts();
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
        is_company: Boolean(client.metadata?.is_company) || false,
        address: String(client.metadata?.address || ''),
        website: String(client.metadata?.website || ''),
        country: String(client.metadata?.country || ''),
        company_name: String(client.metadata?.company_name || ''),
        contact_person: String(client.metadata?.contact_person || ''),
        vat_number: String(client.metadata?.vat_number || ''),
        registration_number: String(client.metadata?.registration_number || ''),
        notes: String(client.metadata?.notes || ''),
        industry: String(client.metadata?.industry || '')
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
          is_company: Boolean(client.metadata?.is_company) || false,
          address: String(client.metadata?.address || ''),
          website: String(client.metadata?.website || ''),
          country: String(client.metadata?.country || ''),
          company_name: String(client.metadata?.company_name || ''),
          contact_person: String(client.metadata?.contact_person || ''),
          vat_number: String(client.metadata?.vat_number || ''),
          registration_number: String(client.metadata?.registration_number || ''),
          notes: String(client.metadata?.notes || ''),
          industry: String(client.metadata?.industry || '')
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
      console.log('🔵 Form submitted with data:', formData);
      console.log('🔵 Is editing existing client?', !!client?.id);
      
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

      // Validate required fields
      if (!firstName && !lastName) {
        toast({
          title: 'Erreur de validation',
          description: 'Veuillez fournir un nom',
          variant: 'destructive',
        });
        return;
      }

      // Prepare the data to be saved in the format expected by contactService
      const contactData = {
        first_name: firstName,
        last_name: lastName,
        email: formData.email || '',
        phone: formData.phone || '',
        type: 'client' as const,
        status: formData.status || 'Active',
        // Store all client-specific fields in metadata
        metadata: {
          is_company: Boolean(formData.metadata.is_company),
          address: formData.metadata.address || '',
          website: formData.metadata.website || '',
          country: formData.metadata.country || '',
          company_name: formData.metadata.company_name || '',
          contact_person: formData.metadata.contact_person || '',
          vat_number: formData.metadata.vat_number || '',
          registration_number: formData.metadata.registration_number || '',
          notes: formData.metadata.notes || '',
          industry: formData.metadata.industry || ''
        }
      };

      console.log('✅ Submitting client data:', contactData);

      if (client?.id) {
        console.log('🔄 Updating client with ID:', client.id);
        await updateContact(client.id, contactData);
        toast({
          title: 'Succès',
          description: 'Client mis à jour avec succès',
        });
      } else {
        console.log('➕ Creating new client');
        const result = await createContact(contactData);
        console.log('✅ Client created:', result);
        toast({
          title: 'Succès',
          description: 'Client créé avec succès',
        });
      }
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('❌ Error saving client:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast({
        title: 'Erreur',
        description: `Erreur lors de la sauvegarde: ${errorMessage}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">{client ? 'Modifier le client' : 'Nouveau client'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Label className="text-gray-700 dark:text-gray-300">Entreprise</Label>
            <Switch
              checked={isCompany}
              onCheckedChange={(checked) => setValue('metadata.is_company', checked)}
              className="bg-white data-[state=checked]:bg-primary"
            />
          </div>

          {isCompany ? (
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Nom de l&apos;entreprise *</Label>
              <Input 
                {...register('metadata.company_name', { required: 'Le nom de l&apos;entreprise est requis' })}
                placeholder="John&apos;s Company"
                className="text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              {errors.metadata?.company_name && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.metadata.company_name.message}</p>
              )}
            </div>
          ) : (
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Nom complet *</Label>
              <Input 
                {...register('fullName', { required: 'Le nom est requis' })}
                className="text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              {errors.fullName && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.fullName.message}</p>
              )}
            </div>
          )}

          {isCompany && (
            <>
              <div>
                <Label className="text-gray-700 dark:text-gray-300">Personne à contacter</Label>
                <Input 
                  {...register('metadata.contact_person')} 
                  placeholder="John Doe"
                  className="text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">N° de TVA</Label>
                  <Input {...register('metadata.vat_number')} className="text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500" />
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">N° d&apos;entreprise</Label>
                  <Input {...register('metadata.registration_number')} className="text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500" />
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Email</Label>
              <Input type="email" {...register('email')} className="text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500" />
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Téléphone</Label>
              <Input type="tel" {...register('phone')} className="text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500" />
            </div>
          </div>

          <div>
            <Label className="text-gray-700 dark:text-gray-300">Adresse</Label>
            <Textarea {...register('metadata.address')} rows={2} className="text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Pays</Label>
              <Input {...register('metadata.country')} className="text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500" />
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Site web</Label>
              <Input type="url" {...register('metadata.website')} className="text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500" />
            </div>
          </div>

          <div>
            <Label className="text-gray-700 dark:text-gray-300">Notes</Label>
            <Textarea {...register('metadata.notes')} rows={2} className="text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500" />
          </div>

          <div>
            <Label className="text-gray-700 dark:text-gray-300">Industrie</Label>
            <Input {...register('metadata.industry')} className="text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500" />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              onClick={() => console.log('🔵 Submit button clicked')}
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}