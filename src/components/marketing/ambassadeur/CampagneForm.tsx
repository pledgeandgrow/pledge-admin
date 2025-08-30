'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Plus, X, DollarSign, Users, Target, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Campaign } from '@/types/data';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase';
import useCampaigns from '@/hooks/useCampaigns';

interface CampagneFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaign: Campaign) => void;
  initialData?: Partial<Campaign>;
  isEdit?: boolean;
}

export function CampagneForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
}: CampagneFormProps): React.ReactElement {
  const supabase = createClient();
  const { createCampaign, updateCampaign } = useCampaigns();
  const [ambassadeurs, setAmbassadeurs] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAmbassadeurs, setSelectedAmbassadeurs] = useState<string[]>(initialData?.ambassadeurs || []);
  const [rewards, setRewards] = useState<{ type: string; description: string; value?: number }[]>(
    initialData?.rewards || []
  );
  const [newReward, setNewReward] = useState<{ type: string; description: string; value?: number }>({
    type: '',
    description: '',
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Campaign>({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      campaign_type: initialData?.campaign_type || 'ambassador',
      status: initialData?.status || 'draft',
      objective: initialData?.objective || 'awareness',
      start_date: initialData?.start_date || new Date().toISOString(),
      end_date: initialData?.end_date || '',
      budget: initialData?.budget || 0,
      spent: initialData?.spent || 0,
      target_audience: initialData?.target_audience || '',
      kpis: initialData?.kpis || {
        impressions: 0,
        engagement: 0,
        conversions: 0,
        reach: 0,
        clicks: 0,
      },
      ambassadeurs: initialData?.ambassadeurs || [],
      rewards: initialData?.rewards || [],
    },
  });

  // Fetch ambassadeurs from Supabase
  useEffect(() => {
    const fetchAmbassadeurs = async () => {
      try {
        const { data, error } = await supabase
          .from('contacts')
          .select('id, first_name, last_name')
          .contains('tags', ['ambassadeur']);

        if (error) {
          console.error('Error fetching ambassadeurs:', error);
          return;
        }

        if (data) {
          setAmbassadeurs(
            data.map(contact => ({
              id: contact.id,
              name: `${contact.first_name} ${contact.last_name}`,
            }))
          );
        }
      } catch (err) {
        console.error('Failed to fetch ambassadeurs:', err);
      }
    };

    if (isOpen) {
      fetchAmbassadeurs();
    }
  }, [isOpen, supabase]);

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        ambassadeurs: initialData.ambassadeurs || [],
        rewards: initialData.rewards || [],
        kpis: initialData.kpis || {
          impressions: 0,
          engagement: 0,
          conversions: 0,
          reach: 0,
          clicks: 0,
        },
      });
      setSelectedAmbassadeurs(initialData.ambassadeurs || []);
      setRewards(initialData.rewards || []);
    }
  }, [initialData, reset]);

  const onFormSubmit = async (data: Campaign) => {
    setLoading(true);
    try {
      // Add ambassadeurs and rewards to form data
      data.ambassadeurs = selectedAmbassadeurs;
      data.rewards = rewards;

      if (isEdit && initialData?.id) {
        // Update existing campaign
        const updatedCampaign = await updateCampaign(initialData.id, data);
        if (updatedCampaign) {
          toast({
            title: 'Campagne mise à jour',
            description: 'La campagne a été mise à jour avec succès.',
          });
          onSubmit(updatedCampaign);
        }
      } else {
        // Create new campaign
        const newCampaign = await createCampaign(data);
        if (newCampaign) {
          toast({
            title: 'Campagne créée',
            description: 'La campagne a été créée avec succès.',
          });
          onSubmit(newCampaign);
        }
      }
    } catch (err) {
      console.error('Error submitting campaign:', err);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'enregistrement de la campagne.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const handleAddReward = () => {
    if (newReward.type && newReward.description) {
      setRewards([...rewards, { ...newReward }]);
      setNewReward({ type: '', description: '', value: undefined });
    }
  };

  const handleRemoveReward = (index: number) => {
    setRewards(rewards.filter((_, i) => i !== index));
  };

  const toggleAmbassadeur = (id: string) => {
    setSelectedAmbassadeurs(prev => {
      if (prev.includes(id)) {
        return prev.filter(ambassadeurId => ambassadeurId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier la campagne' : 'Créer une nouvelle campagne'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modifiez les détails de la campagne existante.'
              : 'Remplissez les détails pour créer une nouvelle campagne.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations de base</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la campagne *</Label>
                  <Input
                    id="name"
                    {...register('name', { required: 'Le nom est requis' })}
                    placeholder="Nom de la campagne"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Description de la campagne"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign_type">Type de campagne *</Label>
                  <Controller
                    name="campaign_type"
                    control={control}
                    rules={{ required: 'Le type est requis' }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className={errors.campaign_type ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ambassador">Ambassadeur</SelectItem>
                          <SelectItem value="referral">Parrainage</SelectItem>
                          <SelectItem value="influencer">Influenceur</SelectItem>
                          <SelectItem value="social">Réseaux sociaux</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="content">Contenu</SelectItem>
                          <SelectItem value="event">Événement</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.campaign_type && (
                    <p className="text-red-500 text-sm">{errors.campaign_type.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Statut *</Label>
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: 'Le statut est requis' }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Brouillon</SelectItem>
                          <SelectItem value="planned">Planifiée</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">En pause</SelectItem>
                          <SelectItem value="completed">Terminée</SelectItem>
                          <SelectItem value="cancelled">Annulée</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="objective">Objectif *</Label>
                  <Controller
                    name="objective"
                    control={control}
                    rules={{ required: 'L\'objectif est requis' }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className={errors.objective ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Sélectionner un objectif" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="awareness">Notoriété</SelectItem>
                          <SelectItem value="consideration">Considération</SelectItem>
                          <SelectItem value="conversion">Conversion</SelectItem>
                          <SelectItem value="acquisition">Acquisition</SelectItem>
                          <SelectItem value="loyalty">Fidélisation</SelectItem>
                          <SelectItem value="advocacy">Recommandation</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.objective && <p className="text-red-500 text-sm">{errors.objective.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target_audience">Public cible</Label>
                  <Input
                    id="target_audience"
                    {...register('target_audience')}
                    placeholder="Public cible de la campagne"
                  />
                </div>
              </div>
            </div>

            {/* Dates and Budget */}
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-medium">Dates et budget</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Date de début *</Label>
                  <Controller
                    name="start_date"
                    control={control}
                    rules={{ required: 'La date de début est requise' }}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                              errors.start_date && "border-red-500"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(new Date(field.value), 'PPP', { locale: fr }) : <span>Sélectionner une date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date ? date.toISOString() : '')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">Date de fin</Label>
                  <Controller
                    name="end_date"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(new Date(field.value), 'PPP', { locale: fr }) : <span>Sélectionner une date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date ? date.toISOString() : '')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (€)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="budget"
                      type="number"
                      className="pl-10"
                      {...register('budget', { valueAsNumber: true })}
                      placeholder="0"
                    />
                  </div>
                </div>

                {isEdit && (
                  <div className="space-y-2">
                    <Label htmlFor="spent">Dépensé (€)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="spent"
                        type="number"
                        className="pl-10"
                        {...register('spent', { valueAsNumber: true })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* KPIs */}
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-medium">KPIs</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kpis.impressions">Impressions</Label>
                  <Input
                    id="kpis.impressions"
                    type="number"
                    {...register('kpis.impressions', { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kpis.engagement">Taux d&apos;engagement (%)</Label>
                  <Input
                    id="kpis.engagement"
                    type="number"
                    step="0.01"
                    {...register('kpis.engagement', { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kpis.conversions">Conversions</Label>
                  <Input
                    id="kpis.conversions"
                    type="number"
                    {...register('kpis.conversions', { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kpis.reach">Portée</Label>
                  <Input
                    id="kpis.reach"
                    type="number"
                    {...register('kpis.reach', { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kpis.clicks">Clics</Label>
                  <Input
                    id="kpis.clicks"
                    type="number"
                    {...register('kpis.clicks', { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Ambassadeurs */}
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Users className="h-5 w-5" />
                Ambassadeurs
              </h3>
              
              <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Sélectionnez les ambassadeurs qui participeront à cette campagne
                  </p>
                  
                  {ambassadeurs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {ambassadeurs.map((ambassadeur) => (
                        <div key={ambassadeur.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`ambassadeur-${ambassadeur.id}`}
                            checked={selectedAmbassadeurs.includes(ambassadeur.id)}
                            onChange={() => toggleAmbassadeur(ambassadeur.id)}
                            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <Label htmlFor={`ambassadeur-${ambassadeur.id}`} className="text-sm">
                            {ambassadeur.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Aucun ambassadeur disponible. Veuillez d&apos;abord ajouter des contacts avec le tag &quot;ambassadeur&quot;.
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedAmbassadeurs.length > 0 && (
                    <p className="text-sm font-medium w-full mb-1">Ambassadeurs sélectionnés:</p>
                  )}
                  {selectedAmbassadeurs.map(id => {
                    const amb = ambassadeurs.find(a => a.id === id);
                    return amb ? (
                      <Badge key={id} variant="secondary" className="flex items-center gap-1">
                        {amb.name}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => toggleAmbassadeur(id)}
                        />
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            {/* Rewards */}
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Target className="h-5 w-5" />
                Récompenses
              </h3>
              
              <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div>
                    <Label htmlFor="reward-type" className="text-sm">Type</Label>
                    <Input
                      id="reward-type"
                      value={newReward.type}
                      onChange={(e) => setNewReward({ ...newReward, type: e.target.value })}
                      placeholder="Type de récompense"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reward-description" className="text-sm">Description</Label>
                    <Input
                      id="reward-description"
                      value={newReward.description}
                      onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                      placeholder="Description"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reward-value" className="text-sm">Valeur (€)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="reward-value"
                        type="number"
                        value={newReward.value || ''}
                        onChange={(e) => setNewReward({ ...newReward, value: e.target.value ? Number(e.target.value) : undefined })}
                        placeholder="0"
                      />
                      <Button
                        type="button"
                        onClick={handleAddReward}
                        disabled={!newReward.type || !newReward.description}
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {rewards.length > 0 ? (
                  <div className="space-y-2 mt-4">
                    <p className="text-sm font-medium">Récompenses ajoutées:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {rewards.map((reward, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-blue-500" />
                            <span className="font-medium text-sm">{reward.type}</span>
                            <span className="text-sm text-gray-500">-</span>
                            <span className="text-sm">{reward.description}</span>
                            {reward.value !== undefined && (
                              <Badge variant="outline" className="ml-2">
                                {reward.value} €
                              </Badge>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveReward(index)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic mt-2">
                    Aucune récompense ajoutée. Utilisez le formulaire ci-dessus pour ajouter des récompenses.
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CampagneForm;
