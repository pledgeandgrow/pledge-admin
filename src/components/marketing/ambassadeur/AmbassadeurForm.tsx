'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Textarea will be used in future implementations
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { NetworkContact } from '@/types/contact';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

// Extended NetworkContact interface with additional metadata for ambassadeurs
interface AmbassadeurContact extends NetworkContact {
  metadata: {
    connection_strength?: number;
    category?: string;
    avatar?: string;
    socialMedia?: {
      instagram?: string;
      twitter?: string;
      facebook?: string;
      linkedin?: string;
      followers?: number;
    };
    performance?: {
      conversions?: number;
      engagement?: string;
      reach?: number;
    };
  };
}

// Form data interface to handle ambassadeur form fields
interface AmbassadeurFormData {
  // Base contact fields
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  status: string;
  type: 'network';
  company: string;
  position: string;
  
  // Metadata fields
  metadata: {
    connection_strength?: number;
    category?: string;
    avatar?: string;
    socialMedia: {
      instagram?: string;
      twitter?: string;
      facebook?: string;
      linkedin?: string;
      followers?: number;
    };
    performance: {
      conversions?: number;
      engagement?: string;
      reach?: number;
    };
  };
}

interface AmbassadeurFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ambassadeur?: AmbassadeurContact | null;
  onSuccess?: () => void;
}

export function AmbassadeurForm({ open, onOpenChange, ambassadeur, onSuccess }: AmbassadeurFormProps) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<AmbassadeurFormData>({
    defaultValues: ambassadeur ? {
      // Base fields
      first_name: ambassadeur.first_name || '',
      last_name: ambassadeur.last_name || '',
      email: ambassadeur.email || '',
      phone: ambassadeur.phone || '',
      status: ambassadeur.status || 'active',
      type: 'network',
      company: ambassadeur.company || '',
      position: ambassadeur.position || '',
      
      // Metadata fields
      metadata: {
        connection_strength: ambassadeur.metadata?.connection_strength || 3,
        category: ambassadeur.metadata?.category || 'Influenceur',
        avatar: ambassadeur.metadata?.avatar || '',
        socialMedia: {
          instagram: ambassadeur.metadata?.socialMedia?.instagram || '',
          twitter: ambassadeur.metadata?.socialMedia?.twitter || '',
          facebook: ambassadeur.metadata?.socialMedia?.facebook || '',
          linkedin: ambassadeur.metadata?.socialMedia?.linkedin || '',
          followers: ambassadeur.metadata?.socialMedia?.followers || 0,
        },
        performance: {
          conversions: ambassadeur.metadata?.performance?.conversions || 0,
          engagement: ambassadeur.metadata?.performance?.engagement || '0%',
          reach: ambassadeur.metadata?.performance?.reach || 0,
        }
      }
    } : {
      // Default values for new ambassadeur
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      status: 'active',
      type: 'network',
      company: '',
      position: '',
      metadata: {
        connection_strength: 3,
        category: 'Influenceur',
        avatar: '',
        socialMedia: {
          instagram: '',
          twitter: '',
          facebook: '',
          linkedin: '',
          followers: 0,
        },
        performance: {
          conversions: 0,
          engagement: '0%',
          reach: 0,
        }
      }
    },
  });

  useEffect(() => {
    if (ambassadeur) {
      reset({
        first_name: ambassadeur.first_name || '',
        last_name: ambassadeur.last_name || '',
        email: ambassadeur.email || '',
        phone: ambassadeur.phone || '',
        status: ambassadeur.status || 'active',
        type: 'network',
        company: ambassadeur.company || '',
        position: ambassadeur.position || '',
        metadata: {
          connection_strength: ambassadeur.metadata?.connection_strength || 3,
          category: ambassadeur.metadata?.category || 'Influenceur',
          avatar: ambassadeur.metadata?.avatar || '',
          socialMedia: {
            instagram: ambassadeur.metadata?.socialMedia?.instagram || '',
            twitter: ambassadeur.metadata?.socialMedia?.twitter || '',
            facebook: ambassadeur.metadata?.socialMedia?.facebook || '',
            linkedin: ambassadeur.metadata?.socialMedia?.linkedin || '',
            followers: ambassadeur.metadata?.socialMedia?.followers || 0,
          },
          performance: {
            conversions: ambassadeur.metadata?.performance?.conversions || 0,
            engagement: ambassadeur.metadata?.performance?.engagement || '0%',
            reach: ambassadeur.metadata?.performance?.reach || 0,
          }
        }
      });
    } else {
      reset({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        status: 'active',
        type: 'network',
        company: '',
        position: '',
        metadata: {
          connection_strength: 3,
          category: 'Influenceur',
          avatar: '',
          socialMedia: {
            instagram: '',
            twitter: '',
            facebook: '',
            linkedin: '',
            followers: 0,
          },
          performance: {
            conversions: 0,
            engagement: '0%',
            reach: 0,
          }
        }
      });
    }
  }, [ambassadeur, open, reset]);

  const onSubmit = async (formData: AmbassadeurFormData) => {
    try {
      // Prepare the data to be saved
      const contactData: Partial<AmbassadeurContact> = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email || '',
        phone: formData.phone || '',
        type: 'network',
        status: formData.status || 'active',
        company: formData.company || '',
        position: formData.position || '',
        tags: ['ambassadeur'],
        // Store all ambassadeur-specific fields in metadata
        metadata: {
          connection_strength: formData.metadata.connection_strength || 3,
          category: formData.metadata.category || 'Influenceur',
          avatar: formData.metadata.avatar || '',
          socialMedia: {
            instagram: formData.metadata.socialMedia.instagram || '',
            twitter: formData.metadata.socialMedia.twitter || '',
            facebook: formData.metadata.socialMedia.facebook || '',
            linkedin: formData.metadata.socialMedia.linkedin || '',
            followers: Number(formData.metadata.socialMedia.followers) || 0,
          },
          performance: {
            conversions: Number(formData.metadata.performance.conversions) || 0,
            engagement: formData.metadata.performance.engagement || '0%',
            reach: Number(formData.metadata.performance.reach) || 0,
          }
        }
      };

      console.log('Submitting ambassadeur data:', contactData);

      // In a real implementation, this would call a service to save the data
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Succès',
        description: ambassadeur?.id 
          ? 'Ambassadeur mis à jour avec succès' 
          : 'Ambassadeur créé avec succès',
      });
      
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving ambassadeur:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{ambassadeur ? 'Modifier l\'ambassadeur' : 'Nouvel ambassadeur'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">Prénom *</Label>
              <Input 
                id="first_name"
                {...register('first_name', { required: 'Le prénom est requis' })}
              />
              {errors.first_name && (
                <p className="text-sm text-red-500">{errors.first_name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="last_name">Nom *</Label>
              <Input 
                id="last_name"
                {...register('last_name', { required: 'Le nom est requis' })}
              />
              {errors.last_name && (
                <p className="text-sm text-red-500">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email" 
                {...register('email')}
              />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input 
                id="phone"
                type="tel" 
                {...register('phone')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Entreprise</Label>
              <Input 
                id="company"
                {...register('company')}
              />
            </div>
            <div>
              <Label htmlFor="position">Poste</Label>
              <Input 
                id="position"
                {...register('position')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select 
                onValueChange={(value) => setValue('metadata.category', value)}
                defaultValue={watch('metadata.category')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Influenceur">Influenceur</SelectItem>
                  <SelectItem value="Client Fidèle">Client Fidèle</SelectItem>
                  <SelectItem value="Expert Métier">Expert Métier</SelectItem>
                  <SelectItem value="Partenaire">Partenaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select 
                onValueChange={(value) => setValue('status', value)}
                defaultValue={watch('status')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="paused">En pause</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="avatar">URL de l&apos;avatar</Label>
            <Input 
              id="avatar"
              {...register('metadata.avatar')}
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium mb-2">Réseaux sociaux</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input 
                  id="instagram"
                  {...register('metadata.socialMedia.instagram')}
                  placeholder="@username"
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input 
                  id="twitter"
                  {...register('metadata.socialMedia.twitter')}
                  placeholder="@username"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input 
                  id="facebook"
                  {...register('metadata.socialMedia.facebook')}
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input 
                  id="linkedin"
                  {...register('metadata.socialMedia.linkedin')}
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="followers">Nombre de followers</Label>
              <Input 
                id="followers"
                type="number"
                {...register('metadata.socialMedia.followers', {
                  valueAsNumber: true,
                  min: 0
                })}
              />
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium mb-2">Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="conversions">Conversions</Label>
                <Input 
                  id="conversions"
                  type="number"
                  {...register('metadata.performance.conversions', {
                    valueAsNumber: true,
                    min: 0
                  })}
                />
              </div>
              <div>
                <Label htmlFor="engagement">Engagement</Label>
                <Input 
                  id="engagement"
                  {...register('metadata.performance.engagement')}
                  placeholder="ex: 4.8%"
                />
              </div>
              <div>
                <Label htmlFor="reach">Portée</Label>
                <Input 
                  id="reach"
                  type="number"
                  {...register('metadata.performance.reach', {
                    valueAsNumber: true,
                    min: 0
                  })}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium mb-2">Force de la relation</h3>
            <div>
              <Label htmlFor="connection_strength">Force (1-5)</Label>
              <Select 
                onValueChange={(value) => setValue('metadata.connection_strength', parseInt(value))}
                defaultValue={watch('metadata.connection_strength')?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une valeur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Très faible</SelectItem>
                  <SelectItem value="2">2 - Faible</SelectItem>
                  <SelectItem value="3">3 - Moyenne</SelectItem>
                  <SelectItem value="4">4 - Forte</SelectItem>
                  <SelectItem value="5">5 - Très forte</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
