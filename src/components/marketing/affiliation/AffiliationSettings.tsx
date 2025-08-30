'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import {
  Settings,
  BarChart,
  Bell,
  Shield,
  Percent,
  Save,
  Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
// Router will be used in future implementations

interface AffiliationSettingsProps {
  settings?: {
    defaultCommission: string;
    minimumPayout: string;
    payoutSchedule: string;
    cookieDuration: number;
  };
}

// Define a type for affiliation settings with metadata structure for Supabase
interface AffiliationSettingsData {
  id?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  status: string;
  metadata: {
    defaultCommission: string;
    minimumPayout: string;
    payoutSchedule: string;
    cookieDuration: number;
    commissions?: {
      standard: string;
      premium: string;
      vip: string;
    };
    notifications?: {
      newAffiliates: boolean;
      conversions: boolean;
      payments: boolean;
    };
    security?: {
      ipRestriction: boolean;
      fraudDetection: boolean;
      manualApproval: boolean;
    };
  };
}

export const AffiliationSettings: React.FC<AffiliationSettingsProps> = ({ settings: initialSettings = {
  defaultCommission: '20%',
  minimumPayout: '100€',
  payoutSchedule: 'Mensuel',
  cookieDuration: 30
} }) => {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const { toast } = useToast();
  // Router will be used in future implementations for navigation
  const supabase = createClient();
  
  // Load settings from Supabase
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('affiliation_settings')
          .select('*')
          .eq('name', 'default')
          .single();
          
        if (error) {
          console.error('Error fetching affiliation settings:', error);
          return;
        }
        
        if (data) {
          setSettingsId(data.id);
          setSettings(data.metadata || initialSettings);
        }
      } catch (error) {
        console.error('Error fetching affiliation settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [supabase, initialSettings]);
  
  // Handle form input changes
  const handleInputChange = (field: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Save settings to Supabase
  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const settingsData: AffiliationSettingsData = {
        name: 'default',
        status: 'active',
        metadata: {
          ...settings,
          commissions: {
            standard: '20%',
            premium: '25%',
            vip: '30%'
          },
          notifications: {
            newAffiliates: true,
            conversions: true,
            payments: true
          },
          security: {
            ipRestriction: false,
            fraudDetection: true,
            manualApproval: true
          }
        }
      };
      
      let result;
      
      if (settingsId) {
        // Update existing settings
        result = await supabase
          .from('affiliation_settings')
          .update(settingsData)
          .eq('id', settingsId);
      } else {
        // Create new settings
        result = await supabase
          .from('affiliation_settings')
          .insert(settingsData);
      }
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      toast({
        title: 'Paramètres sauvegardés',
        description: 'Les paramètres d\'affiliation ont été mis à jour avec succès.'
      });
      
    } catch (error) {
      console.error('Error saving affiliation settings:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde des paramètres.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Paramètres d&apos;Affiliation
          </h2>
          <p className="text-muted-foreground">
            Configuration et statistiques du programme d&apos;affiliation
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          onClick={handleSaveSettings}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder les modifications
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-500" />
                  Paramètres Généraux
                </CardTitle>
                <CardDescription>Configuration de base du programme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Commission par défaut</Label>
                  <Input 
                    type="text" 
                    placeholder="20%" 
                    value={settings.defaultCommission}
                    onChange={(e) => handleInputChange('defaultCommission', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Paiement minimum</Label>
                  <Input 
                    type="text" 
                    placeholder="100€" 
                    value={settings.minimumPayout}
                    onChange={(e) => handleInputChange('minimumPayout', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fréquence de paiement</Label>
                  <Input 
                    type="text" 
                    placeholder="Mensuel" 
                    value={settings.payoutSchedule}
                    onChange={(e) => handleInputChange('payoutSchedule', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Durée du cookie (jours)</Label>
                  <Input 
                    type="number" 
                    placeholder="30" 
                    value={settings.cookieDuration}
                    onChange={(e) => handleInputChange('cookieDuration', Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-green-500" />
                  Statistiques
                </CardTitle>
                <CardDescription>Aperçu des performances</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-gray-50 dark:bg-gray-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Taux de conversion
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12.4%</div>
                      <p className="text-xs text-green-600">+2.1% ce mois</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-50 dark:bg-gray-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Commission moyenne
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">85€</div>
                      <p className="text-xs text-green-600">+5.3% ce mois</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="commissions">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-purple-500" />
                Structure des Commissions
              </CardTitle>
              <CardDescription>Configuration des taux de commission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Commission standard</Label>
                    <div className="text-sm text-muted-foreground">
                      Pour les nouveaux affiliés
                    </div>
                  </div>
                  <Input className="w-[100px]" defaultValue="20%" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Commission premium</Label>
                    <div className="text-sm text-muted-foreground">
                      Pour les affiliés performants
                    </div>
                  </div>
                  <Input className="w-[100px]" defaultValue="25%" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Commission VIP</Label>
                    <div className="text-sm text-muted-foreground">
                      Pour les partenaires stratégiques
                    </div>
                  </div>
                  <Input className="w-[100px]" defaultValue="30%" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-500" />
                Paramètres de Notification
              </CardTitle>
              <CardDescription>Gérez vos préférences de notification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nouvelles inscriptions</Label>
                    <div className="text-sm text-muted-foreground">
                      Notification lors d&apos;un nouvel affilié
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Conversions</Label>
                    <div className="text-sm text-muted-foreground">
                      Notification pour chaque vente
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Paiements</Label>
                    <div className="text-sm text-muted-foreground">
                      Notification des paiements effectués
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                Sécurité et Conformité
              </CardTitle>
              <CardDescription>Paramètres de sécurité du programme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Vérification d&apos;identité</Label>
                    <div className="text-sm text-muted-foreground">
                      Exiger une vérification KYC
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Protection anti-fraude</Label>
                    <div className="text-sm text-muted-foreground">
                      Système de détection automatique
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Double authentification</Label>
                    <div className="text-sm text-muted-foreground">
                      Pour les modifications sensibles
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AffiliationSettings;
